import { useState } from 'hono/jsx/dom'
import type { FileItem } from '../types'
import { fileApiUrl } from '../utils'
import IconTrash from './icons/IconTrash'

interface DeleteButtonProps {
  item: FileItem
  onDeleted: () => void
}

export default function DeleteButton({ item, onDeleted }: DeleteButtonProps) {
  const [deleting, setDeleting] = useState(false)

  const handleClick = async (e: MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return

    setDeleting(true)
    try {
      const res = await fetch(fileApiUrl(item.path), { method: 'DELETE' })
      if (res.ok) onDeleted()
      else alert('Delete failed.')
    } catch {
      alert('Delete failed.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      className="p-1 rounded-sm hover:bg-nord11 hover:text-nord6 text-nord3 transition-colors disabled:opacity-50"
      style={{ borderRadius: '2px' }}
      title="Delete"
      onClick={handleClick}
      disabled={deleting}
    >
      <IconTrash />
    </button>
  )
}
