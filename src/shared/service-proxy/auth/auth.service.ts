import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSessionService } from '@shared/session/app-session.service';
import { environment as env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(
        private _http: HttpClient,
        private _session: AppSessionService
    ) { }

    logout(){
        let url = `${env.remoteServiceBaseUrl}/api/Auth/Logout?token=${this._session.ftmsToken}`;
        return this._http.get(url);
    }
}
