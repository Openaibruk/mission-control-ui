'use client';

import AgentGrid from '@/components/agents/AgentGrid';

export default function AgentsPage() {
  // This page is accessible via the main dashboard sidebar.
  // For direct route access, the main page handles agent rendering.
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Agents</h1>
      <p className="text-sm text-neutral-400">Use the main dashboard to view and manage agents.</p>
    </div>
  );
}
