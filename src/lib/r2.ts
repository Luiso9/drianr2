import type { FileItem, FileType } from '../../client/types'

const EXT_TYPE_MAP: Record<string, FileType> = {
  pdf: 'pdf',
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image', svg: 'image',
  mp4: 'video', webm: 'video', mov: 'video', mkv: 'video',
  mp3: 'audio', wav: 'audio', flac: 'audio', ogg: 'audio',
  js: 'code', ts: 'code', py: 'code', html: 'code', css: 'code', json: 'code', sh: 'code',
  txt: 'text', md: 'text',
  zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive',
  csv: 'data', xlsx: 'data', xls: 'data',
}

export function guessFileType(filename: string): FileType {
  const ext = filename.toLowerCase().split('.').pop() || ''
  return EXT_TYPE_MAP[ext] || 'unknown'
}

export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`
}

export async function listFolder(bucket: R2Bucket, prefix: string): Promise<FileItem[]> {
  const listed = await bucket.list({ prefix, delimiter: '/' })
  const items: FileItem[] = []

  for (const folderKey of listed.delimitedPrefixes ?? []) {
    const name = folderKey.slice(prefix.length).replace(/\/$/, '')
    const childCount = await countImmediateChildren(bucket, folderKey)
    items.push({ id: folderKey, name, type: 'folder', modified: '', path: folderKey, childCount })
  }

  for (const obj of listed.objects) {
    if (obj.key === prefix) continue
    if (obj.key.endsWith('/') && obj.size === 0) continue // skip "folder marker" objects
    const name = obj.key.slice(prefix.length)
    if (!name || name.includes('/')) continue

    items.push({
      id: obj.key,
      name,
      type: guessFileType(name),
      size: formatBytes(obj.size),
      modified: new Date(obj.uploaded).toLocaleString(),
      path: obj.key,
    })
  }

  return items
}

async function countImmediateChildren(bucket: R2Bucket, folderPrefix: string): Promise<number> {
  const listed = await bucket.list({ prefix: folderPrefix, delimiter: '/' })
  const subfolders = listed.delimitedPrefixes?.length ?? 0
  const files = listed.objects.filter(o => o.key !== folderPrefix).length
  return subfolders + files
}
