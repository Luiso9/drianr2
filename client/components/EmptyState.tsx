export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-nord3">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="mb-4 opacity-40">
        <circle cx="18" cy="18" r="12" stroke="#4C566A" strokeWidth="2"/>
        <path d="M27 27L35 35" stroke="#4C566A" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <p className="text-sm">No files match your search.</p>
    </div>
  )
}
