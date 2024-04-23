import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppInitializer } from 'src/app-initializer';
import { SharedModule } from 'src/shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LayoutsModule } from './layouts/layouts.module';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PageAccessDeniedComponent } from './page-access-denied/page-access-denied.component';
import { ServiceProxyModule } from '@shared/service-proxy/service-proxy.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TreeTableModule } from 'primeng/treetable';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { AppBreadcrumbModule } from './layouts/shared/breadcrumb';
import { HealthChecksComponent } from './health-check/health-check.component';

registerLocaleData(localeVi);
@NgModule({
    declarations: [
        AppComponent,
        PageNotFoundComponent,
        PageAccessDeniedComponent,
        HealthChecksComponent
    ],
    imports: [
        BrowserAnimationsModule
        , BrowserModule
        , HttpClientModule
        , AppRoutingModule
        , SharedModule.forRoot()
        , LayoutsModule
        , NgbModule
        , TreeTableModule
        , ServiceProxyModule
        , ToastModule
        , ConfirmDialogModule
        , ButtonModule
        , AppBreadcrumbModule.forRoot()
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (appInitializer: AppInitializer) => appInitializer.init(),
            deps: [AppInitializer],
            multi: true,
        },
        { provide: LOCALE_ID, useValue: 'vi-VN' }
        , MessageService,
        ConfirmationService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
