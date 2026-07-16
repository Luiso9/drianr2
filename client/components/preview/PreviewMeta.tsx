import type { FileItem } from "../../types";
import { getFileLabel } from "../../utils";

export default function PreviewMeta({ item }: { item: FileItem }) {
  return (
    <div
      className="space-y-1.5 text-xs"
      style={{ fontFamily: "'JetBrains Mono', monospace" }}
    >
      <Row label="Type" value={getFileLabel(item.type)} />
      {item.size && <Row label="Size" value={item.size} />}
      <Row label="Modified" value={item.modified} />
      <Row label="Path" value={item.path} truncate />
    </div>
  );
}

function Row({
  label,
  value,
  truncate,
}: {
  label: string;
  value: string;
  truncate?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3 items-start">
      <span className="text-nord3 flex-shrink-0">{label}</span>
      <span
        className={`text-nord1 text-right ${truncate ? "truncate" : ""}`}
        title={truncate ? value : undefined}
      >
        {value}
      </span>
    </div>
  );
}
