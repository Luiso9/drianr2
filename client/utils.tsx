import type { FileItem, FileType } from './types'

export function getFileLabel(type: FileType): string {
  const labels: Record<FileType, string> = {
    folder: 'Folder', pdf: 'PDF', image: 'Image', video: 'Video',
    audio: 'Audio', code: 'Code', text: 'Text', archive: 'Archive',
    data: 'Data', unknown: 'File',
  }
  return labels[type]
}

export function fileApiUrl(path: string, download = false): string {
  const encoded = path.split('/').map(encodeURIComponent).join('/')
  return `/api/file/${encoded}${download ? '?download=1' : ''}`
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

export function deleteById(items: FileItem[], id: string): FileItem[] {
  return items
    .filter(item => item.id !== id)
    .map(item => item.children ? { ...item, children: deleteById(item.children, id) } : item)
}

export function deriveFolderItems(files: FileItem[], navNames: string[]): FileItem[] {
  let cursor = files
  for (let i = 1; i < navNames.length; i++) {
    const found = cursor.find(f => f.name === navNames[i] && f.type === 'folder')
    if (found?.children) cursor = found.children
    else break
  }
  return cursor
}
