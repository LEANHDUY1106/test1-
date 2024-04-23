import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/shared/auth/auth.guard';
import { MailHistoryComponent } from './mail-history/mail-history.component';
import { ConfigComponent } from './setting/setting.component';
const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Hệ thống'
        },
        children: [
            {
                path: '',
                canActivate: [AuthGuard],
                component: ConfigComponent,
                data: {
                    title: 'Cấu hình',
                    functionCode: 'DXRTM.SYSTEM.CONFIG',
                    permission: 'VIEW',
                    appCode: 'DXRTM'
                },
            },
            {
                path: 'mail-history',
                canActivate: [AuthGuard],
                component: MailHistoryComponent,
                data: {
                    title: 'Lịch sử mail',
                    functionCode: 'DXRTM.SYSTEM.MAIL-HISTORY',
                    permission: 'VIEW',
                    appCode: 'DXRTM'
                },
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SystemRoutingModule { }
