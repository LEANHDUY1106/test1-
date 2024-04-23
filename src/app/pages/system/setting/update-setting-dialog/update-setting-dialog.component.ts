
import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { finalize } from 'rxjs/operators';
import { ConfigService } from '@shared/service-proxy/config/config.service';
import { MessageService } from 'primeng/api';
import { PMDialogComponentBase } from '@shared/ui/pm-dialog/pm-dialog-component-base';
import { MessageConfirmService } from '@shared/services/message-confirm.service';
import { PMDialogEvent } from '@shared/ui/pm-dialog/pm-dialog-model';
import { SettingUpdateDto } from '@shared/service-proxy/setting-service/models/settingModel';
import { SettingService } from '@shared/service-proxy/setting-service/setting.service';

@Component({
  selector: 'app-update-config-dialog',
  templateUrl: './update-setting-dialog.component.html',
  providers: [{ provide: PMDialogComponentBase, useExisting: UpdateSettingDialogComponent }]
})
export class UpdateSettingDialogComponent extends PMDialogComponentBase implements OnInit, OnChanges {
  //Input
  @Input() configInput: any = {};
  @Output('finished') finishedToEmit = new EventEmitter<boolean>();

  //Dialog
  isSubmitted: boolean = false;
  updateConfigDialog: FormGroup;

  constructor(
    private _formBuilder: FormBuilder
    , private _messageConfirmService: MessageConfirmService
    , private _configService: ConfigService
    , private _settingService: SettingService
    , private _messageService: MessageService
  ) {
    super();
    this.updateConfigDialog = this._formBuilder.group({
      name: [null, [Validators.required]],
      value: [null, [Validators.required]]
    })
  }


  get getUpdateConfig() {
    return this.updateConfigDialog.controls;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.configInput) {
      if (!this.configInput) {
        return;
      }
      else {
        this.updateConfigDialog.patchValue({
          name: this.configInput?.name,
          value: this.configInput?.value
        })
      }

    }
  }

  ngOnInit() {
  }

  async save(): Promise<PMDialogEvent> {
    this.isSubmitted = true;
    let isUpdateSuccess = await this.onUpdate();
    if(isUpdateSuccess){
        this.finishedToEmit.emit(true);
    }
    return new Promise((resolve) => resolve({ isClose: isUpdateSuccess }));
  }

  onUpdate(): Promise<boolean> {
    return new Promise(resolve => {
      if (this.updateConfigDialog.invalid) {
        resolve(false);
        return;
      }
      this.setLoading(true);

      let updateConfigBody: SettingUpdateDto = {
        name: this.updateConfigDialog.get("name").value,
        value: this.updateConfigDialog.get("value").value
      }

      this._settingService.update(updateConfigBody)
        .pipe(
          finalize(() => this.setLoading(false))
        )
        .subscribe(
          (res) => {
            if(res){
              this._messageService.add({ severity: 'success', detail: 'Cập nhật thành công!' });
            };
            resolve(true);
          }
        );

    })
  }

  cancel(): Promise<boolean> {
    return new Promise<boolean>(async rs => {
      this.isSubmitted = false;
      if (await this._messageConfirmService.showPopupConfirm('Xác nhận hủy')) {
        rs(true);
      }
    });
  }
}
