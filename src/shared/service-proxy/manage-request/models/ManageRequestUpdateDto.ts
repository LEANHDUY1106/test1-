export interface ManageRequestUpdatehDto {
    postId: number
    tittle: string
    postType: number
    projectCode: string
    departmentCode?: string
    postDescription: string
    priority: number
    postStatus: number
    receiverAccount: string
    estimatedStartDate?: Date
    estimatedEndDate?: Date
    desiredDate: Date
    reason: string
    // departmentName?: string
    // userChangeStatus?: string
    files: FileCustom[]
    
}
export interface FileCustom
{
  fileId: string
  fileName: string
}