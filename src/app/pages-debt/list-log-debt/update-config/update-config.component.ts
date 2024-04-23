import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
    Output,
    EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { finalize } from 'rxjs/operators';
import { ConfigService } from '@shared/service-proxy/config/config.service';
import { MessageService } from 'primeng/api';
import { PMDialogComponentBase } from '@shared/ui/pm-dialog/pm-dialog-component-base';
import { MessageConfirmService } from '@shared/services/message-confirm.service';
import { PMDialogEvent } from '@shared/ui/pm-dialog/pm-dialog-model';
import { SettingUpdateDto } from '@shared/service-proxy/setting-service/models/settingModel';
import { SettingService } from '@shared/service-proxy/setting-service/setting.service';
import {
    InseartUpdateDebtLog,
    debtLogResponse,
} from '@shared/service-proxy/invoice-debt/models/DebtLog.model';
import { InvoiceDebtService } from '@shared/service-proxy/invoice-debt/invoicedebt.service';

@Component({
    selector: 'app-update-log-dialog',
    templateUrl: './update-config.component.html',
    styleUrls: ['./update-config.component.scss'],
})
export class UpdateLogDialogComponent implements OnInit, OnChanges {
    //Input
    @Input() logDetail: debtLogResponse;
    @Output('finished') finishedToEmit = new EventEmitter<boolean>();
    isLoading: boolean = false;
    //Dialog
    isSubmitted: boolean = false;
    updateLogDialog: FormGroup;
    inseartUpdate: InseartUpdateDebtLog = {
        invoicedebtlogid: 0,
        invoicenumber: '',
        content: '',
        interacttype: 0,
        creatAt: null,
    };

    constructor(
        private _formBuilder: FormBuilder,
        private _messageConfirmService: MessageConfirmService,
        private _configService: ConfigService,
        private _settingService: SettingService,
        private _messageService: MessageService,
        private _invoiceDebtService: InvoiceDebtService
    ) {
        this.updateLogDialog = this._formBuilder.group({
            interacttype: [0, []],
            createDate: [null, [Validators.required]],
            content: ['', [Validators.required, Validators.maxLength(4000)]],
        });
    }

    get getUpdateLog() {
        return this.updateLogDialog.controls;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.logDetail) {
            if (!this.logDetail) {
                return;
            } else {
                this.updateLogDialog.patchValue({
                    interacttype: this.logDetail?.interacttype,
                    createDate: new Date(this.logDetail?.crateat),
                    content: this.logDetail?.content,
                });
            }
        }
    }

    ngOnInit() {}

    save() {
        this.isSubmitted = true;
        if (this.updateLogDialog.invalid) {
            return;
        }
        this.isLoading = true;
        this.inseartUpdate.invoicedebtlogid = this.logDetail.invoicelogid;
        this.inseartUpdate.creatAt = new Date( new Date(this.updateLogDialog.get('createDate').value).setHours(7));
        this.inseartUpdate.interacttype = this.updateLogDialog.get('interacttype').value;
        this.inseartUpdate.content = this.updateLogDialog.get('content').value;
        this.inseartUpdate.invoicenumber = this.logDetail.invoicenumber;
        this._invoiceDebtService.InsertUpdateDebtLog(this.inseartUpdate).subscribe(res => {
            this._messageService.add({
                severity: 'success',
                detail: 'Import file thành công!',
            });
            this.finishedToEmit.emit(true);
            this.isLoading = false;
        }, err => this.isLoading = false);
    }

    listInteractValue: Value[] = [
        {
            id: 0,
            name: 'Chọn hình thức',
        },
        {
            id: 1,
            name: 'Gọi điện',
        },
        {
            id: 2,
            name: 'Gửi mail',
        },
        {
            id: 3,
            name: 'Đi gặp khách hàng',
        },
        {
            id: 4,
            name: 'Gửi công văn',
        },
        {
            id: 5,
            name: 'Gửi tin nhắn nhắc cước',
        },
    ];

    cancel() {
        this.finishedToEmit.emit(false);
    }
}
export interface Value {
    id: number;
    name: string;
}
