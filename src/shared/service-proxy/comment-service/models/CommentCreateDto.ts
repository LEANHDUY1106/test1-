export interface CommentCreateDto {
    postId: number
    content: string
    receiverEmail: string
    createdUser: string
    files: FileCustom[]
  }
export interface FileCustom
{
  fileId: string
  fileName: string
}