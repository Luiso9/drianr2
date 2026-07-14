import type { CSSProperties } from "hono/jsx";
import type { FileItem } from "../../client/types";
import { getFileLabel } from "../../client/utils";
import { fileApiUrl } from "../../client/utils";
import IconFolder from "./icons/IconFolder";
import IconFile from "./icons/IconFile";
import FileActions from "./FileActions";

const MONO: CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
interface GridCardProps {
  item: FileItem;
  onClick?: () => void;
}

export default function GridCard({ item, onClick }: GridCardProps) {
  const isFolder = item.type === "folder";

  const handleClick = () => {
    if (isFolder) {
      onClick?.();
    } else {
      window.open(fileApiUrl(item.path), "_blank");
    }
  };

  return (
    <div
      className="group border border-nord4 bg-nord6 hover:bg-nord5 hover:border-nord9 transition-all duration-150 cursor-pointer p-4 rounded-sm relative"
      style={{ borderRadius: "3px" }}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="p-2 bg-nord5 group-hover:bg-nord4 rounded-sm transition-colors"
          style={{ borderRadius: "2px" }}
        >
          {isFolder ? (
            <IconFolder open={false} />
          ) : (
            <IconFile type={item.type} />
          )}
        </div>

        {!isFolder && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <FileActions
              onCopy={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(
                  window.location.origin + fileApiUrl(item.path),
                );
              }}
              onDownload={(e) => {
                e.stopPropagation();
                window.location.href = fileApiUrl(item.path, true);
              }}
            />
          </div>
        )}
      </div>

      <div
        className="text-sm font-medium text-nord1 truncate mb-1"
        style={
          isFolder ? { fontSize: "13px" } : { ...MONO, fontSize: "11.5px" }
        }
      >
        {item.name}
      </div>

      <div className="flex items-center justify-between">
        <span
          className="text-xs px-1.5 py-0.5 bg-nord5 text-nord3 rounded-sm border border-nord4"
          style={{ borderRadius: "2px", fontSize: "10px", ...MONO }}
        >
          {getFileLabel(item.type)}
        </span>
        <span
          className="text-xs text-nord3 tabular-nums"
          style={{ ...MONO, fontSize: "11px" }}
        >
          {item.size ?? `${item.children?.length ?? 0} items`}
        </span>
      </div>
      {/*
      <div className="mt-1.5 text-xs text-nord3" style={{ ...MONO, fontSize: '10px' }}>
        {item.modified}
      </div>*/}
    </div>
  );
}
