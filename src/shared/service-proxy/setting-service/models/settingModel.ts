export interface SettingDto {
    id: number;
    name: any;
    value: string;
}

export interface SettingUpdateDto {
    name: any;
    value: string;
}
export interface RemoveCacheInput {
    cacheName: string;
    absolute: boolean;
}

