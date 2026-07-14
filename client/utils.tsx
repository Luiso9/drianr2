import type { FileItem, FileType } from './types'

export function getFileLabel(type: FileType): string {
  const labels: Record<FileType, string> = {
    folder: 'Folder', pdf: 'PDF', image: 'Image', video: 'Video',
    audio: 'Audio', code: 'Code', text: 'Text', archive: 'Archive',
    data: 'Data', unknown: 'File',
  }
  return labels[type]
}

export function flattenFiles(items: FileItem[], query: string): FileItem[] {
  const results: FileItem[] = []
  function walk(list: FileItem[]) {
    for (const item of list) {
      if (item.name.toLowerCase().includes(query.toLowerCase())) results.push(item)
      if (item.children) walk(item.children)
    }
  }
  walk(items)
  return results
}

export function fileApiUrl(path: string, download = false): string {
  const encoded = path.split('/').map(encodeURIComponent).join('/')
  return `/api/file/${encoded}${download ? '?download=1' : ''}`
}
