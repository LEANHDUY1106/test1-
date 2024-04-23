import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { UiModule } from '@shared/ui/ui.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ChipModule } from 'primeng/chip';
import { PagesRoutingModule } from '../pages-routing.module';
import { SystemRoutingModule } from './system-routing.module';
import { UpdateSettingDialogComponent } from './setting/update-setting-dialog/update-setting-dialog.component';
import { ConfigComponent } from './setting/setting.component';
import { PreviewDialogComponent } from './mail-history/preview-dialog/preview-dialog.component';
import { MailHistoryComponent } from './mail-history/mail-history.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from 'primeng/calendar';
@NgModule({
  declarations: [
    UpdateSettingDialogComponent
    , ConfigComponent
    , PreviewDialogComponent
    , MailHistoryComponent
  ],
  imports: [
    CommonModule
    , SharedModule
    , SystemRoutingModule
    , ReactiveFormsModule
    , DialogModule
    , ConfirmDialogModule
    , UiModule
    , NgSelectModule
    , ScrollPanelModule
    , DividerModule
    , TableModule
    , FieldsetModule
    , MenuModule
    , NgbModule
    , ChipModule
    , CalendarModule
  ]
})
export class SystemModule { }
