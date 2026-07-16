import { useState, useEffect, useCallback } from 'hono/jsx/dom'
import type { FileItem } from './types'
import UploadOverlay from './components/UploadOverlay'
import Header from './components/Header'
import Subheader from './components/Subheader'
import Footer from './components/Footer'
import GridView from './components/GridView'
import TreeView from './components/TreeView'
import EmptyState from './components/EmptyState'
import FilePreviewPanel from './components/preview/FilePreviewPanel'
import type { ViewMode } from './components/ViewToggle'

const BUCKET_NAME = 'EMBER DRIAN'
const REGION = 'auto'

interface NavEntry {
  name: string
  prefix: string
}

export default function App() {
  const [view, setView] = useState<ViewMode>('grid')
  const [search, setSearch] = useState('')
  const [navStack, setNavStack] = useState<NavEntry[]>([{ name: BUCKET_NAME, prefix: '' }])
  const [items, setItems] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [previewItem, setPreviewItem] = useState<FileItem | null>(null)

  const currentFolder = navStack[navStack.length - 1]

  const loadFolder = useCallback(async (prefix: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/list?prefix=${encodeURIComponent(prefix)}`)
      if (res.status === 401) {
        window.location.href = '/login'
        return
      }
      const data = await res.json<{ items: FileItem[] }>()
      setItems(data.items ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFolder(currentFolder.prefix)
  }, [currentFolder.prefix])

  const displayItems = search.trim()
    ? items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
    : items

  // Single handler for GridView: folders navigate in, files open the preview panel
  const navigateInto = (item: FileItem) => {
    if (item.type === 'folder') {
      setNavStack(s => [...s, { name: item.name, prefix: item.path }])
      setSearch('')
      setPreviewItem(null)
    } else {
      setPreviewItem(item)
    }
  }

  const navigateTo = (index: number) => {
    setNavStack(s => s.slice(0, index + 1))
    setSearch('')
    setPreviewItem(null)
  }

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
    if (previewItem?.id === id) setPreviewItem(null)
  }

  const fileCount = displayItems.filter(i => i.type !== 'folder').length
  const folderCount = displayItems.filter(i => i.type === 'folder').length

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
        breadcrumbPath={navStack.map(e => e.name)}
        fileCount={fileCount}
        folderCount={folderCount}
        onNavigate={navigateTo}
      />

      <UploadOverlay
        currentPrefix={currentFolder.prefix}
        onUploaded={() => loadFolder(currentFolder.prefix)}
      />

      <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <main className="flex-1 overflow-auto px-4 sm:px-6 py-6" style={{ minWidth: 0 }}>
          {loading ? (
            <div className="text-center py-12 text-nord3">Loading...</div>
          ) : displayItems.length === 0 ? (
            <EmptyState />
          ) : view === 'grid' ? (
            <GridView items={displayItems} onNavigate={navigateInto} onDelete={handleDelete} />
          ) : (
            <TreeView
              items={displayItems}
              canGoUp={navStack.length > 1}
              onGoUp={() => navigateTo(navStack.length - 2)}
              onPreview={setPreviewItem}
              onDelete={handleDelete}
            />
          )}
        </main>

        {previewItem && (
          <div className="hidden sm:flex flex-shrink-0" style={{ height: '100%' }}>
            <FilePreviewPanel
              item={previewItem}
              onClose={() => setPreviewItem(null)}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>

      <Footer bucketName={BUCKET_NAME} region={REGION} />
    </div>
  )
}
