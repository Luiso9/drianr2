import type { FileItem } from '../types'
import { getFileLabel, fileApiUrl } from '../utils'
import IconFolder from './icons/IconFolder'
import IconFile from './icons/IconFile'
import IconDownload from './icons/IconDownload'
import DeleteButton from './DeleteButton'

const MONO: CSSProperties = { fontFamily: "'JetBrains Mono', monospace" }

interface GridCardProps {
  item: FileItem
  onClick: () => void
  onDelete: (id: string) => void
}

export default function GridCard({ item, onClick, onDelete }: GridCardProps) {
  const isFolder = item.type === 'folder'

  return (
    <div
      className="group border border-nord4 bg-nord6 hover:bg-nord5 hover:border-nord9 transition-all duration-150 cursor-pointer p-4 rounded-sm relative"
      style={{ borderRadius: '3px' }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 bg-nord5 group-hover:bg-nord4 rounded-sm transition-colors" style={{ borderRadius: '2px' }}>
          {isFolder ? <IconFolder open={false} /> : <IconFile type={item.type} />}
        </div>

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isFolder && (
            <a
              className="p-1 rounded-sm hover:bg-nord4 text-nord3 hover:text-nord10 transition-colors"
              title="Download"
              href={fileApiUrl(item.path, true)}
              onClick={e => e.stopPropagation()}
            >
              <IconDownload />
            </a>
          )}
          <DeleteButton item={item} onDeleted={() => onDelete(item.id)} />
        </div>
      </div>

      <div
        className="text-sm font-medium text-nord1 truncate mb-1.5"
        style={isFolder ? { fontSize: '13px' } : { ...MONO, fontSize: '11.5px' }}
      >
        {item.name}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs px-1.5 py-0.5 bg-nord5 text-nord3 border border-nord4" style={{ borderRadius: '2px', fontSize: '10px', ...MONO }}>
          {getFileLabel(item.type)}
        </span>
        <span className="text-xs text-nord3 tabular-nums" style={{ ...MONO, fontSize: '11px' }}>
          {item.size ?? `${item.childCount ?? 0} items`}
        </span>
      </div>
    </div>
  )
}
