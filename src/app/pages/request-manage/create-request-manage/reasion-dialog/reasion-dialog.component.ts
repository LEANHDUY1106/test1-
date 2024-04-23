
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PMDialogComponentBase } from '@shared/ui/pm-dialog/pm-dialog-component-base';
import { MessageConfirmService } from '@shared/services/message-confirm.service';
import { PMDialogEvent } from '@shared/ui/pm-dialog/pm-dialog-model';

@Component({
    selector: 'app-reasion-dialog',
    templateUrl: './reasion-dialog.component.html',
    providers: [{ provide: PMDialogComponentBase, useExisting: ReasionDialogComponent }]
})
export class ReasionDialogComponent extends PMDialogComponentBase implements OnInit, OnChanges {
    //Input
    @Output('finished') finishedToEmit = new EventEmitter<boolean>();
    @Input() reason: string;

    //Dialog
    isSubmitted: boolean = false;
    reasionConfigDialog: FormGroup;
    isDirty: boolean = false;

    constructor(
        private _formBuilder: FormBuilder
        , private _messageConfirmService: MessageConfirmService
    ) {
        super();
        this.reasionConfigDialog = this._formBuilder.group({
            value: [null, [Validators.required]]
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        this.reasionConfigDialog.get('value').setValue(this.reason);
    }


    get getReasion() {
        return this.reasionConfigDialog.controls;
    }

    ngOnInit() {
    }
    async save(): Promise<PMDialogEvent> {
        this.isSubmitted = true;
        if (this.reasionConfigDialog.invalid) {
            return;
        }
        this.finishedToEmit.emit(this.reasionConfigDialog.get('value').value);
        //clear value khi gửi xong
        this.reasionConfigDialog.get('value').setValue('');
        this.isSubmitted = false;
        this.isDirty = false;
        return new Promise((resolve) => resolve({ isClose: true }));
    }

    cancel(): Promise<boolean> {
        return new Promise<boolean>(async rs => {
            this.isSubmitted = false;
            // if (await this._messageConfirmService.showPopupConfirm('Xác nhận hủy')) {

            // }
            //clear value khi gửi xong
            this.reasionConfigDialog.get('value').setValue('');
            this.finishedToEmit.emit(this.reasionConfigDialog.get('value').value);
            rs(true);
        });
    }
}
