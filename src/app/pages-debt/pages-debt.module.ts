import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { PagesDebtRoutingModule } from './pages-debt-routing.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ListDebtComponent } from './list-debt/list-debt.component';
import { DetailDebtComponent } from './detail-debt/detail-debt.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ListDebtAssignComponent } from './list-debt-assign/list-debt-assign.component';
import { ListLogDebtComponent } from './list-log-debt/list-log-debt.component';
import { UpdateLogDialogComponent } from './list-log-debt/update-config/update-config.component';

@NgModule({
  declarations: [
    ListDebtComponent,
    DetailDebtComponent,
    ListDebtAssignComponent,
    ListLogDebtComponent,
    UpdateLogDialogComponent
  ],
  imports: [
    CommonModule
    , SharedModule
    , PagesDebtRoutingModule
    , ReactiveFormsModule
    , NgbDropdownModule
    , DialogModule
    , NgbModule
    , ConfirmDialogModule
    , UiModule
    , NgSelectModule
    , ScrollPanelModule
    , DividerModule
    , TableModule
    , FieldsetModule
    , MenuModule
    , ChipModule
    , ChartModule
    , CalendarModule
    , FormsModule
    , CKEditorModule
    , InputNumberModule
  ],
})
export class PagesDebtModule { }
