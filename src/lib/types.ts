// Types for Mission Control

export type TaskStatus = 'inbox' | 'assigned' | 'in_progress' | 'review' | 'done' | 'approval_needed' | 'rejected' | 'backlog';

export type AgentStatus = 'active' | 'idle' | 'offline';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignees?: string[];
  project_id?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  cost_tokens?: number;
  output_url?: string;       // Link to output (file path, URL, etc.)
  output_type?: 'file' | 'link' | 'markdown' | 'image' | 'other';
  updated_at?: string;
  created_at: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  model?: string;
  prompt?: string;
  cost_tokens?: number;
  created_at?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'active' | 'complete' | 'on_hold' | 'paused' | 'archived';
  department?: string;
  done_tasks: number;
  total_tasks: number;
  cost_tokens?: number;
  created_at: string;
}

export interface Activity {
  id: string;
  agent_name: string;
  action: string;
  created_at: string;
}

export interface DashboardStats {
  total: number;
  active: number;
  done: number;
  rate: number;
  totalTokens: number;
  stalledCount: number;
}

// Model configuration for the global model selector
export interface ModelOption {
  id: string;
  label: string;
  provider: string;
  description?: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  { id: 'google/gemini-3.1-pro-preview', label: 'Gemini Pro', provider: 'Google', description: 'Fast & capable' },
  { id: 'openrouter/anthropic/claude-opus-4.6', label: 'Claude Opus', provider: 'Anthropic', description: 'Deep reasoning' },
  { id: 'openrouter/anthropic/claude-sonnet-4', label: 'Claude Sonnet', provider: 'Anthropic', description: 'Balanced' },
  { id: 'openrouter/openai/gpt-4.1', label: 'GPT-4.1', provider: 'OpenAI', description: 'General purpose' },
  { id: 'openrouter/openai/o3', label: 'o3', provider: 'OpenAI', description: 'Reasoning' },
  { id: 'openrouter/auto', label: 'Auto Router', provider: 'OpenRouter', description: 'Best model per task' },
  { id: 'openrouter/minimax/minimax-m2.5', label: 'MiniMax M2.5', provider: 'MiniMax', description: 'Cost efficient' },
];

export interface Feedback {
  id: string;
  title: string;
  description: string;
  category: 'bug' | 'feature' | 'improvement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'project_created' | 'done';
  created_at: string;
  updated_at: string;
  project_id?: string;
}
