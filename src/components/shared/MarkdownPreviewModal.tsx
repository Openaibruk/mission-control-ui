import { X, ExternalLink, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';
import { useState, useEffect } from 'react';

export function MarkdownPreviewModal({ isOpen, onClose, filePath, theme }: { isOpen: boolean, onClose: () => void, filePath: string, theme: 'dark' | 'light' }) {
  const isDark = theme === 'dark';
  const classes = useThemeClasses(isDark);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isOpen && filePath) {
      setLoading(true);
      setError('');
      // Using our existing API for reading workspace files
      fetch(`/api/files?path=${encodeURIComponent(filePath)}&cb=${Date.now()}`)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to load file (${res.status})`);
          return res.text();
        })
        .then(text => {
          setContent(text);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError(err.message || 'Error loading file content');
          setLoading(false);
        });
    }
  }, [isOpen, filePath]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={cn(
          "w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl overflow-hidden shadow-2xl border",
          isDark ? "bg-[#161618] border-white/10" : "bg-white border-black/10"
        )}
      >
        <div className={cn("flex items-center justify-between px-4 py-3 border-b shrink-0", classes.divider)}>
          <div className="flex items-center gap-2 truncate pr-4">
            <h2 className={cn("text-sm font-semibold truncate", classes.heading)}>
              {filePath.split('/').pop()}
            </h2>
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full", isDark ? "bg-neutral-800 text-neutral-400" : "bg-neutral-100 text-neutral-500")}>Markdown Preview</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <a 
              href={`/api/files?path=${encodeURIComponent(filePath)}&action=download`}
              download
              className={cn("p-1.5 rounded-md transition-colors", isDark ? "hover:bg-white/10 text-neutral-400 hover:text-white" : "hover:bg-black/5 text-neutral-500 hover:text-black")}
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </a>
            <button onClick={onClose} className={cn("p-1.5 rounded-md transition-colors", isDark ? "hover:bg-white/10 text-neutral-400 hover:text-white" : "hover:bg-black/5 text-neutral-500 hover:text-black")}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={cn("flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar", isDark ? "text-neutral-300" : "text-neutral-700")}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-red-500 gap-2">
              <span className="text-sm font-medium">Failed to load preview</span>
              <span className="text-xs opacity-80">{error}</span>
            </div>
          ) : (
            <div className={cn(
              "prose prose-sm md:prose-base max-w-none",
              isDark ? "prose-invert prose-headings:text-neutral-100 prose-a:text-violet-400 hover:prose-a:text-violet-300 prose-code:text-violet-300 prose-code:bg-neutral-800/50 prose-pre:bg-neutral-900/50 prose-hr:border-neutral-800" 
                     : "prose-headings:text-neutral-900 prose-a:text-violet-600 hover:prose-a:text-violet-700 prose-code:text-violet-600 prose-code:bg-neutral-100 prose-pre:bg-neutral-100 prose-hr:border-neutral-200"
            )}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeRaw]}
                components={{
                  a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" {...props} />
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
