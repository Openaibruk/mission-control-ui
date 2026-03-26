'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Bot, ListTodo, Activity, Wifi, WifiOff, RefreshCw, Clock, Zap, Server, Users, CheckCircle2 } from 'lucide-react';
import { cn, formatTimeAgo, STATUS_COLORS, AGENT_STATUS_COLORS, getThemeClasses } from '@/lib/utils';
import { Agent, Task, Activity as ActivityType } from '@/lib/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface GatewayStatus {
  connected: boolean;
  status: string;
  sessions: number;
  uptime: number;
}

export default function OverviewDashboard({ theme = 'dark' }: { theme?: 'dark' | 'light' }) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);

  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatus>({ connected: false, status: 'offline', sessions: 0, uptime: 0 });
  const [loading, setLoading] = useState(true);

  const fetchGatewayStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/gateway-status', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setGatewayStatus(data);
      }
    } catch {
      setGatewayStatus({ connected: false, status: 'offline', sessions: 0, uptime: 0 });
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const [agentsRes, tasksRes, activityRes] = await Promise.all([
        supabase.from('agents').select('*').order('last_active_at', { ascending: false }),
        supabase.from('tasks').select('*, agents(*), projects(*)').order('created_at', { ascending: false }).limit(50),
        supabase.from('activity').select('*, agents(*)').order('created_at', { ascending: false }).limit(20),
      ]);

      if (agentsRes.data) setAgents(agentsRes.data);
      if (tasksRes.data) setTasks(tasksRes.data);
      if (activityRes.data) setActivities(activityRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchGatewayStatus();

    const interval = setInterval(fetchGatewayStatus, 15000);
    return () => clearInterval(interval);
  }, [fetchData, fetchGatewayStatus]);

  const activeTasks = tasks.filter(t => t.status === 'in_progress');
  const pendingApproval = tasks.filter(t => t.status === 'approval_needed');
  const activeAgents = agents.filter(a => a.status === 'active');
  const completedTasks = tasks.filter(t => t.status === 'done');

  const formatUptime = (seconds: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-6 h-6 animate-spin text-neutral-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<Bot className="w-4 h-4" />}
          label="Active Agents"
          value={activeAgents.length}
          total={agents.length}
          color="emerald"
          isDark={isDark}
          classes={classes}
        />
        <StatCard
          icon={<ListTodo className="w-4 h-4" />}
          label="Active Tasks"
          value={activeTasks.length}
          total={tasks.length}
          color="blue"
          isDark={isDark}
          classes={classes}
        />
        <StatCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="Completed"
          value={completedTasks.length}
          color="violet"
          isDark={isDark}
          classes={classes}
        />
        <StatCard
          icon={<Zap className="w-4 h-4" />}
          label="Pending Approval"
          value={pendingApproval.length}
          color="amber"
          isDark={isDark}
          classes={classes}
        />
      </div>

      {/* Gateway Health + Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={cn("rounded-xl border p-4", classes.card)}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={cn("text-sm font-semibold flex items-center gap-2", classes.heading)}>
              <Server className="w-4 h-4" /> Gateway Health
            </h3>
            <button onClick={fetchGatewayStatus} className={cn("p-1.5 rounded-lg transition-colors", classes.hover)}>
              <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            {gatewayStatus.connected ? (
              <Wifi className="w-5 h-5 text-emerald-500" />
            ) : (
              <WifiOff className="w-5 h-5 text-red-500" />
            )}
            <div>
              <div className={cn("text-sm font-medium", gatewayStatus.connected ? 'text-emerald-500' : 'text-red-500')}>
                {gatewayStatus.connected ? 'Online' : 'Offline'}
              </div>
              <div className={cn("text-xs", classes.muted)}>
                Status: {gatewayStatus.status}
              </div>
            </div>
          </div>
          {gatewayStatus.connected && (
            <div className={cn("mt-3 pt-3 border-t flex items-center gap-2 text-xs", classes.divider, classes.muted)}>
              <Clock className="w-3 h-3" />
              <span>Uptime: {formatUptime(gatewayStatus.uptime)}</span>
            </div>
          )}
        </div>

        <div className={cn("rounded-xl border p-4", classes.card)}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={cn("text-sm font-semibold flex items-center gap-2", classes.heading)}>
              <Users className="w-4 h-4" /> Active Sessions
            </h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-3xl font-bold", classes.heading)}>
              {gatewayStatus.sessions}
            </span>
            <span className={cn("text-sm", classes.muted)}>sessions</span>
          </div>
          <div className={cn("mt-3 text-xs", classes.muted)}>
            {gatewayStatus.connected
              ? `Connected to gateway with ${gatewayStatus.sessions} active session${gatewayStatus.sessions !== 1 ? 's' : ''}`
              : 'Connect to gateway to see active sessions'}
          </div>
        </div>
      </div>

      {/* Active Tasks */}
      <div className={cn("rounded-xl border p-4", classes.card)}>
        <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", classes.heading)}>
          <ListTodo className="w-4 h-4" /> Active Tasks
        </h3>
        {activeTasks.length === 0 ? (
          <p className={cn("text-sm", classes.muted)}>No active tasks</p>
        ) : (
          <div className="space-y-2">
            {activeTasks.slice(0, 10).map(task => (
              <div key={task.id} className={cn("flex items-center justify-between p-2 rounded-lg", isDark ? 'bg-neutral-800/50' : 'bg-neutral-50')}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className={cn("w-2 h-2 rounded-full shrink-0", STATUS_COLORS[task.status] || 'bg-neutral-500')} />
                  <span className={cn("text-sm truncate", classes.text)}>{task.title}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  {task.agents && (
                    <span className={cn("text-xs", classes.muted)}>
                      {task.agents.avatar_emoji} {task.agents.name}
                    </span>
                  )}
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded", classes.badge)}>
                    P{task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className={cn("rounded-xl border p-4", classes.card)}>
        <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", classes.heading)}>
          <Activity className="w-4 h-4" /> Recent Activity
        </h3>
        {activities.length === 0 ? (
          <p className={cn("text-sm", classes.muted)}>No recent activity</p>
        ) : (
          <div className="space-y-2">
            {activities.slice(0, 15).map(activity => (
              <div key={activity.id} className={cn("flex items-start gap-2 text-sm", classes.text)}>
                <span className="shrink-0">{activity.agents?.avatar_emoji || '🤖'}</span>
                <div className="min-w-0">
                  <span className="font-medium">{activity.agents?.name || activity.agent_id}</span>
                  {' '}
                  <span className={classes.muted}>{activity.action}</span>
                  {activity.details && (
                    <span className={cn("block text-xs truncate", classes.muted)}>{activity.details}</span>
                  )}
                </div>
                <span className={cn("text-xs shrink-0 ml-auto", classes.muted)}>
                  {formatTimeAgo(activity.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  total,
  color,
  isDark,
  classes,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  total?: number;
  color: string;
  isDark: boolean;
  classes: ReturnType<typeof getThemeClasses>;
}) {
  const colorMap: Record<string, string> = {
    emerald: 'text-emerald-500',
    blue: 'text-blue-500',
    violet: 'text-violet-500',
    amber: 'text-amber-500',
  };

  return (
    <div className={cn("rounded-xl border p-4", classes.card)}>
      <div className="flex items-center gap-2 mb-2">
        <span className={colorMap[color] || 'text-neutral-500'}>{icon}</span>
        <span className={cn("text-xs", classes.muted)}>{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={cn("text-2xl font-bold", classes.heading)}>{value}</span>
        {total !== undefined && (
          <span className={cn("text-sm", classes.muted)}>/ {total}</span>
        )}
      </div>
    </div>
  );
}
