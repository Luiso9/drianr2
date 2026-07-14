import IconSearch from './icons/IconSearch'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="flex-1 max-w-sm relative">
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <IconSearch />
      </span>
      <input
        type="text"
        placeholder="Search files…"
        value={value}
        onChange={(e: Event) => onChange((e.currentTarget as HTMLInputElement).value)}
        className="w-full pl-8 pr-3 py-1.5 text-sm bg-nord5 border border-nord4 focus:border-nord9 focus:outline-none text-nord1 placeholder-nord3 transition-colors"
        style={{ borderRadius: '2px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}
      />
    </div>
  )
}
