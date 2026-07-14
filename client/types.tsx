export type FileType =
  | 'folder'
  | 'pdf'
  | 'image'
  | 'video'
  | 'audio'
  | 'code'
  | 'text'
  | 'archive'
  | 'data'
  | 'unknown'

export interface FileItem {
  id: string
  name: string
  type: FileType
  size?: string
  modified: string
  path: string
  children?: FileItem[]
}
