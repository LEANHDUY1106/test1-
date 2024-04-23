import { Router } from '@angular/router';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import CONSTANT from '@shared/configs/CONSTANT';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { DataStateLeftMenuService } from '@shared/services/changeLeftMenu.service';
import { FindTerDebtService, RequestInvoiceDebtSearch } from '../service/findterdebt.service';
import { InvoiceDebtService } from '@shared/service-proxy/invoice-debt/invoicedebt.service';
import { RequestInvoiceDebt, RequestInvoiceDebtExprot, ResponseInvoiceDebt } from '@shared/service-proxy/invoice-debt/models/requestInvoiceDebt.model';
import { MessageConfirmService } from '@shared/services/message-confirm.service';
import { saveAs } from 'file-saver';
import { AppSessionService } from '@shared/session/app-session.service';

@Component({
    selector: 'app-list-debt',
    templateUrl: './list-debt.component.html',
    styleUrls: ['./list-debt.component.scss']
})
export class ListDebtComponent implements OnInit {
    isCollapsed: boolean = true;
    isFullScreen: boolean = false;
    isLoading: boolean = false;
    isStateLeftMenu: boolean;
    rangeDates: Date[];
    selectedStatuss: ConfigObject[];
    isView: boolean = false;
    isSubAdmin: boolean = false;
    availableStatuss = ([{
        name: 'Đang xử lý',
        id: 1
    }, {
        name: 'Đã thanh toán',
        id: 0
    }
    ]);
    requestSearch: RequestInvoiceDebt = {
        p_contractnumber: '',
        p_status: '1',
        p_demaccount: '',
        invoicenumber: '',
        startDate: null,
        endDate: null,
        customername: '',
        createdUser: '',
        orderBy: '',
        taxcode: '',
        isSortDesc: false,
        fetch: 0,
        offset: 10
    }
    listInvoiceDebt: ResponseInvoiceDebt[];
    @HostListener('window:resize', ['$event'])
    onResize() {
        this.isFullScreen = false;
        if (window.innerWidth >= 992) {
            this.isFullScreen = true;
        }
    }
    constructor(private router: Router,
        private _dataService: DataStateLeftMenuService,
        private _messageConfirmService: MessageConfirmService,
        private _messageService: MessageService,
        private session: AppSessionService,
        private _searchService: FindTerDebtService,
        private _debtService: InvoiceDebtService) {
    }
    ngOnInit(): void {

        this.isFullScreen = false;
        if (window.innerWidth >= 992) {
            this.isFullScreen = true;
        }
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
        if (this.session?.user?.divisionCode != CONSTANT.FTI_DEM && !this.isView && !this.isSubAdmin) {
            this.router.navigateByUrl('/403');
        }
        //lấy trạng tháistate
        this._dataService.currentState.subscribe(state => {
            this.isStateLeftMenu = state;
        });
        this._searchService.currentState.subscribe(res => {
            if (res) {
                this.requestSearch = res as RequestInvoiceDebt;
                this.currentPage = res.curentPage;
                this.rowPerPage = res?.offset ? res?.offset : 10;
                //lấy lại trạng thái trên search nếu có
                if (this.requestSearch.p_status != null && this.requestSearch.p_status != '') {
                    this.selectedStatuss = [];
                    let arrStatusIds = this.requestSearch.p_status.split(',');
                    this.availableStatuss.forEach(item => {
                        arrStatusIds.forEach(id => {
                            if (item.id == Number(id)) {

                                this.selectedStatuss.push(item);
                            }
                        })
                    })
                }
                //lấy lại thời gian tìm kiếm
                let rangeDates: Date[] = [];
                if (this.requestSearch?.startDate) {
                    rangeDates.push(new Date(this.requestSearch?.startDate))
                }
                if (this.requestSearch?.endDate) {
                    rangeDates.push(new Date(this.requestSearch?.endDate))
                }
                if (rangeDates.length > 0) {
                    this.rangeDates = rangeDates;
                }
            }
        });

        //lấy lại trạng thái trên search nếu có
        if (this.requestSearch.p_status != null || this.requestSearch.p_status != '') {
            this.selectedStatuss = [];
            let arrStatusIds = this.requestSearch.p_status.split(',');
            this.availableStatuss.forEach(item => {
                arrStatusIds.forEach(id => {
                    if (item.id == Number(id)) {

                        this.selectedStatuss.push(item);
                    }
                })
            })
        }

        this.loadData();
    }
    //lấy dữ liệu danh sách
    loadData() {
        this.isLoading = true;
        this._debtService.getAll(this.requestSearch).subscribe(res => {
            console.log(res);
            this.listInvoiceDebt = res['data'].items;
            this.totalCount = res['data'].totalCount;
            this.isLoading = false;
        }, error => { this.isLoading = false })
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
        this.requestSearch.offset = this.rowPerPage;
        this.requestSearch.fetch = (this.currentPage - 1) * this.rowPerPage;
        let searchState: RequestInvoiceDebtSearch;
        searchState = this.requestSearch as RequestInvoiceDebtSearch;
        searchState.curentPage = this.currentPage;
        this._searchService.changeState(searchState);
        this.loadData();
    }
    lazyLoadCustom(event: LazyLoadEvent) {
        this.requestSearch = {
            ...this.requestSearch,
            orderBy: event.sortField,
            isSortDesc: event.sortOrder == -1
        }
        this.loadData();
    }
    //xử lý file
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
        this._debtService.importFile(event.target.files[0]).subscribe(res => {
            this._messageService.add({
                severity: 'success',
                detail: 'Import file thành công!',
            });

            myApp.ui.clearBusy();
            this.loadData();
        }, error => { myApp.ui.clearBusy(); });
    }

    //lọc data search
    onSearch() {
        //bỏ khảng trắng đầu cuối
        this.requestSearch.p_contractnumber = this.requestSearch.p_contractnumber.trim();
        this.requestSearch.customername = this.requestSearch.customername.trim();
        this.requestSearch.invoicenumber = this.requestSearch.invoicenumber.trim();
        this.requestSearch.p_demaccount = this.requestSearch.p_demaccount.trim();
        //lấy về bản ghi đầu tiên khi tìm kiếm
        this.requestSearch.fetch = 0;
        //lấy trạng thái
        if (this.selectedStatuss?.length > 0) {
            this.requestSearch.p_status = this.selectedStatuss.map(x => x.id).join(',');
        } else {
            this.requestSearch.p_status = '';
        }
        //đưa về đầu trang
        this.requestSearch.fetch = 0;
        this.currentPage = 1;

        //tính ngày
        //đưa về null của ngày bắt đầu và kết thúc
        this.requestSearch.startDate = null;
        this.requestSearch.endDate = null;
        if (this.rangeDates) {
            //chọn 2 khoảng thời gian
            if (this.rangeDates[1]) {
                this.requestSearch.startDate = this.rangeDates[0];
                //set về thời gian cuối ngày
                this.requestSearch.endDate = new Date(this.rangeDates[1].setHours(23, 59, 59));
            } else {
                //chỉ chọn 1 khoảng thời gian
                let endDate = new Date(this.rangeDates[0]);
                this.requestSearch.startDate = this.rangeDates[0];
                //set về thời gian cuối ngày
                this.requestSearch.endDate = new Date(endDate.setHours(23, 59, 59));
            }
        }
        let searchState: RequestInvoiceDebtSearch;
        searchState = this.requestSearch as RequestInvoiceDebtSearch;
        searchState.curentPage = this.currentPage;
        this._searchService.changeState(searchState);
        this.loadData();

    }

    refeshSearch() {
        this.requestSearch = {
            p_contractnumber: '',
            p_status: '1',
            p_demaccount: '',
            invoicenumber: '',
            startDate: null,
            endDate: null,
            customername: '',
            createdUser: '',
            orderBy: '',
            taxcode: '',
            isSortDesc: false,
            fetch: 0,
            offset: 10
        }
        this.currentPage = 1;

        let searchState: RequestInvoiceDebtSearch;
        searchState = this.requestSearch as RequestInvoiceDebtSearch;
        searchState.curentPage = this.currentPage;
        this._searchService.changeState(searchState);

        this.loadData();

    }

    //đi đến trang chi tiết
    detailDebt(id: number) {
        this.router.navigate([
            `manage-debt/edit/${id}`,
        ]);
    }

    exprot: RequestInvoiceDebtExprot = {
        p_contractnumber: '',
        p_status: '',
        p_demaccount: '',
        invoicenumber: '',
        startDate: null,
        endDate: null,
        customername: '',
        createdUser: '',
        orderBy: '',
        isSortDesc: false,
        fetch: 0,
        offset: 1000000000,
        exportType: 2
    };

    async exprotData() {
        if (await this._messageConfirmService.showPopupConfirm(
            'Xác nhận Exprot dữ liệu',
            'Bạn có muốn thực hiện hành động này không?'
        )) {
            myApp.ui.setBusy();
            this.exprot.p_contractnumber = this.requestSearch.p_contractnumber;
            this.exprot.p_status = this.requestSearch.p_status;
            this.exprot.p_demaccount = this.requestSearch.p_demaccount;
            this.exprot.invoicenumber = this.requestSearch.invoicenumber;
            this.exprot.startDate = this.requestSearch.startDate;
            this.exprot.endDate = this.requestSearch.endDate;
            this.exprot.customername = this.requestSearch.customername;
            this.exprot.createdUser = this.requestSearch.createdUser;
            this.exprot.orderBy = this.requestSearch.orderBy;
            this.exprot.isSortDesc = this.requestSearch.isSortDesc;
            this._debtService.exprortExcel(this.exprot)
                .subscribe(file => {
                    saveAs(file.data, this.session.user.userName + '_' + new Date().toLocaleDateString('vi-VI') + '.xlsx');
                    myApp.ui.clearBusy();
                }, error => myApp.ui.clearBusy())
        }

    }

    //
    checkStatusFileImport() {
        this._debtService.getPersen().subscribe(res => {
            myApp.ui.setBusy(HTMLElement, res + '%');
            if (res = 100) {
                myApp.ui.clearBusy();
            } else {
                setTimeout(() => {
                    new Promise(() => this.checkStatusFileImport());
                }, 1000);
            }
        });
    }
    async DownloadTemplate() {
        if (
            await this._messageConfirmService.showPopupConfirm(
                'Xác nhận Download Template',
                'Bạn có muốn thực hiện hành động này không?'
            )
        ) {
            this._debtService
                .ImportInvoice_DownloadTemplate()
                .subscribe((file) => {
                    saveAs(
                        file.data,
                        'Template_Invoice.xlsx'
                    );
                });
        }
    }
}

export class ConfigObject {
    id: number;
    name: string;
}
