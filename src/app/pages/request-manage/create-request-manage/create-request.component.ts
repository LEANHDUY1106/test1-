
import CONSTANT from '@shared/configs/CONSTANT';
import { Component, OnInit, Input, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ManageRequestService } from '@shared/service-proxy/manage-request/manage-request.service';
import { GetListSuggestionDto, ManageRequestCreatehDto } from '@shared/service-proxy/manage-request/models/ManageRequestCreateDto';
import { MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MessageConfirmService } from '@shared/services/message-confirm.service';
import { ManageRequestGetByIdDto } from '@shared/service-proxy/manage-request/models/ManageRequestInputSearchDto';
import * as moment from 'moment';
import { SettingService } from '@shared/service-proxy/setting-service/setting.service';
import { ManageRequestUpdatehDto } from '@shared/service-proxy/manage-request/models/ManageRequestUpdateDto';
import { SearchCommentDto } from '@shared/service-proxy/comment-service/models/SearchCommentDto';
import { CommentDto } from '@shared/service-proxy/comment-service/models/CommentDto';
import { CommentService } from '@shared/service-proxy/comment-service/comment.service';
import { CommentCreateDto, FileCustom } from '@shared/service-proxy/comment-service/models/CommentCreateDto';
import { FileService } from '@shared/service-proxy/file/file.service';
import { FileDeleteDto, FileInfoDto } from '@shared/service-proxy/file/models/FileInfoDto';
import { saveAs } from 'file-saver';
import { AppSessionService } from '@shared/session/app-session.service';
import { characterValidator, incorrectDate } from '@shared/validate/custom-validate';
import { FileItem } from '@shared/service-proxy/manage-request/models/ManageRequestOutputDto';
import { AccountFtmsInfor } from '@shared/models/AccountFtmsInfor';
import { DataStateLeftMenuService } from '@shared/services/changeLeftMenu.service';
import { PMDialogEvent } from '@shared/ui/pm-dialog/pm-dialog-model';
import { AlertService } from '@shared/services/alert';
import { NgIf } from '@angular/common';
import { BackDetailService } from '@shared/services/backDetail.Service';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.scss']
})

export class CreateRequestComponent implements OnInit {
  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    if (this.isDirty) {
      if (!this.isCreate) {
        return new Observable<boolean>(subscribe => {
          const callback = () => {
            subscribe.next(true);
          }
          this.alert.confirm(callback);
        });
      } else {
        return true;
      }
    } else {
      return true;
    }
  }
  @HostListener('document:click', ['$event'])
  DocumentClick(event: Event) {
    let popRecomment = document.getElementById("recomment-name-product");
    let targetEl = event.target as HTMLElement;
    if (!popRecomment?.contains(targetEl)) {
      this.isShowRecomment = false;
    }

  }
  @Input() postid: number;
  @Input() isCreateSupport: boolean = false;
  config = {
    toolbar: {
      items: [
        'heading', '|',
        'bold', 'italic', '|',
        'bulletedList', 'numberedList', '|',
        'insertTable', '|',
        'undo', 'redo'
      ]
    },
    language: 'en',
    placeholder: "Nhập nội dung..."
  };
  assignLoading = false;
  assignInput$ = new Subject<string>();
  commentInput$ = new Subject<string>();
  selectedAssigns: AccountFtmsInfor;
  selectedMails: AccountFtmsInfor[] = [];
  selectedMailsRollBack: AccountFtmsInfor[] = [];
  comments: CommentDto[] = [];
  submitted: boolean = false;
  form: FormGroup;
  formComment: FormGroup;
  isDirty: boolean = false;
  isCreate: boolean = false;
  selectedStatus: number = 0;
  isLoading: boolean = false;
  isSucsess: boolean = false;
  isUpdate: boolean = true;
  isLoadingComment: boolean = false;
  isAdmin: boolean = false;
  checkStatus: number;
  isFirstLoad: boolean = false;
  userCencel: string;
  files: File[] = [];
  searchComment: SearchCommentDto = {
    postid: 0,
    offset: 0,
    fetch: 1000000
  };
  postId: ManageRequestGetByIdDto = {
    postId: 0
  };
  manageRequest: ManageRequestCreatehDto = {
    postId: 0,
    tittle: null,
    postDescription: null,
    postType: 0,
    priority: 0,
    projectCode: null,
    postStatus: null,
    receiverAccount: "",
    estimatedEndDate: null,
    estimatedStartDate: null,
    departmentCode: null,
    desiredDate: null,
    files: []
  };
  manageRequestUpdate: ManageRequestUpdatehDto = {
    postId: 0,
    tittle: null,
    postDescription: null,
    postType: 0,
    priority: 0,
    projectCode: null,
    postStatus: null,
    receiverAccount: null,
    estimatedEndDate: null,
    estimatedStartDate: null,
    departmentCode: null,
    desiredDate: null,
    reason: null,
    files: []
  }
  public isCollapsed = true;
  isStateLeftMenu: boolean;
  checkListManagerNumber: number = 0;
  public Editor = ClassicEditor;
  @ViewChild('commentContainer') commentContainer: ElementRef;
  constructor(private _formBuilder: FormBuilder,
    private _manageRequest: ManageRequestService,
    private _messageService: MessageService,
    private _messageConfirmService: MessageConfirmService,
    private session: AppSessionService,
    private _commentService: CommentService,
    private _fileService: FileService,
    private alert: AlertService,
    private _backDetailService: BackDetailService,
    private _router: Router,
    private _dataService: DataStateLeftMenuService) {
    this.form = this._formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(256)]],
      content: ['', [Validators.required, Validators.maxLength(4000)]],
      type: [1, [Validators.required]],
      dateComplate: ['', [Validators.required,]],
      nameProduct: ['', [Validators.required, Validators.maxLength(128)]],
      startDate: ['', []],
      unit: [''],
      estimateDate: ['', []],
      priority: [3, [Validators.required]],
      typeSupport: ['', [Validators.required]],
      infoSupport: ['', [Validators.required]]
    });
    this.formComment = this._formBuilder.group({
      comment: ['', [Validators.required, Validators.maxLength(2000)]]
    });
    this.supportTypes = [
      { typeName: 'Hệ thống' },
      { typeName: 'Quy trình' },
      { typeName: 'Download tài liệu' }
    ];
  }
  isCheckScrenn: boolean = false;
  isCheckScreenTitle: boolean = false;
  isCheckDiscussion: boolean = false;
  isCheckCreateUser: boolean = false;
  currentUser: string;
  userAssign: string;
  supportSystemInfos: SupportSystemInfo[] = [];
  supportTypes: SupportType[] = [];
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isCheckScrenn = false;
    if (window.innerWidth >= 1460) {
      this.isCheckScrenn = true;
    }
    this.isCheckScreenTitle = false;
    this.isCheckDiscussion = false;
    if (window.innerWidth >= 1385) {
      this.isCheckScreenTitle = true;
      this.isCheckDiscussion = true;
    }
  }
  async ngOnInit(): Promise<void> {
    this.isCheckScrenn = false;
    if (window.innerWidth >= 1460) {
      this.isCheckScrenn = true;
    }
    this.isCheckScreenTitle = false;
    this.isCheckDiscussion = false;
    if (window.innerWidth >= 1385) {
      this.isCheckScreenTitle = true;
      this.isCheckDiscussion = true;
    }
    //lấy dữ liệu
    if (this.session.settings.get('supportSystemInfo')) {
      this.supportSystemInfos = this.session.settings.get('supportSystemInfo');
    }

    //
    this._backDetailService.currentState.subscribe(state => {
      this.checkListManagerNumber = state;
    });
    this.currentUser = this.session?.user?.userName?.toLocaleLowerCase();
    //lấy trạng tháistate
    this._dataService.currentState.subscribe(state => {
      this.isStateLeftMenu = state;
    });
    this.loadDataComments();
    this.loadDataAssign();
    this.isLoading = true;
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
    // this.isAdmin = true;
    // this.loadDataType();
    //nếu postid > 0 thì get dữ liệu và là form update
    if (this.postid > 0) {
      //nếu la role admin thì với cho sửa
      this.isUpdate = false;
      this.loadDataAutoComplateComment();
      // this.loadDataAssign();
      this.loadDataDetail();
      this.loadDataComment();
    } else {
      this.loadDataAutoComplate();
      //nếu tạo hỗ trợ thì role nào tạo cũng được
      if (!this.isCreateSupport) {
        if (!(this.session.isCreate || this.isAdmin)) {
          this._router.navigateByUrl('/403');
          return;
        }
      }
      this.form.get('infoSupport').disable();
      if (this.session.settings.get('typeRq')) {
        this.availableTypes = JSON.parse(this.session.settings.get('typeRq')['value']);
        //nếu tạo yêu cầu hỗ trợ
        if (this.isCreateSupport) {
          //chỉ lấy loại là hỗ trợ
          this.availableTypes = this.availableTypes.filter(x => x.id == 3);
          //set luôn value
          this.form.get('type').setValue(3);
          this.form.get('type').disable();
        } else {
          //loại trừ hỗ trợ
          this.availableTypes = this.availableTypes.filter(x => x.id != 3);
          this.form.get('type').enable();
        }
      }
      //set giá trị sẵn có của mã đơn vị và Tên đơn vị
      this.form.get('unit').setValue(this.session.user.divisionCode);
      this.isLoading = false;
      myApp.ui.clearBusy();
    }
    //kiểm tra sự thay đổi của form
    this.onFormChange();
  }
  //after view
  ngAfterViewChecked() {
    if (this.comments.length > 0) {
      this.commentContainer.nativeElement.scrollTop =
        this.commentContainer.nativeElement.scrollHeight;
    }
  }
  //lấy dữ liệu comment
  loadDataComment() {
    this.isLoadingComment = true;
    this.searchComment.postid = this.postid;
    this._commentService.getByPostId(this.searchComment)
      .pipe(
        finalize(async () => {
          this.isLoadingComment = false;
        })
      )
      .subscribe(async (res) => {
        this.comments = res['data'].commentInfos;
      });
  }
  //get dữ liệu detail của request
  typeName: string;
  createUser: string;
  createDate: string;
  createTime: string;
  oldStatus: number;
  loadDataDetail() {
    this.isLoading = true;
    this.postId.postId = this.postid;
    this._manageRequest.getById(this.postId)
      .pipe(
        finalize(async () => {
          this.isLoading = false;
        })
      )
      .subscribe(async (res) => {
        //gán lại dữ liệu
        this.manageRequest.postId = res.postid;
        if (res.posttype == 3) {
          this.isCreateSupport = true;
        } else {
          this.isCreateSupport = false;
        }
        if (this.session.settings?.get('typeRq')) {
          this.availableTypes = JSON.parse(this.session.settings.get('typeRq')['value']);
          //nếu tạo yêu cầu hỗ trợ
          if (this.isCreateSupport) {
            //chỉ lấy loại là hỗ trợ
            this.availableTypes = this.availableTypes.filter(x => x.id == 3);
            //set luôn value
            this.form.get('type').disable();
          } else {
            //loại trừ hỗ trợ
            this.availableTypes = this.availableTypes.filter(x => x.id != 3);
            this.form.get('type').enable();
          }
        }
        this.form.get('type').setValue(res.posttype);
        this.availableTypes.forEach(item => {
          if (item.id == res.posttype) {
            this.typeName = item.name;
          }
        });
        this.form.get('unit').setValue(res.departmentCode);
        this.form.get('dateComplate').setValue(this.parseDateTime(res.desiredDate));
        this.form.get('estimateDate').setValue(this.parseDateTime(res.estimatedenddate));
        if (this.parseDateTime(res.estimatedenddate) == "01/01/0001") {
          this.form.get('estimateDate').setValue(null);
        }
        this.form.get('startDate').setValue(this.parseDateTime(res.estimatedstartdate));
        if (this.parseDateTime(res.estimatedstartdate) == "01/01/0001") {
          this.form.get('startDate').setValue(null);
        }
        this.form.get('content').setValue(res.postdescription);
        this.form.get('priority').setValue(res.priority);
        if (this.isCreateSupport) {
          let listProjectCode = res.projectCode.split(';');
          if (listProjectCode?.length >= 2) {
            this.form.get('typeSupport').setValue(listProjectCode[0]);
            this.form.get('infoSupport').setValue(listProjectCode[1]);
            this.form.get('nameProduct').setValue(listProjectCode[0] + ' - ' + listProjectCode[1]);
            this.form.get('infoSupport').enable();
          } else {
            this.form.get('typeSupport').setValue(listProjectCode[0]);
            this.form.get('nameProduct').setValue(res.projectCode);
            this.form.get('infoSupport').disable();
          }
        } else {
          this.form.get('nameProduct').setValue(res.projectCode);
        }
        this.form.get('title').setValue(res.tittle);
        this.createUser = res.createdUser;
        this.createDate = this.parseDateTime(res.createdDate);
        this.createTime = this.getTime(res.createdDate.toString());
        this.reason = res.reason;
        this.userCencel = res.updateby;
        //laays danh sách email để gửi mail
        // this.inputEmail = res.emailreceiver;
        //kiểm tra xem có mail không
        // if (res.emailreceiver != null || res.emailreceiver != undefined) {
        //   //lấy mảng email
        //   this.loaddataAutoComplateInput(res.emailreceiver, true);
        // }
        // this.displayListEmail = res.emailreceiver;
        // //lấy dữ liệu đã chọn trước
        // if (res.receiverAccount != null || res.receiverAccount != undefined) {
        //khoong phair null thif voi set gia tri
        if (res.receiverAccount) {
          this.userAssign = res?.receiverAccount?.toLocaleLowerCase();
          if (!this.isAdmin) {
            if (this.currentUser == this.userAssign) {
              this.isAdmin = true;
            }
          }
          this.loaddataAutoComplateInput(res.receiverAccount);
        } else {
          //nếu không có người tiếp nhận reset về null
          this.selectedAssigns = null;
          this.loadDataAutoComplate();
        }
        // }
        //lấy danh sách file
        this.listFileOfPost = res.fileItems;
        this.checkStatus = res.poststatus;
        //lấy trạng thái
        this.selectedStatus = res.poststatus;
        //trạng thái dropdown
        this.statusList.forEach(item => {
          if (item.id == res.poststatus) {
            this.selectDropDownStatus = item;
          }
        });
        this.oldStatus = res.poststatus;

        //kiểm tra xem có phải người tạo không
        if (res?.createdUser) {
          this.isCheckCreateUser = (this.createUser.toString().toLocaleLowerCase() == this.session.user.email.split('@')[0].toString().toLocaleLowerCase());
        }
        //gán createUser
        this.isDirty = false;
      });
  }
  listFileOfPost: FileItem[] = [];
  // lấy dữ liệu assign
  loadDataAssign() {
    this.assignInput$.pipe(
      debounceTime(CONSTANT.TIME_OUT_SEARCH),
      distinctUntilChanged(),
      tap(() => this.assignLoading = true),
      finalize(() => { this.assignLoading = false }),
      switchMap(term => {
        if (term == null || term == undefined) {
          term = "";
        }
        return this._manageRequest.getListAssign(term, 0, 10);
      })
    ).subscribe(data => {
      data.forEach(item => {
        //lấy userName là emali
        item.userName = item.email.split('@')[0].toLocaleLowerCase();
      })
      this.availableAssigns = data;
      //chuyển tên về tên thường
      this.assignLoading = false
    })
  }
  loadDataComments() {
    this.commentInput$.pipe(
      debounceTime(CONSTANT.TIME_OUT_SEARCH),
      distinctUntilChanged(),
      tap(() => this.assignLoading = true),
      finalize(() => { this.assignLoading = false }),
      switchMap(term => {
        if (term == null || term == undefined) {
          term = "";
        }
        return this._manageRequest.getListAssign(term, 0, 10);
      })
    ).subscribe(data => {
      data.forEach(item => {
        //lấy userName là emali
        item.userName = item.email.split('@')[0].toLocaleLowerCase();
      })
      this.availableComments = data;
      //chuyển tên về tên thường
      this.assignLoading = false
    })
  }
  //lấy dữ liệu lúc đầu cho người tiếp nhận
  loadDataAutoComplate() {
    // if(isGetDetail){
    //   this._manageRequest.getListAssign(name, 0, 10).pipe(finalize(() => {this.assignLoading = false}),).subscribe(data => {
    //     this.selectedAssigns = data[0];
    //   });
    // }else{

    // }
    this.assignLoading = true;
    this._manageRequest.getListAssign("", 0, 10).pipe(finalize(() => { this.assignLoading = false }),).subscribe(data => {
      //chuyển dữ liệu về tên thường
      data.forEach(item => {
        //lấy userName là emali
        item.userName = item.email.split('@')[0].toLocaleLowerCase();
      })
      this.availableAssigns = data;
      this.availableComments = data;
    });
  }
  loadDataAutoComplateComment() {
    // if(isGetDetail){
    //   this._manageRequest.getListAssign(name, 0, 10).pipe(finalize(() => {this.assignLoading = false}),).subscribe(data => {
    //     this.selectedAssigns = data[0];
    //   });
    // }else{

    // }
    this.assignLoading = true;
    this._manageRequest.getListAssign("", 0, 10).pipe(finalize(() => { this.assignLoading = false }),).subscribe(data => {
      //chuyển dữ liệu về tên thường
      data.forEach(item => {
        //lấy userName là emali
        item.userName = item.email.split('@')[0].toLocaleLowerCase();
      })
      this.availableComments = data;
    });
  }
  //load data autocolpalte
  loaddataAutoComplateInput(userName: string, isMultil = false) {
    this.isFirstLoad = true;
    if (isMultil) {
      //không vào
      if (userName.length > 0) {
        // let arr = userName.split(';');
        // arr.forEach(item => {
        //   this._manageRequest.getListAssign(item, 0, 1).subscribe(data => {
        //     let account: AccountFtmsInfor = {
        //       userName: data[0].userName,
        //       fullName: data[0].fullName,
        //       divisionCode: data[0].divisionCode,
        //       departmentCode: data[0].departmentCode,
        //       areaCode: data[0].areaCode,
        //       email: data[0].email,
        //       position: data[0].position,
        //       saleId: data[0].saleId,
        //       employeeId: data[0].employeeId,
        //     };
        //     this.selectedMails.push(account);
        //   })
        // });
      }
    } else {
      this.assignLoading = true;
      this._manageRequest.getListAssign(userName, 0, 10).pipe(finalize(() => { this.assignLoading = false }),).subscribe(rs => {
        // let account: AccountFtmsInfor = {
        //   userName: data[0].userName,
        //   fullName: data[0].fullName,
        //   divisionCode: data[0].divisionCode,
        //   departmentCode: data[0].departmentCode,
        //   areaCode: data[0].areaCode,
        //   email: data[0].email,
        //   position: data[0].position,
        //   saleId: data[0].saleId,
        //   employeeId: data[0].employeeId,
        // };
        rs.forEach(item => {
          //lấy userName là emali
          item.userName = item.email.split('@')[0].toLocaleLowerCase();
        })
        let assigner = rs.find(x => x.userName.toLocaleLowerCase() == userName.toLocaleLowerCase());
        this.availableAssigns = rs;
        this.selectedAssigns = assigner;
        //gán vào list để lấy ra
        // this.availableAssigns = rs;
      });
    }
  }

  availableTypes: Type[] = [];
  //lấy dữ liệu type
  // loadDataType() {
  //   this.isLoading = true;
  //   this._settingService.getSettings(CONSTANT.SYSTEM_TYPEREQUEST)
  //     .pipe(
  //       finalize(async () => {
  //         this.isLoading = false;
  //       })
  //     ).subscribe(async (res) => {
  //       this.availableTypes = JSON.parse(res.value);
  //     })
  // }
  //
  isCheckEndDate: boolean = false;
  isCheckStartDate: boolean = false;

  //lấy tên loại

  //lấy forrm
  get fm() { return this.form.controls; }
  get fcm() { return this.formComment.controls; }
  //auto complate assgin
  availableAssigns: AccountFtmsInfor[] = [];
  availableComments: AccountFtmsInfor[] = [];
  onAssignChange() {
    this.isFirstLoad = false;
    this.isDirty = true;
    this.checkChangeStatusNonAssign = false;
    //nếu xóa lựa chọn thì lấy lại danh sách select
    if (!this.selectedAssigns) {
      this.selectedStatus = 0;
      this.loadDataAutoComplate();
    }
    //nếu trạng thái đang là 0 thì đưa về 1
    if (this.selectedAssigns) {
      //là tạo mới thì với chuyển trạng thái
      if (this.selectedStatus == 0) {
        this.selectedStatus = 1;
      }
    } else {
      this.checkChangeStatus = false;
      if (!(this.postid > 0)) {
        this.selectedStatus = 0;
      }
      if (this.selectedStatus != 0) {
        this.checkChangeStatusNonAssign = true;
      }
    }
    // console.log("Chọng người tieps nhận: "+this.selectedAssigns.userName);
  }
  checkChangeStatus: boolean = false;
  //dữ liệu valid file
  invalidFile: boolean = false;
  messageErr: string = "";
  //lưu lại dữ liệu mới
  async save() {
    this.submitted = true;
    //set dữ liệu
    if (this.postid > 0) {
      //ngày bắt đầu và kết thúc không hợp lệ
      if (this.isCheckStartDate || this.isCheckEndDate || this.checkChangeStatus || this.checkChangeStatusNonAssign) {
        this.isLoading = false;
        return;
      }
      if (this.isCreateSupport) {
        this.form.get('nameProduct').disable();
      } else {
        this.form.get('typeSupport').disable();
        this.form.get('infoSupport').disable();
      }
      if (this.form.invalid) {
        this.isLoading = false;
        return;
      }
      //update
      if (this.oldStatus == 1 || this.oldStatus == 2) {
        if (this.selectedStatus == 0) {
          this._messageService.add({
            severity: 'error',
            detail: 'Không thể chuyển trạng thái về chưa tiếp nhận!',
          });
          this.isLoading = false;
          return;
        }
      }
      if (this.isDirty) {
        if (
          await this._messageConfirmService.showPopupConfirm(
            'Xác nhận hủy',
            'Bạn có muốn thực hiện hành động này không?'
          )
        ) {
          this.isLoading = true;

          //adđ file mới khi update
          let fileResult: FileInfoDto[] = [];
          this.invalidFile = false;
          if (this.files.length > 0) {
            try {
              console.log('file' + this.files);
              fileResult = await this._fileService.uploadFile(this.files)
            } catch (error) {
              //loại bỏ hết các mesage
              this._messageService.clear();
              this._messageService.add({
                severity: 'error',
                detail: 'Có lỗi không upload được file!',
              });
              this.isLoading = false;
              return;
            }
          }
          this.manageRequestUpdate.files = [];
          if (fileResult.length > 0) {
            fileResult.forEach(item => {
              let file: FileCustom = {
                fileId: "",
                fileName: ""
              };
              file.fileId = item.fileId;
              file.fileName = item.fileName;
              this.manageRequestUpdate.files.push(file);
            })
          }

          this.manageRequestUpdate.postId = this.postid;
          this.manageRequestUpdate.postType = this.form.get('type').value;
          this.manageRequestUpdate.departmentCode = this.form.get('unit').value;
          this.manageRequestUpdate.desiredDate = new Date(moment(this.form.get('dateComplate').value, 'DD/MM/YYYY').toDate().setHours(7));
          this.manageRequestUpdate.estimatedEndDate = new Date(moment(this.form.get('estimateDate').value, 'DD/MM/YYYY').toDate().setHours(7));
          if (this.form.get('estimateDate').value == "") {
            this.manageRequestUpdate.estimatedEndDate = null;
          }
          this.manageRequestUpdate.estimatedStartDate = new Date(moment(this.form.get('startDate').value, 'DD/MM/YYYY').toDate().setHours(7));
          if (this.form.get('startDate').value == "") {
            this.manageRequestUpdate.estimatedStartDate = null;
          }
          this.manageRequestUpdate.postDescription = this.trimCkEditor(this.form.get('content').value);
          this.manageRequestUpdate.priority = this.form.get('priority').value;
          if (this.isCreateSupport) {
            if (this.form.get('typeSupport').value == 'Hệ thống') {
              this.manageRequestUpdate.projectCode = this.form.get('typeSupport').value + ';' + this.form.get('infoSupport').value;
            } else {
              this.manageRequestUpdate.projectCode = this.form.get('typeSupport').value;
            }
          } else {
            this.manageRequestUpdate.projectCode = this.form.get('nameProduct').value.trim();
          }

          this.manageRequestUpdate.tittle = this.form.get('title').value.trim();
          this.manageRequestUpdate.postStatus = this.selectedStatus;
          if (this.selectedStatus != 0) {
            this.manageRequestUpdate.receiverAccount = this.selectedAssigns?.userName;
          } else {
            this.manageRequestUpdate.receiverAccount = "";
          }

          if (this.reason?.length > 0) {
            this.manageRequestUpdate.reason = this.reason;
          } else {
            this.manageRequestUpdate.reason = "";
          }
          //nếu không phải trạng thái từ chối thì clear lý do
          if (this.selectedStatus != 3) {
            this.manageRequestUpdate.reason = "";
            this.reason = ""
          }

          //
          //api
          this._manageRequest.update(this.manageRequestUpdate)
            .pipe(
              finalize(async () => {
                this.isLoading = false;
              })
            )
            .subscribe(async (res) => {

              this._messageService.add({
                severity: 'success',
                detail: 'Lưu thành công',
              });
              //chuyển summited về false nếu update
              this.submitted = false;
              //load lại dữ liệu components
              this.ngOnInit();
            }, error => {
              //đưa lại về trạng thái cũ nếu vào case error
              this.selectDropDownStatus = this.statusList.filter(item => item.id == this.oldStatus)[0];
              this.selectedStatus = this.oldStatus;
            });
        }
      }
    } else {
      //tạo mới
      //ngày bắt đầu và kết thúc không hợp lệ
      this.isLoading = true;
      if (this.isCheckStartDate || this.isCheckEndDate || this.checkChangeStatus || this.checkChangeStatusNonAssign) {
        this.isLoading = false;
        return;
      }
      if (this.isCreateSupport) {
        this.form.get('nameProduct').disable();
      } else {
        this.form.get('typeSupport').disable();
        this.form.get('infoSupport').disable();
      }
      if (this.isAdmin) {
        if (this.form.invalid) {
          console.log('validate voo day');
          this.isLoading = false;
          return;
        }
      } else {
        if (this.form.controls.title.invalid || this.form.controls.content.invalid
          || this.form.controls.type.invalid || this.form.controls.dateComplate.invalid
          || this.form.controls.unit.invalid || this.form.controls.nameProduct.invalid
          || this.form.controls.typeSupport.invalid || this.form.controls.infoSupport.invalid
          || this.form.controls.priority.invalid) {
          this.isLoading = false;
          return;
        }
      }
      let fileResult: FileInfoDto[] = [];
      this.invalidFile = false;
      if (this.files.length > 0) {
        // if (this.files.length > 5) {
        //   this.invalidFile = true;
        //   this.isLoading = false;
        //   this.messageErr = "Không thể upload vượt quá 5 file!";
        //   return;
        // }
        // for (let i = 0; i < this.files.length; i++) {
        //   if (this.files[i].size > 5242880) {
        //     this.invalidFile = true;
        //     this.isLoading = false;
        //     this.messageErr = "Dung lượng file " + this.files[i].name + " vượt quá 5MB (size tối đa cho mỗi file)!";
        //     return;
        //   }
        // }
        try {
          console.log('file' + this.files);
          fileResult = await this._fileService.uploadFile(this.files)
        } catch (error) {
          //loại bỏ hết các mesage
          this._messageService.clear();
          this._messageService.add({
            severity: 'error',
            detail: 'Có lỗi không upload được file!',
          });
          this.isLoading = false;
          return;
        }
      }
      this.manageRequest.postId = 0;
      this.manageRequest.postType = this.form.get('type').value;
      this.manageRequest.departmentCode = this.form.get('unit').value;
      this.manageRequest.desiredDate = new Date(new Date(this.form.get('dateComplate').value).setHours(7));
      if (this.form.get('estimateDate').value == "" || this.form.get('estimateDate').value == null || this.form.get('estimateDate').value == undefined) {
        this.manageRequest.estimatedEndDate = null;
      } else {
        this.manageRequest.estimatedEndDate = new Date(new Date(this.form.get('estimateDate').value).setHours(7));
      }
      if (this.form.get('startDate').value == "" || this.form.get('startDate').value == null || this.form.get('startDate').value == undefined) {
        this.manageRequest.estimatedStartDate = null;
      } else {
        this.manageRequest.estimatedStartDate = new Date(new Date(this.form.get('startDate').value).setHours(7));
      }
      this.manageRequest.postDescription = this.trimCkEditor(this.form.get('content').value);
      this.manageRequest.priority = this.form.get('priority').value;
      if (this.isCreateSupport) {
        if (this.form.get('typeSupport').value == 'Hệ thống') {
          this.manageRequest.projectCode = this.form.get('typeSupport').value + ';' + this.form.get('infoSupport').value;
        } else {
          this.manageRequest.projectCode = this.form.get('typeSupport').value;
        }
      } else {
        this.manageRequest.projectCode = this.form.get('nameProduct').value.trim();
      }
      this.manageRequest.tittle = this.form.get('title').value.trim();
      this.manageRequest.postStatus = this.selectedStatus;
      this.manageRequest.receiverAccount = this.selectedAssigns?.userName;
      //nếu có người assign khi tạo mới trạng thái luôn là đã tiếp nhận
      if (this.selectedAssigns) {
        this.manageRequest.postStatus = 1;
      }
      this.manageRequest.files = [];
      if (fileResult.length > 0) {
        fileResult.forEach(item => {
          let file: FileCustom = {
            fileId: "",
            fileName: ""
          };
          file.fileId = item.fileId;
          file.fileName = item.fileName;
          this.manageRequest.files.push(file);
        })
      }
      this._manageRequest.create(this.manageRequest)
        .pipe(
          finalize(async () => {
            this.isLoading = false;
          }))
        .subscribe(async (res) => {

          this._messageService.add({
            severity: 'success',
            detail: 'Lưu thành công',
          });
          this.isCreate = true;
          this.isSucsess = true;
          this._router
            .navigateByUrl(`manage-request`)
            .then(() => myApp.ui.clearBusy());
        });
    }
  }
  onFormChange() {
    this.form.get('title').valueChanges.subscribe(val => {
      this.isDirty = true;
    });
    this.form.get('content').valueChanges.subscribe(val => {
      this.isDirty = true;
    });
    this.form.get('type').valueChanges.subscribe(val => {
      this.isDirty = true;
    });
    this.form.get('dateComplate').valueChanges.subscribe(val => {
      this.isDirty = true;
    });
    this.form.get('nameProduct').valueChanges.subscribe(val => {
      this.isDirty = true;
    });
    this.form.get('startDate').valueChanges.subscribe(val => {
      this.isDirty = true;
      if (val) {
        if (this.form.get('estimateDate').value) {
          if (this.form.get('estimateDate').value instanceof Date) {
            if (this.form.get('estimateDate').value < val) {
              this.isCheckStartDate = true;
            } else {
              this.isCheckStartDate = false;
              this.isCheckEndDate = false;
            }
          } else {
            if (new Date(moment(this.form.get('estimateDate').value, 'DD/MM/YYYY').toDate()) < val) {
              this.isCheckStartDate = true;
            } else {
              this.isCheckStartDate = false;
              this.isCheckEndDate = false;
            }
          }
        } else {
          this.isCheckStartDate = false;
          this.isCheckEndDate = false;
        }
      } else {
        this.isCheckStartDate = false;
        this.isCheckEndDate = false;
      }
    });
    this.form.get('unit').valueChanges.subscribe(val => {
      this.isDirty = true;
    });
    this.form.get('estimateDate').valueChanges.subscribe(val => {
      this.isDirty = true;
      if (val) {
        if (this.form.get('startDate').value) {
          if (this.form.get('startDate').value instanceof Date) {
            if (this.form.get('startDate').value > val) {
              this.isCheckEndDate = true;
            } else {
              this.isCheckEndDate = false;
              this.isCheckStartDate = false;
            }
          } else {
            if (new Date(moment(this.form.get('startDate').value, 'DD/MM/YYYY').toDate()) > val) {
              this.isCheckEndDate = true;
            } else {
              this.isCheckStartDate = false;
              this.isCheckEndDate = false;
            }
          }
        } else {
          this.isCheckEndDate = false;
          this.isCheckStartDate = false;
        }
      } else {
        this.isCheckEndDate = false;
        this.isCheckStartDate = false;
      }
    });
    this.form.get('priority').valueChanges.subscribe(val => {
      this.isDirty = true;
    });
    // this.form.get('assign').valueChanges.subscribe(val => {
    //   this.isDirty = true;
    // });
  }
  //hủy
  async cancel() {
    if (this.postid > 0) {
      if (!this.isUpdate) {
        this.isDirty = false;
      }
    }
    //chỉnh sửa form
    if (this.isDirty) {
      if (this.postid > 0) {
        // cập nhật form
        if (this.isUpdate) {
          if (
            await this._messageConfirmService.showPopupConfirm(
              'Xác nhận hủy',
              'Bạn có muốn thực hiện hành động này không?'
            )
          ) {
            this.isUpdate = false;
            this.loadDataDetail();
          }
        } else {
          if (this.checkListManagerNumber == 0) {
            this._router
              .navigateByUrl(`manage-request`);
          } else {
            if (this.checkListManagerNumber == 1) {
              this._router
                .navigateByUrl(`manage-request/my-created`);
            } else {
              this._router
                .navigateByUrl(`manage-request/my-assign`);
            }
          }
        }
      } else {
        history.back();
      }

    } else {
      if (this.isUpdate == true) {
        if (this.postid > 0) {
          this.isUpdate = false;
        } else {
          history.back();
        }
      } else {
        if (this.postid > 0) {
          if (this.checkListManagerNumber == 0) {
            this._router
              .navigateByUrl(`manage-request`);
          } else {
            if (this.checkListManagerNumber == 1) {
              this._router
                .navigateByUrl(`manage-request/my-created`);
            } else {
              if (this.checkListManagerNumber == 2) {
                this._router
                  .navigateByUrl(`manage-request/my-assign`);
              } else {
                this._router
                  .navigateByUrl(`manage-request/my-follow`);
              }
            }
          }
        } else {
          history.back();
        }
      }
    }
  }
  //format date
  parseDateTime(datetime: any) {
    return moment(datetime).format('DD/MM/YYYY');
  }

  //lấy giờ
  getTime(datetime: string) {
    let date = new Date(datetime);
    let hourse = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let minus = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    return hourse + ":" + minus;
  }

  //
  checkChangeStatusNonAssign: boolean = false;
  onStatusChange() {
    this.isDirty = true;
    this.checkChangeStatus = false
    this.checkChangeStatusNonAssign = false;
    if (this.selectedAssigns) {
      if (this.selectedStatus == 0) {
        this.checkChangeStatus = true;
      }
    }
    if (!this.selectedAssigns) {
      if (this.selectedStatus != 0) {
        this.checkChangeStatusNonAssign = true;
      }
    }
    //nếu trạng thái là từ chối hiển thị popup lý do
    if (this.selectedStatus == 3) {
      this.isShowReasionDialog = true;
    }
  }

  //tải danh sách comment khi scrooll
  getListComment(event: any) {
    // if (event.target.offsetHeight + event.target.scrollTop >= (event.target.scrollHeight)) {
    //   this.searchComment.fetch += 5;
    //   this.loadDataComment();
    // }
  }
  //lưu comment
  commentSubmited: boolean = false;
  // checkSendMail: boolean = false;
  commentCreateDto: CommentCreateDto = {
    postId: 0,
    content: "",
    receiverEmail: "",
    createdUser: "",
    files: []
  };
  isSendComment: boolean = false;
  fileCustoms: FileCustom[] = [];
  async saveComment() {
    this.isSendComment = true;
    this.commentSubmited = true;
    let fileResult: FileInfoDto[] = [];
    if (this.formComment.invalid) {
      this.isSendComment = false;
      return;
    }
    this.isLoadingComment = true;
    this.invalidFile = false;
    if (this.files.length > 0) {
      // if (this.files.length > 5) {
      //   this.invalidFile = true;
      //   this.isLoadingComment = false;
      //   this.messageErr = "Không thể upload vượt quá 5 file!";
      //   this.isSendComment = false;
      //   return;
      // }
      // for (let i = 0; i < this.files.length; i++) {
      //   if (this.files[i].size > 5242880) {
      //     this.invalidFile = true;
      //     this.isLoadingComment = false;
      //     this.messageErr = "Dung lượng file " + this.files[i].name + " vượt quá 5MB (size tối đa cho mỗi file)!";
      //     this.isSendComment = false;
      //     return;
      //   }
      // }
      try {
        fileResult = await this._fileService.uploadFile(this.files)
      } catch (error) {
        this.isLoadingComment = false;
        this.isSendComment = false;
        return;
      }
    }
    this.commentCreateDto.postId = this.postid;
    this.commentCreateDto.content = this.formComment.get('comment').value.trim();
    //trước khi push thì cho array file về rỗng
    this.commentCreateDto.files = [];
    if (fileResult.length > 0) {
      fileResult.forEach(item => {
        let file: FileCustom = {
          fileId: "",
          fileName: ""
        };
        file.fileId = item.fileId;
        file.fileName = item.fileName;
        this.commentCreateDto.files.push(file);
      })
    }
    //
    // if (this.checkSendMail) {
    //   this.commentCreateDto.isSendMail = 1;
    //   if (this.displayListEmail != null && this.displayListEmail.length > 0) {
    //     this.commentCreateDto.receiverEmail = this.displayListEmail;
    //   }
    // }
    this.commentCreateDto.receiverEmail = this.displayListEmail ? this.displayListEmail : null;
    this.commentCreateDto.createdUser = this.session.user.userName;
    //reset form luôn
    this._commentService.create(this.commentCreateDto)
      .pipe(
        finalize(async () => {
          this.isLoadingComment = false;
        })
      )
      .subscribe(async (res) => {
        this._messageService.add({
          severity: 'success',
          detail: 'Gửi thành công',
        });
        this.resetFormComment();
        //xóa data input upload file tránh người dùng upload lại file cũ.
        document.getElementById('uploadFile')['value'] = "";
        this.commentSubmited = false;
        this.isSendComment = false;
        this.loadDataComment();
      }, error => { this.isSendComment = false; });

  }
  //reset form comment
  resetFormComment() {
    this.formComment.get('comment').setValue(null);
    // this.checkSendMail = false;
    this.displayListEmail = null;
    this.selectedMails = [];
    this.commentCreateDto.files = [];
    this.files = [];
    this.selectedMailsRollBack = [];
    this.isSucsess = true;
    setTimeout(() => {
      this.isSucsess = false;
    }, 500)
  }
  //kiểm tra xem khi check gửi mail thì đã nhập danh sách email chưa nếu chưa hiển thị cảnh báo
  // changeCheckSendMail() {
  //   if (this.displayListEmail == null || this.displayListEmail.length == 0) {
  //     if (this.checkSendMail) {
  //       this._messageService.add({
  //         severity: 'warn',
  //         detail: 'Nhập danh sách email để thực hiện việc gửi email!',
  //       });
  //     }
  //   }
  // }
  //save list email
  displayListEmail: string;
  addEmailToList() {
    // if (this.inputEmail == null || this.inputEmail == "") {
    //   this.displayListEmail = this.inputEmail;
    //   this.isCollapsed = true;
    //   return;
    // }
    // // else {
    // //   if (this.regiexListEmail(this.inputEmail)) {
    // //     this.displayListEmail = this.inputEmail;
    // //     this.isCollapsed = true;
    // //   }
    // // }
    if (this.selectedMails.length > 0) {
      let arr = this.selectedMails.map(item => item.userName);
      let arrString: string[] = [];
      arr.forEach(item => {
        if (arrString?.length > 0) {
          let index = 0;
          arrString.forEach(i => {
            if (item == i) {
              index++;
            }
          })
          if (index == 0) {
            arrString.push(item);
          }
        } else {
          arrString.push(item);
        }
      })
      this.displayListEmail = arrString.join(';');

    } else {
      this.displayListEmail = "";
    }
    //lưu lại dữ liệu để back về
    this.selectedMailsRollBack = this.selectedMails;
    this.isDustryListEmail = false;
    this.isCollapsed = true;
  }
  //regex list email
  // isSubmitedEmail = false;
  // regiexListEmail(listEmail: string) {
  //   if (listEmail == null || listEmail == "") {
  //     return true;
  //   }
  //   let listMail = listEmail.split(';');
  //   let check = 0;
  //   let expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  //   listMail.forEach(item => {
  //     //loại bỏ khoảng trắng nếu có
  //     item = item.trim();
  //     if (!expression.test(item)) {
  //       check++;
  //     }
  //   });
  //   if (check > 0) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  //xử lý upload file
  //download file
  downloadFile(fileId: string, fileName: string) {
    myApp.ui.setBusy();
    this._fileService.downloadFileFromFtms(fileId)
      .pipe(finalize(() => myApp.ui.clearBusy()))
      .subscribe(res => {
        saveAs(res.data, fileName);
      });
  };
  //checkperrmissdion
  async checkPersion() {
    return await this.session.checkRoles(CONSTANT.FTI_ROLES.FTI_DXRTM_ADMIN);
  }
  //kiểm tra nếu có role admin thì với cho update
  editRequest() {
    this.isUpdate = !this.isUpdate;
  }
  //lấy list file
  pushData(event: any) {
    this.files = event;
    this.invalidFile = false;
    this.isDirty = true;
    if (this.files.length > 0) {
      if (this.submitted == true) {
        this.checkFiles();
      }
      if (this.commentSubmited == true) {
        this.checkFiles();
      }
    }
  }
  //validate upload file
  checkFiles() {
    if (this.files.length > 5) {
      this.invalidFile = true;
      this.messageErr = "Không thể upload vượt quá 5 file!";
      return;
    }
    for (let i = 0; i < this.files.length; i++) {
      if (this.files[i].size > 5242880) {
        this.invalidFile = true;
        this.messageErr = "Dung lượng file " + this.files[i].name + " vượt quá 5MB (size tối đa cho mỗi file)!";
        return;
      }
    }
  }
  //mở popup
  isShowManualDialog: boolean = false;
  dialogManual: Subject<PMDialogEvent> = new Subject<PMDialogEvent>();
  showManual() {
    this.isShowManualDialog = true;
  }
  //status
  selectDropDownStatus: Type;
  reason: string;
  selectDropDown(item: Type) {
    //chọn item cũ không làm gì cả
    if (this.oldStatus == item.id) {
      // //cho xử lý thay đổi lý do
      // if(item.id == 3){
      //   this.isShowReasionDialog = true;
      // }
      return;
    }
    //khác item cũ
    if (this.oldStatus != 0) {
      if (item.id == 0) {
        this._messageService.add({
          severity: 'error',
          detail: 'Không thể chuyển trạng thái về chưa tiếp nhận!',
        });
        return;
      }
    }
    if (!this.selectedAssigns && (item.id != 3)) {
      this._messageService.add({
        severity: 'error',
        detail: 'Thêm người tiếp nhận trước khi chuyển trạng thái!',
      });
      return;
    }
    // if(item.id == 3){
    //   this._messageService.add({
    //     severity: 'warn',
    //     detail: 'Gửi thảo luận giải thích lý do từ chối!',
    //   });
    // }
    //từ chối hiển thị popup lý do từ chối.
    if (item.id == 3) {
      //mở popup nhập lý do
      this.selectDropDownStatus = item;
      this.selectedStatus = this.selectDropDownStatus.id;
      this.isShowReasionDialog = true;
    } else {
      //update trạng thái ngầm
      this.selectDropDownStatus = item;
      this.selectedStatus = this.selectDropDownStatus.id;
      this.updateStatus(this.selectedStatus);
    }
  }
  updateStatus(status: number) {
    this.manageRequestUpdate.postId = this.postid;
    this.manageRequestUpdate.postType = this.form.get('type').value;
    this.manageRequestUpdate.departmentCode = this.form.get('unit').value;
    this.manageRequestUpdate.desiredDate = new Date(moment(this.form.get('dateComplate').value, 'DD/MM/YYYY').toDate().setHours(7));
    this.manageRequestUpdate.estimatedEndDate = new Date(moment(this.form.get('estimateDate').value, 'DD/MM/YYYY').toDate().setHours(7));
    if (this.form.get('estimateDate').value == "") {
      this.manageRequestUpdate.estimatedEndDate = null;
    }
    this.manageRequestUpdate.estimatedStartDate = new Date(moment(this.form.get('startDate').value, 'DD/MM/YYYY').toDate().setHours(7));
    if (this.form.get('startDate').value == "") {
      this.manageRequestUpdate.estimatedStartDate = null;
    }
    this.manageRequestUpdate.postDescription = this.form.get('content').value;
    this.manageRequestUpdate.priority = this.form.get('priority').value;
    this.manageRequestUpdate.projectCode = this.form.get('nameProduct').value;
    this.manageRequestUpdate.tittle = this.form.get('title').value;
    this.manageRequestUpdate.postStatus = status;
    if (this.oldStatus == 0) {
      this.manageRequestUpdate.receiverAccount = "";
    } else {
      this.manageRequestUpdate.receiverAccount = this.selectedAssigns?.userName;
    }
    if (this.reason?.length > 0) {
      this.manageRequestUpdate.reason = this.reason;
    } else {
      this.manageRequestUpdate.reason = "";
    }
    // this.manageRequestUpdate.userChangeStatus = this.session.user.email.split('@')[0];
    // this.manageRequestUpdate.userChangeStatus = 'tinnd10';
    //nếu không phải trạng thái từ chối thì clear lý do
    if (status != 3) {
      this.manageRequestUpdate.reason = "";
      this.reason = ""
    }
    //api
    this._manageRequest.update(this.manageRequestUpdate)
      .pipe(
        finalize(async () => {
          this.isLoading = false;
        })
      )
      .subscribe(async (res) => {
        this.oldStatus = this.selectedStatus;
        // this._messageService.add({
        //   severity: 'success',
        //   detail: 'Chuyển trạng thái thành công',
        // });
      }, error => {
        //đưa lại về trạng thái cũ nếu vào case error
        this.selectDropDownStatus = this.statusList.filter(item => item.id == this.oldStatus)[0];
        this.selectedStatus = this.oldStatus;
      });
  }
  isDustryListEmail: boolean = false;
  changeValueListEmail() {
    this.isDustryListEmail = true;
  }
  async rollBackEmail() {
    if (this.isDustryListEmail) {
      if (
        await this._messageConfirmService.showPopupConfirm(
          'Xác nhận hủy',
          'Hành động hủy bỏ sẽ lấy lại dữ liệu cũ!'
        )
      ) {
        //lấy dữ liệu vào option để lấy ra
        this.selectedMailsRollBack.forEach(item => {
          this.availableComments.push(item);
        });
        this.selectedMails = this.selectedMailsRollBack;
        this.isDustryListEmail = false;
        this.isCollapsed = true;
      }
    } else {
      this.isDustryListEmail = false;
      this.isCollapsed = true;
    }
  }
  statusList: Type[] = [
    { id: 0, name: 'Chưa tiếp nhận' },
    { id: 1, name: 'Đã tiếp nhận' },
    { id: 2, name: 'Đang xử lý' },
    { id: 3, name: 'Từ chối' },
    { id: 4, name: 'Đã đóng' }
  ]
  //dialog reasion
  isShowReasionDialog: boolean = false;
  dialogReasion: Subject<PMDialogEvent> = new Subject<PMDialogEvent>();
  finishedInsertReasion(event: any) {
    //click btn hủy back về trạng thái ban đầu và dừng
    //check đang tạo mới hay cập nhật
    if (this.postid > 0) {
      if (event == '' || event == null) {
        //đưa select box về ban đầu nếu click hủy
        this.selectDropDownStatus = this.statusList.filter(item => item.id == this.oldStatus)[0];
        this.selectedStatus = this.oldStatus;
        return;
      }
    } else {
      //tạo mới
      if (event == '' || event == null) {
        //đưa select box trạng thái về chưa tiếp nhận nếu click btn hủy
        this.selectedStatus = 0;
        return;
      }
    }
    //lấy data
    this.reason = event;
    //nếu chỉnh status nhanh thì update luôn
    if (!this.isUpdate) {
      this.updateStatus(3);
    }
  }
  //kiểm tra chuỗi con
  checkCheracter(strings: string) {
    if (strings.search("Gửi email thất bại tới:") != -1) {
      return true;
    } else {
      return false;
    }
  }
  //kiểm tra xem chọn cái gì
  selectTypeSupport() {
    this.isDirty = true;
    if (this.form.get('typeSupport').value == 'Hệ thống') {
      this.form.get('infoSupport').enable();
    } else {
      this.form.get('infoSupport').setValue('');
      this.form.get('infoSupport').disable();
      if (this.form.get('typeSupport').value == 'Quy trình') {
        if (this.session.settings.get('supportProcessInfo')) {
          this.loaddataAutoComplateInput(this.session.settings.get('supportProcessInfo')[0].emailsupport);
          this.selectedStatus = 1;
        }
      } else {
        if (this.session.settings.get('supportDownloadInfo')) {
          this.loaddataAutoComplateInput(this.session.settings.get('supportDownloadInfo')[0].emailsupport);
          this.selectedStatus = 1;
        }
      }
    }
  }
  selectInfoSupport() {
    this.isDirty = true;
    console.log(this.form.get('infoSupport').value);
    let info = this.supportSystemInfos.find(x => x.systemName == this.form.get('infoSupport').value);
    console.log(info);
    this.loaddataAutoComplateInput(info.emailsupport);
    this.selectedStatus = 1;
  }
  //trim khoảng trắng trong ckeditor
  trimCkEditor(textEditor: string) {
    //đổi khoảng trắng html -> text
    textEditor = textEditor.replace(/&nbsp;/g, ' ');
    //loại bỏ thẻ <p></p>
    let text = textEditor.substring(3, textEditor.length - 5);
    console.log('<p>' + text.trim() + '</p>');
    return '<p>' + text.trim() + '</p>';
  }

  //xóa file
  async removeFile(file) {
    if (
      await this._messageConfirmService.showPopupConfirm(
        'Xác nhận xóa file',
        'Bạn chắc chắn muốn xóa file ' + file.fileName + '!'
      )) {
      this._fileService.DeleteFile({ fileId: file.fileId } as FileDeleteDto).subscribe(res => {
        this.listFileOfPost = this.listFileOfPost.filter(x => x.fileId != file.fileId);
        this._messageService.add({
          severity: 'success',
          detail: 'Xóa file thành công',
        });
      });
    }
  }
  //focus input 
  isShowRecomment: boolean = false;
  listRecomment: string[];
  focusInput(isFocus) {
    this.isShowRecomment = isFocus;
  }
  searchSuggession() {
    this.isShowRecomment = true;
    if (this.form.get('nameProduct').value?.length > 1) {
      this._manageRequest.getListSuggestion({ projectCode: this.form.get('nameProduct').value } as GetListSuggestionDto).subscribe(res => {
        this.listRecomment = res['data'].items;
      });
    } else {
      this.listRecomment = [];
    }
  }
  //chọn tên project
  selectedProjectName(name: string) {
    this.form.get('nameProduct').setValue(name);
    this.isShowRecomment = false;
  }
}

export interface Type {
  id: number;
  name: string;
}

export interface SupportSystemInfo {
  systemName: string
  emailsupport: string
}
export interface SupportType {
  typeName: string
}
