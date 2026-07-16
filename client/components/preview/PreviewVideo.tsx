import { useRef, useState, useEffect } from 'hono/jsx/dom'
import type { FileItem } from '../../types'
import { fileApiUrl } from '../../utils'
import IconPlay from '../icons/IconPlay'

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function PreviewVideo({ item }: { item: FileItem }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => setCurrentTime(video.currentTime)
    const onLoadedMetadata = () => setDuration(video.duration)
    const onEnded = () => setPlaying(false)

    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('ended', onEnded)

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      video.removeEventListener('ended', onEnded)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setPlaying(true)
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  const seek = (e: MouseEvent) => {
    const video = videoRef.current
    if (!video || !duration) return
    const bar = e.currentTarget as HTMLDivElement
    const rect = bar.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    video.currentTime = ratio * duration
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-nord0 gap-4 relative" style={{ minHeight: 0 }}>
      <video
        ref={videoRef}
        src={fileApiUrl(item.path)}
        className="max-w-full max-h-full absolute inset-0 w-full h-full object-contain"
        onClick={togglePlay}
      />

      {!playing && (
        <button
          onClick={togglePlay}
          className="relative z-10 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '50%', padding: '12px' }}
        >
          <IconPlay />
        </button>
      )}

      <div className="relative z-10 flex flex-col items-center gap-2 w-full px-6" style={{ marginTop: playing ? '0' : undefined }}>
        <div
          className="w-48 h-1 bg-nord2 rounded-full overflow-hidden cursor-pointer"
          onClick={seek}
        >
          <div className="h-full bg-nord9 rounded-full" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-nord3 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
    </div>
  )
}
