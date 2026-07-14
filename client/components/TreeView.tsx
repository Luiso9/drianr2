import type { FileItem } from '../../client/types'
import TreeNode from './TreeNode'
import IconBack from './icons/IconBack'

interface TreeViewProps {
  items: FileItem[]
  canGoUp: boolean
  onGoUp: () => void
}

export default function TreeView({ items, canGoUp, onGoUp }: TreeViewProps) {
  return (
    <div
      className="border border-nord4 bg-nord6 overflow-hidden"
      style={{ borderRadius: '3px' }}
    >
      <div
        className="hidden md:grid border-b border-nord4 bg-nord5 px-2 py-1.5 text-nord3 font-medium"
        style={{ gridTemplateColumns: '1fr 100px 120px 64px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px' }}
      >
        <span className="pl-10">Name</span>
        <span className="text-right">Size</span>
        <span className="text-right pr-16">Modified</span>
        <span />
      </div>

      <div>
        {canGoUp && (
          <div
            className="flex items-center gap-1.5 py-1 px-2 cursor-pointer hover:bg-nord5 transition-colors border-b border-nord4 text-sm text-nord3"
            onClick={onGoUp}
          >
            <span className="w-3" />
            <IconBack />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px' }}>..</span>
          </div>
        )}
        {items.map((item, idx) => (
          <div key={item.id} className={idx < items.length - 1 ? 'border-b border-nord4' : ''}>
            <TreeNode item={item} depth={0} />
          </div>
        ))}
      </div>
    </div>
  )
}
