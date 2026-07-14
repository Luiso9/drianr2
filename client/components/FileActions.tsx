import IconCopy from './icons/IconCopy'
import IconDownload from './icons/IconDownload'

interface FileActionsProps {
  onCopy?: (e: React.MouseEvent) => void
  onDownload?: (e: React.MouseEvent) => void
}

export default function FileActions({ onCopy, onDownload }: FileActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        className="p-1 rounded-sm hover:bg-nord4 text-nord3 hover:text-nord10 transition-colors"
        title="Copy URL"
        onClick={onCopy}
      >
        <IconCopy />
      </button>
      <button
        className="p-1 rounded-sm hover:bg-nord4 text-nord3 hover:text-nord10 transition-colors"
        title="Download"
        onClick={onDownload}
      >
        <IconDownload />
      </button>
    </div>
  )
}
