'use client';

import { useState, useCallback, useEffect } from 'react';
import { useSupabase } from '@/hooks/useSupabase';
import { useTheme, useThemeClasses } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { Task, Agent, Project } from '@/lib/types';
import { ViewType, NAV_ITEMS } from '@/lib/utils';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { OverviewDashboard } from '@/components/dashboard/OverviewDashboard';
import { KanbanBoard } from '@/components/board/KanbanBoard';
import { AgentGrid } from '@/components/agents/AgentGrid';
import { ApprovalsView } from '@/components/views/ApprovalsView';
import { WorkflowView } from '@/components/views/WorkflowView';
import { InsightsView } from '@/components/views/InsightsView';
import { ActivityView } from '@/components/views/ActivityView';
import { SettingsView } from '@/components/views/SettingsView';
import { SkillsView } from '@/components/views/SkillsView';
import { TaskModal } from '@/components/shared/TaskModal';
import { AgentModal } from '@/components/shared/AgentModal';
import { ProjectModal } from '@/components/shared/ProjectModal';
import FeedbackModal from '@/components/shared/FeedbackModal';
import { NovaWidget } from '@/components/chat/NovaWidget';

export default function MC() {
  const { theme, toggle: toggleTheme, isDark } = useTheme();
  const classes = useThemeClasses(isDark);
  const db = useSupabase();

  const [view, setView] = useState<ViewType>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isNewTask, setIsNewTask] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [isNewAgent, setIsNewAgent] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isNewProject, setIsNewProject] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const pendingApprovals = db.tasks.filter(t => t.status === 'approval_needed');

  const handleNewTaskClick = useCallback(() => {
    setEditingTask(null);
    setIsNewTask(true);
    setIsTaskModalOpen(true);
  }, []);

  const handleEditTaskClick = useCallback((task: Task) => {
    setEditingTask(task);
    setIsNewTask(false);
    setIsTaskModalOpen(true);
  }, []);

  const handleTaskModalSave = useCallback((taskData: Partial<Task> & { id?: string }) => {
    if (isNewTask) {
      db.addTask(taskData.title!, taskData.description, undefined, taskData.assignees);
    } else if (taskData.id) {
      db.updateTask(taskData as Task);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, [db, isNewTask]);

  const handleTaskDelete = useCallback((id: string) => {
    db.deleteTask(id);
    setIsTaskModalOpen(false);
    setEditingTask(null);
  }, [db]);

  const handleNewAgentClick = useCallback(() => {
    setEditingAgent(null);
    setIsNewAgent(true);
  }, []);

  const handleEditAgentClick = useCallback((agent: Agent) => {
    setEditingAgent(agent);
    setIsNewAgent(false);
  }, []);

  const handleAgentModalSave = useCallback((agentData: Partial<Agent> & { id?: string }) => {
    if (isNewAgent) {
      db.addAgent({ name: agentData.name!, role: agentData.role || '', status: agentData.status || 'active' });
    } else if (agentData.id) {
      db.updateAgent(agentData as Agent & { id: string });
    }
    setEditingAgent(null);
    setIsNewAgent(false);
  }, [db, isNewAgent]);

  const handleAgentDelete = useCallback((id: string) => {
    db.deleteAgent(id);
    setEditingAgent(null);
    setIsNewAgent(false);
  }, [db]);

  const handleNewProjectClick = useCallback(() => {
    setEditingProject(null);
    setIsNewProject(true);
  }, []);

  const handleEditProjectClick = useCallback((project: Project) => {
    setEditingProject(project);
    setIsNewProject(false);
  }, []);

  const handleProjectModalSave = useCallback((projData: Partial<Project> & { id?: string }) => {
    if (isNewProject) {
      db.addProject({ name: projData.name!, description: projData.description, status: projData.status || 'active', department: projData.department });
    } else if (projData.id) {
      db.updateProject(projData as Project & { id: string });
    }
    setEditingProject(null);
    setIsNewProject(false);
  }, [db, isNewProject]);

  const handleProjectDelete = useCallback((id: string) => {
    db.deleteProject(id);
    setEditingProject(null);
    setIsNewProject(false);
  }, [db]);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  return (
    <div className={cn("flex h-screen font-sans", classes.bg, isDark ? 'text-neutral-300 space-bg stars-bg' : 'text-neutral-700')}>
      <Sidebar
        view={view} setView={setView} pendingCount={pendingApprovals.length}
        isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}
        theme={theme} toggleTheme={toggleTheme}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          view={view} onMenuClick={() => setIsSidebarOpen(true)}
          onNewTask={handleNewTaskClick} onNewProject={handleNewProjectClick}
          onNewAgent={handleNewAgentClick}
          onOpenFeedback={() => setShowFeedback(true)}
          theme={theme} agents={db.agents} tasks={db.tasks}
          pendingApprovals={pendingApprovals.length}
        />
        <div className="flex-1 overflow-y-auto custom-scroll">
          {db.error && <div className="p-4 text-red-500 bg-red-100 dark:bg-red-900/20 rounded m-4">Error: {db.error}</div>}
          {db.loading && !db.error && <div className="p-4 text-center text-violet-500">Loading data...</div>}
          {!db.loading && !db.error && (
            <>
              {view === 'dashboard' && (
                <OverviewDashboard
                  stats={db.stats} tasks={db.tasks} agents={db.agents}
                  activities={db.activities} projects={db.projects}
                  loading={db.loading} theme={theme}
                  onEditProject={handleEditProjectClick}
                  onNewProject={handleNewProjectClick}
                  onUpdateProjectStatus={(id, status) => db.updateProject({ id, status } as Partial<Project> & { id: string })}
                />
              )}
              {view === 'board' && (
                <KanbanBoard
                  tasks={db.tasks} agents={db.agents}
                  onTaskClick={handleEditTaskClick} onMoveTask={db.moveTask}
                  onNewTask={handleNewTaskClick}
                  loading={db.loading} theme={theme}
                />
              )}
              {view === 'agents' && (
                <AgentGrid
                  agents={db.agents} tasks={db.tasks}
                  onAgentClick={handleEditAgentClick}
                  onNewAgent={handleNewAgentClick}
                  loading={db.loading} theme={theme}
                />
              )}
              {view === 'approvals' && <ApprovalsView pendingTasks={pendingApprovals} onApprove={db.approveTask} loading={db.loading} theme={theme} />}
              {view === 'workflow' && <WorkflowView theme={theme} agents={db.agents} />}
              {view === 'skills' && <SkillsView theme={theme} />}
              {view === 'insights' && <InsightsView stats={db.stats} agents={db.agents} tasks={db.tasks} projects={db.projects} loading={db.loading} theme={theme} />}
              {view === 'activity' && <ActivityView activities={db.activities} agents={db.agents} loading={db.loading} theme={theme} />}
              {view === 'settings' && <SettingsView agents={db.agents} theme={theme} onUpdateAgent={db.updateAgent} />}
            </>
          )}
        </div>
      </div>
      <NovaWidget theme={theme} />
      {(isTaskModalOpen || editingTask) && (
        <TaskModal task={editingTask} isNew={isNewTask} projects={db.projects} agents={db.agents}
          onClose={() => { setIsTaskModalOpen(false); setEditingTask(null); }}
          onSave={handleTaskModalSave} onDelete={handleTaskDelete} theme={theme} />
      )}
      {(editingAgent || isNewAgent) && (
        <AgentModal agent={editingAgent} isNew={isNewAgent} tasks={db.tasks}
          onClose={() => { setEditingAgent(null); setIsNewAgent(false); }}
          onSave={handleAgentModalSave} onDelete={handleAgentDelete} theme={theme} />
      )}
      {(editingProject || isNewProject) && (
        <ProjectModal project={editingProject} isNew={isNewProject} tasks={db.tasks}
          onClose={() => { setEditingProject(null); setIsNewProject(false); }}
          onSave={handleProjectModalSave} onDelete={handleProjectDelete} theme={theme} />
      )}
      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} theme={theme} />
    </div>
  );
}
