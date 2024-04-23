export interface BaseResponseDto<T> {
    data: T | null;
    message: string | null;
}


export interface BaseResponsePaginationChild<T> {
    items: T | null;
    totalRecords: number | null;
}

export interface ResponsePaginationResult<T> {
    items: T[] | null;
    totalCount: number | null;
}

export interface BaseResponsePaginationDto<T> {
    data: BaseResponsePaginationChild<T> | null;
    message: string | null;
}
