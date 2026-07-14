interface FooterProps {
  bucketName: string
  region: string
}

export default function Footer({ bucketName, region }: FooterProps) {
  return (
    <footer className="border-t border-nord4 bg-nord5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <span
          className="text-xs text-nord3"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
        >
          Cloudflare R2 · {bucketName} · {region}
        </span>
        <span
          className="text-xs text-nord3"
          style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
        >
          r2viewer
        </span>
      </div>
    </footer>
  )
}
