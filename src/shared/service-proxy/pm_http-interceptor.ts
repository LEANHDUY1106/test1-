import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CONSTANT from '@shared/configs/CONSTANT';
import { AppSessionService } from '@shared/session/app-session.service';
import { MessageService } from 'primeng/api';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, mergeMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class PMHttpInterceptor implements HttpInterceptor {


    constructor(
        private _session: AppSessionService
        , private _http: HttpClient,
        private _mes: MessageService
    ) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // if (!environment.production)
        //     console.log('HttpRequest', req);

        return next.handle(this.modifyRequest(req)).pipe(
            map((event: HttpEvent<any>) => {
                // if (!environment.production)
                //     console.log('HttpResponse', event);
                return event;
            }),
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status == 401) {
                        return this._http.get(`${environment.remoteServiceBaseUrl}/api/Auth?token=${this._session.ftmsToken}`).pipe(
                            mergeMap(res => {
                                this._session.token = res['accessToken'];
                                return next.handle(this.modifyRequest(req));
                            }),
                            catchError(e => {
                                myApp.utils.deleteCookie(CONSTANT.DEFAULT_COOKIE_NAME);
                                let host = myApp.utils.getHost(environment.loginType);
                                window.location.href =
                                    `${environment.loginUrl}${environment.loginType == 'ticket' ? '/login?service' : '?urlreturn'}=${host}`;
                                return next.handle(this.modifyRequest(req));
                            })
                        )
                    }

                    if (error.error) {
                        // if (!environment.production)
                        //     console.log(`Http Error status ${error.status}:`, error?.error?.message);
                        this._mes.add({ severity: 'error', summary: 'Lỗi', detail: error?.error?.message });
                        //return next.handle(this.modifyRequest(req));
                    }

                    // if (error.status == 500) {
                    //     console.log("erro 500", error?.error?.message);
                    //     this._mes.add({ severity: 'error', summary: 'Lỗi', detail: error?.error?.message });
                    // }

                    // if (error.status == 0) {
                    //     console.log("erro not response", error?.error?.message);
                    //     this._mes.add({ severity: 'error', summary: 'Lỗi', detail: "Lỗi không xác định" });
                    // }
                    return throwError(error);

                }
            })
        );
    }

    // private modifyRequest(req) {
    //     return req.clone({
    //         setHeaders: { Authorization: `Bearer ${this._session.token}`}
    //     });
    // }
    private modifyRequest(req) {
        //neeus upload fiel thif ko set content-type 
        if(req.url.includes("api/File/UploadMutiple") || req.url.includes("api/InvoiceDebt/Import") || req.url.includes("InvoiceDebt/ImportDataLog")){
            return req.clone({
                setHeaders: { Authorization: `Bearer ${this._session.token}`}
            });
        }else{
            return req.clone({
                setHeaders: { Authorization: `Bearer ${this._session.token}`, 'Content-Type': 'application/json'}
            });
        }
    }
}
