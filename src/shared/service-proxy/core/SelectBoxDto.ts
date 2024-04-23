export interface SelectBoxDto<T> {
    value: T,
    label: string
}

export interface SelectBoxOutputDto<T> {
    items: SelectBoxDto<T>[];
    totalCount: number;
}
