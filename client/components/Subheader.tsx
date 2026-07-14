import Breadcrumb from './Breadcrumb'

interface SubheaderProps {
  breadcrumbPath: string[]
  fileCount: number
  folderCount: number
  onNavigate: (index: number) => void
}

export default function Subheader({ breadcrumbPath, fileCount, folderCount, onNavigate }: SubheaderProps) {
  return (
    <div className="border-b border-nord4 bg-nord5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        <Breadcrumb path={breadcrumbPath} onNavigate={onNavigate} />
        <div
          className="flex items-center gap-1 flex-shrink-0 text-nord3"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
        >
          {folderCount > 0 && <span>{folderCount} folder{folderCount !== 1 ? 's' : ''}</span>}
          {folderCount > 0 && fileCount > 0 && <span className="mx-1 text-nord4">·</span>}
          {fileCount > 0 && <span>{fileCount} file{fileCount !== 1 ? 's' : ''}</span>}
        </div>
      </div>
    </div>
  )
}
