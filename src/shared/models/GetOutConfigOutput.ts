import { MasterType } from './MasterType';
import UserApp from './UserApp';
import UserFunction from './UserFunction';
import UserLoginInfoDto from './UserLoginInfoDto'

export interface GetOutConfigOutput {
    status: number;
    user: UserLoginInfoDto | undefined;
    token: string | undefined;
    app: UserApp | undefined;
    settings: Settings;
    funcs: UserFunction[] | undefined;
    isAdmin: boolean;
    isCreate: boolean;
}

export class Settings {
    /**
     *
     */
    constructor(value: object) {
        this._settings = new Map(Object.entries(value));
    }
    get<T>(base: string, ...restOfName: Array<string | number>) {
        let result = this._settings.get(base);
        for (const select of restOfName) {
            result = result[select];
        }
        return result as T;
    }

    private _getMaster(typeName: string, value: any): MasterType {
        const mastersByType = this.get<MasterType[]>(`MasterType.${typeName}`) || [];
        return mastersByType.find(x => x.value == value);
    }

    /**
     *
     * @param typeName Master type (bảng master) cần lấy
     * @param value Giá trị cần lấy
     * @returns tên của master type có giá trị đưa vào
     */
    getMasterName(typeName: string, value: any): string {
        const master = this._getMaster(typeName, value);
        return master?.name;
    }

    /**
     *
     * @param typeName Master type (bảng master) cần lấy
     * @param value Giá trị cần lấy
     * @returns Ghi chú của master type có giá trị đưa vào
     */
    getMasterNote(typeName: string, value: any): string {
        const master = this._getMaster(typeName, value);
        return master?.note;
    }
    private _settings: Map<string, any>
}
