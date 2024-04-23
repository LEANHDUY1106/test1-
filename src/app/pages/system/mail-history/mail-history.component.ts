import { finalize } from 'rxjs/operators';
import { AppSessionService } from '@shared/session/app-session.service';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import CONSTANT from '@shared/configs/CONSTANT';
import { MasterType } from '@shared/models/MasterType';
import { MenuItem, MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { MailHistoryDto, MailHistorySearch } from '@shared/service-proxy/mail-history/models/MailHistory';
import { PMDialogEvent } from '@shared/ui/pm-dialog/pm-dialog-model';
import { MailHistoryService } from '@shared/service-proxy/mail-history/mail-history.service';
import { MessageConfirmService } from '@shared/services/message-confirm.service';
import { DataStateLeftMenuService } from '@shared/services/changeLeftMenu.service';

@Component({
    selector: 'app-mail-history',
    templateUrl: './mail-history.component.html',
    styleUrls: ['./mail-history.component.scss']
})
export class MailHistoryComponent implements OnInit {
    //
    isFullScreen: boolean = false;
    isCollapsed: boolean = true;
    @HostListener('window:resize', ['$event'])
    onResize() {
        this.isFullScreen = false;
        if (window.innerWidth >= 992) {
            this.isFullScreen = true;
        }
    }

    // breadCrumbItems = [
    //     { label: 'DX-RTM', path: '/' }
    //     , { label: 'Lịch sử mail', active: true }
    // ];

    mailStatus: MasterType[];

    isToggle: boolean = false;
    searchForm: FormGroup;

    mailHistories: any[];
    mailHistorySelected: MailHistoryDto;
    isLoading = false;

    totalCount = 0;
    currentPage = 1;
    rowPerPage: number = CONSTANT.ROWS_PER_PAGE_DEFAULT;

    isShowDetailDialog = false;
    dialogPreviewSubject: Subject<PMDialogEvent> = new Subject<PMDialogEvent>();

    /**Menu các thao tác file */
    menuItems: MenuItem[] = [];

    //Permission
    isViewDetail: boolean = false;
    isResend: boolean = false;
    isDelete: boolean = false;
    isStateLeftMenu: boolean;

    constructor(
        private _formBuilder: FormBuilder
        , private _mailService: MailHistoryService
        , private _titleService: Title
        , private _messageConfirmService: MessageConfirmService
        , private _messageService: MessageService
        , public _session: AppSessionService
        , private _dataService: DataStateLeftMenuService
    ) {
        this.searchForm = this._formBuilder.group({
            status: [null],
            to: [null],
            createdAt: [null]
        });
    }

    async ngOnInit(): Promise<void> {
        this.isFullScreen = false;
        if (window.innerWidth >= 992) {
            this.isFullScreen = true;
        }
        //lấy trạng tháistate
        this._dataService.currentState.subscribe(state => {
            this.isStateLeftMenu = state;
        });
        this._titleService.setTitle('Lịch sử gửi mail');
        if (this._session.settings.get('mailHistory')) {
            this.mailStatus = JSON.parse(this._session.settings.get('mailHistory')['value']);
        }
        await this.checkPermission();
        this.onSearch();
        this.dialogPreviewSubject.subscribe(({ isClose }) => {
            if (isClose)
                this.mailHistorySelected = null;
        });
        myApp.ui.clearBusy();
    }

    onSearch() {
        //xử lý ngày
        let createdAt =
            this.searchForm.controls['createdAt'].value ?? undefined;
        //ngày bắt đầu đã là thời điểm đầu 0h00p
        let tempStartDate =
            createdAt && myApp.moment.changeOnlyTimeZone(createdAt[0]);
        let tempEndDate =
            createdAt && myApp.moment.changeOnlyTimeZone(createdAt[1]);
        //lấy thời điểm cuối cùng trong ngày 23h59p59s
        tempEndDate = tempEndDate ? new Date(new Date(new Date(tempEndDate.setHours(23)).setMinutes(59)).setSeconds(59)) : undefined;
        const query: MailHistorySearch = {
            status: this.searchForm.get('status').value,
            startDate: tempStartDate,
            endDate: tempEndDate,
            to: this.searchForm.get('to').value ? this.searchForm.get('to').value : "",
            fetch: this.rowPerPage,
            offset: (this.currentPage - 1) * this.rowPerPage
        };
        this.isLoading = true;
        this._mailService.getList(query).subscribe(rs => {
            this.totalCount = rs['data'].totalCount;
            this.mailHistories = rs['data'].items;
            this.mailHistories.forEach(item => {
                this.mailStatus.forEach(status => {
                    if (item.status == status['Value']) {
                        item['statusName'] = status['Name'];
                    }
                });
            });
            this.isLoading = false;
        });
    }

    onPagination(event) {
        this.currentPage = event.page + 1;
        this.rowPerPage = event.rows;
        this.onSearch();
    }

    generateMenu = (mailHistory: MailHistoryDto) => {
        this.menuItems = [
            // {
            //     label: 'Xem nội dung',
            //     disabled: !this.isViewDetail,
            //     icon: 'pi pi-eye',
            //     command: () => {
            //         this.mailHistorySelected = mailHistory;
            //         this.isShowDetailDialog = true;
            //     }
            // },
            // {
            //     label: 'Gửi lại',
            //     disabled: mailHistory?.status !== 0,
            //     icon: 'pi pi-refresh',
            //     command: () => {
            //         myApp.ui.setBusy();
            //         this._mailService.resend(mailHistory.id).subscribe(() => {
            //             this.onSearch();
            //             myApp.ui.clearBusy();
            //             this._messageService.add({ severity: 'success', detail: 'Lưu thành công' });
            //         })
            //     },
            // },
            {
                label: 'Xóa',
                disabled: !this.isDelete,
                icon: 'pi pi-times',
                command: async () => {
                    const isConfirm = await this._messageConfirmService.showPopupConfirm('Xác nhận xóa');
                    if (isConfirm) {
                        this.isLoading = true;
                        this._mailService.delete(mailHistory.id)
                            .pipe(
                                finalize(async () => {
                                    this.currentPage = 1;
                                    this.onSearch();
                                    this.isLoading = false;
                                })
                            )
                            .subscribe(() => {
                                this._messageService.add({ severity: 'success', detail: 'Lưu thành công' });
                            });
                    }
                },
            }
        ];
    }

    async checkPermission() {
        // this.isViewDetail = await this._session.checkPermission("DXRTM.SYSTEM.MAIL-HISTORY", "VIEW", "DXRTM");
        // this.isResend = await this._session.checkPermission("DXRTM.SYSTEM.MAIL-HISTORY", "UPDATE", "DXRTM");
        this.isDelete = await this._session.checkPermission("DXRTM.SYSTEM.MAIL-HISTORY", "DELETE", "DXRTM");

        myApp.ui.clearBusy();
    }
}
