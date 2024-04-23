export interface MailHistoryDto {
    id: number;
    subject: string;
    tos: string[];
    ccs?: any;
    createdAt: Date;
    status: number;
    reason?: any;
}

export interface MailHistoryDetailDto {
    body?: any;
    isBodyHtml: number;
    id: number;
    subject: string;
    tos: string[];
    ccs?: any;
    createdAt: Date;
    status: number;
    reason?: any;
}

export interface MailHistorySearch {
    status: number
    startDate: Date
    endDate: Date
    to: string
    fetch: number
    offset: number
}