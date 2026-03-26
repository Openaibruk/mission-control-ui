const fs = require('fs');
const file = '/home/ubuntu/.openclaw/workspace/mission-control-ui/src/components/board/KanbanBoard.tsx';
let content = fs.readFileSync(file, 'utf8');

// Ensure Eye icon is imported
if (!content.includes('Eye,')) {
  content = content.replace('X } from', 'X, Eye, CheckCircle2 } from');
}
if (!content.includes('import { MarkdownPreviewModal }')) {
  content = content.replace("import { useState, useMemo } from 'react';", "import { useState, useMemo } from 'react';\nimport { MarkdownPreviewModal } from '../shared/MarkdownPreviewModal';");
}

// Ensure KanbanBoard has previewFile state
if (!content.includes('previewFile')) {
  content = content.replace('const [filterAgent, setFilterAgent] = useState<string | null>(null);', 
    'const [filterAgent, setFilterAgent] = useState<string | null>(null);\n  const [previewFile, setPreviewFile] = useState<string | null>(null);\n\n  const getOutputUrl = (task: Task) => {\n    if (task.output_url) return task.output_url;\n    if (task.description) {\n      const match = task.description.match(/\\[output\\]:\\s*([^\\s,]+)/i);\n      if (match) return match[1].trim();\n    }\n    return null;\n  };');
}

// Replace the task rendering block
const oldTaskBlockStart = 'const stalled = isStalled(task);';
const newTaskBlock = `const stalled = isStalled(task);
                  const outputUrl = getOutputUrl(task);
                  const hasMarkdown = outputUrl?.toLowerCase().endsWith('.md');
                  const isDone = task.status === 'done';

                  return (
                    <div
                      key={task.id}
                      className={cn(
                        "group border rounded-lg p-3 transition-all",
                        classes.card, classes.hoverCard,
                        stalled && "border-amber-500/40 bg-amber-500/5 shadow-sm shadow-amber-500/5",
                        isDone && (isDark ? "border-emerald-500/20 bg-emerald-500/5 opacity-80 hover:opacity-100" : "border-emerald-500/20 bg-emerald-50/50 opacity-90 hover:opacity-100")
                      )}
                    >
                      {stalled && (
                        <div className="flex items-center justify-between mb-2">
                          <span className="flex items-center gap-1.5 text-[10px] text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                            <AlertTriangle className="w-3 h-3" /> STALLED
                          </span>
                        </div>
                      )}

                      <div onClick={() => onTaskClick(task)} className="cursor-pointer">
                        <h4 className={cn("text-[12px] font-medium mb-1 line-clamp-2 leading-snug flex items-start gap-1.5", 
                          isDone ? (isDark ? "text-emerald-400/90 line-through decoration-emerald-500/30" : "text-emerald-700/90 line-through decoration-emerald-500/30") : classes.heading
                        )}>
                          {isDone && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-500" />}
                          {task.title}
                        </h4>
                        {task.description && !isDone && (
                          <p className={cn("text-[10px] line-clamp-2 mb-2 leading-relaxed", classes.muted)}>
                            {task.description.replace(/\\[output\\]:\\s*\\S+/i, '')}
                          </p>
                        )}
                      </div>

                      {isDone && outputUrl && (
                        <div className="mt-2 mb-2 p-2 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[9px] font-mono truncate text-emerald-600 dark:text-emerald-400 opacity-80">{outputUrl.split('/').pop()}</span>
                            {hasMarkdown && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewFile(outputUrl);
                                }}
                                className={cn("flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold transition-all shadow-sm shrink-0", 
                                  isDark ? "bg-violet-600 hover:bg-violet-500 text-white" : "bg-violet-100 hover:bg-violet-200 text-violet-700")}
                              >
                                <Eye className="w-3 h-3" /> Preview
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50">
                        <div className="flex items-center space-x-1">
                          <div className="flex -space-x-1">
                            {task.assignees?.slice(0, 3).map((assignee, i) => (
                              <img key={i} src={getAvatar(assignee.replace('@', ''))} alt={assignee}
                                className={cn("w-5 h-5 rounded-full border-2", isDark ? "border-[#161618]" : "border-white")} title={assignee} />
                            ))}
                          </div>
                          <span className={cn("text-[9px] ml-1 font-medium", classes.subtle)}>{timeAgo(task.created_at)}</span>
                        </div>
                        {!isDoneColumn && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoveMenu task={task} onMove={onMoveTask} isDark={isDark} />
                          </div>
                        )}
                      </div>
                    </div>
                  );`;

// Let's replace the whole body of columnTasks.map
const startRegex = /const stalled = isStalled\(task\);/;
const endRegex = /<div className="flex items-center justify-between mt-3 pt-2 border-t[^>]+>([\s\S]*?)<\/div>\s*<\/div>\s*\);\s*\}\)/;

if (content.match(startRegex)) {
  const parts = content.split('const stalled = isStalled(task);');
  const before = parts[0];
  const afterMatch = parts[1].match(/<div className="flex items-center justify-between mt-3 pt-2 border-t[^>]+>([\s\S]*?)<\/div>\s*<\/div>\s*\);\s*\}\)/);
  if (afterMatch) {
    const after = parts[1].substring(afterMatch.index + afterMatch[0].length);
    content = before + newTaskBlock + '\n                })' + after;
  }
}

// Add the modal component at the end
if (!content.includes('<MarkdownPreviewModal')) {
  content = content.replace('</>', `  <MarkdownPreviewModal 
        isOpen={!!previewFile} 
        onClose={() => setPreviewFile(null)} 
        filePath={previewFile || ''} 
        theme={theme} 
      />
    </>`);
}

fs.writeFileSync(file, content);
