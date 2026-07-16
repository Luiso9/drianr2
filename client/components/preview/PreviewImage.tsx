import type { FileItem } from '../../types'
import { fileApiUrl } from '../../utils'

export default function PreviewImage({ item }: { item: FileItem}) {
  return (
    <div
      className="flex-1 flex items-center justify-center bg-nord5 overflow-hidden"
      style={{ minHeight: 0 }}
    >
      <img
        src={fileApiUrl(item.path)}
        alt={item.name}
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}
