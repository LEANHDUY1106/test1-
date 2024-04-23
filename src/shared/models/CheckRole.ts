export default interface CheckRole {
   isCheck : boolean,
   roles: string []
}

export interface ApiResult<T = {}>{
   code: number;
   data: T;
   message: string;
   status: string
   systemName: string;

}