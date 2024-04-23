import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpResponse, HttpResponseBase } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { mergeMap as _observableMergeMap, catchError as _observableCatch } from 'rxjs/operators';
import { throwError as _observableThrow, of as _observableOf } from 'rxjs';
import { ResponsePaginationResult } from "../core/BaseResponseDto";
import { ManageRequestGetByIdDto, ManageRequestInputSearchDto } from "./models/ManageRequestInputSearchDto";
import { ManageReQuestOutputDto } from "./models/ManageRequestOutputDto";
import { DeletePostIdDto, FollowPostIdDto, GetListSuggestionDto, ManageRequestCreatehDto } from './models/ManageRequestCreateDto';
import { ManageRequestUpdatehDto } from './models/ManageRequestUpdateDto';
import { AccountFtmsInfor } from '@shared/models/AccountFtmsInfor';
import { FileResponse } from '../core/FileResponse';


@Injectable({
    providedIn: 'root'
  })
  export class ManageRequestService {
    constructor(
        private _http: HttpClient
      ) { }

      getAll(request: ManageRequestInputSearchDto){
        const url = `${env.remoteServiceBaseUrl}/api/Post/GetPost`;
        return this._http.post<ResponsePaginationResult<ManageReQuestOutputDto>>(url, request);
      }

      create(request: ManageRequestCreatehDto){
        const url = `${env.remoteServiceBaseUrl}/api/Post/CreatePost`;
        return this._http.post<number>(url, request);
      }

      DeleteById(request: DeletePostIdDto){
        const url = `${env.remoteServiceBaseUrl}/api/Post/PostDeletById`;
        return this._http.post<number>(url, request);
      }

      getListSuggestion(request: GetListSuggestionDto){
        const url = `${env.remoteServiceBaseUrl}/api/Post/GetSuggestProjectCode`;
        return this._http.post<string[]>(url, request);
      }

      follow(request: FollowPostIdDto){
        const url = `${env.remoteServiceBaseUrl}/api/Post/PostUpdateFollowUp`;
        return this._http.post<number>(url, request);
      }

      getById(request: ManageRequestGetByIdDto){
        const url = `${env.remoteServiceBaseUrl}/api/Post/GetPostById`;
        return this._http.post<ManageReQuestOutputDto>(url, request);
      }

      update(request: ManageRequestUpdatehDto){
        const url = `${env.remoteServiceBaseUrl}/api/Post/UpdatePost`;
        return this._http.post<number>(url, request);
      }

      getListAssign(name: string, pageNumber: number, pageSize: number){
        const url = `${env.remoteServiceBaseUrl}/api/Post/GetListAssign?email=${name}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
        return this._http.get<AccountFtmsInfor[]>(url);
      }

      exprortExcel(request: ManageRequestInputSearchDto) {
        const url_ = `${env.remoteServiceBaseUrl}/api/Post/ExportPost`;
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