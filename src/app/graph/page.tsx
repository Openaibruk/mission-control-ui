'use client'

import dynamic from 'next/dynamic'

const GraphView = dynamic(() => import('@/components/graph/GraphView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400">Loading graph view...</p>
      </div>
    </div>
  ),
})

export default function GraphPage() {
  return (
    <div className="w-full h-screen">
      <GraphView theme="dark" />
    </div>
  )
}
