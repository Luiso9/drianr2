import { useState, useEffect } from 'hono/jsx/dom'
import { fileApiUrl } from '../../utils'

export function useTextContent(path: string) {
  const [content, setContent] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setContent(null)
    setError(false)

    fetch(fileApiUrl(path))
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.text()
      })
      .then(text => {
        if (!cancelled) setContent(text)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })

    return () => {
      cancelled = true
    }
  }, [path])

  return { content, error }
}
