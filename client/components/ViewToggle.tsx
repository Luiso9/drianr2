import IconGrid from './icons/IconGrid'
import IconTree from './icons/IconTree'

export type ViewMode = 'grid' | 'tree'

interface ViewToggleProps {
  view: ViewMode
  onChange: (view: ViewMode) => void
}


export default function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div
      className="flex items-center border border-nord4 overflow-hidden flex-shrink-0"
      style={{ borderRadius: '2px' }}
    >
      <button
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors ${view === 'grid' ? 'bg-nord0 text-nord6' : 'bg-nord6 text-nord3 hover:bg-nord5 hover:text-nord1'}`}
        onClick={() => onChange('grid')}
      >
        <IconGrid />
        <span className="hidden sm:block">Grid</span>
      </button>
      <div className="w-px self-stretch bg-nord4" />
      <button
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors ${view === 'tree' ? 'bg-nord0 text-nord6' : 'bg-nord6 text-nord3 hover:bg-nord5 hover:text-nord1'}`}
        onClick={() => onChange('tree')}
      >
        <IconTree />
        <span className="hidden sm:block">Tree</span>
      </button>
    </div>
  )
}
