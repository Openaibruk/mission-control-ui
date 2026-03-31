'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 text-center">
          <div className="text-red-500">🚨 Something went wrong</div>
          <div className="text-sm text-red-400/70 mt-2">{this.state.error?.message}</div>
        </div>
      );
    }
    return this.props.children;
  }
}
