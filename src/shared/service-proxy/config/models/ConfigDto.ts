export interface ConfigDto {
    name: string;
    value: string;
}

export interface GetListConfigInput {
    keyword: string;
    fetch: number;
    offset: number;
    orderBy: string;
    isSortDesc: boolean;
}

export interface GetListConfigOutput {
    name: string;
    value: string;
}

export interface GetListConfigDto {
    items: GetListConfigOutput[],
    totalCount: number
}

export interface UpdateConfigInput {
    name: string;
    value: string;
}

export interface RemoveCacheInput {
    cacheName: string;
    absolute: boolean;
}