import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppSessionService } from '../session/app-session.service';
import { environment } from '../../environments/environment'
import UserFunction from '../models/UserFunction';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

    /**
     *
     */
    constructor(
        private _session: AppSessionService,
        private _router: Router,
    ) {
    }

    // Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        if (!this._session.user) {
            let host = myApp.utils.getHost(environment.loginType);
            window.location.href = `${environment.loginUrl}${environment.loginType == 'ticket' ? '/login?service' : '?urlreturn'}=${host}`;
            return false;
        }
        if (!route.data || !route.data['functionCode'])
            return true;
        const { functionCode, permission, appCode } = route.data;
        const allow = await this.checkPermission(functionCode, permission, appCode);
        if (allow)
            return true;
        this._router.navigate([this.selectBestRoute()]);
        return false;
    }

    selectBestRoute(): string {
        myApp.ui.clearBusy();
        if (!this._session.user) {
            let host = myApp.utils.getHost(environment.loginType);
            window.location.href =
                `${environment.loginUrl}${environment.loginType == 'ticket' ? '/login?service' : '?urlreturn'}=${host}`;
            return '/account/login';
        }
        return '/403';
    }

    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return true;
    }

    private async checkPermission(functionCode: string, permission: string, appCode: string = 'DXRTM'): Promise<boolean> {
        return await this._session.checkPermission(functionCode, permission, appCode);
        let allow = false;
        let checkFunc = (funcs: UserFunction[]) => {
            for (const func of funcs) {
                if (Array.isArray(func)) {
                    checkFunc(func);
                    continue;
                } else if (func.code.toLocaleLowerCase() == permission.toLocaleLowerCase()) {
                    allow = true;
                    break;
                }
            }
        };
        //checkFunc(this._session.funcs);
        return allow;
    }

}
