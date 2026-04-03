'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Task, Agent, Project, Activity, DashboardStats } from '@/lib/types';

interface UseSupabaseReturn {
  tasks: Task[];
  agents: Agent[];
  projects: Project[];
  activities: Activity[];
  loading: boolean;
  error: string | null;
  stats: DashboardStats;
  addTask: (title: string, description?: string, projectId?: string, assignees?: string[]) => Promise<void>;
  updateTask: (task: Partial<Task> & { id: string }) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  moveTask: (id: string, status: string) => Promise<void>;
  approveTask: (id: string, title: string, approved: boolean) => Promise<void>;
  addAgent: (agent: Omit<Agent, 'id' | 'created_at'>) => Promise<void>;
  updateAgent: (agent: Partial<Agent> & { id: string }) => Promise<void>;
  deleteAgent: (id: string) => Promise<void>;
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'done_tasks' | 'total_tasks'>) => Promise<void>;
  updateProject: (project: Partial<Project> & { id: string }) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

// Helper to detect stalled tasks (in_progress > 1 hour, assigned > 2 hours)
function countStalled(tasks: Task[]): number {
  const now = Date.now();
  return tasks.filter(t => {
    const age = now - new Date(t.created_at).getTime();
    if (t.status === 'in_progress' && age > 3600000) return true;
    if (t.status === 'assigned' && age > 7200000) return true;
    return false;
  }).length;
}

export function useSupabase(): UseSupabaseReturn {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0, active: 0, done: 0, rate: 0, totalTokens: 0, stalledCount: 0,
  });

  const calculateStats = useCallback((taskList: Task[]) => {
    const total = taskList.filter(t => t.status !== 'rejected').length;
    const doneC = taskList.filter(t => t.status === 'done').length;
    const activeC = taskList.filter(t => ['assigned', 'in_progress', 'review'].includes(t.status)).length;
    const rate = total > 0 ? Math.round((doneC / total) * 100) : 0;
    const totalTokens = taskList.reduce((sum, t) => sum + (t.cost_tokens || 0), 0);
    const stalledCount = countStalled(taskList);
    setStats({ total, active: activeC, done: doneC, rate, totalTokens, stalledCount });
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksRes, agentsRes, projectsRes, activitiesRes] = await Promise.all([
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('agents').select('*'),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('activities').select('*').gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()).order('created_at', { ascending: false }).limit(50),
      ]);
      if (tasksRes.error) throw tasksRes.error;
      if (agentsRes.error) throw agentsRes.error;
      if (projectsRes.error) throw projectsRes.error;
      if (activitiesRes.error) throw activitiesRes.error;
      const tl = tasksRes.data || [];
      setTasks(tl);
      calculateStats(tl);
      setAgents(agentsRes.data || []);
      setProjects(projectsRes.data || []);
      setActivities(activitiesRes.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => { loadData(); }, [loadData]);

  // Realtime subscriptions
  useEffect(() => {
    const ch1 = supabase.channel('tasks-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (p) => {
      if (p.eventType === 'INSERT') setTasks(prev => { const n = [p.new as Task, ...prev]; calculateStats(n); return n; });
      if (p.eventType === 'UPDATE') setTasks(prev => { const n = prev.map(t => t.id === p.new.id ? p.new as Task : t); calculateStats(n); return n; });
      if (p.eventType === 'DELETE') setTasks(prev => { const n = prev.filter(t => t.id !== p.old.id); calculateStats(n); return n; });
    }).subscribe();
    const ch2 = supabase.channel('activities-rt').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, (p) => {
      setActivities(prev => {
        const newAct = p.new as Activity;
        const isRecent = (Date.now() - new Date(newAct.created_at).getTime()) < 48 * 60 * 60 * 1000;
        if (!isRecent) return prev;
        return [...prev, newAct];
      });
    }).subscribe();
    const ch3 = supabase.channel('projects-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (p) => {
      if (p.eventType === 'INSERT') setProjects(prev => [p.new as Project, ...prev]);
      if (p.eventType === 'UPDATE') setProjects(prev => prev.map(pr => pr.id === p.new.id ? p.new as Project : pr));
      if (p.eventType === 'DELETE') setProjects(prev => prev.filter(pr => pr.id !== p.old.id));
    }).subscribe();
    const ch4 = supabase.channel('agents-rt').on('postgres_changes', { event: '*', schema: 'public', table: 'agents' }, (p) => {
      if (p.eventType === 'INSERT') setAgents(prev => [...prev, p.new as Agent]);
      if (p.eventType === 'UPDATE') setAgents(prev => prev.map(a => a.id === p.new.id ? p.new as Agent : a));
      if (p.eventType === 'DELETE') setAgents(prev => prev.filter(a => a.id !== p.old.id));
    }).subscribe();
    return () => { supabase.removeChannel(ch1); supabase.removeChannel(ch2); supabase.removeChannel(ch3); supabase.removeChannel(ch4); };
  }, [calculateStats]);

  // ── Task actions ──
  const addTask = async (title: string, description?: string, projectId?: string, assignees?: string[]) => {
    const payload: Record<string, unknown> = { title, description: description || '', status: 'inbox', assignees: assignees || [] };
    if (projectId) payload.project_id = projectId;
    await supabase.from('tasks').insert([payload]);
    await supabase.from('activities').insert([{ agent_name: 'Bruk', action: `Created: ${title}` }]);
    // Update project task count if linked
    if (projectId) {
      const proj = projects.find(p => p.id === projectId);
      if (proj) await supabase.from('projects').update({ total_tasks: proj.total_tasks + 1 }).eq('id', projectId);
    }
  };

  const updateTask = async (task: Partial<Task> & { id: string }) => {
    const { id, ...updates } = task;
    await supabase.from('tasks').update(updates).eq('id', id);
    await supabase.from('activities').insert([{ agent_name: 'Bruk', action: `Updated: ${task.title || id}` }]);
  };

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
  };

  const moveTask = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
      if (error) {
        console.error('Move task error:', error);
        alert(`Failed to move task: ${error.message}`);
      }
    } catch (err) {
      console.error('Move task exception:', err);
      alert(`Failed to move task: ${err}`);
    }
  };

  const approveTask = async (id: string, title: string, approved: boolean) => {
    await supabase.from('tasks').update({ status: approved ? 'inbox' : 'rejected' }).eq('id', id);
    await supabase.from('activities').insert([{ agent_name: 'Bruk', action: `${approved ? '✅ Approved' : '❌ Rejected'}: ${title}` }]);
  };

  // ── Agent actions ──
  const addAgent = async (agent: Omit<Agent, 'id' | 'created_at'>) => {
    await supabase.from('agents').insert([agent]);
    await supabase.from('activities').insert([{ agent_name: 'Bruk', action: `Added agent: ${agent.name}` }]);
  };

  const updateAgent = async (agent: Partial<Agent> & { id: string }) => {
    const { id, ...updates } = agent;
    await supabase.from('agents').update(updates).eq('id', id);
    await supabase.from('activities').insert([{ agent_name: 'Bruk', action: `Updated agent: ${agent.name || id}` }]);
  };

  const deleteAgent = async (id: string) => {
    const agent = agents.find(a => a.id === id);
    await supabase.from('agents').delete().eq('id', id);
    if (agent) await supabase.from('activities').insert([{ agent_name: 'Bruk', action: `Removed agent: ${agent.name}` }]);
  };

  // ── Project actions ──
  const addProject = async (project: Omit<Project, 'id' | 'created_at' | 'done_tasks' | 'total_tasks'>) => {
    await supabase.from('projects').insert([{ ...project, done_tasks: 0, total_tasks: 0 }]);
    await supabase.from('activities').insert([{ agent_name: 'Bruk', action: `Created project: ${project.name}` }]);
  };

  const updateProject = async (project: Partial<Project> & { id: string }) => {
    const { id, ...updates } = project;
    await supabase.from('projects').update(updates).eq('id', id);
    await supabase.from('activities').insert([{ agent_name: 'Bruk', action: `Updated project: ${project.name || id}` }]);
  };

  const deleteProject = async (id: string) => {
    const proj = projects.find(p => p.id === id);
    await supabase.from('projects').delete().eq('id', id);
    if (proj) await supabase.from('activities').insert([{ agent_name: 'Bruk', action: `Deleted project: ${proj.name}` }]);
  };

  return {
    tasks, agents, projects, activities, loading, error, stats,
    addTask, updateTask, deleteTask, moveTask, approveTask,
    addAgent, updateAgent, deleteAgent,
    addProject, updateProject, deleteProject,
    refresh: loadData,
  };
}
