
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MessageConfirmService } from '@shared/services/message-confirm.service';
import { AppSessionService } from '@shared/session/app-session.service';
import { MenuItem, MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { PMDialogEvent } from '@shared/ui/pm-dialog/pm-dialog-model';
import { GetListConfigOutput } from '@shared/service-proxy/config/models/ConfigDto';
import { SettingService } from '@shared/service-proxy/setting-service/setting.service';
import { DataStateLeftMenuService } from '@shared/services/changeLeftMenu.service';

@Component({
  selector: 'app-config',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class ConfigComponent implements OnInit {

  // breadCrumbItems = [
  //   { label: 'DX-RTM', path: '/' }
  //   , { label: 'Cấu hình', active: true}
  // ];

  searchForm: FormGroup;

  //List track progress
  listConfig: any[] = [];
  isLoading: boolean = false;

  /**Menu các thao tác file */
  menuItems: MenuItem[] = [];

  //Dialog
  isShowUpdateConfigDialog = false;
  dialogUpdateConfig: Subject<PMDialogEvent> = new Subject<PMDialogEvent>();
  configDtoSelected: any;

  //Permission
  isUpdate: boolean = false;
  isRemoveCache: boolean = false;
  isStateLeftMenu: boolean;

  constructor(
    private _formBuilder: FormBuilder
    , private _titleService: Title
    , private _messageConfirmService: MessageConfirmService
    , private _messageService: MessageService
    , private _settingService: SettingService
    , public _session: AppSessionService
    , private _dataService: DataStateLeftMenuService
  ) {
    // this.searchForm = this._formBuilder.group({
    //   keyword: [null]
    // });
  }

  get getListConfig() {
    return this.searchForm.controls;
  }

  async ngOnInit(): Promise<void> {
    this._titleService.setTitle('Cấu hình');
    //lấy trạng tháistate
    this._dataService.currentState.subscribe(state => {
      this.isStateLeftMenu = state;
    });
    await this.checkPermission();

    this.getList();
  }


  getList() {
    this.isLoading = true;
    this.listConfig = [];
    this._settingService.getlistettings()
      .pipe(
        finalize(async () => {
          this.isLoading = false;
        })
      )
      .subscribe(async (res) => {
        this.listConfig = res;

      });

  }

  generateMenu = (config: GetListConfigOutput) => {
    this.menuItems = [
      {
        label: 'Cập nhật',
        disabled: !this.isUpdate,
        icon: 'pi pi-pencil',
        command: () => {
          this.isShowUpdateConfigDialog = true;
          this.configDtoSelected = config;
        }
      }
      , {
        label: 'Xóa cache',
        disabled: !this.isRemoveCache,
        icon: 'pi pi-trash',
        command: () => {
          let clearCacheInput = {
            cacheName: "RTM:Setting@" + config.name,
            absolute: true
          };
          this._settingService.clearCache(clearCacheInput).subscribe(() => {
            this._messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Thao tác thành công' })
          })
        }
      }
    ];
  }

  /**Phương thức refesh khi thực hiện xong action */
  finishedToRefesh($event) {
    if ($event) {
      this.getList();
    }
  }

  async checkPermission() {
    this.isUpdate = await this._session.checkPermission("DXRTM.SYSTEM.CONFIG", "UPDATE", "DXRTM");
    this.isRemoveCache = await this._session.checkPermission("DXRTM.SYSTEM.CONFIG", "DELETE", "DXRTM");
    myApp.ui.clearBusy();
  }
}
