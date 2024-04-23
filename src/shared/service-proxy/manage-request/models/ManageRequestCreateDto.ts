export interface ManageRequestCreatehDto {
    postId: number
    tittle: string
    postType: number
    projectCode: string
    departmentCode: string
    postDescription: string
    postStatus: number
    receiverAccount: string
    estimatedStartDate: Date
    estimatedEndDate: Date
    priority: number
    desiredDate: Date
    files: FileCustom[]
    
}
export interface FileCustom
{
  fileId: string
  fileName: string
}

export interface DeletePostIdDto
{
  postId: number
}

export interface GetListSuggestionDto
{
  projectCode: string
}

export interface FollowPostIdDto
{
  postid: number
  followUpStatus: number
}