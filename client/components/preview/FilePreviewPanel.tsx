import type { FileItem } from "../../types";
import IconFile from "../icons/IconFile";
import IconClose from "../icons/IconClose";
import PreviewContent from "./PreviewContent";
import PreviewMeta from "./PreviewMeta";
import PreviewActions from "./PreviewActions";

interface FilePreviewPanelProps {
  item: FileItem;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function FilePreviewPanel({
  item,
  onClose,
  onDelete,
}: FilePreviewPanelProps) {
  return (
    <div
      className="flex flex-col border-l border-nord4 bg-nord6"
      style={{ width: "340px", minWidth: "340px", height: "100%" }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-nord4 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex-shrink-0">
            <IconFile type={item.type} />
          </span>
          <span
            className="text-sm text-nord1 font-medium truncate"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px",
            }}
          >
            {item.name}
          </span>
        </div>
        <button
          className="p-1 text-nord3 hover:text-nord1 hover:bg-nord5 rounded-sm transition-colors flex-shrink-0 ml-2"
          style={{ borderRadius: "2px" }}
          onClick={onClose}
        >
          <IconClose />
        </button>
      </div>

      <div
        className="flex-1 overflow-hidden flex flex-col"
        style={{ minHeight: 0 }}
      >
        <PreviewContent item={item} />
      </div>

      <div className="border-t border-nord4 px-4 py-4 flex-shrink-0 space-y-4">
        <PreviewMeta item={item} />
        <PreviewActions
          item={item}
          onDelete={() => {
            onDelete(item.id);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
