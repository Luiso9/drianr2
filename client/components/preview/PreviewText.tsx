import type { FileItem } from '../../types'
import { useTextContent } from './useTextContent'

export default function PreviewText({ item }: { item: FileItem }) {
  const { content, error } = useTextContent(item.path)

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-nord11 text-sm p-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        Failed to load file.
      </div>
    )
  }

  if (content === null) {
    return (
      <div className="flex-1 flex items-center justify-center text-nord3 text-sm p-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        Loading…
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-5" style={{ minHeight: 0 }}>
      <pre
        className="text-nord1 leading-relaxed whitespace-pre-wrap text-sm"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}
      >
        {content}
      </pre>
    </div>
  )
}
