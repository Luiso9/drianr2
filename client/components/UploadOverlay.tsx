import { useState, useEffect, useCallback } from 'hono/jsx/dom'

interface UploadOverlayProps {
  currentPrefix: string
  onUploaded: () => void
}

interface PendingUpload {
  files: File[]
  targetPrefix: string
  targetLabel: string
}

export default function UploadOverlay({ currentPrefix, onUploaded }: UploadOverlayProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [pending, setPending] = useState<PendingUpload | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let dragCounter = 0

    const onDragEnter = (e: DragEvent) => {
      e.preventDefault()
      dragCounter++
      if (e.dataTransfer?.types.includes('Files')) setIsDragging(true)
    }

    const onDragOver = (e: DragEvent) => {
      e.preventDefault()
    }

    const onDragLeave = (e: DragEvent) => {
      e.preventDefault()
      dragCounter--
      if (dragCounter <= 0) {
        dragCounter = 0
        setIsDragging(false)
      }
    }

    const onDrop = (e: DragEvent) => {
      e.preventDefault()
      dragCounter = 0
      setIsDragging(false)

      const files = Array.from(e.dataTransfer?.files ?? [])
      if (files.length === 0) return

      // Walk up from the drop point to find a folder card, if any
      const dropEl = (e.target as HTMLElement)?.closest('[data-drop-target]')
      const targetPrefix = dropEl?.getAttribute('data-drop-target') ?? currentPrefix
      const targetLabel = dropEl?.getAttribute('data-drop-label') ?? 'this folder'

      setPending({ files, targetPrefix, targetLabel })
    }

    window.addEventListener('dragenter', onDragEnter)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('drop', onDrop)

    return () => {
      window.removeEventListener('dragenter', onDragEnter)
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('dragleave', onDragLeave)
      window.removeEventListener('drop', onDrop)
    }
  }, [currentPrefix])

  const confirmUpload = useCallback(async () => {
    if (!pending) return
    setUploading(true)

    const totalBytes = pending.files.reduce((sum, f) => sum + f.size, 0)
    const uploadedByFile = pending.files.map(() => 0)

    const updateProgress = () => {
      const uploaded = uploadedByFile.reduce((a, b) => a + b, 0)
      setProgress(totalBytes > 0 ? Math.round((uploaded / totalBytes) * 100) : 0)
    }

    try {
      for (let i = 0; i < pending.files.length; i++) {
        const file = pending.files[i]

        const presignRes = await fetch('/api/upload-presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name,
            prefix: pending.targetPrefix,
            contentType: file.type || 'application/octet-stream',
          }),
        })

        if (!presignRes.ok) throw new Error('Failed to get upload URL')
        const signed = await presignRes.json<{ url: string; headers: Record<string, string> }>()

        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open('PUT', signed.url)
          for (const [k, v] of Object.entries(signed.headers)) xhr.setRequestHeader(k, v)
          xhr.upload.onprogress = (ev) => {
            if (!ev.lengthComputable) return
            uploadedByFile[i] = ev.loaded
            updateProgress()
          }
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              uploadedByFile[i] = file.size
              updateProgress()
              resolve()
            } else {
              reject(new Error(`Upload failed: ${xhr.status}`))
            }
          }
          xhr.onerror = () => reject(new Error('Network error during upload'))
          xhr.send(file)
        })
      }

      setPending(null)
      onUploaded()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }, [pending, onUploaded])

  return (
    <>
      {isDragging && !pending && (
        <div className="fixed inset-0 z-40 bg-nord0/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div
            className="border-2 border-dashed border-nord8 bg-nord1/80 px-8 py-6 text-nord6"
            style={{ borderRadius: '4px', fontFamily: "'JetBrains Mono', monospace" }}
          >
            Drop files to upload
          </div>
        </div>
      )}

      {pending && (
        <div className="fixed inset-0 z-50 bg-nord0/70 backdrop-blur-sm flex items-center justify-center">
          <div
            className="bg-nord6 w-full max-w-md p-6"
            style={{ borderRadius: '2px', fontFamily: "'JetBrains Mono', monospace" }}
          >
            <h2 className="text-sm font-medium text-nord1 mb-3">Confirm upload</h2>
            <p className="text-xs text-nord3 mb-4">
              Upload {pending.files.length} {pending.files.length === 1 ? 'file' : 'files'} to{' '}
              <span className="text-nord10 font-medium">{pending.targetLabel}</span>?
            </p>

            <ul className="text-xs text-nord2 mb-4 max-h-32 overflow-y-auto space-y-1">
              {pending.files.map((f, i) => (
                <li key={i} className="truncate">{f.name}</li>
              ))}
            </ul>

            {uploading && (
              <div className="mb-4">
                <div className="h-1.5 bg-nord4 rounded overflow-hidden">
                  <div
                    className="h-full bg-nord9 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-nord3 mt-1">{progress}%</p>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => !uploading && setPending(null)}
                disabled={uploading}
                className="px-3 py-1.5 text-xs text-nord3 border border-nord4 disabled:opacity-50"
                style={{ borderRadius: '2px' }}
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                disabled={uploading}
                className="px-3 py-1.5 text-xs bg-nord10 text-nord6 disabled:opacity-50"
                style={{ borderRadius: '2px' }}
              >
                {uploading ? 'Uploading…' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
