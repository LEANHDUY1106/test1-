import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SearchCommentDto } from "./models/SearchCommentDto";
import { environment as env } from 'src/environments/environment';
import { ResponsePaginationResult } from "../core/BaseResponseDto";
import { CommentDto } from "./models/CommentDto";
import { CommentCreateDto } from "./models/CommentCreateDto";

@Injectable({
    providedIn: 'root'
})
export class CommentService {
    constructor(
        private _http: HttpClient
    ) { }

    getByPostId(request: SearchCommentDto){
        const url = `${env.remoteServiceBaseUrl}/api/Comment/GetCommentByPostId`;
        return this._http.post<ResponsePaginationResult<CommentDto>>(url, request);
    }

    create(request: CommentCreateDto){
        const url = `${env.remoteServiceBaseUrl}/api/Comment/CreateCommentByPostId`;
        return this._http.post<number>(url, request);
    }
}