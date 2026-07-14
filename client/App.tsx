import { useState, useEffect, useCallback } from "hono/jsx/dom";
import UploadOverlay from './components/UploadOverlay'
import type { FileItem } from "./types";
import Header from "./components/Header";
import Subheader from "./components/Subheader";
import Footer from "./components/Footer";
import GridView from "./components/GridView";
import TreeView from "./components/TreeView";
import EmptyState from "./components/EmptyState";

type ViewMode = "grid" | "tree";

const BUCKET_NAME = "EMBER DRIAN";
const REGION = "auto"; // R2 doesn't have regions like S3, kept for Footer's display

interface NavEntry {
  name: string;
  prefix: string;
}

export default function App() {
  const [view, setView] = useState<ViewMode>("grid");
  const [search, setSearch] = useState("");
  const [navStack, setNavStack] = useState<NavEntry[]>([{ name: BUCKET_NAME, prefix: "" }]);
  const [items, setItems] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);

  const currentFolder = navStack[navStack.length - 1];

  const loadFolder = useCallback(async (prefix: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/list?prefix=${encodeURIComponent(prefix)}`);

      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }

      const data = await res.json();
      setItems(data.items ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFolder(currentFolder.prefix);
  }, [currentFolder.prefix]);

  const displayItems = search.trim()
    ? items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    : items;

  const navigateInto = (item: FileItem) => {
    if (item.type === "folder") {
      setNavStack((s) => [...s, { name: item.name, prefix: item.path }]);
      setSearch("");
    }
  };

  const navigateTo = (index: number) => {
    setNavStack((s) => s.slice(0, index + 1));
    setSearch("");
  };

  const fileCount = displayItems.filter((i) => i.type !== "folder").length;
  const folderCount = displayItems.filter((i) => i.type === "folder").length;

  return (
    <div className="min-h-screen bg-nord6 flex flex-col">
      <Header
        bucketName={BUCKET_NAME}
        search={search}
        view={view}
        onSearchChange={setSearch}
        onViewChange={setView}
      />

      <Subheader
        breadcrumbPath={navStack.map((s) => s.name)}
        fileCount={fileCount}
        folderCount={folderCount}
        onNavigate={navigateTo}
      />

      <UploadOverlay
        currentPrefix={currentFolder.prefix}
        onUploaded={() => loadFolder(currentFolder.prefix)}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6">
        {loading ? (
          <div className="text-center py-12 text-nord3">Loading...</div>
        ) : displayItems.length === 0 ? (
          <EmptyState />
        ) : view === "grid" ? (
          <GridView items={displayItems} onNavigate={navigateInto} />
        ) : (
          <TreeView
            items={displayItems}
            canGoUp={navStack.length > 1}
            onGoUp={() => navigateTo(navStack.length - 2)}
          />
        )}
      </main>

      <Footer bucketName={BUCKET_NAME} region={REGION} />
    </div>
  );
}
