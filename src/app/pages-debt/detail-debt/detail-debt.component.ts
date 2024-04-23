import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { DataStateLeftMenuService } from '@shared/services/changeLeftMenu.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { InvoiceDebtService } from '@shared/service-proxy/invoice-debt/invoicedebt.service';
import { UpdateStatusDebt, requestDetailDebt, requestDetailDebtUpdate, responseDetailDebt } from '@shared/service-proxy/invoice-debt/models/request-response-detailDebt';
import { Observable, Subject } from 'rxjs';
import { AccountFtmsInfor } from '@shared/models/AccountFtmsInfor';
import { debounceTime, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';
import CONSTANT from '@shared/configs/CONSTANT';
import { ManageRequestService } from '@shared/service-proxy/manage-request/manage-request.service';
import { MessageService } from 'primeng/api';
import { InseartUpdateDebtLog, RequestDebtLog, debtLogResponse, deleteLog } from '@shared/service-proxy/invoice-debt/models/DebtLog.model';
import { MessageConfirmService } from '@shared/services/message-confirm.service';
import { saveAs } from 'file-saver';
import { AppSessionService } from '@shared/session/app-session.service';
import { AlertService } from '@shared/services/alert';

@Component({
    selector: 'app-detail-debt',
    templateUrl: './detail-debt.component.html',
    styleUrls: ['./detail-debt.component.scss']
})
export class DetailDebtComponent implements OnInit {

    @HostListener('window:beforeunload')
    canDeactivate(): Observable<boolean> | boolean {
        if (this.isDirty) {
            if(this.isUpdate){
                return new Observable<boolean>(subscribe => {
                    const callback = () => {
                        subscribe.next(true);
                    }
                    this.alert.confirm(callback);
                });
            }else{
                return true;
            }
        } else {
            return true;
        }
    }

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
    isCheckScrenn: boolean = false;
    isCheckScreenTitle: boolean = false;
    isCheckDiscussion: boolean = false;
    isLoading: boolean = false;
    isStateLeftMenu: boolean;
    isUpdate: boolean = false;
    form: FormGroup;
    formLogHistory: FormGroup;
    submitted: boolean = false;
    value8: number;
    selectDropDownStatus: Type;
    logSummit: boolean = false;
    selectedStatus: Type;
    invoiceId = 0;
    isDirty: boolean = false;
    detailEinvoiceDebt: responseDetailDebt;
    @ViewChild('commentContainer') commentContainer: ElementRef;
    //lấy giá trị
    listInteractValue: Value[] = [
        {
            id: 0,
            name: 'Chọn hình thức'
        },
        {
            id: 1,
            name: 'Gọi điện'
        },
        {
            id: 2,
            name: 'Gửi mail'
        },
        {
            id: 3,
            name: 'Đi gặp khách hàng'
        },
        {
            id: 4,
            name: 'Gửi công văn'
        },
        {
            id: 5,
            name: 'Gửi tin nhắn nhắc cước'
        }
    ];
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
    public Editor = ClassicEditor;
    isView: boolean = false;
    isSubAdmin: boolean = false;
    isAssigner: boolean = false;
    constructor(private router: Router, private _dataService: DataStateLeftMenuService,
        private _formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
        private _messageService: MessageService,
        private session: AppSessionService,
        private alert: AlertService,
        private _manageRequest: ManageRequestService,
        private _messageConfirmService: MessageConfirmService,
        private _invoiceDebtService: InvoiceDebtService) {
        this.form = this._formBuilder.group({
            invoicenumber: ['', [Validators.required]],
            region: ['', [Validators.required]],
            invoicedate: [null, [Validators.required]],
            branch: ['', [Validators.required,]],
            servicename: ['', [Validators.required]],
            contractnumber: ['', [Validators.required]],
            totalamount: [null],
            customername: ['', [Validators.required]],
            totaldebt: [null],
            taxcode: ['', [Validators.required]],
            receiverestimatedate: [null, [Validators.required]],
            department: ['', []],
            saleaccount: ['', []],
            demaccount: [this.selectedAssigns, []],
            status: [0, []],
            invoicetypename: ['', []]
        });
        this.formLogHistory = this._formBuilder.group({
            interacttype: [0, []],
            content: ['', [Validators.required, Validators.maxLength(4000)]]
        });
    }
    statusList: Type[] = [
        { id: 1, name: 'Đang xử lý' },
        { id: 0, name: 'Đã thanh toán' }
    ]
    selectTypeInvoice: TypeInvoice = { value: '', name: 'Chọn loại hóa đơn' }
    typeInvoiceList: TypeInvoice[] = [
        { value: '', name: 'Chọn loại hóa đơn' },
        { value: 'Dịch vụ', name: 'Dịch vụ' },
        { value: 'Thiết bị', name: 'Thiết bị' }
    ]
    ngOnInit(): void {
        //lấy id
        this.activatedRoute.params.subscribe(params => {
            let id = '';
            id = params['id'];

            if (id != '') {
                this.invoiceId = +id;
            }
        });
        //kiểm tra nếu không nằm trong trung tâm DEM thì ridirect sang trang 403 không có quyền hoặc có quyền view
        if (this.session.settings.get('dem_bgd')) {

            let email_dem_bgd = this.session.settings.get('dem_bgd')[0].email;

            let arrSubAdmin = email_dem_bgd.toString().split(',');
            arrSubAdmin.forEach(item => {
                if (item.toLocaleLowerCase() == this.session?.user?.email.toLocaleLowerCase()) {
                    this.isView = true;
                }
            });
        }
        //kiểm tra queenf subadmin Dem

        let email_dem = this.session.settings.get('dem_subadmin')[0].email;
        if (email_dem) {
            let arrSubAdmin = email_dem.toString().split(',');
            arrSubAdmin.forEach(item => {
                if (item.toLocaleLowerCase() == this.session?.user?.email.toLocaleLowerCase()) {
                    this.isSubAdmin = true;
                }
            });
        }
        //nếu không phải subadmin Dem thì không có quyền chỉnh sửa trạng thái và nợ còn lại
        // if(!this.isSubAdmin){
        //     this.form.get('status').disable();
        //     this.form.get('totaldebt').disable();
        // }
        if (this.session?.user?.divisionCode != CONSTANT.FTI_DEM && !this.isView && !this.isSubAdmin) {
            this.router.navigateByUrl('/403');
        }
        //lấy trạng tháistate
        this._dataService.currentState.subscribe(state => {
            this.isStateLeftMenu = state;
        });
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
        this.loadDataAssign();
        if (this.invoiceId > 0) {
            //lấy dữ liệu
            this.getDetail()
        }
        //kiểm tra sự thay đổi của form
        this.onFormChange();
    }

    onFormChange() {
        this.form.get('invoicenumber').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('region').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('invoicedate').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('branch').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('servicename').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('contractnumber').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('totalamount').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('totaldebt').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('taxcode').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('receiverestimatedate').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('department').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('saleaccount').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('demaccount').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('status').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
        this.form.get('invoicetypename').valueChanges.subscribe(val => {
            this.isDirty = true;
        });
    }

    //after view
    ngAfterViewChecked() {
        if (this.listDebtLog?.length > 0) {
            this.commentContainer.nativeElement.scrollTop =
                this.commentContainer.nativeElement.scrollHeight;
        }
    }

    get fm() { return this.form.controls; }
    get fl() { return this.formLogHistory.controls; }

    //lưu lại lịch sử khi chọn edit
    historyListDebtLog: debtLogResponse[];
    checkOpenEdit: number = -1;
    historyContent: string;
    historyInvoiceType: number;
    openEditLog(index) {
        if (this.checkOpenEdit == -1) {
            this.checkOpenEdit = index;
            this.historyContent = this.listDebtLog[index].content;
            this.historyInvoiceType = this.listDebtLog[index].interacttype;
            document
                .getElementById("story-log-label-" + index)
                .classList.add("display-none");
            document
                .getElementById("story-log-active-" + index)
                .classList.remove("display-none");
        } else {
            this._messageService.add({
                severity: 'warn',
                detail: 'Đóng lại form đang cập nhật để tiếp tục!',
            });
        }
    }

    closeEditLog(index, checksSave = false) {
        if (this.checkOpenEdit > -1) {
            this.checkOpenEdit = -1;
            //nếu là update thì không back về data cũ
            if (!checksSave) {
                this.listDebtLog[index].content = this.historyContent;
                this.listDebtLog[index].interacttype = this.historyInvoiceType;
            }
            document
                .getElementById("story-log-label-" + index)
                .classList.remove("display-none");
            document
                .getElementById("story-log-active-" + index)
                .classList.add("display-none");
        }
    }

    //lấy dữ liệu chi tiết
    async getDetail() {
        setTimeout(() => {
            myApp.ui.setBusy();
        }, 250);
        this._invoiceDebtService.getDetail({ invoicedebtid: this.invoiceId } as requestDetailDebt).subscribe(res => {
            this.detailEinvoiceDebt = res['data'].items;
            this.form.get('invoicenumber').setValue(this.detailEinvoiceDebt.invoicenumber);
            this.form.get('region').setValue(this.detailEinvoiceDebt.region);
            this.form.get('invoicedate').setValue(this.detailEinvoiceDebt.invoicedate ? new Date(this.detailEinvoiceDebt.invoicedate) : null);
            this.form.get('branch').setValue(this.detailEinvoiceDebt.branch);
            this.form.get('servicename').setValue(this.detailEinvoiceDebt.servicename);
            this.form.get('contractnumber').setValue(this.detailEinvoiceDebt.contractnumber);
            this.form.get('totalamount').setValue(this.detailEinvoiceDebt.totalamount);
            this.form.get('customername').setValue(this.detailEinvoiceDebt.customername);
            this.form.get('totaldebt').setValue(this.detailEinvoiceDebt.totaldebt);
            this.form.get('taxcode').setValue(this.detailEinvoiceDebt.taxcode);
            this.form.get('receiverestimatedate').setValue(new Date(this.detailEinvoiceDebt.receiverestimatedate).getFullYear() == 1 ? null : new Date(this.detailEinvoiceDebt.receiverestimatedate));
            this.form.get('department').setValue(this.detailEinvoiceDebt.department);
            this.form.get('saleaccount').setValue(this.detailEinvoiceDebt.saleaccount);
            this.form.get('demaccount').setValue(this.detailEinvoiceDebt.demaccount);
            this.form.get('status').setValue(this.detailEinvoiceDebt.status);
            this.form.get('invoicetypename').setValue(this.detailEinvoiceDebt.invoicetypename ? this.detailEinvoiceDebt.invoicetypename : '');
            this.selectedStatus = this.statusList.find(x => x.id == this.detailEinvoiceDebt.status);
            if (this.detailEinvoiceDebt?.demaccount) {
                this.loaddataAutoComplateInput(this.detailEinvoiceDebt.demaccount);
            }
            if (this.session?.user?.userName.toLocaleLowerCase() == this.detailEinvoiceDebt.demaccount.toLocaleLowerCase()) {
                this.isAssigner = true;
            }
            this.getListDebtLog();
            setTimeout(() => {
                myApp.ui.clearBusy();
                this.isDirty = false;
            }, 250);
        }, error => {
            setTimeout(() => {
                myApp.ui.clearBusy();
            }, 250);
        });
    }

    //thay đổi nhanh status
    changeStatus(item) {
        if (this.selectedStatus.id == item.id) {
            return;
        }
        this.selectedStatus = item;
        this._invoiceDebtService.updateStatus({ invoicedebtid: this.detailEinvoiceDebt.invoiceid, status: item.id } as UpdateStatusDebt).subscribe(res => {
        });
    }

    //assigner
    assignLoading = false;
    assignInput$ = new Subject<string>();
    selectedAssigns: AccountFtmsInfor;
    availableAssigns: AccountFtmsInfor[] = [];
    onAssignChange() {
        console.log(this.selectedAssigns);
        //nếu xóa lựa chọn thì lấy lại danh sách select
        if (!this.selectedAssigns) {
            this.loadDataAutoComplate();
        }
    }
    // lấy dữ liệu assign
    loadDataAssign() {
        this.assignInput$.pipe(
            debounceTime(CONSTANT.TIME_OUT_SEARCH),
            distinctUntilChanged(),
            tap(() => this.assignLoading = true),
            finalize(() => { this.assignLoading = false }),
            switchMap(term => {
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
    loadDataAutoComplate() {
        this.assignLoading = true;
        this._manageRequest.getListAssign("", 0, 10).pipe(finalize(() => { this.assignLoading = false }),).subscribe(data => {
            //chuyển dữ liệu về tên thường
            data.forEach(item => {
                //lấy userName là emali
                item.userName = item.email.split('@')[0].toLocaleLowerCase();
            })
            this.availableAssigns = data;
        });
    }
    //load data autocolpalte
    loaddataAutoComplateInput(userName: string) {
        this.assignLoading = true;
        this._manageRequest.getListAssign(userName, 0, 10).pipe(finalize(() => { this.assignLoading = false }),).subscribe(rs => {
            rs.forEach(item => {
                //lấy userName là emali
                item.userName = item.email.split('@')[0].toLocaleLowerCase();
            })
            let assigner = rs.find(x => x.userName.toLocaleLowerCase() == userName.toLocaleLowerCase());
            this.availableAssigns = rs;
            this.selectedAssigns = assigner;
        });
    }

    //quay lại
    async back() {
        if (this.isDirty) {
            if (this.isUpdate) {
                if (
                    await this._messageConfirmService.showPopupConfirm(
                        'Xác nhận hủy',
                        'Bạn có muốn thực hiện hành động này không?'
                    )
                ) {
                    this.isUpdate = false;
                    this.getDetail();
                }
            } else {

                history.back();
            }

        } else {
            if (this.isUpdate) {
                this.isUpdate = false;
            } else {
                history.back();
            }
        }

    }

    debtUpdate: requestDetailDebtUpdate = {
        invoiceid: null,
        region: null,
        branch: null,
        contractnumber: null,
        customername: null,
        taxcode: null,
        invoicenumber: null,
        invoicedate: null,
        totalamount: null,
        department: null,
        saleaccount: null,
        demaccount: null,
        servicename: null,
        totaldebt: null,
        statusname: null,
        interacttype: null,
        updateat: null,
        createuser: null,
        updateuser: null,
        status: null,
        createat: null,
        receiverestimatedate: null,
        invoicetypename: null
    };
    save() {

        this.submitted = true;
        if (this.form.invalid) {
            return;
        }
        if (this.form.get('totalamount').value < this.form.get('totaldebt').value) {
            return;
        }
        this.isLoading = true;
        this.debtUpdate.invoiceid = this.detailEinvoiceDebt.invoiceid;
        this.debtUpdate.invoicenumber = this.form.get('invoicenumber').value;
        this.debtUpdate.region = this.form.get('region').value;
        this.debtUpdate.invoicedate = this.form.get('invoicedate').value;
        this.debtUpdate.branch = this.form.get('branch').value;
        this.debtUpdate.servicename = this.form.get('servicename').value;
        this.debtUpdate.contractnumber = this.form.get('contractnumber').value;
        this.debtUpdate.totalamount = this.form.get('totalamount').value;
        this.debtUpdate.customername = this.form.get('customername').value;
        this.debtUpdate.totaldebt = this.form.get('totaldebt').value;
        this.debtUpdate.taxcode = this.form.get('taxcode').value;
        this.debtUpdate.receiverestimatedate = this.form.get('receiverestimatedate').value;
        this.debtUpdate.department = this.form.get('department').value;
        this.debtUpdate.saleaccount = this.form.get('saleaccount').value;
        this.debtUpdate.demaccount = this.selectedAssigns?.userName?.toLocaleLowerCase();
        this.debtUpdate.status = this.form.get('status').value;
        this.debtUpdate.invoicetypename = this.form.get('invoicetypename').value;

        this._invoiceDebtService.update(this.debtUpdate).subscribe(res => {
            this._messageService.add({
                severity: 'success',
                detail: 'Cập nhật thông tin thành công!',
            });
            this.isUpdate = false;
            this.isLoading = false;
            this.getDetail();

        }, error => { this.isLoading = false; });
    }

    //lấy danh sách tình trạng hóa đơn
    requestLog: RequestDebtLog = {
        invoicenumber: '',
        isViewDetail: true,
        fetch: 100000,
        offset: 0
    }
    isLoadingLog: boolean = false;
    listDebtLog: debtLogResponse[];
    getListDebtLog() {
        this.isLoadingLog = true;
        this.requestLog.invoicenumber = this.detailEinvoiceDebt?.invoicenumber;
        this._invoiceDebtService.getListDebtLog(this.requestLog).subscribe(res => {
            this.listDebtLog = res['data'].items;
            this.historyListDebtLog = res['data'].items;
            this.isLoadingLog = false;
            this.isAddLog = false;
        }, error => this.isLoadingLog = false);
    }
    getInteretType(id) {
        return this.listInteractValue.find(x => x.id == id).name;
    }
    //edit log
    editLog(logItem, index) {
        if (!logItem.content) {
            return;
        }
        this.isLoadingLog = true;
        let log: InseartUpdateDebtLog = {
            invoicedebtlogid: logItem.invoicelogid,
            invoicenumber: logItem.invoicenumber,
            content: logItem.content,
            interacttype: logItem.interacttype
        };
        this._invoiceDebtService.InsertUpdateDebtLog(log).subscribe(res => {
            this._messageService.add({
                severity: 'success',
                detail: 'Cập nhật thông tin thành công!',
            });
            this.closeEditLog(index, true);
            this.isLoadingLog = false;
            this.getListDebtLog();
        }, error => this.isLoadingLog = false);
    }
    isAddLog: boolean = false;
    saveLog() {
        this.logSummit = true;
        if (this.formLogHistory.invalid) {
            return;
        }
        this.isAddLog = true;
        //chuyển ký tự xuống dòng
        let log: InseartUpdateDebtLog = {
            invoicedebtlogid: 0,
            invoicenumber: this.detailEinvoiceDebt.invoicenumber,
            content: this.formLogHistory.get('content').value,
            interacttype: this.formLogHistory.get('interacttype').value
        };
        this._invoiceDebtService.InsertUpdateDebtLog(log).subscribe(res => {
            this._messageService.add({
                severity: 'success',
                detail: 'Thêm tình trạng hóa đơn thành công!',
            });
            this.logSummit = false;
            this.isLoadingLog = false;
            //set lại giá trị
            this.formLogHistory.get('content').setValue('');
            this.formLogHistory.get('interacttype').setValue(0);
            this.getListDebtLog();
        }, error => { this.isLoadingLog = false; this.logSummit = false });
    }

    //tải template
    async DownloadTemplate() {
        if (await this._messageConfirmService.showPopupConfirm(
            'Xác nhận Download Template',
            'Bạn có muốn thực hiện hành động này không?'
        )) {
            this._invoiceDebtService.DownloadTemplate()
                .subscribe(file => {
                    saveAs(file.data, 'Template_DebtLog.xlsx');
                })
        }
    }

    //import file
    changeFile(event) {
        let fileName = event.target.files[0].name;
        let typeFile = fileName?.split('.')[fileName?.split('.').length -1];
        if (typeFile != 'xlsx') {
            this._messageService.add({
                severity: 'error',
                detail: 'Upload file có đuôi .xlsx để tiếp tục!',
            });
            return;
        }
        myApp.ui.setBusy();
        // new Promise(() => this.checkStatusFileImport());
        //call api đưa file xuống dưới BE
        this._invoiceDebtService.importFileLog(event.target.files[0], this.detailEinvoiceDebt.invoicenumber).subscribe(res => {
            this._messageService.add({
                severity: 'success',
                detail: 'Import file thành công!',
            });
            this.getListDebtLog();
            myApp.ui.clearBusy();
        }, error => { this.getListDebtLog(); myApp.ui.clearBusy(); });
    }

    // checkStatusFileImport(){
    //     this._invoiceDebtService.getPersen().subscribe(res => {
    //         myApp.ui.setBusy(HTMLElement, res + '%');
    //         if(res = 100){
    //             myApp.ui.clearBusy();
    //         }else{
    //             setTimeout(() => {
    //                 new Promise(() => this.checkStatusFileImport());
    //               }, 500);
    //         }
    //     });
    // }

    //xoas log
    async deleteEditLog(log) {
        if (await this._messageConfirmService.showPopupConfirm(
            'Xác nhận xóa',
            'Bạn chắc chắn muốn xóa lịch sử hóa đơn?'
        )) {
            this._invoiceDebtService.DeleteLog({ invoicedebtlogid: log.invoicelogid } as deleteLog).subscribe(res => {
                this._messageService.add({
                    severity: 'success',
                    detail: 'Xóa thành công!',
                });
                this.getListDebtLog();
            })
        }
    }

    getHTML(html) {
        try {
            return html = html.replace(/(?:\r\n|\r|\n)/g, '<br>');
        } catch (error) {
            return html;
        }
    }

}

export interface Type {
    id: number;
    name: string;
}
export interface Value {
    id: number;
    name: string;
}

export interface TypeInvoice {
    value: string;
    name: string;
}

