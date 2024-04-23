export interface CommentDto {
    id: number
    postid: number
    content: string
    createduser: string
    createdtime: string
    fileInfos: FileInfo[]
    emailreceiver: string
}

export interface FileInfo {
    fileId: string
    fileName: string
  }