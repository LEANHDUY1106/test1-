import { ServiceType } from "@shared/models/ServiceType";

export default class {
    static readonly TIME_OUT_SEARCH : number = 500;
    static readonly TIME_OUT_EXPORT : number = 2000;
    static readonly ROWS_PER_PAGE_OPTIONS : number[] = [5,10,20,30];
    static readonly ROWS_PER_PAGE_OPTIONS_DEFAULT : Object[] = [
        {
            value: 5,
            label   : '5'
        },
        {
            value: 10,
            label   : '10'
        },
        {
            value: 20,
            label   : '20'
        },
        {
            value: 50,
            label   : '50'
        }
    ];
    static readonly ROWS_PER_PAGE_DEFAULT : number = 10;
    static readonly DEFAULT_COOKIE_NAME : string = 'fwef231';


    static readonly CREATE_FEE_DEFAULT : number = 5000;
    static readonly MAINTAIN_FEE_DEFAULT : number = 2000;
    static readonly MAX_VALUE_INT32 : number = 2147483647;

    //settings
    static readonly SYSTEM_RECEIVERACCOUNT: string = "System.ReceiverAccount";
    static readonly SYSTEM_TYPEREQUEST: string = "System.TypeRequest";

    //trung tam DEM
    // static readonly FTI_DEM : string = 'FTIDEM';
    static readonly FTI_DEM : string = 'FTIDEM';
    static readonly FTI_ISC : string = 'FTIISC';

    static readonly FTI_ROLES = {
        /** Nhân viên đảm bảo chất lượng FTI */
        QUA_QA_MAN  :"FTI-QUA-QA MAN",
        /** Nhân viên kinh doanh FTI */
        SAL_SALE_SUPPORT  :"FTI-SAL SALE SUPPORT",
        /** GD/PGD Trung tâm kinh doanh FTI */
        SAL_CENTER_MANAGER  :"FTI-SAL CENTER MANAGER",
        /** TP/PP Quản lý bán hàng FTI */
        SAL_SALE_MANAGER  :"FTI-SAL SALE MANAGER",
        /** FTI-CS NV CSKH */
        CS_STAFF  :"FTI-CS STAFF",
        /** Nhân viên kinh doanh FTI */
        SAL_SALESMAN  :"FTI-SAL SALESMAN",
        /** Nhóm AD quản trị toàn hệ thống FTI */
        FTI_ADMIN  :"FTI.ADMIN",
        /** Nhóm quyền Admin DX-RTM */
        FTI_DXRTM_ADMIN: "DXRTM.ADMIN",
        /** Phiên bản đầy đủ hơn của nhóm CS Staff*/
        CS_STAFFFULL: "FTI-CS STAFF,FTI-CSE STAFF"
    };
}
