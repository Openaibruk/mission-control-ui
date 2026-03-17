'use client';

import { useState, useCallback, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Header } from '@/components/layout/Header';
import { Sidebar, ViewId } from '@/components/layout/Sidebar';
import OverviewDashboard from '@/components/dashboard/OverviewDashboard';
import StatsCards from '@/components/dashboard/StatsCards';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import ProjectsGrid from '@/components/dashboard/ProjectsGrid';
import TokenCostWidget from '@/components/dashboard/TokenCostWidget';
import AgentGrid from '@/components/agents/AgentGrid';
import KanbanBoard from '@/components/board/KanbanBoard';
import NovaWidget from '@/components/chat/NovaWidget';
import OnboardingDashboard from '@/components/onboarding/OnboardingDashboard';
import AgentModal from '@/components/shared/AgentModal';
import FeedbackModal from '@/components/shared/FeedbackModal';
import ProjectModal from '@/components/shared/ProjectModal';
import TaskModal from '@/components/shared/TaskModal';
import ActivityView from '@/components/views/ActivityView';
import ApprovalsView from '@/components/views/ApprovalsView';
import FeedbackView from '@/components/views/FeedbackView';
import InsightsView from '@/components/views/InsightsView';
import ProjectsView from '@/components/views/ProjectsView';
import SettingsView from '@/components/views/SettingsView';
import SkillsView from '@/components/views/SkillsView';
import WorkflowView from '@/components/views/WorkflowView';
import FeedbackTab from '@/components/views/FeedbackTab';
import { Agent, Task, Activity as ActivityType, Project } from '@/lib/types';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgrdeznxllkdolvrhlnm.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [theme] = useState<'dark' | 'light'>('dark');
  const [activeView, setActiveView] = useState<ViewId>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState({
    total_tasks: 0, active_tasks: 0, completed_tasks: 0,
    avg_effort: 0, active_agents: 0, total_agents: 0, approval_needed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [pendingApprovals, setPendingApprovals] = useState(0);

  // Modals
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [agentsRes, tasksRes, activitiesRes, projectsRes] = await Promise.all([
        supabase.from('agents').select('*').order('created_at', { ascending: false }),
        supabase.from('tasks').select('*, projects(id, name, color, status), agents(id, name, department, avatar_emoji)').order('created_at', { ascending: false }).limit(200),
        supabase.from('activities').select('*, agents(name, department, avatar_emoji)').order('created_at', { ascending: false }).limit(50),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
      ]);

      const agentData = (agentsRes.data || []) as Agent[];
      const taskData = (tasksRes.data || []) as Task[];
      const activityData = (activitiesRes.data || []) as ActivityType[];
      const projectData = (projectsRes.data || []) as Project[];

      setAgents(agentData);
      setTasks(taskData);
      setActivities(activityData);
      setProjects(projectData);

      const activeTasks = taskData.filter(t => t.status === 'in_progress').length;
      const completedTasks = taskData.filter(t => t.status === 'done').length;
      const approvalNeeded = taskData.filter(t => t.status === 'approval_needed').length;
      const activeAgents = agentData.filter(a => a.status === 'active').length;
      const effortTasks = taskData.filter(t => t.actual_effort && t.actual_effort > 0);
      const avgEffort = effortTasks.length > 0
        ? effortTasks.reduce((sum, t) => sum + (t.actual_effort || 0), 0) / effortTasks.length
        : 0;

      setStats({
        total_tasks: taskData.length,
        active_tasks: activeTasks,
        completed_tasks: completedTasks,
        avg_effort: Math.round(avgEffort * 10) / 10,
        active_agents: activeAgents,
        total_agents: agentData.length,
        approval_needed: approvalNeeded,
      });
      setPendingApprovals(approvalNeeded);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleNewTask = () => setShowTaskModal(true);
  const handleNewProject = () => setShowProjectModal(true);
  const handleNewAgent = () => setActiveView('agents');
  const handleMenuClick = () => setSidebarCollapsed(!sidebarCollapsed);

  const handleApproveTask = async (taskId: string) => {
    try {
      await fetch('/api/approve-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, action: 'approve' }),
      });
      fetchData();
    } catch (err) {
      console.error('Approve error:', err);
    }
  };

  const handleRejectTask = async (taskId: string) => {
    try {
      await fetch('/api/approve-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, action: 'reject' }),
      });
      fetchData();
    } catch (err) {
      console.error('Reject error:', err);
    }
  };

  const handleAddTask = async (taskData: Partial<Task>) => {
    try {
      await supabase.from('tasks').insert(taskData);
      fetchData();
    } catch (err) {
      console.error('Add task error:', err);
    }
  };

  const handleAddProject = async (projectData: Partial<Project>) => {
    try {
      await supabase.from('projects').insert(projectData);
      fetchData();
    } catch (err) {
      console.error('Add project error:', err);
    }
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <StatsCards stats={stats} theme={theme} />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <div className={theme === 'dark' ? 'bg-neutral-900 border border-neutral-800 rounded-xl p-4' : 'bg-white border border-neutral-200 rounded-xl p-4'}>
                  <h3 className={`text-sm font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Active Tasks</h3>
                  {tasks.filter(t => t.status === 'in_progress').length === 0 ? (
                    <p className={`text-sm ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>No active tasks</p>
                  ) : (
                    <div className="space-y-2">
                      {tasks.filter(t => t.status === 'in_progress').slice(0, 8).map(task => (
                        <div key={task.id} className={`flex items-center justify-between p-2 rounded-lg ${theme === 'dark' ? 'bg-neutral-800/50' : 'bg-neutral-50'}`}>
                          <span className={`text-sm truncate ${theme === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>{task.title}</span>
                          {task.agents && (
                            <span className={`text-xs shrink-0 ml-2 ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>
                              {task.agents.avatar_emoji} {task.agents.name}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <ActivityFeed activities={activities} theme={theme} loading={loading} />
              </div>
              <div className="space-y-4">
                <TokenCostWidget theme={theme} />
                <FeedbackTab theme={theme} />
              </div>
            </div>
          </div>
        );
      case 'projects':
        return <ProjectsView projects={projects} tasks={tasks} theme={theme} onNewProject={handleNewProject} />;
      case 'agents':
        return (
          <div className="space-y-4">
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Agents</h2>
            <AgentGrid agents={agents} theme={theme} onAgentClick={setSelectedAgent} />
          </div>
        );
      case 'tasks':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-neutral-900'}`}>Tasks Board</h2>
              <button
                onClick={handleNewTask}
                className="bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
              >
                + New Task
              </button>
            </div>
            <KanbanBoard tasks={tasks} agents={agents} theme={theme} />
          </div>
        );
      case 'onboarding':
        return <OnboardingDashboard theme={theme} />;
      case 'approvals':
        return <ApprovalsView tasks={tasks} theme={theme} loading={loading} onApprove={handleApproveTask} onReject={handleRejectTask} />;
      case 'feedback':
        return <FeedbackView theme={theme} />;
      case 'settings':
        return <SettingsView theme={theme} />;
      case 'workflow':
        return <WorkflowView theme={theme} />;
      case 'skills':
        return <SkillsView theme={theme} />;
      case 'insights':
        return <InsightsView theme={theme} />;
      default:
        return <OverviewDashboard theme={theme} />;
    }
  };

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-neutral-950' : 'bg-white'}`}>
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        theme={theme}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onMenuClick={handleMenuClick}
          onNewTask={handleNewTask}
          onNewProject={handleNewProject}
          onNewAgent={handleNewAgent}
          onOpenFeedback={() => setShowFeedback(true)}
          theme={theme}
          agents={agents}
          tasks={tasks}
          pendingApprovals={pendingApprovals}
        />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      {/* Floating Chat Widget */}
      <NovaWidget theme={theme} compact />

      {/* Modals */}
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} theme={theme} />
      <AgentModal agent={selectedAgent} isOpen={!!selectedAgent} onClose={() => setSelectedAgent(null)} theme={theme} />
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        onSubmit={handleAddTask}
        theme={theme}
        agents={agents}
        projects={projects}
      />
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onSubmit={handleAddProject}
        theme={theme}
      />
    </div>
  );
}
