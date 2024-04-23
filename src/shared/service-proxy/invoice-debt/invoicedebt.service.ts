
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { environment as env } from '../../../environments/environment'
import { Injectable } from '@angular/core';
import { RequestInvoiceDebt, RequestInvoiceDebtExprot, ResponseInvoiceDebt } from './models/requestInvoiceDebt.model';
import { ResponsePaginationResult } from '../core/BaseResponseDto';
import { UpdateStatusDebt, requestDetailDebt, requestDetailDebtUpdate, responseDetailDebt } from './models/request-response-detailDebt';
import { ImportFileLog, InseartUpdateDebtLog, RequestDebtLog, debtLogResponse, deleteLog } from './models/DebtLog.model';
import { Observable } from 'rxjs';
import { FileResponse } from '../core/FileResponse';
import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { throwError as _observableThrow, of as _observableOf } from 'rxjs';

@Injectable({ providedIn: 'root' })

export class InvoiceDebtService {

    constructor(private _http: HttpClient) { }

    importFile(file: File) {
        let formData = new FormData();
        formData.append("file", file);
        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/Import`;
        return this._http.post<number>(url_, formData);
    }

    exprortExcel(request: RequestInvoiceDebtExprot) {
        const url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/InvoiceDebt_Export`;
        let options_: any = {
            body: request,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };
        return this._http.request("post", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownloadFilePost(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownloadFilePost(<any>response_);
                } catch (e) {
                    return <Observable<FileResponse>><any>_observableThrow(e);
                }
            } else
                return <Observable<FileResponse>><any>_observableThrow(response_);
        }));
    }

    importFileLog(file: File, id: string) {
        let formData = new FormData();
        formData.append("file", file);
        formData.append("invoicenumber", id.toString());

        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/ImportDataLog`;
        return this._http.post<number>(url_, formData);
    }

    importFileLogWithInvoiceNumber(file: File) {
        let formData = new FormData();
        formData.append("file", file);

        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/ImportDataLog_WithInvoiceNumber`;
        return this._http.post<number>(url_, formData);
    }

    getAll(request: RequestInvoiceDebt) {
        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/InvoiceDebt_GetList`;
        return this._http.post<ResponsePaginationResult<ResponseInvoiceDebt>>(url_, request);
    }

    getDetail(request: requestDetailDebt) {
        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/InvoiceDebt_GetDetail`;
        return this._http.post<ResponsePaginationResult<responseDetailDebt>>(url_, request);
    }

    updateStatus(request: UpdateStatusDebt) {
        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/InvoiceDebt_UpdateStatus`;
        return this._http.post<number>(url_, request);
    }

    update(request: requestDetailDebtUpdate) {
        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/InvoiceDebt_Update`;
        return this._http.post<number>(url_, request);
    }

    getListDebtLog(request: RequestDebtLog) {
        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/InvoiceDebtLog_GetList`;
        return this._http.post<ResponsePaginationResult<debtLogResponse>>(url_, request);
    }

    InsertUpdateDebtLog(request: InseartUpdateDebtLog) {
        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/InvoiceDebtLog_InsertUpdate`;
        return this._http.post<number>(url_, request);
    }

    DeleteLog(request: deleteLog) {
        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/InvoiceLogDebt_DeleteByID`;
        return this._http.post<number>(url_, request);
    }

    getPersen() {
        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/GetValue_LoadingCache`;
        return this._http.post<number>(url_, null);
    }

    DownloadTemplate() {
        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/InvoiceDebt_DownloadTemplate_Log`;
        let options_: any = {
            body: null,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };
        return this._http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownloadFilePost(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownloadFilePost(<any>response_);
                } catch (e) {
                    return <Observable<FileResponse>><any>_observableThrow(e);
                }
            } else
                return <Observable<FileResponse>><any>_observableThrow(response_);
        }));
    }

    ImportInvoice_DownloadTemplate() {
        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/ImportInvoice_DownloadTemplate`;
        let options_: any = {
            body: null,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };
        return this._http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownloadFilePost(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownloadFilePost(<any>response_);
                } catch (e) {
                    return <Observable<FileResponse>><any>_observableThrow(e);
                }
            } else
                return <Observable<FileResponse>><any>_observableThrow(response_);
        }));
    }

    DownloadTemplateWidthInvoiceNumber() {
        let url_ = `${env.remoteServiceBaseUrl}/api/InvoiceDebt/InvoiceDebtLog_DownloadTemplate_WithInvoiceNumber`;
        let options_: any = {
            body: null,
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };
        return this._http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownloadFilePost(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownloadFilePost(<any>response_);
                } catch (e) {
                    return <Observable<FileResponse>><any>_observableThrow(e);
                }
            } else
                return <Observable<FileResponse>><any>_observableThrow(response_);
        }));
    }
    protected processDownloadFilePost(response: HttpResponseBase): Observable<FileResponse> {
        const status = response.status;
        let getResponse = () => {
            if (response instanceof HttpResponse)
                return response.body;
            return (<any>response).error instanceof Blob ? (<any>response).error : undefined;
        }
        const responseBlob = getResponse();

        let _headers: any = {}; if (response.headers) { for (let key of response.headers.keys()) { _headers[key] = response.headers.get(key); } }
        if (status === 200 || status === 206) {
            const contentDisposition = response.headers ? response.headers.get("content-disposition") : undefined;
            const fileNameMatch = contentDisposition ? /filename="?([^"]*?)"?(;|$)/g.exec(contentDisposition) : undefined;
            const fileName = fileNameMatch && fileNameMatch.length > 1 ? fileNameMatch[1] : undefined;
            return _observableOf({ fileName: fileName, data: responseBlob, status: status, headers: _headers });
        }
        return _observableOf<FileResponse>(<any>null);
    }

}

