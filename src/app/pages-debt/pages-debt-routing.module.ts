import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { ListDebtComponent } from './list-debt/list-debt.component';
import { DetailDebtComponent } from './detail-debt/detail-debt.component';
import { ListDebtAssignComponent } from './list-debt-assign/list-debt-assign.component';
import { ListLogDebtComponent } from './list-log-debt/list-log-debt.component';
import { ConfirmGuard } from '@shared/guard/confirm.guard';
const routes: Routes = [
    {
        path: '',
        component: ListDebtComponent,
        data: {
            title: 'Danh sách công nợ'
          },
        canActivate: [AuthGuard],
        // data: {
        //     functionCode: 'MES.DEFAULT',
        //     permission: 'VIEW',
        //     appCode: 'FTIMES'
        // }
    },
    {
        path: 'list-assign',
        component: ListDebtAssignComponent,
        data: {
            title: 'Danh sách được phân công'
          },
        canActivate: [AuthGuard],
        // data: {
        //     functionCode: 'MES.DEFAULT',
        //     permission: 'VIEW',
        //     appCode: 'FTIMES'
        // }
    },
    {
        path: 'edit/:id',
        component: DetailDebtComponent,
        data: {
            title: 'Chi tiết công nợ'
          },
        canActivate: [AuthGuard],
        canDeactivate: [ConfirmGuard],
        // data: {
        //     functionCode: 'MES.DEFAULT',
        //     permission: 'VIEW',
        //     appCode: 'FTIMES'
        // }DetailDebtComponent
    },
    {
        path: 'list-log-debt',
        component: ListLogDebtComponent,
        data: {
            title: 'Tình trạng hóa đơn'
          },
        canActivate: [AuthGuard],
        // data: {
        //     functionCode: 'MES.DEFAULT',
        //     permission: 'VIEW',
        //     appCode: 'FTIMES'
        // }DetailDebtComponent
    }
    // {
    //     path: 'manage-request', 
    //     loadChildren: () => import('./request-manage/request-manage.module').then(m => m.RequestManageModule)
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesDebtRoutingModule { }
