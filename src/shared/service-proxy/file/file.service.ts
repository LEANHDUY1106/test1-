import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment as env } from 'src/environments/environment';
import { FileDeleteDto, FileInfoDto } from "./models/FileInfoDto";
import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { Observable } from "rxjs";
import { throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { FileResponse } from "../core/FileResponse";
// import {RequestOptions} from '@angular/http';

@Injectable()
export class FileService {
    constructor(
        private _http: HttpClient

    ) { }

    downloadFileFromFtms(fileId: string) {
        let url_ = `${env.remoteServiceBaseUrl}/api/File/DownloadFileFromFtms?fileId=${fileId}`;
        let options_: any = {
            observe: "response",
            responseType: "blob",
            headers: new HttpHeaders({
                "Accept": "text/plain"
            })
        };
        return this._http.request("get", url_, options_).pipe(_observableMergeMap((response_: any) => {
            return this.processDownloadFileFromFtms(response_);
        })).pipe(_observableCatch((response_: any) => {
            if (response_ instanceof HttpResponseBase) {
                try {
                    return this.processDownloadFileFromFtms(<any>response_);
                } catch (e) {
                    return <Observable<FileResponse>><any>_observableThrow(e);
                }
            } else
                return <Observable<FileResponse>><any>_observableThrow(response_);
        }));
    }

    protected processDownloadFileFromFtms(response: HttpResponseBase): Observable<FileResponse> {
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


    async uploadFile(files: File[]) {
        let url_ = `${env.remoteServiceBaseUrl}/api/File/UploadMutiple`;
        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        return await this._http.post<FileInfoDto[]>(url_, formData).toPromise();
    }

    DeleteFile(file: FileDeleteDto) {
        let url_ = `${env.remoteServiceBaseUrl}/api/File/Delete`;
        return this._http.post<FileInfoDto[]>(url_, file);
    }

}