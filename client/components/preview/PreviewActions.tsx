import type { FileItem } from "../../types";
import { fileApiUrl } from "../../utils";

import { useState } from "hono/jsx/dom";
import IconCopy from "../icons/IconCopy";
import IconDownload from "../icons/IconDownload";
import IconTrash from "../icons/IconTrash";
import type { CSSProperties } from "hono/jsx";
import DeleteButton from "../DeleteButton";

const MONO: CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "10px",
};

interface PreviewActionsProps {
  item: FileItem;
  onDelete: () => void;
}

export default function PreviewActions({
  item,
  onDelete,
}: PreviewActionsProps) {
  const [confirm, setConfirm] = useState(false);

  const handleDelete = () => {
    if (confirm) onDelete();
    else setConfirm(true);
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <button
          className="flex items-center justify-center gap-1.5 px-2 py-2 border border-nord4 text-nord3 hover:text-nord1 hover:bg-nord5 transition-colors text-xs"
          style={{ borderRadius: "2px", ...MONO }}
          onClick={() =>
            navigator.clipboard.writeText(
              window.location.origin + fileApiUrl(item.path),
            )
          }
        >
          <IconCopy />
          Copy URL
        </button>
        <a
          className="flex items-center justify-center gap-1.5 px-2 py-2 border border-nord4 text-nord3 hover:text-nord1 hover:bg-nord5 transition-colors text-xs"
          style={{ borderRadius: "2px", ...MONO }}
          href={fileApiUrl(item.path, true)}
        >
          <IconDownload />
          Download
        </a>
        <DeleteButton item={item} onDeleted={onDelete} />
      </div>
    </div>
  );
}
