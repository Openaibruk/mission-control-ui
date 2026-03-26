'use client';

import { useState } from 'react';
import { useThemeClasses } from '@/hooks/useTheme';
import { Play, Database } from 'lucide-react';

export default function SupersetQueryPage() {
  const isDark = true;
  const classes = useThemeClasses(isDark);
  
  const [sql, setSql] = useState('SELECT * FROM workflows LIMIT 10;');
  const [databaseId, setDatabaseId] = useState('6');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runQuery = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/superset/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sql: sql.trim(),
          database_id: parseInt(databaseId),
          schema: 'main',
          expand_data: true,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.message || data.error || 'Query failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderTable = () => {
    if (!result || !result.data) return null;
    const { columns, rows } = result.data;
    if (!columns || columns.length === 0) {
      return <div className="mt-4 text-sm text-neutral-400">No columns returned</div>;
    }
    return (
      <div className="mt-6 overflow-x-auto border border-neutral-800/50 rounded-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-800/50">
            <tr>
              {columns.map((col: any, i: number) => (
                <th key={i} className="px-3 py-2 font-semibold text-neutral-200">{col.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any, ri: number) => (
              <tr key={ri} className="border-t border-neutral-800/30 hover:bg-neutral-800/20">
                {columns.map((col: any, ci: number) => (
                  <td key={ci} className="px-3 py-2 font-mono text-xs text-neutral-300">
                    {String(row[ci] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-3 py-2 text-xs text-neutral-500 border-t border-neutral-800/30">
          {rows.length} row(s)
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Database className="w-6 h-6 text-violet-400" />
        <h1 className="text-xl font-bold text-white">Superset SQL Lab Integration</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Database ID</label>
          <input
            type="number"
            value={databaseId}
            onChange={(e) => setDatabaseId(e.target.value)}
            placeholder="e.g., 6"
            className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Schema (usually 'main')</label>
          <input
            type="text"
            value="main"
            disabled
            className="w-full rounded-md bg-neutral-800 border border-neutral-700 px-3 py-2 text-sm text-neutral-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-neutral-400 mb-1">SQL Query</label>
        <textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          rows={4}
          className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2 text-sm font-mono text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          placeholder="SELECT * FROM workflows LIMIT 10;"
        />
      </div>

      <button
        onClick={runQuery}
        disabled={loading}
        className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        {loading ? (
          <>Running…</>
        ) : (
          <>
            <Play className="w-4 h-4" /> Run Query
          </>
        )}
      </button>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="text-sm text-neutral-300">
            {result.status === 'success' ? (
              <span className="text-emerald-400">✓ Query succeeded</span>
            ) : (
              <span className="text-amber-400">⚠ Query completed with status: {result.status}</span>
            )}
          </div>
          {renderTable()}
        </div>
      )}
    </div>
  );
}
