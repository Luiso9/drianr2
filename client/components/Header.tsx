import SearchInput from './SearchInput'
import ViewToggle from './ViewToggle'

type ViewMode = 'grid' | 'tree'

interface HeaderProps {
  bucketName: string
  search: string
  view: ViewMode
  onSearchChange: (value: string) => void
  onViewChange: (view: ViewMode) => void
}

function BucketLogo() {
  return (
    <div
      className="w-6 h-6 bg-nord10 flex items-center justify-center"
      style={{ borderRadius: '2px' }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M2 4C2 3 3 2 7 2s5 1 5 2v6c0 1-1 2-5 2S2 11 2 10V4z" fill="white" opacity="0.9"/>
        <ellipse cx="7" cy="4" rx="5" ry="1.5" fill="white"/>
      </svg>
    </div>
  )
}

export default function Header({ bucketName, search, view, onSearchChange, onViewChange }: HeaderProps) {
  return (
    <header className="border-b border-nord4 bg-nord6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-2">
              <BucketLogo />
              <span className="font-semibold text-nord0 text-sm tracking-tight">R2 Viewer</span>
            </div>
            <span className="text-nord4 hidden sm:block">·</span>
            <span
              className="text-sm text-nord3 hidden sm:block"
              style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11.5px' }}
            >
              {bucketName}
            </span>
          </div>

          <SearchInput value={search} onChange={onSearchChange} />
          <ViewToggle view={view} onChange={onViewChange} />
        </div>
      </div>
    </header>
  )
}
