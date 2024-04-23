import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment as env } from 'src/environments/environment';
import { RemoveCacheInput, SettingDto, SettingUpdateDto } from "./models/settingModel";

@Injectable({
    providedIn: 'root'
  })
  export class SettingService {
    constructor(
        private _http: HttpClient
      ) { }

      getSettings(key: string){
        const url = `${env.remoteServiceBaseUrl}/api/Settings/GetSettingByName?settingName=${key}`;
        return this._http.get<SettingDto>(url);
      }
      getlistettings(){
        const url = `${env.remoteServiceBaseUrl}/api/Settings/GetSettings`;
        return this._http.get<SettingDto[]>(url);
      }
      update(body: SettingUpdateDto){
        const url = `${env.remoteServiceBaseUrl}/api/Settings/Update`;
        return this._http.post<boolean>(url, body);
      }
      clearCache(removeCacheInput: RemoveCacheInput) {
        let url = `${env.remoteServiceBaseUrl}/api/Config`;
        return this._http.delete(url, { body: removeCacheInput });
      }
    }