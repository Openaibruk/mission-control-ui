'use client';

import { useState, useEffect, useCallback } from 'react';

interface GatewayData {
  generatedAt: string;
  vps: {
    status: string;
    uptime: number;
    cpu: number;
    memory: { total: number; used: number; percent: number };
    disk: { percent: number };
    load: string;
  };
  gateway: {
    status: string;
    uptime: number;
    sessions: number;
  };
  paperclip: {
    status: string;
  };
}

export function useGatewayStatus(intervalMs = 30000) {
  const [data, setData] = useState<GatewayData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/gateway-live', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, intervalMs);
    return () => clearInterval(timer);
  }, [fetchStatus, intervalMs]);

  return { data, loading, refresh: fetchStatus };
}
