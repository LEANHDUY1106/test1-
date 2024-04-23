import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout/layout.component';
import { PageAccessDeniedComponent } from './page-access-denied/page-access-denied.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HealthChecksComponent } from './health-check/health-check.component'

const routes: Routes = [
    {
        path: '', data: {
            title: 'Trang chủ',
            code: "FTIDX-RTM"
        }, component: LayoutComponent, loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
    },
    { path: 'health', component: HealthChecksComponent },
    { path: '403', component: PageAccessDeniedComponent },
    { path: '404', component: PageNotFoundComponent },
    { path: '**', redirectTo: '404' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
