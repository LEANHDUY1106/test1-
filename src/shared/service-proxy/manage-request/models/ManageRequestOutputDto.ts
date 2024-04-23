export interface ManageReQuestOutputDto {
    postid: number
    tittle: string
    posttype: number
    projectCode: string
    departmentCode: string
    postdescription: string
    poststatus: number
    receiverAccount: any
    estimatedstartdate: Date
    estimatedenddate: Date
    desiredDate: Date
    createdUser: string
    createdDate: Date
    updatedTime: string
    priority: number
    emailreceiver: string
    fileItems: FileItem[]
    reason: string
    updateby: string
    followup: number
}
export interface FileItem {
    fileId: string
    fileName: string
  }