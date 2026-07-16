import type { FileItem } from '../../types'
import PreviewImage from './PreviewImage'
import PreviewPdf from './PreviewPdf'
import PreviewCode from './PreviewCode'
import PreviewText from './PreviewText'
import PreviewData from './PreviewData'
import PreviewVideo from './PreviewVideo'
import PreviewAudio from './PreviewAudio'
import IconFile from '../icons/IconFile'

interface PreviewContentProps {
  item: FileItem
}

export default function PreviewContent({ item }: PreviewContentProps) {
  switch (item.type) {
    case 'image': return <PreviewImage item={item} />
    case 'pdf':   return <PreviewPdf item={item} />
    case 'code':  return <PreviewCode item={item} />
    case 'text':  return <PreviewText item={item} />
    case 'data':  return <PreviewData item={item} />
    case 'video': return <PreviewVideo item={item} />
    case 'audio': return <PreviewAudio item={item} />
    default:
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-nord3 gap-2" style={{ minHeight: 0 }}>
          <IconFile type={item.type} />
          <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>No preview available</p>
        </div>
      )
  }
}
