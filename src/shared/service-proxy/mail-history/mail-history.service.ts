import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment as env } from 'src/environments/environment';
import { ResponsePaginationResult } from "../core/BaseResponseDto";
import { MailHistoryDetailDto, MailHistoryDto, MailHistorySearch } from "./models/MailHistory";

@Injectable({
    providedIn: 'root'
  })
  export class MailHistoryService {
    constructor(
        private _http: HttpClient
      ) { }

      getById(id: number){
        const url = `${env.remoteServiceBaseUrl}/api/MailHistory/${id}`;
        return this._http.get<MailHistoryDetailDto>(url);
      }
      delete(id: number){
        const url = `${env.remoteServiceBaseUrl}/api/MailHistory/${id}`;
        return this._http.delete<boolean>(url);
      }
      getList(request: MailHistorySearch){
        const url = `${env.remoteServiceBaseUrl}/api/MailHistory/GetAll`;
        return this._http.post<ResponsePaginationResult<MailHistoryDto>>(url, request);
      }
      resend(id: number){
        const url = `${env.remoteServiceBaseUrl}/api/MailHistory/resend/${id}`;
        return this._http.get(url);
    }
}