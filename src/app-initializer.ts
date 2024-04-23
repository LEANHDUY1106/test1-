import { Injectable, Injector } from '@angular/core';
import { AppSessionService } from './shared/session/app-session.service';
import { environment as env } from './environments/environment';


@Injectable({
    providedIn: 'root',
})

export class AppInitializer {
    constructor(
        private _injector: Injector
    ) {

    }

    init(): () => Promise<boolean> {
        return () => {
            return new Promise<boolean>((resolve, reject) => {
                const urlSearchParams = new URLSearchParams(window.location.search);
                const params = eval(`Object.fromEntries(eval('urlSearchParams.entries()'))`);
                let token = params[env.loginType] || null;
                let host = encodeURIComponent(myApp.utils.getHost(env.loginType));
                if (!token) {
                    window.location.href = `${env.loginUrl}${env.loginType == 'ticket' ? '/login?service' : '?urlreturn'}=${host}`;
                }
                const appSessionService = this._injector.get(AppSessionService);
                appSessionService.init(token).then(rs => {
                    resolve(rs);
                }).catch(reason => {
                    reject(false);
                })
            });
        }
    }
}
