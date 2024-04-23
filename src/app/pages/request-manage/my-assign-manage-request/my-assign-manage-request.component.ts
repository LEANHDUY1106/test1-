
import { finalize } from 'rxjs/operators';
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { DataStateLeftMenuService } from '@shared/services/changeLeftMenu.service';
import CONSTANT from '@shared/configs/CONSTANT';
import { ManageRequestService } from '@shared/service-proxy/manage-request/manage-request.service';
import { ManageRequestInputSearchDto } from '@shared/service-proxy/manage-request/models/ManageRequestInputSearchDto';
import { ManageReQuestOutputDto } from '@shared/service-proxy/manage-request/models/ManageRequestOutputDto';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import { AppSessionService } from '@shared/session/app-session.service';
import { SettingService } from '@shared/service-proxy/setting-service/setting.service';
import { DatePipe } from '@angular/common';
import { MessageConfirmService } from '@shared/services/message-confirm.service';
import { BackDetailService } from '@shared/services/backDetail.Service';
import { Search } from '@shared/models/search';
import { Table } from 'primeng/table';
import { DeletePostIdDto, FollowPostIdDto } from '@shared/service-proxy/manage-request/models/ManageRequestCreateDto';
import { MyAssignSearchService } from './my-assign-search.service';

@Component({
  templateUrl: './my-assign-manage-request.component.html',
  styleUrls: ['./my-assign-manage-request.component.scss']
})
export class MyAssignManageRequestComponent implements OnInit {
  isFullScreen: boolean = false;
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isFullScreen = false;
    if (window.innerWidth >= 992) {
      this.isFullScreen = true;
    }
  }
  @ViewChild('table') table: Table;
  searchInput: ManageRequestInputSearchDto = {
    postid: 0,
    tittle: "",
    posttype: '',
    poststatus: '',
    departmentCode: "",
    assigner: "",
    priority: '',
    offset: 0,
    fetch: 10,
    createdUser: "",
    projectcode: '',
    followup: 0
  };
  searchState: Search = {
    postid: 0,
    tittle: "",
    posttype: '',
    poststatus: '',
    departmentCode: "",
    assigner: "",
    priority: '',
    offset: 0,
    fetch: 10,
    createdUser: "",
    projectcode: '',
    isSortDesc: null,
    tap: null,
    orderBy: null,
    currentPage: 1
  };
  rangeDates: Date[];
  listRequest: ManageReQuestOutputDto[] = [];
  title: string;
  isLoading: boolean = false;
  isStateLeftMenu: boolean;
  labelList: string = "Danh sách yêu cầu";
  isCreate: boolean;
  isAdmin: boolean = false;
  isSupport: boolean = true;
  constructor(
    private _manageRequest: ManageRequestService,
    private _messageService: MessageService,
    private session: AppSessionService,
    private _settingService: SettingService,
    private _router: Router,
    private _dataService: DataStateLeftMenuService,
    private _messageConfirmService: MessageConfirmService,
    private _backDetailService: BackDetailService,
    private _searchService: MyAssignSearchService
  ) {
  }
  public isCollapsed = true;
  async ngOnInit(): Promise<void> {
    this.isFullScreen = false;
    if (window.innerWidth >= 992) {
      this.isFullScreen = true;
    }
    //kiểm tra xem có quyền tạo không
    this.isCreate = this.session.isCreate || this.session.isAdmin;
    //lấy trạng tháistate
    this._dataService.currentState.subscribe(state => {
      this.isStateLeftMenu = state;
    });
    this._searchService.currentState.subscribe(state => {
      this.searchInput.postid = state?.postid ? state?.postid : 0;
      this.searchInput.createdUser = state?.createdUser ? state?.createdUser : "";
      this.searchInput.departmentCode = state?.departmentCode ? state.departmentCode : "";
      this.searchInput.fetch = state?.fetch ? state?.fetch : 10;
      this.searchInput.isSortDesc = state?.isSortDesc;
      this.searchInput.offset = state?.offset ? state?.offset : 0;
      this.searchInput.orderBy = state?.orderBy;
      this.searchInput.poststatus = state?.poststatus;
      this.searchInput.assigner = this.session.user.userName.toLowerCase();
      this.currentPage = state?.currentPage ? state?.currentPage : 1;
      this.rowPerPage = state?.fetch ? state?.fetch : 10;
      if (state?.poststatus) {
        let arrStt = state?.poststatus.split(',');
        arrStt.forEach(item => {
          this.selectedStatuss.push(this.availableStatuss.find(x => x.id == Number(item)));
        });
      }
      // this.searchInput.posttype = state?.posttype;
      this.searchInput.priority = state?.priority;
      if (state?.priority) {
        let arrPriority = state?.priority.split(',');
        arrPriority.forEach(item => {
          this.selectedPrioritys.push(this.availablePrioritys.find(x => x.id == Number(item)));
        });
      }
      this.searchInput.projectcode = state?.projectcode;
      this.searchInput.tittle = state?.tittle;
      this.isSupport = state?.tap != undefined ? state?.tap : this.session?.user?.divisionCode == CONSTANT.FTI_ISC ? false : true;
      if (!state?.posttype) {
        if (this.isSupport) {
          this.searchInput.posttype = '3';
        } else {
          this.searchInput.posttype = '1,2,4';
        }
      } else {
        this.searchInput.posttype = state?.posttype;
      }
      if (this.session.settings.get('typeRq')) {
        this.availableTypes = JSON.parse(this.session.settings.get('typeRq')['value']);
        //nếu là tap support thì lấy giá trị support thôi
        if (this.isSupport) {
          this.availableTypes = this.availableTypes.filter(x => x.id == 3);
          this.searchInput.posttype = '3';
        } else {
          this.availableTypes = this.availableTypes.filter(x => x.id != 3);
          // this.searchInput.posttype = '1,2,4';
          if (this.searchInput.posttype?.length < 5) {
            let arrType = this.searchInput.posttype.split(',');
            arrType.forEach(item => {
              this.selectedTypes.push(this.availableTypes.find(x => x.id == Number(item)));
            });
          }
        }
      }
      //mở collap
      this.isCollapsed = state?.isCollap != undefined ? state?.isCollap : true;
      //gán lại vào giá trị truyền
      this.searchInput.fetch = this.rowPerPage;
      this.searchInput.offset = (this.currentPage - 1) * this.rowPerPage;
      //lưu lại thông tin search
      this.searchState.postid = this.searchInput.postid;
      this.searchState.assigner = this.searchInput.assigner;
      this.searchState.createdUser = this.searchInput.createdUser;
      this.searchState.departmentCode = this.searchInput.departmentCode;
      this.searchState.fetch = this.searchInput.fetch;
      this.searchState.isSortDesc = this.searchInput.isSortDesc;
      this.searchState.offset = this.searchInput.offset;
      this.searchState.orderBy = this.searchInput.orderBy;
      this.searchState.poststatus = this.searchInput.poststatus;
      this.searchState.posttype = this.searchInput.posttype;
      this.searchState.priority = this.searchInput.priority;
      this.searchState.projectcode = this.searchInput.projectcode;
      this.searchState.tittle = this.searchInput.tittle;
      this.searchState.currentPage = this.currentPage;
    });
    //kiểm tra nếu người dùng thuộc trung tâm isc thì chuyển đến tap danh sách số hóa
    // if (this.session?.user?.divisionCode == CONSTANT.FTI_ISC) {
    //   this.isSupport = false;
    // }
    //gán isAdmin check dưới BE
    this.isAdmin = this.session?.isAdmin;
    //kiểm tra xem user có quyền admin không
    if (!this.isAdmin) {
      if (this.session.settings.get('subadmin')) {
        let arrAccout = JSON.parse(this.session.settings.get('subadmin')['value']);
        //check xem có trùng với danh sách subadmin ko
        arrAccout.forEach(item => {
          if (this.session.user.email == item.name) {
            this.isAdmin = true;
          }
        });
      }
    }
    //lấy danh sách avairibaleTypes
    // if (this.session.settings.get('typeRq')) {
    //   this.availableTypes = JSON.parse(this.session.settings.get('typeRq')['value']);
    //   //nếu là tap support thì lấy giá trị support thôi
    //   if (this.isSupport) {
    //     this.availableTypes = this.availableTypes.filter(x => x.id == 3);
    //     this.searchInput.posttype = '3';
    //   } else {
    //     this.availableTypes = this.availableTypes.filter(x => x.id != 3);
    //     this.searchInput.posttype = '1,2,4';
    //   }
    // }
    // this.loadDataType();
    this._backDetailService.changeState(2);
    this.searchInput.assigner = this.session.user.userName.toLowerCase();
    this.loadData();
  }
  loadData() {
    this.isLoading = true;
    // this.searchInput.tittle = this.searchInput.departmentCode;
    //bỏ khoảng trắng ở tìm kiếm tên
    if (this.searchInput.tittle != null && this.searchInput.tittle != "") {
      this.searchInput.tittle = this.searchInput.tittle.trim();
    }
    if (this.searchInput.createdUser != null && this.searchInput.createdUser != "") {
      this.searchInput.createdUser = this.searchInput.createdUser.trim();
    }
    this._manageRequest
      .getAll(this.searchInput)
      .subscribe(async (res) => {
        this.listRequest = res['data'].items;
        //lấy tên của loại yêu cầu
        this.listRequest.forEach(item => {
          this.availableTypes.forEach(type => {
            if (item.posttype == type.id) {
              item['typeName'] = type.name;
            }
            let nameArray = item.projectCode.split(';');
            if (nameArray?.length >= 2) {
              item['nameProjectCode'] = nameArray[0] + ' - ' + nameArray[1];
            } else {
              item['nameProjectCode'] = item.projectCode;
            }
          });
        });
        this.totalCount = res['data'].totalCount;
        this.isLoading = false;
      }, err => this.isLoading = false);
  }

  //collspan fillter
  colspanFilter() {
    this.isCollapsed = !this.isCollapsed;
  }

  //checkperrmissdion
  async checkPersion() {
    return await this.session.checkRoles(CONSTANT.FTI_ROLES.FTI_DXRTM_ADMIN);
  }

  //format date
  parseDateTime(datetime: any) {
    return moment(datetime).format('DD/MM/YYYY');
  }

  //autocomplate type
  selectedTypes: ConfigObject[] = [];
  availableTypes: ConfigObject[] = [];
  onTypeChange() {
    // this.typeIds = this.selectedTypes.map<any>(x => x.id);
    this.searchInput.posttype = '';
    if (this.selectedTypes?.length > 0) {
      let arayId: number[] = [];
      this.selectedTypes.forEach(i => {
        arayId.push(i.id);
      });

      this.searchInput.posttype = arayId.join(',');
    } else {
      this.searchInput.posttype = '1,2,4';
    }
  }
  //autocomplate type
  selectedStatuss: ConfigObject[] = [];
  availableStatuss = ([{
    name: 'Chưa tiếp nhận',
    id: 0
  }, {
    name: 'Đã tiếp nhận',
    id: 1
  }, {
    name: 'Đang xử lý',
    id: 2
  }, {
    name: 'Từ chối',
    id: 3
  }, {
    name: 'Đã đóng',
    id: 4
  }
  ]);
  onStatusChange() {
    // this.statusIds = this.selectedStatuss.map<any>(x => x.id);
    this.searchInput.poststatus = '';
    if (this.selectedStatuss) {
      let arayId: number[] = [];
      this.selectedStatuss.forEach(i => {
        arayId.push(i.id);
      });
      this.searchInput.poststatus = arayId.join(',');
    }
  }
  //autocomplate type
  selectedPrioritys: ConfigObject[] = [];
  availablePrioritys = ([{
    name: 'Cao',
    id: 1
  }, {
    name: 'Trung bình',
    id: 2
  }, {
    name: 'Thấp',
    id: 3
  }
  ]);
  onPriorityChange() {
    // this.priorityIds = this.selectedPrioritys.map<any>(x => x.id);
    this.searchInput.priority = '';
    if (this.selectedPrioritys?.length > 0) {
      let arayId: number[] = [];
      this.selectedPrioritys.forEach(i => {
        arayId.push(i.id);
      });
      this.searchInput.priority = arayId.join(',');
    }
  }

  //phân trang
  currentPage: number = 1;
  totalCount: number;
  rowPerPage: number = CONSTANT.ROWS_PER_PAGE_DEFAULT;
  paginate(event) {
    //Nếu người dùng thay đổi số hàng trên một trang
    if (this.rowPerPage != event.rows) {
      this.totalCount = 0;
      this.rowPerPage = event.rows;
      this.currentPage = 1;
    } else {
      this.currentPage = event.page + 1;
    }
    this.searchInput.fetch = this.rowPerPage;
    this.searchInput.offset = (this.currentPage - 1) * this.rowPerPage;
    this.searchState.offset = this.searchInput.offset;
    this.searchState.fetch = this.searchInput.fetch;
    this.searchState.tap = this.isSupport;
    this.searchState.currentPage = this.currentPage;
    this._searchService.changeState(this.searchState);
    setTimeout(() => {
      this.loadData();
    }, 200);
    // this.panigation.updateCurrentPage(1);
  }

  //chuyển detal post
  detailPost(id: number) {
    this._router.navigate([
      `manage-request/edit/${id}`,
    ]);
  }
  //lấy dữ liệu type
  loadDataType() {
    this._settingService.getSettings(CONSTANT.SYSTEM_TYPEREQUEST)
      .subscribe(async (res) => {
        this.availableTypes = JSON.parse(res.value);
      });
  }
  //chuyển đến form tạo
  goToCreate() {
    if (this.isSupport) {
      this._router.navigate([
        `manage-request/create-support`,
      ]);
    } else {
      if (this.isCreate || this.isAdmin) {
        this._router.navigate([
          `manage-request/create`,
        ]);
      }
    }

  }
  //onkeydown
  onKeyDown(event: any) {
    //đưa về trang đầu
    this.currentPage = 1;
    this.searchInput.fetch = this.rowPerPage;
    this.searchInput.offset = (this.currentPage - 1) * this.rowPerPage;
    //lưu lại thông tin search
    this.searchState.postid = this.searchInput.postid;
    this.searchState.assigner = this.searchInput.assigner;
    this.searchState.createdUser = this.searchInput.createdUser;
    this.searchState.departmentCode = this.searchInput.departmentCode;
    this.searchState.fetch = this.searchInput.fetch;
    this.searchState.isSortDesc = this.searchInput.isSortDesc;
    this.searchState.offset = this.searchInput.offset;
    this.searchState.orderBy = this.searchInput.orderBy;
    this.searchState.poststatus = this.searchInput.poststatus;
    this.searchState.posttype = this.searchInput.posttype;
    this.searchState.priority = this.searchInput.priority;
    this.searchState.projectcode = this.searchInput.projectcode;
    this.searchState.tittle = this.searchInput.tittle;
    this.searchState.isCollap = this.isCollapsed;
    this.searchState.tap = this.isSupport;
    this._searchService.changeState(this.searchState);
    setTimeout(() => {
      this.loadData();
    }, 200);
  }
  //on
  async exportData() {
    if (await this._messageConfirmService.showPopupConfirm(
      'Xác nhận Export dữ liệu',
      'Bạn có muốn thực hiện hành động này không?'
    )) {
      myApp.ui.setBusy();
      let serchExport = this.searchInput;
      serchExport.offset = 0;
      serchExport.fetch = 1000000;
      this._manageRequest.exprortExcel(serchExport)
        .pipe(
          finalize(() => {
            myApp.ui.clearBusy();
          })
        ).subscribe(file => {
          let fileName = '';
          if (this.isSupport) {
            fileName = this.dateTimeToString(new Date(), 'dd/MM/yyyy') + '_Support_Request_List';
          } else {
            fileName = this.dateTimeToString(new Date(), 'dd/MM/yyyy') + '_DX_Request_List';
          }
          saveAs(file.data, fileName);
        });
    }
  }
  changeIsCallap() {
    this.isCollapsed = !this.isCollapsed;
    this.searchState.isCollap = this.isCollapsed;
    this._searchService.changeState(this.searchState);
  }
  //parst Date to string DD/MM/YY
  dateTimeToString(date: Date, fomat: string) {
    if (date == null) return '';

    let pipe = new DatePipe('en-US');

    return pipe.transform(date, fomat);
  }
  //lazyload sort
  lazyLoadCustom(event: LazyLoadEvent) {
    this.searchInput = {
      ...this.searchInput,
      orderBy: event.sortField,
      isSortDesc: event.sortOrder == -1
    };
    this.searchState.isSortDesc = this.searchInput?.isSortDesc;
    this.searchState.orderBy = this.searchInput?.orderBy;
    this._searchService.changeState(this.searchState);
    this.loadData();
  }
  clearSearch() {
    let searchInput: ManageRequestInputSearchDto = {
      postid: 0,
      tittle: "",
      posttype: '',
      poststatus: '',
      departmentCode: "",
      assigner: "",
      priority: '',
      offset: 0,
      fetch: 10,
      createdUser: "",
      projectcode: '',
      followup: 0
    };
    this.searchInput = searchInput;
    //nếu là hỗ trợ thì lọc hỗ trợ
    if (this.isSupport) {
      this.searchInput.posttype = '3';
    } else {
      this.searchInput.posttype = '1,2,4';
    }
    this.selectedTypes = null;
    this.selectedPrioritys = null;
    this.selectedStatuss = null;
    this.loadData();
  }

  //thay đổi tap
  changeTap(isChange: boolean) {
    if (this.isSupport == isChange) {
      return;
    }
    this.isSupport = isChange;
    if (this.session.settings.get('typeRq')) {
      this.availableTypes = JSON.parse(this.session.settings.get('typeRq')['value']);
      //nếu là tap support thì lấy giá trị support thôi
      if (this.isSupport) {
        this.availableTypes = this.availableTypes.filter(x => x.id == 3);
        this.searchInput.posttype = '3';
      } else {
        this.availableTypes = this.availableTypes.filter(x => x.id != 3);
        this.searchInput.posttype = '1,2,4';
      }
    }
    //lưu lại dữ liệu findter
    this.searchState.tap = isChange;
    this.searchState.posttype = this.searchInput.posttype;
    //reseet sort table khi chuyển tap
    this.table.sortOrder = 0;
    this.table.sortField = '';
    this.table.reset();

    this.currentPage = 1;
    this.searchState.currentPage = this.currentPage;
    this.searchInput.offset = 0;
    this.searchInput.fetch = 10;
    this.searchState.offset = 0;
    this.searchState.fetch = 10;
    this._searchService.changeState(this.searchState);
    setTimeout(() => {
      this.loadData();
    }, 200);
  }
  //xóa post
  async deletePost(id: number) {
    if (
      await this._messageConfirmService.showPopupConfirm(
        'Xác nhận xóa yêu cầu',
        'Bạn chắc chắn muốn xóa yêu cầu này'
      )) {
      this.isLoading = true;
      this._manageRequest.DeleteById({ postId: id } as DeletePostIdDto).subscribe(res => {
        this._messageService.add({
          severity: 'success',
          detail: 'Xóa thành công',
        });
        this.loadData();
      }, (err) => this.isLoading = false);
    }
  }

  //theo doi hoac bo theo doi
  follow(id: number, follow: number) {
    this._manageRequest.follow({ postid: id, followUpStatus: follow } as FollowPostIdDto).subscribe(res => {
      if (this.listRequest.find(x => x.postid == id).followup == 0) {
        this._messageService.add({
          severity: 'success',
          detail: 'Thêm vào danh sách theo dõi thành công',
        });
      } else {
        this._messageService.add({
          severity: 'success',
          detail: 'Xóa bản ghi khỏi danh sách theo dõi thành công',
        });
      }
      this.loadData();
    });
  }
  //check search assigner
  isChangeSearchAssigner: boolean = false;
  onChangeAssigner() {
    this.isChangeSearchAssigner = true;
  }
  //check search created
  isChangeSearchCreated: boolean = false;
  onChangeCreated() {
    this.isChangeSearchCreated = true;
  }
}

export class ConfigObject {
  id: number;
  name: string;
}
