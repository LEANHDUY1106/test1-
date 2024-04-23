import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageComponent } from './pages.component';
const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        data: {
            title: 'Dashboard'
        },
        // canActivate: [AuthGuard],
        // data: {
        //     functionCode: 'MES.DEFAULT',
        //     permission: 'VIEW',
        //     appCode: 'FTIMES'
        // }
    },
    {
        path: 'manage-request',
        loadChildren: () => import('./request-manage/request-manage.module').then(m => m.RequestManageModule)
    },
    {
        path: 'system',
        loadChildren: () => import('./system/system.module').then(m => m.SystemModule)
    },
    {
        path: 'manage-debt', data: {
            title: 'Quản lý công nợ'
        }, loadChildren: () => import('../pages-debt/pages-debt.module').then(m => m.PagesDebtModule)
    },
    // {
    //     path: 'table',
    //     loadChildren: () => import('./table/table.module').then(m => m.TableModule)

    // },
    // {
    //     path: 'file', loadChildren: () => import('./file/file.module').then(m => m.FileModule)
    // }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PagesRoutingModule { }
