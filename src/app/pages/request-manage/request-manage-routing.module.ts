import { ConfirmGuard } from './../../../shared/guard/confirm.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { CreateRequestComponent } from './create-request-manage/create-request.component';
import { EditRequestComponent } from './edit-request-manage/edit-request.component';
import { ManageRequestComponent } from './manage-request/manage-request.component';
import { MyAssignManageRequestComponent } from './my-assign-manage-request/my-assign-manage-request.component';
import { MyManageRequestComponent } from './my-manage-request/my-manage-request.component';
import { CreateRequestSupportComponent } from './create-request-support/create-request-support.component';
import { MyFollowRequestComponent } from './my-follow-request/my-follow-request.component';
const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: ManageRequestComponent,
        data: {
            title: 'Danh sách yêu cầu'
        }
    },
    {
        path: 'create',
        canActivate: [AuthGuard],
        component: CreateRequestComponent,
        canDeactivate: [ConfirmGuard],
        data: {
            title: 'Tạo yêu cầu số hóa'
        },
    },
    {
        path: 'create-support',
        canActivate: [AuthGuard],
        component: CreateRequestSupportComponent,
        canDeactivate: [ConfirmGuard],
        data: {
            title: 'Tạo yêu cầu hỗ trợ'
        },
    },
    {
        path: 'edit/:id',
        canActivate: [AuthGuard],
        component: EditRequestComponent,
        canDeactivate: [ConfirmGuard],
        data: {
            title: 'Cập nhật yêu cầu'
        },
    },
    {
        path: 'my-created',
        canActivate: [AuthGuard],
        component: MyManageRequestComponent,
        data: {
            title: 'Yêu cầu đã tạo'
        }
    },
    {
        path: 'my-assign',
        canActivate: [AuthGuard],
        component: MyAssignManageRequestComponent,
        data: {
            title: 'Yêu cầu phân công'
        }
    },
    {
        path: 'my-follow',
        canActivate: [AuthGuard],
        component: MyFollowRequestComponent,
        data: {
            title: 'Yêu cầu theo dõi'
        }
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RequestManageRoutingModule { }
