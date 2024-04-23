import { environment as env } from 'src/environments/environment';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DashBoardProcessingTaskByUserRequestData, getDashboardStatusInput, getDashboardTypeInput } from './models/dashBoardProcessingTaskByUserDto';
import { ApiResult } from '@shared/models/CheckRole';
import { ResultPostStatus, ResultPostTaskByUser, ResultPostType } from './models/resultPostType';


@Injectable({
    providedIn: 'root'
  })
  export class DashboardService {
    constructor(
        private _http: HttpClient
      ) { }

      getCount(){
        const url = `${env.remoteServiceBaseUrl}/api/Post/DashBoad_GetCount`;
        return this._http.post<number>(url,null);
      }

      processingTaskByUser(request: DashBoardProcessingTaskByUserRequestData){
        const url = `${env.remoteServiceBaseUrl}/api/Post/DashBoard_ProcessingTaskByUser`;
        return this._http.post<ApiResult<ResultPostTaskByUser>>(url, request);
      }

      postType(request: getDashboardTypeInput){
        const url = `${env.remoteServiceBaseUrl}/api/Post/DashBoard_ByPostType`;
        return this._http.post<ApiResult<ResultPostType>>(url, request);
      }

      postStatus(request: getDashboardStatusInput){
        const url = `${env.remoteServiceBaseUrl}/api/Post/DashBoard_ByPostStatus`;
        return this._http.post<ApiResult<ResultPostStatus>>(url, request);
      }
  }