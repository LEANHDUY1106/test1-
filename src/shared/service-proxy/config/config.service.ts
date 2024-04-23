import { GetListConfigInput, GetListConfigDto, UpdateConfigInput, RemoveCacheInput } from './models/ConfigDto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(
    private _http: HttpClient
  ) {

  }

  getListConfig(query: GetListConfigInput) {
    let url = `${env.remoteServiceBaseUrl}/api/Config`;
    return this._http.post<GetListConfigDto>(url, query);
  }

  updateConfig(input: UpdateConfigInput) {
    let url = `${env.remoteServiceBaseUrl}/api/Config`;
    return this._http.put(url, input);
  }

  clearCache(removeCacheInput: RemoveCacheInput) {
    let url = `${env.remoteServiceBaseUrl}/api/Config`;
    return this._http.delete(url, { body: removeCacheInput });
  }
}
