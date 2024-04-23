import { async } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DataStateLeftMenuService } from '@shared/services/changeLeftMenu.service';
import { MenuItem, MessageService } from 'primeng/api';
import { GetListConfigOutput } from '@shared/service-proxy/config/models/ConfigDto';
import {
    RequestDebtLog,
    debtLogResponse,
    deleteLog,
} from '@shared/service-proxy/invoice-debt/models/DebtLog.model';
import { InvoiceDebtService } from '@shared/service-proxy/invoice-debt/invoicedebt.service';
import CONSTANT from '@shared/configs/CONSTANT';
import { MessageConfirmService } from '@shared/services/message-confirm.service';
import { saveAs } from 'file-saver';
import { PMDialogEvent } from '@shared/ui/pm-dialog/pm-dialog-model';
import { Subject } from 'rxjs';

@Component({
    templateUrl: './list-log-debt.component.html',
    styleUrls: ['./list-log-debt.component.scss'],
})
export class ListLogDebtComponent implements OnInit {
    /**Menu các thao tác file */
    menuItems: MenuItem[] = [];
    isLoading: boolean = false;
    isShowUpdateConfigDialog: boolean = false;
    constructor(
        private router: Router,
        private _dataService: DataStateLeftMenuService,
        private _invoiceDebtService: InvoiceDebtService,
        private _messageConfirmService: MessageConfirmService,
        private _messageService: MessageService
    ) {}
    ngOnInit(): void {
        this._dataService.currentState.subscribe((state) => {
            this.isStateLeftMenu = state;
        });
        this.getListDebtLog();
    }

    generateMenu = (config) => {
        this.menuItems = [
            {
                label: 'Cập nhật',
                icon: 'pi pi-pencil',
                command: () => {
                    this.debtLogDetail = config;
                      this.isShowUpdateConfigDialog = config;
                },
            },
            {
                label: 'Xóa',
                icon: 'pi pi-trash',
                command: () => {
                    this._invoiceDebtService
                        .DeleteLog({
                            invoicedebtlogid: config.invoicelogid,
                        } as deleteLog)
                        .subscribe(() => {
                            this._messageService.add({
                                severity: 'success',
                                summary: 'Service Message',
                                detail: 'Xóa thành công',
                            });
                            this.getListDebtLog();
                        });
                },
            },
        ];
    };

    listDebtLog: debtLogResponse[];
    debtLogDetail: debtLogResponse;
    requestLog: RequestDebtLog = {
        invoicenumber: '',
        isViewDetail: false,
        fetch: 10,
        offset: 0,
    };
    getListDebtLog() {
        this.isLoading = true;
        this._invoiceDebtService.getListDebtLog(this.requestLog).subscribe(
            (res) => {
                this.listDebtLog = res['data'].items;
                this.totalCount = res['data'].totalCount;
                this.isLoading = false;
            },
            (error) => (this.isLoading = false)
        );
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
        this.requestLog.fetch = this.rowPerPage;
        this.requestLog.offset = (this.currentPage - 1) * this.rowPerPage;
        this.getListDebtLog();
    }

    //tải template
    async DownloadTemplate() {
        if (
            await this._messageConfirmService.showPopupConfirm(
                'Xác nhận Download Template',
                'Bạn có muốn thực hiện hành động này không?'
            )
        ) {
            this._invoiceDebtService
                .DownloadTemplateWidthInvoiceNumber()
                .subscribe((file) => {
                    saveAs(
                        file.data,
                        'Template_DebtLog_widthInvoiceNumber.xlsx'
                    );
                });
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
        this._invoiceDebtService
            .importFileLogWithInvoiceNumber(event.target.files[0])
            .subscribe(
                (res) => {
                    this._messageService.add({
                        severity: 'success',
                        detail: 'Import file thành công!',
                    });
                    this.getListDebtLog();
                    myApp.ui.clearBusy();
                },
                (error) => {
                    myApp.ui.clearBusy();
                }
            );
    }
    finishedToRefesh(event){
        if(event){
            this.getListDebtLog();
        }
        this.isShowUpdateConfigDialog= false;
    }

    getHTML(html){
        return html = html?.replace(/(?:\r\n|\r|\n)/g, '<br>');
    }
    isStateLeftMenu: boolean;
}
