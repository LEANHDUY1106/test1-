import { SharedModule } from './../../../shared/shared.module';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RequestManageRoutingModule } from './request-manage-routing.module';
import { ManageRequestComponent } from './manage-request/manage-request.component';
import { CreateRequestComponent } from './create-request-manage/create-request.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { UiModule } from '@shared/ui/ui.module';
import { EditRequestComponent } from './edit-request-manage/edit-request.component';
import { FileService } from '@shared/service-proxy/file/file.service';
import { MyManageRequestComponent } from './my-manage-request/my-manage-request.component';
import { MyAssignManageRequestComponent } from './my-assign-manage-request/my-assign-manage-request.component';
import { ReasionDialogComponent } from './create-request-manage/reasion-dialog/reasion-dialog.component';
import { TableModule } from 'primeng/table';
import { CreateRequestSupportComponent } from './create-request-support/create-request-support.component';
import { ManualDialogComponent } from './create-request-manage/manual-dialog/manual-dialog.component';
import { MyFollowRequestComponent } from './my-follow-request/my-follow-request.component';
@NgModule({
  declarations: [
    ReasionDialogComponent,
    ManageRequestComponent,
    CreateRequestComponent,
    EditRequestComponent,
    MyManageRequestComponent,
    MyAssignManageRequestComponent,
    CreateRequestSupportComponent,
    ManualDialogComponent,
    MyFollowRequestComponent
  ],
  imports: [
    CommonModule
    , RequestManageRoutingModule
    , ReactiveFormsModule
    , NgbDropdownModule
    , NgbModule
    , UiModule
    , TableModule
    , SharedModule
    , NgSelectModule
    , FormsModule
    , CKEditorModule
    , CalendarModule
  ],
  exports: [
    NgSelectComponent,
    CreateRequestComponent,
    EditRequestComponent,
    MyManageRequestComponent,
    MyAssignManageRequestComponent
  ],
  bootstrap: [EditRequestComponent],
  providers: [
    FileService
  ]
})
export class RequestManageModule { }
