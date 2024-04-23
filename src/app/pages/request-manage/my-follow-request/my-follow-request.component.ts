
import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { DataStateLeftMenuService } from '@shared/services/changeLeftMenu.service';
import CONSTANT from '@shared/configs/CONSTANT';
import { ManageRequestService } from '@shared/service-proxy/manage-request/manage-request.service';
import { ManageRequestInputSearchDto } from '@shared/service-proxy/manage-request/models/ManageRequestInputSearchDto';
import { ManageReQuestOutputDto } from '@shared/service-proxy/manage-request/models/ManageRequestOutputDto';
import { Router } from '@angular/router';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { AppSessionService } from '@shared/session/app-session.service';
import { SettingService } from '@shared/service-proxy/setting-service/setting.service';
import { MessageConfirmService } from '@shared/services/message-confirm.service';
import { BackDetailService } from '@shared/services/backDetail.Service';
import { SearchService } from '@shared/services/search.service';
import { Table } from 'primeng/table';
import { FollowPostIdDto } from '@shared/service-proxy/manage-request/models/ManageRequestCreateDto';

@Component({
    templateUrl: './my-follow-request.component.html',
    styleUrls: ['./my-follow-request.component.scss']
})
export class MyFollowRequestComponent implements OnInit {
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
        followup: 1
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
        private _backDetailService: BackDetailService
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
        //kiểm tra nếu người dùng thuộc trung tâm isc thì chuyển đến tap danh sách số hóa
        if (this.session?.user?.divisionCode == CONSTANT.FTI_ISC) {
            this.isSupport = false;
        }
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
        this._backDetailService.changeState(3);
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

    //autocomplate type
    selectedTypes: ConfigObject[] = [];
    availableTypes: ConfigObject[] = [];
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
        this.loadData();
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
    //lazyload sort
    lazyLoadCustom(event: LazyLoadEvent) {
        this.searchInput = {
            ...this.searchInput,
            orderBy: event.sortField,
            isSortDesc: event.sortOrder == -1
        };
        this.loadData();
    }
    //thay đổi tap
    changeTap(isChange: boolean) {
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
        //reseet sort table khi chuyển tap
        this.table.sortOrder = 0;
        this.table.sortField = '';
        this.table.reset();
        //lưu lại dữ liệu findter

        this.currentPage = 1;
        this.searchInput.offset = 0;
        this.searchInput.fetch = 10;
        this.loadData();
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
}

export class ConfigObject {
    id: number;
    name: string;
}
