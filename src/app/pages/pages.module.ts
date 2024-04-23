import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PagesRoutingModule } from './pages-routing.module';
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { PageComponent } from './pages.component';
@NgModule({
  declarations: [
    DashboardComponent,
    PageComponent
  ],
  imports: [
    CommonModule
    , SharedModule
    , PagesRoutingModule
    , ReactiveFormsModule
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
  ],
})
export class PagesModule { }
