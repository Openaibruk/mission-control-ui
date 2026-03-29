import React, { useState, useEffect } from 'react';
import { Folder, FolderOpen, File, FileText, ChevronRight, ChevronDown, Plus, Trash2, Edit2, RefreshCw, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';

interface FileNode {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  lastModified: string;
}

interface WorkspaceViewProps {
  theme?: 'dark' | 'light';
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function WorkspaceView({ theme = 'dark' }: WorkspaceViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  
  const [currentPath, setCurrentPath] = useState('');
  const [items, setItems] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [treeLoading, setTreeLoading] = useState(false);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create_folder' | 'create_file' | 'rename'>('create_folder');
  const [modalInput, setModalInput] = useState('');
  const [selectedItemPath, setSelectedItemPath] = useState('');

  const fetchFolder = async (dirPath: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/workspace?path=${encodeURIComponent(dirPath)}`);
      if (res.ok) {
        const data = await res.json();
        const sorted = (data.items || []).sort((a: FileNode, b: FileNode) => {
          if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
          return a.isDirectory ? -1 : 1;
        });
        setItems(sorted);
        setCurrentPath(dirPath);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolder('');
  }, []);

  const handleCreate = async () => {
    if (!modalInput.trim()) return;
    const type = modalMode === 'create_folder' ? 'directory' : 'file';
    const targetPath = currentPath ? `${currentPath}/${modalInput}` : modalInput;
    
    try {
      await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: targetPath, type })
      });
      setIsModalOpen(false);
      fetchFolder(currentPath);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRename = async () => {
    if (!modalInput.trim() || !selectedItemPath) return;
    const newPath = currentPath ? `${currentPath}/${modalInput}` : modalInput;
    try {
      await fetch('/api/workspace', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPath: selectedItemPath, newPath })
      });
      setIsModalOpen(false);
      fetchFolder(currentPath);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (path: string) => {
    if (!confirm(`Are you sure you want to delete ${path}?`)) return;
    try {
      await fetch(`/api/workspace?path=${encodeURIComponent(path)}`, { method: 'DELETE' });
      fetchFolder(currentPath);
    } catch (e) {
      console.error(e);
    }
  };

  const openModal = (mode: 'create_folder' | 'create_file' | 'rename', oldPath?: string, oldName?: string) => {
    setModalMode(mode);
    setModalInput(oldName || '');
    if (oldPath) setSelectedItemPath(oldPath);
    setIsModalOpen(true);
  };

  const breadcrumbs = currentPath.split('/').filter(Boolean);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className={cn("flex-none p-4 md:p-6 border-b flex justify-between items-center", classes.divider)}>
        <div>
          <h1 className={cn("text-2xl font-bold flex items-center gap-2", classes.heading)}>
            <Box className="w-6 h-6 text-emerald-500" />
            Workspace
          </h1>
          <p className={cn("text-sm mt-1", classes.subtle)}>Manage server filesystem.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openModal('create_folder')} className={cn("px-3 py-1.5 text-xs font-medium rounded border transition-colors flex items-center gap-1", isDark ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50")}>
            <Folder className="w-3.5 h-3.5" /> New Folder
          </button>
          <button onClick={() => openModal('create_file')} className={cn("px-3 py-1.5 text-xs font-medium rounded border transition-colors flex items-center gap-1", isDark ? "border-violet-500/30 text-violet-400 hover:bg-violet-500/10" : "border-violet-200 text-violet-600 hover:bg-violet-50")}>
            <FileText className="w-3.5 h-3.5" /> New File
          </button>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className={cn("px-4 py-2 flex items-center gap-2 text-sm border-b overflow-x-auto", classes.divider, classes.muted)}>
        <button onClick={() => fetchFolder('')} className="hover:text-emerald-500 transition-colors font-medium flex items-center gap-1">
          <Box className="w-4 h-4" /> Root
        </button>
        {breadcrumbs.map((crumb, idx) => {
          const pathSoFar = breadcrumbs.slice(0, idx + 1).join('/');
          return (
            <React.Fragment key={pathSoFar}>
              <ChevronRight className="w-4 h-4 opacity-50" />
              <button onClick={() => fetchFolder(pathSoFar)} className="hover:text-emerald-500 transition-colors font-medium">
                {crumb}
              </button>
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left Pane: Simple Tree (Just shows current context for now) */}
        <div className={cn("hidden md:block w-64 p-4 border-r overflow-y-auto custom-scroll", classes.divider)}>
          <div className={cn("text-xs font-semibold uppercase tracking-wider mb-4", classes.muted)}>Workspace Structure</div>
          <div className="space-y-1">
            <button onClick={() => fetchFolder('')} className={cn("w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded transition-colors", currentPath === '' ? (isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700") : (isDark ? "hover:bg-white/5" : "hover:bg-neutral-100"), classes.heading)}>
              <Box className="w-4 h-4 text-emerald-500" /> Root
            </button>
            {breadcrumbs.map((crumb, idx) => {
              const p = breadcrumbs.slice(0, idx + 1).join('/');
              return (
                <div key={p} className="flex flex-col">
                  <button onClick={() => fetchFolder(p)} className={cn("w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded transition-colors", currentPath === p ? (isDark ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-50 text-emerald-700") : (isDark ? "hover:bg-white/5" : "hover:bg-neutral-100"), classes.heading)} style={{ paddingLeft: `${(idx + 1) * 12 + 8}px` }}>
                    {currentPath === p ? <FolderOpen className="w-4 h-4 text-amber-500" /> : <Folder className="w-4 h-4 text-amber-500" />} {crumb}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Pane: Explorer */}
        <div className="flex-1 overflow-auto custom-scroll p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-emerald-500">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className={cn("flex flex-col items-center justify-center h-64 text-center", classes.subtle)}>
              <FolderOpen className="w-12 h-12 mb-4 opacity-20" />
              <p>This folder is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((item) => (
                <div key={item.path} className={cn("flex flex-col p-3 rounded-lg border transition-colors group relative", isDark ? "bg-[#0f172a] border-white/10 hover:border-emerald-500/50" : "bg-white border-neutral-200 hover:border-emerald-500")}>
                  <div className="flex items-start gap-3 mb-2 cursor-pointer" onClick={() => item.isDirectory ? fetchFolder(item.path) : null}>
                    {item.isDirectory ? <Folder className="w-8 h-8 text-amber-500 shrink-0" /> : <File className="w-8 h-8 text-neutral-400 shrink-0" />}
                    <div className="truncate flex-1">
                      <div className={cn("text-sm font-medium truncate", classes.heading)} title={item.name}>{item.name}</div>
                      <div className={cn("text-[10px]", classes.subtle)}>{item.isDirectory ? 'Folder' : formatBytes(item.size)}</div>
                    </div>
                  </div>
                  
                  {/* Actions overlay */}
                  <div className={cn("absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity")}>
                    <button onClick={() => openModal('rename', item.path, item.name)} className={cn("p-1.5 rounded transition-colors", isDark ? "bg-[#1e293b] hover:bg-emerald-500/20 text-emerald-400" : "bg-neutral-100 hover:bg-emerald-100 text-emerald-600")} title="Rename">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.path)} className={cn("p-1.5 rounded transition-colors", isDark ? "bg-[#1e293b] hover:bg-red-500/20 text-red-400" : "bg-neutral-100 hover:bg-red-100 text-red-600")} title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Rename */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={cn("w-full max-w-sm p-5 rounded-xl border shadow-xl", isDark ? "bg-[#0f172a] border-white/10" : "bg-white border-neutral-200")}>
            <h3 className={cn("text-lg font-semibold mb-4", classes.heading)}>
              {modalMode === 'create_folder' ? 'Create Folder' : modalMode === 'create_file' ? 'Create File' : 'Rename Item'}
            </h3>
            <input
              type="text"
              autoFocus
              value={modalInput}
              onChange={(e) => setModalInput(e.target.value)}
              placeholder={modalMode === 'rename' ? 'New name' : 'Enter name...'}
              className={cn("w-full px-3 py-2 text-sm rounded-md border focus:outline-none mb-4", isDark ? "bg-[#1e293b] border-white/10 text-white focus:border-emerald-500" : "bg-neutral-50 border-neutral-200 text-neutral-900 focus:border-emerald-500")}
              onKeyDown={(e) => { if (e.key === 'Enter') { modalMode === 'rename' ? handleRename() : handleCreate(); } }}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className={cn("px-4 py-2 text-sm font-medium rounded-md", isDark ? "hover:bg-white/5 text-neutral-300" : "hover:bg-neutral-100 text-neutral-600")}>
                Cancel
              </button>
              <button onClick={modalMode === 'rename' ? handleRename : handleCreate} className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
