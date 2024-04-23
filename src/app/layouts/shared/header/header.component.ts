import { Component, OnInit, Inject, Output, EventEmitter, HostListener } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { AppSessionService } from 'src/shared/session/app-session.service';
import UserLoginInfoDto from 'src/shared/models/UserLoginInfoDto';
import UserApp from 'src/shared/models/UserApp';
import { AuthService } from '@shared/service-proxy/auth/auth.service';
import { environment as env } from 'src/environments/environment';
import CONSTANT from '@shared/configs/CONSTANT';
import { GroupApp } from './app-header';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  @HostListener('document:click', ['$event'])
  DocumentClick(event: Event) {
    let headNavMenu = document.getElementById("ftms-show-menuu-app");
    let targetEl = event.target as HTMLElement;
    if (headNavMenu.contains(targetEl)) {
      return;
    } else {
      if (this.checkCloseMenu) {
        headNavMenu.classList.remove("ftms-hide-cursor");
        let menu = document.getElementById("ftms-menu-app");
        menu.style.height = "0px";
        menu.classList.add("ftms-overfolow-hidden");
      }
    }
  }
  checkCloseMenu: boolean = false;
  element: any;
  configData: any;
  cookieValue;
  flagvalue;
  countryName;
  valueset: string;
  urlHome: string = env.urlBms;

  user: UserLoginInfoDto = null;

  apps: UserApp[] | undefined;

  groupApps: GroupApp[] = [];


  // tslint:disable-next-line: max-line-length
  constructor(
    @Inject(DOCUMENT) private document: any
    , private router: Router
    , private session: AppSessionService
    , private _authService: AuthService
  ) {
    this.user = session.user;
    this.apps = session.apps;
    //xử lý lấy groupApp
    if (this.groupApps.length == 0 && this.groupApps == null) {
      this.groupApps.push({
        name: this.apps[0].appGroupName,
        code: this.apps[0].appGroupCode,
        userApps: []
      });
    }
    //kiểm tra danh sách lấy các group app
    this.apps.forEach(app => {
      let check = 0;
      this.groupApps.forEach(group => {
        if (app.appGroupCode == group.code) {
          check++;
        }
      });
      if (check == 0) {
        this.groupApps.push({
          name: app.appGroupName,
          code: app.appGroupCode,
          userApps: []
        });
      }
      //lấy các group apps không trùng nhau
    });
    //lấy app thuộc group
    this.groupApps.forEach(group => {
      this.apps.forEach(app => {
        if (group.code == app.appGroupCode) {
          app['isShowImage'] = true;
          if (app.imgPath == null) {
            app['isShowImage'] = false;
          }
          //gennerate Name
          app.shortName = this.getSortName(app.displayName);
          group.userApps.push(app);
        }
      })
    });
  }

  ngOnInit(): void {
    this.element = document.documentElement;
    this.configData = {
      suppressScrollX: true,
      wheelSpeed: 0.3
    };
  }

  /**
   *  lấy sortname
   * */
  getSortName(name: string) {
    let sortName: string;
    let nameSplit = name.split('-')[1];
    //nếu tên không có dạng FTI-Name thì lấy 2 ký tự đầu của tên làm sort
    if (nameSplit == null || nameSplit == undefined) {
      name = name.trim();
      sortName = name.slice(0, 2);
    } else {
      nameSplit = nameSplit.trim();
      if (nameSplit.length <= 3) {
        sortName = nameSplit;
      } else {
        sortName = nameSplit.slice(0, 2);
      }
    }
    return sortName;
  }

  /**
   * Logout the user
   */
  logout() {
    myApp.ui.setBusy();
    const host = myApp.utils.getHost(env.loginType);
    if (env.loginType == 'ticket') {
      const href = `${env.loginUrl}/logout?service=${host}`;
      window.location.href = href;
      myApp.ui.clearBusy();
    } else {
      this._authService.logout().subscribe(rs => {
        const href = `${env.loginUrl}${env.loginType == 'ticket' ? '/login?service' : '?urlreturn'}=${host}`;
        myApp.utils.deleteCookie(CONSTANT.DEFAULT_COOKIE_NAME);
        window.location.href = href;
        myApp.ui.clearBusy();
      });
    }
  }

  getUrlIcon(imgPath: string) {
    const host = window.location.origin;
    return `${host}/assets/img/apps/${imgPath}`
  }
  openMenuApp() {
    this.checkCloseMenu = false;
    let imgApp = document.getElementById("ftms-show-menuu-app");
    imgApp.classList.add("ftms-hide-cursor");
    document.getElementById("ftms-menu-app").style.height = "100vh";
    setTimeout(() => {
      document.getElementById("ftms-menu-app").classList.remove("ftms-overfolow-hidden");
      this.checkCloseMenu = true;
    }, 500);
  }
  closeMenuApp() {
    if (this.checkCloseMenu) {
      let imgApp = document.getElementById("ftms-show-menuu-app");
      imgApp.classList.remove("ftms-hide-cursor");
      document.getElementById("ftms-menu-app").style.height = "0px";
      document.getElementById("ftms-menu-app").classList.add("ftms-overfolow-hidden");
    }
  }
}

