import type { FileItem } from '../types'
import GridCard from './GridCard'

interface GridViewProps {
  items: FileItem[]
  onNavigate: (item: FileItem) => void
  onDelete: (id: string) => void
}

export default function GridView({ items, onNavigate, onDelete }: GridViewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {items.map((item) => {
        const isFolder = item.type === 'folder'
        return (
          <div key={item.id} {...(isFolder ? { 'data-drop-target': item.path, 'data-drop-label': item.name } : {})}>
            <GridCard item={item} onClick={() => onNavigate(item)} onDelete={onDelete} />
          </div>
        )
      })}
    </div>
  )
}
