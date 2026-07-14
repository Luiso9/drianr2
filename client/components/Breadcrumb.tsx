interface BreadcrumbProps {
  path: string[]
  onNavigate: (index: number) => void
}

export default function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  return (
    <div
      className="flex items-center gap-1 text-sm text-nord3 flex-wrap"
      style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}
    >
      {path.map((segment, idx) => (
        <span key={idx} className="flex items-center gap-1">
          {idx > 0 && <span className="text-nord4">/</span>}
          <button
            className={`hover:text-nord10 transition-colors ${idx === path.length - 1 ? 'text-nord1 font-medium' : 'text-nord3'}`}
            onClick={() => onNavigate(idx)}
          >
            {segment}
          </button>
        </span>
      ))}
    </div>
  )
}
