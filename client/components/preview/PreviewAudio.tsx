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

  const seek = (e: Event) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const slider = e.currentTarget as HTMLInputElement
    audio.currentTime = Number(slider.value)
  }

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

      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        step={0.01}
        onInput={seek}
        className="w-64 cursor-pointer accent-nord10"
        disabled={!duration}
      />

      <div className="text-nord3 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px' }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  )
}
