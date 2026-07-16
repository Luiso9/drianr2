import { useState, useEffect } from 'hono/jsx/dom'
import type { FileItem } from '../../types'
import { fileApiUrl } from '../../utils'
import type { CSSProperties } from 'hono/jsx'

const MONO: CSSProperties = { fontFamily: "'JetBrains Mono', monospace" }

export default function PreviewPdf({ item }: { item: FileItem }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const url = fileApiUrl(item.path)

  useEffect(() => {
    let cancelled = false
    setStatus('loading')
    fetch(url, { method: 'HEAD' })
      .then(res => { if (!cancelled) setStatus(res.ok ? 'ready' : 'error') })
      .catch(() => { if (!cancelled) setStatus('error') })
    return () => { cancelled = true }
  }, [url])

  if (status === 'error') {
    return (
      <div
        className="flex-1 flex items-center justify-center text-nord3 text-xs p-6 text-center"
        style={MONO}
      >
        Failed to load PDF.
      </div>
    )
  }

  if (status === 'ready') {
    return (
      <iframe
        src={url}
        className="w-full"
        style={{ border: 'none', height: '100%', flex: '1 1 auto' }}
        title={item.name}
      />
    )
  }

  return (
    <div className="flex-1 overflow-y-auto p-5 bg-nord5" style={{ minHeight: 0 }}>
      <div className="bg-nord6 border border-nord4 shadow-sm mx-auto max-w-sm p-6 space-y-4" style={{ borderRadius: '2px' }}>
        <div className="h-5 bg-nord4 rounded-sm" style={{ width: '70%' }} />
        <div className="h-3 bg-nord5 border border-nord4 rounded-sm" style={{ width: '100%' }} />
        <div className="space-y-2">
          {[100, 85, 92, 78, 95, 60, 88].map((w, i) => (
            <div key={i} className="h-2.5 bg-nord4 rounded-sm" style={{ width: `${w}%`, opacity: 0.6 + i * 0.04 }} />
          ))}
        </div>
        <div className="h-px bg-nord4 my-4" />
        <div className="space-y-2">
          {[90, 75, 82, 68].map((w, i) => (
            <div key={i} className="h-2.5 bg-nord4 rounded-sm" style={{ width: `${w}%`, opacity: 0.5 }} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2">
          {['Revenue', 'Growth', 'Users', 'Retention'].map((label, i) => (
            <div key={i} className="border border-nord4 p-3" style={{ borderRadius: '2px' }}>
              <div className="h-2 bg-nord9 rounded-sm mb-1.5" style={{ width: '40%', opacity: 0.5 }} />
              <div className="h-4 bg-nord4 rounded-sm" style={{ width: '60%' }} />
              <div className="text-xs text-nord3 mt-1" style={{ ...MONO, fontSize: '9px' }}>{label}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2 pt-1">
          {[88, 70, 80].map((w, i) => (
            <div key={i} className="h-2.5 bg-nord4 rounded-sm" style={{ width: `${w}%`, opacity: 0.5 }} />
          ))}
        </div>
      </div>
    </div>
  )
}
