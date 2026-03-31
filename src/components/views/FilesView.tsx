import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, FileText, FileJson, File, X, RefreshCw, Eye, HardDrive, Filter, Clock, ExternalLink, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';

interface FileItem {
  name: string;
  path: string;
  size: number;
  lastModified: string;
  isDirectory: boolean;
}

interface FilesViewProps {
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

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase();
  if (['json'].includes(ext || '')) return <FileJson className="w-4 h-4 text-emerald-500" />;
  if (['md', 'txt', 'csv'].includes(ext || '')) return <FileText className="w-4 h-4 text-blue-500" />;
  return <File className="w-4 h-4 text-neutral-400" />;
}

export function FilesView({ theme = 'dark' }: FilesViewProps) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [previewContent, setPreviewContent] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Deliverables state
  interface DeliverableItem { name: string; url: string; type: string; size: string; driveId?: string; project: string; status: string }
  const [deliverables, setDeliverables] = useState<DeliverableItem[]>([]);
  const [loadingDeliverables, setLoadingDeliverables] = useState(true);
  const [showDeliverablesView, setShowDeliverablesView] = useState(false);

  // Fetch deliverables on mount
  useEffect(() => {
    fetch('/api/deliverables')
      .then(res => res.json())
      .then(data => { setDeliverables(data.files || []); setLoadingDeliverables(false); })
      .catch(() => setLoadingDeliverables(false));
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/workspace/search');
      if (!res.ok) throw new Error('Failed to fetch files');
      const data = await res.json();
      setFiles(data.items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSelectFile = async (file: FileItem) => {
    setSelectedFile(file);
    setPreviewContent(null);
    
    // Only preview text-like files
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['md', 'txt', 'json', 'csv', 'js', 'ts', 'tsx', 'py'].includes(ext || '')) {
      setPreviewContent('Preview not available for this file type.');
      return;
    }

    setPreviewLoading(true);
    try {
      const res = await fetch(`/api/files?path=${encodeURIComponent(file.path)}`);
      if (!res.ok) throw new Error('Preview failed');
      const text = await res.text();
      setPreviewContent(text);
    } catch (err) {
      setPreviewContent('Failed to load preview.');
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleDownload = (file: FileItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(`/api/files?action=download&path=${encodeURIComponent(file.path)}`, '_blank');
  };

  const filteredFiles = useMemo(() => {
    return files
      .filter(f => f.name.toLowerCase().includes(search.toLowerCase()) || f.path.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime());
  }, [files, search]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className={cn("flex-none p-4 md:p-6 border-b", classes.divider)}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className={cn("text-2xl font-bold flex items-center gap-2", classes.heading)}>
              <HardDrive className="w-6 h-6 text-violet-500" />
              Agent Files
            </h1>
            <p className={cn("text-sm mt-1", classes.subtle)}>All outputs, logs, and workspace assets.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", classes.muted)} />
              <input
                type="text"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  "w-full pl-9 pr-4 py-2 text-sm rounded-md border focus:outline-none transition-colors",
                  isDark ? "bg-[#0f172a] border-white/10 text-white focus:border-violet-500/50" 
                         : "bg-white border-neutral-200 text-neutral-900 focus:border-violet-500"
                )}
              />
            </div>
            <button
              onClick={fetchFiles}
              className={cn(
                "p-2 rounded-md transition-colors",
                isDark ? "hover:bg-white/5 text-neutral-400" : "hover:bg-neutral-100 text-neutral-500"
              )}
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        <div className={cn("flex-1 overflow-auto custom-scroll p-4", selectedFile && "hidden md:block md:w-2/3 border-r", classes.divider)}>
          {/* Deliverables Section */}
          <div className={cn("mb-6 p-4 rounded-xl border", isDark ? "bg-gradient-to-br from-violet-900/10 to-blue-900/10 border-violet-800/30" : "bg-gradient-to-br from-violet-50 to-blue-50 border-violet-200")}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-violet-500" />
                <h2 className={cn("text-[16px] font-bold", classes.heading)}>Deliverables</h2>
                {!loadingDeliverables && deliverables.length > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 font-semibold">
                    {deliverables.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowDeliverablesView(!showDeliverablesView)}
                className={cn(
                  "text-[11px] px-3 py-1.5 rounded-md font-medium transition-colors",
                  isDark ? "bg-violet-600/20 text-violet-400 hover:bg-violet-600/30" : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                )}
              >
                {showDeliverablesView ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showDeliverablesView && (
              <div className="space-y-2">
                {loadingDeliverables ? (
                  <div className={cn("text-[12px] py-4 text-center", classes.muted)}>Loading deliverables...</div>
                ) : deliverables.length === 0 ? (
                  <div className={cn("text-[12px] py-4 text-center", classes.muted)}>No deliverables yet. They appear when tasks are completed.</div>
                ) : (
                  deliverables.map((d, i) => (
                    <div key={i} className={cn(
                      "flex items-center justify-between p-3 rounded-lg border transition-colors",
                      isDark ? "bg-[#0f172a]/60 border-white/5 hover:bg-white/5" : "bg-white border-neutral-200 hover:bg-neutral-50"
                    )}>
                      <div className="flex items-center gap-3 min-w-0">
                        {d.type === 'pptx' && <span className="text-lg flex-shrink-0">📊</span>}
                        {d.type === 'doc' && <span className="text-lg flex-shrink-0">📄</span>}
                        {d.type === 'md' && <span className="text-lg flex-shrink-0">📝</span>}
                        <div className="truncate">
                          <div className={cn("text-[12px] font-medium truncate", classes.heading)}>{d.name}</div>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className={classes.muted}>{d.size}</span>
                            {d.driveId && (
                              <>
                                <span className={classes.muted}>•</span>
                                <CheckCircle className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                <span className="text-emerald-500">On Drive</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {d.driveId && (
                          <a href={`https://drive.google.com/file/d/${d.driveId}/view`} target="_blank" rel="noopener noreferrer"
                            className={cn(
                              "flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium transition-colors",
                              isDark ? "bg-blue-600/20 text-blue-400 hover:bg-blue-600/30" : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            )}
                          >
                            <ExternalLink className="w-3 h-3" /> Open
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {!showDeliverablesView && !loadingDeliverables && deliverables.length > 0 && (
              <div className={cn("text-[11px]", classes.muted)}>
                Click <strong>Show</strong> to view {deliverables.length} deliverable{deliverables.length !== 1 ? 's' : ''} with download links.
              </div>
            )}
          </div>
          {error ? (
            <div className="p-4 text-red-500 bg-red-500/10 rounded-md border border-red-500/20">{error}</div>
          ) : loading ? (
            <div className="flex items-center justify-center h-64 text-violet-500">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className={cn("flex flex-col items-center justify-center h-64 text-center", classes.subtle)}>
              <Search className="w-12 h-12 mb-4 opacity-20" />
              <p>No files found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-1">
              {/* Table Header */}
              <div className={cn("grid grid-cols-[1fr_120px_160px_60px] gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider", classes.muted)}>
                <div>Name</div>
                <div>Size</div>
                <div>Modified</div>
                <div className="text-right">Action</div>
              </div>
              
              {/* File List */}
              {filteredFiles.map((file) => (
                <div
                  key={file.path}
                  onClick={() => handleSelectFile(file)}
                  className={cn(
                    "grid grid-cols-[1fr_120px_160px_60px] gap-4 px-4 py-3 items-center rounded-lg text-sm cursor-pointer transition-all",
                    selectedFile?.path === file.path
                      ? (isDark ? "bg-violet-500/10 border border-violet-500/20" : "bg-violet-50 border border-violet-200")
                      : (isDark ? "hover:bg-white/5 border border-transparent" : "hover:bg-neutral-50 border border-transparent")
                  )}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {getFileIcon(file.name)}
                    <div className="truncate">
                      <div className={classes.heading}>{file.name}</div>
                      <div className={cn("text-[10px] truncate mt-0.5", classes.subtle)}>{file.path}</div>
                    </div>
                  </div>
                  <div className={classes.subtle}>{formatBytes(file.size)}</div>
                  <div className={cn("flex items-center gap-1.5", classes.subtle)}>
                    <Clock className="w-3 h-3" />
                    {new Date(file.lastModified).toLocaleDateString()}
                  </div>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => handleDownload(file, e)}
                      className={cn("p-1.5 rounded-md transition-colors", isDark ? "hover:bg-white/10" : "hover:bg-neutral-200")}
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Panel */}
        {selectedFile && (
          <div className={cn("w-full md:w-1/3 flex flex-col h-full bg-opacity-50", isDark ? "bg-[#0a0e1a]" : "bg-neutral-50")}>
            <div className={cn("flex-none flex items-center justify-between p-4 border-b", classes.divider)}>
              <div className="flex items-center gap-2 truncate pr-4">
                <Eye className="w-4 h-4 text-violet-500" />
                <span className={cn("font-medium truncate text-sm", classes.heading)}>{selectedFile.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(selectedFile)}
                  className={cn("p-1.5 rounded-md transition-colors", isDark ? "hover:bg-white/10" : "hover:bg-neutral-200")}
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedFile(null)}
                  className={cn("p-1.5 rounded-md transition-colors", isDark ? "hover:bg-white/10" : "hover:bg-neutral-200")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto custom-scroll p-4 text-sm">
              <div className="mb-4 space-y-2">
                <div className={cn("text-xs font-semibold uppercase tracking-wider mb-2", classes.muted)}>File Details</div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className={classes.subtle}>Path</div>
                  <div className={cn("col-span-2 break-all", classes.heading)}>{selectedFile.path}</div>
                  <div className={classes.subtle}>Size</div>
                  <div className={cn("col-span-2", classes.heading)}>{formatBytes(selectedFile.size)}</div>
                  <div className={classes.subtle}>Modified</div>
                  <div className={cn("col-span-2", classes.heading)}>{new Date(selectedFile.lastModified).toLocaleString()}</div>
                </div>
              </div>
              
              <div className={cn("text-xs font-semibold uppercase tracking-wider mb-2", classes.muted)}>Preview</div>
              {previewLoading ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-violet-500" />
                </div>
              ) : previewContent ? (
                <div className={cn(
                  "p-3 rounded-md overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed",
                  isDark ? "bg-[#0f172a] text-neutral-300 border border-white/5" : "bg-white text-neutral-700 border border-neutral-200"
                )}>
                  {previewContent}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
