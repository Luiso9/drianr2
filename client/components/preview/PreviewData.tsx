import type { FileItem } from '../../types'
import { useTextContent } from './useTextContent'

export default function PreviewData({ item }: { item: FileItem }) {
  const { content, error } = useTextContent(item.path)

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center text-nord11 text-xs p-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        Failed to load file.
      </div>
    )
  }

  if (content === null) {
    return (
      <div className="flex-1 flex items-center justify-center text-nord3 text-xs p-6" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        Loading…
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-4 bg-nord0" style={{ minHeight: 0 }}>
      <pre className="text-nord14 leading-relaxed" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11.5px' }}>
        <code>{content}</code>
      </pre>
    </div>
  )
}
