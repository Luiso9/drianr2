import { useState, useCallback } from 'hono/jsx/dom'
import type { CSSProperties } from 'hono/jsx'
import type { FileItem } from '../types'
import { fileApiUrl } from '../utils'
import IconFolder from './icons/IconFolder'
import IconFile from './icons/IconFile'
import IconChevron from './icons/IconChevron'
import IconCopy from './icons/IconCopy'
import IconDownload from './icons/IconDownload'
import DeleteButton from './DeleteButton'

const MONO: CSSProperties = { fontFamily: "'JetBrains Mono', monospace" }

interface TreeNodeProps {
  item: FileItem
  depth?: number
  onPreview: (item: FileItem) => void
  onDelete: (id: string) => void
}

export default function TreeNode({ item, depth = 0, onPreview, onDelete }: TreeNodeProps) {
  const [open, setOpen] = useState(false)
  const [children, setChildren] = useState<FileItem[] | null>(null)
  const [loading, setLoading] = useState(false)

  const isFolder = item.type === 'folder'
  const indent = depth * 16

  const toggle = useCallback(async () => {
    if (!isFolder) return
    if (!open && children === null) {
      setLoading(true)
      try {
        const res = await fetch(`/api/list?prefix=${encodeURIComponent(item.path)}`)
        if (res.status === 401) {
          window.location.href = '/login'
          return
        }
        const data = await res.json<{ items: FileItem[] }>()
        setChildren(data.items ?? [])
      } catch {
        setChildren([])
      } finally {
        setLoading(false)
      }
    }
    setOpen(o => !o)
  }, [isFolder, open, children, item.path])

  const handleRowClick = () => {
    if (isFolder) toggle()
    else onPreview(item)
  }

  return (
    <div>
      <div
        className="group flex items-center gap-1.5 py-1 px-2 cursor-pointer transition-colors duration-100 hover:bg-nord5 select-none"
        style={{ paddingLeft: `${8 + indent}px` }}
        onClick={handleRowClick}
      >
        <span className="w-3 flex items-center justify-center flex-shrink-0">
          {isFolder && <IconChevron open={open} />}
        </span>

        <span className="flex-shrink-0">
          {isFolder ? <IconFolder open={open} /> : <IconFile type={item.type} />}
        </span>

        <span
          className="flex-1 text-sm text-nord1 truncate min-w-0"
          style={!isFolder ? { ...MONO, fontSize: '12px' } : { fontSize: '13px' }}
        >
          {item.name}
        </span>

        <span className="text-xs text-nord3 flex-shrink-0 tabular-nums opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
          {item.size ?? `${item.childCount ?? 0} items`}
        </span>

        <span className="text-xs text-nord3 flex-shrink-0 tabular-nums hidden md:block" style={{ ...MONO, fontSize: '11px' }}>
          {item.modified}
        </span>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          {!isFolder && (
            <>
              <button
                className="p-1 rounded-sm hover:bg-nord4 text-nord3 hover:text-nord10 transition-colors"
                title="Copy URL"
                onClick={e => {
                  e.stopPropagation()
                  navigator.clipboard.writeText(window.location.origin + fileApiUrl(item.path))
                }}
              >
                <IconCopy />
              </button>
              <a
                className="p-1 rounded-sm hover:bg-nord4 text-nord3 hover:text-nord10 transition-colors"
                title="Download"
                href={fileApiUrl(item.path, true)}
                onClick={e => e.stopPropagation()}
              >
                <IconDownload />
              </a>
            </>
          )}
          <DeleteButton item={item} onDeleted={() => onDelete(item.id)} />
        </div>
      </div>

      {open && isFolder && (
        <div style={{ borderLeft: '1px solid #D8DEE9', marginLeft: `${8 + indent + 11}px` }}>
          {loading && (
            <div className="text-xs text-nord3 py-1" style={{ ...MONO, paddingLeft: '8px' }}>Loading…</div>
          )}
          {!loading && children?.length === 0 && (
            <div className="text-xs text-nord3 py-1 italic" style={{ ...MONO, paddingLeft: '8px' }}>Empty folder</div>
          )}
          {!loading && children?.map(child => (
            <TreeNode
              key={child.id}
              item={child}
              depth={depth + 1}
              onPreview={onPreview}
              onDelete={(id) => setChildren(c => c?.filter(x => x.id !== id) ?? null)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
