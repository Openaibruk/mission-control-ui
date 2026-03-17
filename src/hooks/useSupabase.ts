'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Agent, Task, Activity, Project, Goal, OrgChartEntry, ApprovalGate, AuditLogEntry, HeartbeatSchedule } from '@/lib/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgrdeznxllkdolvrhlnm.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const QUERY_TIMEOUT = 8000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Query timeout')), ms)),
  ]);
}

export function useSupabase() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({ total_tasks: 0, active_tasks: 0, completed_tasks: 0, avg_effort: 0, active_agents: 0, total_agents: 0, approval_needed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const [agentsRes, tasksRes, activitiesRes, projectsRes] = await Promise.all([
        withTimeout(supabase.from('agents').select('*').order('created_at', { ascending: false }), QUERY_TIMEOUT),
        withTimeout(supabase.from('tasks').select('*, projects(id, name, color, status), agents(id, name, department, avatar_emoji)').order('created_at', { ascending: false }).limit(200), QUERY_TIMEOUT),
        withTimeout(supabase.from('activities').select('*, agents(name, department, avatar_emoji)').order('created_at', { ascending: false }).limit(50), QUERY_TIMEOUT),
        withTimeout(supabase.from('projects').select('*').order('created_at', { ascending: false }), QUERY_TIMEOUT),
      ]);

      const agentData = (agentsRes.data || []) as Agent[];
      const taskData = (tasksRes.data || []) as Task[];
      const activityData = (activitiesRes.data || []) as Activity[];
      const projectData = (projectsRes.data || []) as Project[];

      setAgents(agentData);
      setTasks(taskData);
      setActivities(activityData);
      setProjects(projectData);

      const activeTasks = taskData.filter(t => t.status === 'in_progress').length;
      const completedTasks = taskData.filter(t => t.status === 'done').length;
      const pendingApprovals = taskData.filter(t => t.status === 'approval_needed').length;
      const activeAgents = agentData.filter(a => a.status === 'active').length;
      const effortTasks = taskData.filter(t => t.actual_effort && t.actual_effort > 0);
      const avgEffort = effortTasks.length > 0 ? effortTasks.reduce((sum, t) => sum + (t.actual_effort || 0), 0) / effortTasks.length : 0;

      setStats({
        total_tasks: taskData.length,
        active_tasks: activeTasks,
        completed_tasks: completedTasks,
        avg_effort: Math.round(avgEffort * 10) / 10,
        active_agents: activeAgents,
        total_agents: agentData.length,
        approval_needed: pendingApprovals,
      });

      setLastRefresh(new Date());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(msg);
      console.error('Supabase fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(true); }, [fetchData]);

  useEffect(() => {
    pollingRef.current = setInterval(() => fetchData(false), 30000);
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, [fetchData]);

  const addTask = async (task: Partial<Task>) => {
    const { data, error: err } = await supabase.from('tasks').insert(task).select().single();
    if (err) { setError(err.message); return null; }
    await fetchData();
    return data as Task;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { error: err } = await supabase.from('tasks').update(updates).eq('id', id);
    if (err) { setError(err.message); return false; }
    await fetchData();
    return true;
  };

  const approveTask = async (id: string) => {
    const res = await fetch('/api/approve-task', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ taskId: id, action: 'approve' }) });
    const result = await res.json();
    if (!result.error) await fetchData();
    return result;
  };

  const rejectTask = async (id: string) => {
    const res = await fetch('/api/approve-task', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ taskId: id, action: 'reject' }) });
    const result = await res.json();
    if (!result.error) await fetchData();
    return result;
  };

  const addAgent = async (agent: Partial<Agent>) => {
    const { data, error: err } = await supabase.from('agents').insert(agent).select().single();
    if (err) { setError(err.message); return null; }
    await fetchData();
    return data as Agent;
  };

  const addProject = async (project: Partial<Project>) => {
    const { data, error: err } = await supabase.from('projects').insert(project).select().single();
    if (err) { setError(err.message); return null; }
    await fetchData();
    return data as Project;
  };

  return {
    agents, tasks, activities, projects, stats,
    loading, error, lastRefresh,
    fetchData, addTask, updateTask, approveTask, rejectTask, addAgent, addProject,
    supabase,
  };
}
