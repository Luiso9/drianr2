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

const BAR_COUNT = 40

const BAR_HEIGHTS = Array.from(
  { length: BAR_COUNT },
  (_, i) => 20 + Math.sin(i * 0.6) * 12 + Math.sin(i * 1.3) * 8
)

export default function PreviewAudio({ item }: { item: FileItem }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => setPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.play()
      setPlaying(true)
    } else {
      audio.pause()
      setPlaying(false)
    }
  }

  const seek = (e: MouseEvent) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const bar = e.currentTarget as HTMLDivElement
    const rect = bar.getBoundingClientRect()
    const ratio = (e.clientX - rect.left) / rect.width
    audio.currentTime = ratio * duration
  }

  const progress = duration > 0 ? currentTime / duration : 0

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-nord5 gap-5" style={{ minHeight: 0 }}>
      <audio ref={audioRef} src={fileApiUrl(item.path)} />

      <button
        onClick={togglePlay}
        className="flex items-center justify-center"
        style={{ background: '#5E81AC', borderRadius: '50%', padding: '10px' }}
      >
        <IconPlay />
      </button>

      <div className="relative flex items-end gap-0.5 h-16 cursor-pointer" onClick={seek}>
        <div className="flex items-end gap-0.5 h-16">
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="w-1.5"
              style={{ height: `${h}px`, background: '#D8DEE9', borderRadius: '1px' }}
            />
          ))}
        </div>

        <div
          className="absolute inset-0 flex items-end gap-0.5 h-16 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - progress * 100}% 0 0)` }}
        >
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="w-1.5"
              style={{ height: `${h}px`, background: '#81A1C1', borderRadius: '1px' }}
            />
          ))}
        </div>
      </div>

      <div className="w-48 h-1 bg-nord4 rounded-full overflow-hidden cursor-pointer" onClick={seek}>
        <div className="h-full bg-nord10 rounded-full" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="text-nord3 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  )
}
