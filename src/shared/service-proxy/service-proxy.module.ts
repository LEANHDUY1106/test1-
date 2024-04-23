import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PMHttpInterceptor } from './pm_http-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';



@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: PMHttpInterceptor,
            multi: true
        },
    ]
})
export class ServiceProxyModule { }
