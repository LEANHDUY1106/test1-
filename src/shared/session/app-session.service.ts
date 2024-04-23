import { async } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import UserLoginInfoDto from '@shared/models/UserLoginInfoDto';
import { GetOutConfigOutput, Settings } from '../models/GetOutConfigOutput';
import UserApp from '../models/UserApp';
import UserFunction from '../models/UserFunction';
import { environment } from '../../environments/environment';
import CONSTANT from '@shared/configs/CONSTANT';
import UserPermission from '@shared/models/UserPermission';
import { Router } from '@angular/router';
import CheckRole, { ApiResult } from '@shared/models/CheckRole';
// import { resolve } from 'dns';
// import { rejects } from 'assert';

@Injectable()
export class AppSessionService {

    constructor(
        private _router: Router,
        private _httpClient: HttpClient
    ) { }

    private _user: UserLoginInfoDto | undefined;
    private _token: string | undefined;
    private _ftmsToken: string | undefined;
    private _apps: UserApp[] | undefined;
    private _funcs: UserFunction[] | undefined;
    private _permissions: UserPermission[] = [];
    private _roles: string[] = [];
    private _settings: Settings;
    private _isAmdin: boolean;
    private _isCreate: boolean;

    get isAdmin(): boolean {
        return this._isAmdin;
    }

    get isCreate(): boolean {
        return this._isCreate;
    }

    get settings(): Settings {
        return this._settings;
    }

    set settings(setting: Settings) {
        this.settings = setting;
    }

    get user(): UserLoginInfoDto | undefined {
        return this._user;
    }

    get userId(): number | null | undefined {
        return this.user ? this.user.id : null;
    }

    get token(): string | undefined {
        return this._token;
    }
    set token(token: string) {
        this._token = token;
    }

    get apps(): UserApp[] | undefined {
        return this._apps || [];
    }

    get funcs(): UserFunction[] | undefined {
        return this._funcs;
    }

    get ftmsToken(): string | undefined {
        return this._ftmsToken;
    }

    init(token: string | null): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let host = encodeURIComponent(myApp.utils.getHost(environment.loginType));
            this._httpClient.get<GetOutConfigOutput>(`${environment.remoteServiceBaseUrl}/api/Config${token ? '?token=' + token : ''}&service=${host}`)
                .subscribe(rs => {
                    if (rs.status == 403) {
                        this._router.navigate(
                            ['/403'],
                            {
                                queryParams: {
                                    type: 0
                                }
                            }
                        ).then(() => resolve(true));
                        return;
                    }

                    //kiểm tra subadimin
                    let isSubAdmin = false;
                    this._settings = new Settings(rs.settings)

                    let arrAccout = JSON.parse(this._settings.get('subadmin')['value']);
                    //check xem có trùng với danh sách subadmin ko
                    arrAccout.forEach(item => {
                        if (rs?.user?.email.toLocaleLowerCase() == item.name.toLocaleLowerCase()) {
                            isSubAdmin = true;
                        }
                    });
                    //kiểm tra xem có phải người dùng TT DEM hay không
                    let isDemUser = false;
                    //kiểm tra xem có phải là bgd ko
                    let isBod = false;
                    if (!isSubAdmin) {
                        let email_dem_bgd = this._settings.get('dem_bgd')[0].email;

                        let arrSubAdmin = email_dem_bgd.toString().split(',');
                        arrSubAdmin.forEach(item => {
                            if (item.toLocaleLowerCase() == rs.user?.email.toLocaleLowerCase()) {
                                isBod = true;
                            }
                        });
                    }
                    //nếu là Bod thì không là user Dem
                    if (!isBod) {
                        if (rs?.user?.divisionCode == CONSTANT.FTI_DEM) {
                            isDemUser = true;
                        }
                    }
                    if (rs.user == null) {
                        myApp.utils.deleteCookie(CONSTANT.DEFAULT_COOKIE_NAME);
                        window.location.href = `${environment.loginUrl}${environment.loginType == 'ticket' ? '/login?service' : '?urlreturn'}=${host}`;
                    }
                    if (rs.isAdmin) {
                        this._funcs = JSON.parse(`
                [
                    {
                        "items": [],
                        "id": 8426,
                        "code": "DX-RTM.Request.Create",
                        "description": null,
                        "displayName": "Tạo yêu cầu hỗ trợ",
                        "parentCode": null,
                        "appCode": "FTIMES",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request/create-support",
                        "cssClass": "far fa-plus-square",
                        "isEnable": "0"
                    },
                    {
                        "items": [],
                        "id": 8426,
                        "code": "DX-RTM.Request.Create",
                        "description": null,
                        "displayName": "Tạo yêu cầu số hóa",
                        "parentCode": null,
                        "appCode": "FTIMES",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request/create",
                        "cssClass": "far fa-calendar-plus",
                        "isEnable": "0"
                    },

                    {
                        "items": [],
                        "id": 8425,
                        "code": "DX-RTM.DASHBOARD",
                        "description": null,
                        "displayName": "Danh sách yêu cầu",
                        "parentCode": null,
                        "appCode": "FTIDX-RTM",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request",
                        "cssClass": "fa fa-solid fa-list",
                        "isEnable": "0"
                        },
                        {
                            "items": [],
                            "id": 8425,
                            "code": "DX-RTM.DASHBOARD",
                            "description": null,
                            "displayName": "Yêu cầu đã tạo",
                            "parentCode": null,
                            "appCode": "FTIDX-RTM",
                            "orders": "1",
                            "host": null,
                            "prefix": null,
                            "path": "/manage-request/my-created",
                            "cssClass": "fa-solid fa-clipboard-list",
                            "isEnable": "0"
                            },
                            {
                                "items": [],
                                "id": 8425,
                                "code": "DX-RTM.DASHBOARD",
                                "description": null,
                                "displayName": "Yêu cầu được phân công",
                                "parentCode": null,
                                "appCode": "FTIDX-RTM",
                                "orders": "1",
                                "host": null,
                                "prefix": null,
                                "path": "/manage-request/my-assign",
                                "cssClass": "fa-solid fa-chalkboard-user",
                                "isEnable": "0"
                                },
                                {
                                    "items": [],
                                    "id": 8425,
                                    "code": "DX-RTM.DASHBOARD",
                                    "description": null,
                                    "displayName": "Yêu cầu đang theo dõi",
                                    "parentCode": null,
                                    "appCode": "FTIDX-RTM",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/manage-request/my-follow",
                                    "cssClass": "fas fa-bookmark",
                                    "isEnable": "0"
                                    },
                                {
                                    "items": [],
                                    "id": 8426,
                                    "code": "DX-RTM.Request.Create",
                                    "description": null,
                                    "displayName": "Dashboard",
                                    "parentCode": null,
                                    "appCode": "FTIMES",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/",
                                    "cssClass": "fa-solid fa-gauge-high",
                                    "isEnable": "0"
                                },
                                {
                                    "items": [
                                        {
                                            "items": [],
                                            "id": 84263,
                                            "code": "DX-RTM.list",
                                            "description": null,
                                            "displayName": "Danh sách công nợ",
                                            "parentCode": null,
                                            "appCode": "FTIDX-RTM",
                                            "orders": "1",
                                            "host": null,
                                            "prefix": null,
                                            "path": "/manage-debt",
                                            "cssClass": "",
                                            "isEnable": "0"
                                        },
                                        {
                                            "items": [],
                                            "id": 842624,
                                            "code": "DX-RTM.Settings",
                                            "description": null,
                                            "displayName": "Danh sách được phân công",
                                            "parentCode": null,
                                            "appCode": "FTIDX-RTM",
                                            "orders": "1",
                                            "host": null,
                                            "prefix": null,
                                            "path": "/manage-debt/list-assign",
                                            "cssClass": "",
                                            "isEnable": "0"
                                        },
                                        {
                                            "items": [],
                                            "id": 842624,
                                            "code": "DX-RTM.Settings",
                                            "description": null,
                                            "displayName": "Tình trạng hóa đơn",
                                            "parentCode": null,
                                            "appCode": "FTIDX-RTM",
                                            "orders": "1",
                                            "host": null,
                                            "prefix": null,
                                            "path": "/manage-debt/list-log-debt",
                                            "cssClass": "",
                                            "isEnable": "0"
                                        }
                                    ],
                                    "id": 8426234,
                                    "code": "DX-RTM.Debt",
                                    "description": null,
                                    "displayName": "Quản lý công nợ",
                                    "parentCode": null,
                                    "appCode": "FTIDX-RTM",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/manage-debt",
                                    "cssClass": "fas fa-wallet",
                                    "isEnable": "0"
                                },
                    {
                        "items": [
                            {
                                "items": [],
                                "id": 8426,
                                "code": "DX-RTM.HistoryMail",
                                "description": null,
                                "displayName": "Lịch sử mail",
                                "parentCode": null,
                                "appCode": "FTIDX-RTM",
                                "orders": "1",
                                "host": null,
                                "prefix": null,
                                "path": "/system/mail-history",
                                "cssClass": "",
                                "isEnable": "0"
                            },
                            {
                                "items": [],
                                "id": 8426,
                                "code": "DX-RTM.Settings",
                                "description": null,
                                "displayName": "Cấu hình",
                                "parentCode": null,
                                "appCode": "FTIDX-RTM",
                                "orders": "1",
                                "host": null,
                                "prefix": null,
                                "path": "/system",
                                "cssClass": "",
                                "isEnable": "0"
                            }
                        ],
                        "id": 8426,
                        "code": "DX-RTM.System",
                        "description": null,
                        "displayName": "Hệ thống",
                        "parentCode": null,
                        "appCode": "FTIDX-RTM",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/settings",
                        "cssClass": "fa fa-regular fa-gear",
                        "isEnable": "0"
                    }
                    ]`);
                    } else {
                        if (rs.isCreate || isSubAdmin) {
                            if (isDemUser) {
                                this._funcs = JSON.parse(`
                [
                    {
                        "items": [],
                        "id": 8426,
                        "code": "DX-RTM.Request.Create",
                        "description": null,
                        "displayName": "Tạo yêu cầu hỗ trợ",
                        "parentCode": null,
                        "appCode": "FTIMES",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request/create-support",
                        "cssClass": "far fa-plus-square",
                        "isEnable": "0"
                    },
                    {
                        "items": [],
                        "id": 8426,
                        "code": "DX-RTM.Request.Create",
                        "description": null,
                        "displayName": "Tạo yêu cầu số hóa",
                        "parentCode": null,
                        "appCode": "FTIMES",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request/create",
                        "cssClass": "far fa-calendar-plus",
                        "isEnable": "0"
                    },

                    {
                        "items": [],
                        "id": 8425,
                        "code": "DX-RTM.DASHBOARD",
                        "description": null,
                        "displayName": "Danh sách yêu cầu",
                        "parentCode": null,
                        "appCode": "FTIDX-RTM",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request",
                        "cssClass": "fa fa-solid fa-list",
                        "isEnable": "0"
                        },
                        {
                            "items": [],
                            "id": 8425,
                            "code": "DX-RTM.DASHBOARD",
                            "description": null,
                            "displayName": "Yêu cầu đã tạo",
                            "parentCode": null,
                            "appCode": "FTIDX-RTM",
                            "orders": "1",
                            "host": null,
                            "prefix": null,
                            "path": "/manage-request/my-created",
                            "cssClass": "fa-solid fa-clipboard-list",
                            "isEnable": "0"
                            },
                            {
                                "items": [],
                                "id": 8425,
                                "code": "DX-RTM.DASHBOARD",
                                "description": null,
                                "displayName": "Yêu cầu được phân công",
                                "parentCode": null,
                                "appCode": "FTIDX-RTM",
                                "orders": "1",
                                "host": null,
                                "prefix": null,
                                "path": "/manage-request/my-assign",
                                "cssClass": "fa-solid fa-chalkboard-user",
                                "isEnable": "0"
                                },
                                {
                                    "items": [],
                                    "id": 8425,
                                    "code": "DX-RTM.DASHBOARD",
                                    "description": null,
                                    "displayName": "Yêu cầu đang theo dõi",
                                    "parentCode": null,
                                    "appCode": "FTIDX-RTM",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/manage-request/my-follow",
                                    "cssClass": "fas fa-bookmark",
                                    "isEnable": "0"
                                    },
                                {
                                    "items": [],
                                    "id": 8426,
                                    "code": "DX-RTM.Request.Create",
                                    "description": null,
                                    "displayName": "Dashboard",
                                    "parentCode": null,
                                    "appCode": "FTIMES",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/",
                                    "cssClass": "fa-solid fa-gauge-high",
                                    "isEnable": "0"
                                },
                                {
                                    "items": [
                                        {
                                            "items": [],
                                            "id": 8426,
                                            "code": "DX-RTM.list",
                                            "description": null,
                                            "displayName": "Danh sách công nợ",
                                            "parentCode": null,
                                            "appCode": "FTIDX-RTM",
                                            "orders": "1",
                                            "host": null,
                                            "prefix": null,
                                            "path": "/manage-debt",
                                            "cssClass": "",
                                            "isEnable": "0"
                                        },
                                        {
                                            "items": [],
                                            "id": 8426,
                                            "code": "DX-RTM.Settings",
                                            "description": null,
                                            "displayName": "Danh sách được phân công",
                                            "parentCode": null,
                                            "appCode": "FTIDX-RTM",
                                            "orders": "1",
                                            "host": null,
                                            "prefix": null,
                                            "path": "/manage-debt/list-assign",
                                            "cssClass": "",
                                            "isEnable": "0"
                                        },
                                        {
                                            "items": [],
                                            "id": 842624,
                                            "code": "DX-RTM.Settings",
                                            "description": null,
                                            "displayName": "Tình trạng hóa đơn",
                                            "parentCode": null,
                                            "appCode": "FTIDX-RTM",
                                            "orders": "1",
                                            "host": null,
                                            "prefix": null,
                                            "path": "/manage-debt/list-log-debt",
                                            "cssClass": "",
                                            "isEnable": "0"
                                        }
                                    ],
                                    "id": 8426,
                                    "code": "DX-RTM.Debt",
                                    "description": null,
                                    "displayName": "Quản lý công nợ",
                                    "parentCode": null,
                                    "appCode": "FTIDX-RTM",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/manage-debt",
                                    "cssClass": "fas fa-wallet",
                                    "isEnable": "0"
                                }
                    ]`);
                            } else {
                                if (isBod) {
                                    this._funcs = JSON.parse(`
                [
                    {
                        "items": [],
                        "id": 8426,
                        "code": "DX-RTM.Request.Create",
                        "description": null,
                        "displayName": "Tạo yêu cầu hỗ trợ",
                        "parentCode": null,
                        "appCode": "FTIMES",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request/create-support",
                        "cssClass": "far fa-plus-square",
                        "isEnable": "0"
                    },
                    {
                        "items": [],
                        "id": 8426,
                        "code": "DX-RTM.Request.Create",
                        "description": null,
                        "displayName": "Tạo yêu cầu số hóa",
                        "parentCode": null,
                        "appCode": "FTIMES",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request/create",
                        "cssClass": "far fa-calendar-plus",
                        "isEnable": "0"
                    },

                    {
                        "items": [],
                        "id": 8425,
                        "code": "DX-RTM.DASHBOARD",
                        "description": null,
                        "displayName": "Danh sách yêu cầu",
                        "parentCode": null,
                        "appCode": "FTIDX-RTM",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request",
                        "cssClass": "fa fa-solid fa-list",
                        "isEnable": "0"
                        },
                        {
                            "items": [],
                            "id": 8425,
                            "code": "DX-RTM.DASHBOARD",
                            "description": null,
                            "displayName": "Yêu cầu đã tạo",
                            "parentCode": null,
                            "appCode": "FTIDX-RTM",
                            "orders": "1",
                            "host": null,
                            "prefix": null,
                            "path": "/manage-request/my-created",
                            "cssClass": "fa-solid fa-clipboard-list",
                            "isEnable": "0"
                            },
                            {
                                "items": [],
                                "id": 8425,
                                "code": "DX-RTM.DASHBOARD",
                                "description": null,
                                "displayName": "Yêu cầu được phân công",
                                "parentCode": null,
                                "appCode": "FTIDX-RTM",
                                "orders": "1",
                                "host": null,
                                "prefix": null,
                                "path": "/manage-request/my-assign",
                                "cssClass": "fa-solid fa-chalkboard-user",
                                "isEnable": "0"
                                },
                                {
                                    "items": [],
                                    "id": 8425,
                                    "code": "DX-RTM.DASHBOARD",
                                    "description": null,
                                    "displayName": "Yêu cầu đang theo dõi",
                                    "parentCode": null,
                                    "appCode": "FTIDX-RTM",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/manage-request/my-follow",
                                    "cssClass": "fas fa-bookmark",
                                    "isEnable": "0"
                                    },
                                {
                                    "items": [],
                                    "id": 8426,
                                    "code": "DX-RTM.Request.Create",
                                    "description": null,
                                    "displayName": "Dashboard",
                                    "parentCode": null,
                                    "appCode": "FTIMES",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/",
                                    "cssClass": "fa-solid fa-gauge-high",
                                    "isEnable": "0"
                                },
                                {
                                    "items": [
                                        {
                                            "items": [],
                                            "id": 8426,
                                            "code": "DX-RTM.list",
                                            "description": null,
                                            "displayName": "Danh sách công nợ",
                                            "parentCode": null,
                                            "appCode": "FTIDX-RTM",
                                            "orders": "1",
                                            "host": null,
                                            "prefix": null,
                                            "path": "/manage-debt",
                                            "cssClass": "",
                                            "isEnable": "0"
                                        }
                                    ],
                                    "id": 8426,
                                    "code": "DX-RTM.Debt",
                                    "description": null,
                                    "displayName": "Quản lý công nợ",
                                    "parentCode": null,
                                    "appCode": "FTIDX-RTM",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/manage-debt",
                                    "cssClass": "fas fa-wallet",
                                    "isEnable": "0"
                                }
                    ]`);
                                } else {
                                    this._funcs = JSON.parse(`
                [
                    {
                        "items": [],
                        "id": 8426,
                        "code": "DX-RTM.Request.Create",
                        "description": null,
                        "displayName": "Tạo yêu cầu hỗ trợ",
                        "parentCode": null,
                        "appCode": "FTIMES",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request/create-support",
                        "cssClass": "far fa-plus-square",
                        "isEnable": "0"
                    },
                    {
                        "items": [],
                        "id": 8426,
                        "code": "DX-RTM.Request.Create",
                        "description": null,
                        "displayName": "Tạo yêu cầu số hóa",
                        "parentCode": null,
                        "appCode": "FTIMES",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request/create",
                        "cssClass": "far fa-calendar-plus",
                        "isEnable": "0"
                    },

                    {
                        "items": [],
                        "id": 8425,
                        "code": "DX-RTM.DASHBOARD",
                        "description": null,
                        "displayName": "Danh sách yêu cầu",
                        "parentCode": null,
                        "appCode": "FTIDX-RTM",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request",
                        "cssClass": "fa fa-solid fa-list",
                        "isEnable": "0"
                        },
                        {
                            "items": [],
                            "id": 8425,
                            "code": "DX-RTM.DASHBOARD",
                            "description": null,
                            "displayName": "Yêu cầu đã tạo",
                            "parentCode": null,
                            "appCode": "FTIDX-RTM",
                            "orders": "1",
                            "host": null,
                            "prefix": null,
                            "path": "/manage-request/my-created",
                            "cssClass": "fa-solid fa-clipboard-list",
                            "isEnable": "0"
                            },
                            {
                                "items": [],
                                "id": 8425,
                                "code": "DX-RTM.DASHBOARD",
                                "description": null,
                                "displayName": "Yêu cầu được phân công",
                                "parentCode": null,
                                "appCode": "FTIDX-RTM",
                                "orders": "1",
                                "host": null,
                                "prefix": null,
                                "path": "/manage-request/my-assign",
                                "cssClass": "fa-solid fa-chalkboard-user",
                                "isEnable": "0"
                                },
                                {
                                    "items": [],
                                    "id": 8425,
                                    "code": "DX-RTM.DASHBOARD",
                                    "description": null,
                                    "displayName": "Yêu cầu đang theo dõi",
                                    "parentCode": null,
                                    "appCode": "FTIDX-RTM",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/manage-request/my-follow",
                                    "cssClass": "fas fa-bookmark",
                                    "isEnable": "0"
                                    },
                                {
                                    "items": [],
                                    "id": 8426,
                                    "code": "DX-RTM.Request.Create",
                                    "description": null,
                                    "displayName": "Dashboard",
                                    "parentCode": null,
                                    "appCode": "FTIMES",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/",
                                    "cssClass": "fa-solid fa-gauge-high",
                                    "isEnable": "0"
                                }
                    ]`);
                                }
                            }
                        } else {
                            if (isDemUser) {
                                this._funcs = JSON.parse(`
                [
                    {
                        "items": [],
                        "id": 8426,
                        "code": "DX-RTM.Request.Create",
                        "description": null,
                        "displayName": "Tạo yêu cầu hỗ trợ",
                        "parentCode": null,
                        "appCode": "FTIMES",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request/create-support",
                        "cssClass": "far fa-plus-square",
                        "isEnable": "0"
                    },
                    {
                        "items": [],
                        "id": 8425,
                        "code": "DX-RTM.DASHBOARD",
                        "description": null,
                        "displayName": "Danh sách yêu cầu",
                        "parentCode": null,
                        "appCode": "FTIDX-RTM",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request",
                        "cssClass": "fa fa-solid fa-list",
                        "isEnable": "0"
                        },
                        {
                            "items": [],
                            "id": 8425,
                            "code": "DX-RTM.DASHBOARD",
                            "description": null,
                            "displayName": "Yêu cầu đã tạo",
                            "parentCode": null,
                            "appCode": "FTIDX-RTM",
                            "orders": "1",
                            "host": null,
                            "prefix": null,
                            "path": "/manage-request/my-created",
                            "cssClass": "fa-solid fa-clipboard-list",
                            "isEnable": "0"
                            },
                            {
                                "items": [],
                                "id": 8425,
                                "code": "DX-RTM.DASHBOARD",
                                "description": null,
                                "displayName": "Yêu cầu được phân công",
                                "parentCode": null,
                                "appCode": "FTIDX-RTM",
                                "orders": "1",
                                "host": null,
                                "prefix": null,
                                "path": "/manage-request/my-assign",
                                "cssClass": "fa-solid fa-chalkboard-user",
                                "isEnable": "0"
                                },
                                {
                                    "items": [],
                                    "id": 8425,
                                    "code": "DX-RTM.DASHBOARD",
                                    "description": null,
                                    "displayName": "Yêu cầu đang theo dõi",
                                    "parentCode": null,
                                    "appCode": "FTIDX-RTM",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/manage-request/my-follow",
                                    "cssClass": "fas fa-bookmark",
                                    "isEnable": "0"
                                    },
                                {
                                    "items": [],
                                    "id": 8426,
                                    "code": "DX-RTM.Request.Create",
                                    "description": null,
                                    "displayName": "Dashboard",
                                    "parentCode": null,
                                    "appCode": "FTIMES",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/",
                                    "cssClass": "fa-solid fa-gauge-high",
                                    "isEnable": "0"
                                },
                                {
                                    "items": [
                                        {
                                            "items": [],
                                            "id": 8426,
                                            "code": "DX-RTM.list",
                                            "description": null,
                                            "displayName": "Danh sách công nợ",
                                            "parentCode": null,
                                            "appCode": "FTIDX-RTM",
                                            "orders": "1",
                                            "host": null,
                                            "prefix": null,
                                            "path": "/manage-debt",
                                            "cssClass": "",
                                            "isEnable": "0"
                                        },
                                        {
                                            "items": [],
                                            "id": 8426,
                                            "code": "DX-RTM.Settings",
                                            "description": null,
                                            "displayName": "Danh sách được phân công",
                                            "parentCode": null,
                                            "appCode": "FTIDX-RTM",
                                            "orders": "1",
                                            "host": null,
                                            "prefix": null,
                                            "path": "/manage-debt/list-assign",
                                            "cssClass": "",
                                            "isEnable": "0"
                                        },
                                        {
                                            "items": [],
                                            "id": 842624,
                                            "code": "DX-RTM.Settings",
                                            "description": null,
                                            "displayName": "Tình trạng hóa đơn",
                                            "parentCode": null,
                                            "appCode": "FTIDX-RTM",
                                            "orders": "1",
                                            "host": null,
                                            "prefix": null,
                                            "path": "/manage-debt/list-log-debt",
                                            "cssClass": "",
                                            "isEnable": "0"
                                        }
                                    ],
                                    "id": 8426,
                                    "code": "DX-RTM.Debt",
                                    "description": null,
                                    "displayName": "Quản lý công nợ",
                                    "parentCode": null,
                                    "appCode": "FTIDX-RTM",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/manage-debt",
                                    "cssClass": "fas fa-wallet",
                                    "isEnable": "0"
                                }
                    ]`);
                            } else {
                                if (isBod) {
                                    this._funcs = JSON.parse(`
                [
                    {
                        "items": [],
                        "id": 8426,
                        "code": "DX-RTM.Request.Create",
                        "description": null,
                        "displayName": "Tạo yêu cầu hỗ trợ",
                        "parentCode": null,
                        "appCode": "FTIMES",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request/create-support",
                        "cssClass": "far fa-plus-square",
                        "isEnable": "0"
                    },
                    {
                        "items": [],
                        "id": 8425,
                        "code": "DX-RTM.DASHBOARD",
                        "description": null,
                        "displayName": "Danh sách yêu cầu",
                        "parentCode": null,
                        "appCode": "FTIDX-RTM",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request",
                        "cssClass": "fa fa-solid fa-list",
                        "isEnable": "0"
                        },
                        {
                            "items": [],
                            "id": 8425,
                            "code": "DX-RTM.DASHBOARD",
                            "description": null,
                            "displayName": "Yêu cầu đã tạo",
                            "parentCode": null,
                            "appCode": "FTIDX-RTM",
                            "orders": "1",
                            "host": null,
                            "prefix": null,
                            "path": "/manage-request/my-created",
                            "cssClass": "fa-solid fa-clipboard-list",
                            "isEnable": "0"
                            },
                            {
                                "items": [],
                                "id": 8425,
                                "code": "DX-RTM.DASHBOARD",
                                "description": null,
                                "displayName": "Yêu cầu được phân công",
                                "parentCode": null,
                                "appCode": "FTIDX-RTM",
                                "orders": "1",
                                "host": null,
                                "prefix": null,
                                "path": "/manage-request/my-assign",
                                "cssClass": "fa-solid fa-chalkboard-user",
                                "isEnable": "0"
                                },
                                {
                                    "items": [],
                                    "id": 8425,
                                    "code": "DX-RTM.DASHBOARD",
                                    "description": null,
                                    "displayName": "Yêu cầu đang theo dõi",
                                    "parentCode": null,
                                    "appCode": "FTIDX-RTM",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/manage-request/my-follow",
                                    "cssClass": "fas fa-bookmark",
                                    "isEnable": "0"
                                    },
                                {
                                    "items": [],
                                    "id": 8426,
                                    "code": "DX-RTM.Request.Create",
                                    "description": null,
                                    "displayName": "Dashboard",
                                    "parentCode": null,
                                    "appCode": "FTIMES",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/",
                                    "cssClass": "fa-solid fa-gauge-high",
                                    "isEnable": "0"
                                },
                                {
                                    "items": [
                                        {
                                            "items": [],
                                            "id": 8426,
                                            "code": "DX-RTM.list",
                                            "description": null,
                                            "displayName": "Danh sách công nợ",
                                            "parentCode": null,
                                            "appCode": "FTIDX-RTM",
                                            "orders": "1",
                                            "host": null,
                                            "prefix": null,
                                            "path": "/manage-debt",
                                            "cssClass": "",
                                            "isEnable": "0"
                                        }
                                    ],
                                    "id": 8426,
                                    "code": "DX-RTM.Debt",
                                    "description": null,
                                    "displayName": "Quản lý công nợ",
                                    "parentCode": null,
                                    "appCode": "FTIDX-RTM",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/manage-debt",
                                    "cssClass": "fas fa-wallet",
                                    "isEnable": "0"
                                }
                    ]`);
                                } else {
                                    this._funcs = JSON.parse(`
                [
                    {
                        "items": [],
                        "id": 8426,
                        "code": "DX-RTM.Request.Create",
                        "description": null,
                        "displayName": "Tạo yêu cầu hỗ trợ",
                        "parentCode": null,
                        "appCode": "FTIMES",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request/create-support",
                        "cssClass": "far fa-plus-square",
                        "isEnable": "0"
                    },
                    {
                        "items": [],
                        "id": 8425,
                        "code": "DX-RTM.DASHBOARD",
                        "description": null,
                        "displayName": "Danh sách yêu cầu",
                        "parentCode": null,
                        "appCode": "FTIDX-RTM",
                        "orders": "1",
                        "host": null,
                        "prefix": null,
                        "path": "/manage-request",
                        "cssClass": "fa fa-solid fa-list",
                        "isEnable": "0"
                        },
                        {
                            "items": [],
                            "id": 8425,
                            "code": "DX-RTM.DASHBOARD",
                            "description": null,
                            "displayName": "Yêu cầu đã tạo",
                            "parentCode": null,
                            "appCode": "FTIDX-RTM",
                            "orders": "1",
                            "host": null,
                            "prefix": null,
                            "path": "/manage-request/my-created",
                            "cssClass": "fa-solid fa-clipboard-list",
                            "isEnable": "0"
                            },
                            {
                                "items": [],
                                "id": 8425,
                                "code": "DX-RTM.DASHBOARD",
                                "description": null,
                                "displayName": "Yêu cầu được phân công",
                                "parentCode": null,
                                "appCode": "FTIDX-RTM",
                                "orders": "1",
                                "host": null,
                                "prefix": null,
                                "path": "/manage-request/my-assign",
                                "cssClass": "fa-solid fa-chalkboard-user",
                                "isEnable": "0"
                                },
                                {
                                    "items": [],
                                    "id": 8425,
                                    "code": "DX-RTM.DASHBOARD",
                                    "description": null,
                                    "displayName": "Yêu cầu đang theo dõi",
                                    "parentCode": null,
                                    "appCode": "FTIDX-RTM",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/manage-request/my-follow",
                                    "cssClass": "fas fa-bookmark",
                                    "isEnable": "0"
                                    },
                                {
                                    "items": [],
                                    "id": 8426,
                                    "code": "DX-RTM.Request.Create",
                                    "description": null,
                                    "displayName": "Dashboard",
                                    "parentCode": null,
                                    "appCode": "FTIMES",
                                    "orders": "1",
                                    "host": null,
                                    "prefix": null,
                                    "path": "/",
                                    "cssClass": "fa-solid fa-gauge-high",
                                    "isEnable": "0"
                                }
                    ]`);
                                }
                            }
                        }
                    }
                    this._ftmsToken = token;
                    this._user = rs.user;
                    this._token = rs.token;
                    this._isAmdin = rs.isAdmin;
                    this._isCreate = rs.isCreate;
                    if (rs.app && rs.app.items && rs.app.items.length > 0) {
                        this._apps = rs.app.items[0].items;
                    }
                    myApp.utils.setCookieValue(CONSTANT.DEFAULT_COOKIE_NAME, token)
                    resolve(true);
                }, () => {
                    window.location.href = `${environment.loginUrl}${environment.loginType == 'ticket' ? '/login?service' : '?urlreturn'}=${host}`;
                    myApp.ui.loadErrorPage(environment.production, 'Không thể khởi tạo app, vui lòng kiểm tra kết nối hoặc liên hệ admin!');
                    reject('Không thể khởi tạo app, vui lòng kiểm tra kết nối hoặc liên hệ admin!');
                })
            // resolve(true);
        });
    }

    async refreshToken() {
        try {
            const rs = await this._httpClient.get(`${environment.remoteServiceBaseUrl}/api/Auth?token=${this.ftmsToken}`).toPromise();
            this.token = rs['accessToken'];
        } catch (error) {
            myApp.utils.deleteCookie(CONSTANT.DEFAULT_COOKIE_NAME);
            let host = myApp.utils.getHost(environment.loginType);
            window.location.href = `${environment.loginUrl}?${environment.loginType == 'ticket' ? '/login?service' : '?urlreturn'}=${host}`;
        }
    }

    async checkPermission(functionCode: string, permission: string, appCode: string = 'DXRTM') {
        let _permission: UserPermission = this._permissions
            .find(x => x.appCode == appCode && x.functionCode == functionCode && x.permission == permission);
        if (_permission) return _permission.access;
        const url = `${environment.remoteServiceBaseUrl}/api/Auth/CheckPermission?functionCode=${functionCode}&permission=${permission}&appCode=${appCode}`
        const { data } = await this._httpClient.get<ApiResult<boolean>>(url).toPromise();
        _permission = {
            appCode,
            functionCode,
            permission,
            access: data
        };
        this._permissions.push(_permission);
        return data;
    }

    async checkRoles(roles: string): Promise<boolean> {
        //Kiểm tra nếu session đã có roles thì lấy ra check.
        if (this._roles?.length > 0) {
            return this._roles.filter(x => roles.split(",").find(y => y == x)).length > 0;
        }
        const url = `${environment.remoteServiceBaseUrl}/api/Auth/CheckRoles?roles=${roles}`
        let result = await this._httpClient.get<CheckRole>(url).toPromise();

        // Gán role cho sesion user đó.
        this._roles = result.roles;
        return result.isCheck;
    }
}
