export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'offline';
  department: string;
  role: string;
  avatar_emoji: string;
  last_active_at: string;
  tasks_completed: number;
  budget_spent_usd: number;
  budget_monthly_usd: number;
  reports_to: string | null;
  org_level: number;
  goals: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  agent_id: string;
  project_id: string;
  created_at: string;
  updated_at: string;
  estimated_effort?: number;
  actual_effort?: number;
  checkout_by?: string;
  checkout_at?: string;
  checkout_expires_at?: string;
  goal_id?: string;
  tags?: string[];
  agents?: Agent;
  projects?: { id: string; name: string; color: string; status: string };
}

export interface Activity {
  id: number;
  agent_id: string;
  action: string;
  details: string;
  created_at: string;
  agents?: Agent;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  status: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: string;
  target_date: string;
  priority: number;
  project_id: string;
}

export interface OrgChartEntry {
  id: string;
  agent_id: string;
  reports_to: string | null;
  org_level: number;
  department: string;
  agents?: Agent;
  subordinates?: OrgChartEntry[];
}

export interface ApprovalGate {
  id: string;
  task_status: string;
  requires_role: string;
  auto_approve_after_hours: number;
  is_active: boolean;
}

export interface AuditLogEntry {
  id: number;
  actor_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  created_at: string;
}

export interface HeartbeatSchedule {
  id: string;
  name: string;
  cron_expr: string;
  is_active: boolean;
  last_run_at: string;
  next_run_at: string;
  payload: Record<string, unknown>;
}

export interface Feedback {
  id: string;
  title: string;
  description: string;
  category: 'bug' | 'feature' | 'improvement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'project_created' | 'fixed' | 'done';
  created_at: string;
  updated_at: string;
  project_id?: string;
  project?: Project;
}
