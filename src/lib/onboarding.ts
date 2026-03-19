import { supabase } from './supabase';

// --- Types ---

export const ONBOARDING_STAGES = [
  'registration',
  'documents',
  'training',
  'background_check',
  'active',
] as const;

export type OnboardingStage = typeof ONBOARDING_STAGES[number];

export const STAGE_LABELS: Record<OnboardingStage, string> = {
  registration: 'Registration',
  documents: 'Documents',
  training: 'Training',
  background_check: 'Background Check',
  active: 'Active',
};

export const STAGE_COLORS: Record<OnboardingStage, { bg: string; text: string; border: string }> = {
  registration: { bg: 'bg-blue-500/10', text: 'text-blue-500', border: 'border-blue-500' },
  documents: { bg: 'bg-amber-500/10', text: 'text-amber-500', border: 'border-amber-500' },
  training: { bg: 'bg-purple-500/10', text: 'text-purple-500', border: 'border-purple-500' },
  background_check: { bg: 'bg-cyan-500/10', text: 'text-cyan-500', border: 'border-cyan-500' },
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', border: 'border-emerald-500' },
};

export interface StageHistoryEntry {
  stage: OnboardingStage;
  entered_at: string;
  exited_at?: string;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  current_stage: OnboardingStage;
  stage_history: StageHistoryEntry[];
  notes: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface OnboardingStats {
  total: number;
  inProgress: number;
  completed: number;
  completionRate: number;
}

// --- Helpers ---

export function daysInCurrentStage(driver: Driver): number {
  const history = driver.stage_history || [];
  const currentEntry = history.find(
    (h) => h.stage === driver.current_stage && !h.exited_at
  );
  const enteredAt = currentEntry?.entered_at || driver.created_at;
  const diffMs = Date.now() - new Date(enteredAt).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function isStalled(driver: Driver): boolean {
  return driver.current_stage !== 'active' && daysInCurrentStage(driver) > 3;
}

export function getNextStage(current: OnboardingStage): OnboardingStage | null {
  const idx = ONBOARDING_STAGES.indexOf(current);
  if (idx < 0 || idx >= ONBOARDING_STAGES.length - 1) return null;
  return ONBOARDING_STAGES[idx + 1];
}

export function computeStats(drivers: Driver[]): OnboardingStats {
  const total = drivers.length;
  const completed = drivers.filter((d) => d.current_stage === 'active').length;
  const inProgress = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, inProgress, completed, completionRate };
}

// --- Supabase queries ---

export async function fetchDrivers(): Promise<{ data: Driver[] | null; error: { message: string } | null }> {
  const { data, error } = await supabase
    .from('driver_onboarding')
    .select('*')
    .order('created_at', { ascending: false });
  return { data: data as Driver[] | null, error };
}

export async function addDriver(driver: {
  name: string;
  phone: string;
  email?: string;
}): Promise<{ data: Driver | null; error: { message: string } | null }> {
  const now = new Date().toISOString();
  const stageHistory: StageHistoryEntry[] = [
    { stage: 'registration', entered_at: now },
  ];

  const { data, error } = await supabase
    .from('driver_onboarding')
    .insert({
      name: driver.name,
      phone: driver.phone,
      email: driver.email || null,
      current_stage: 'registration',
      stage_history: stageHistory,
    })
    .select()
    .single();

  return { data: data as Driver | null, error };
}

export async function advanceStage(driver: Driver): Promise<{ data: Driver | null; error: { message: string } | null }> {
  const nextStage = getNextStage(driver.current_stage);
  if (!nextStage) return { data: null, error: { message: 'Already at final stage' } };

  const now = new Date().toISOString();
  const history = [...(driver.stage_history || [])];

  // Close current stage entry
  const currentIdx = history.findIndex(
    (h) => h.stage === driver.current_stage && !h.exited_at
  );
  if (currentIdx >= 0) {
    history[currentIdx] = { ...history[currentIdx], exited_at: now };
  }

  // Open new stage entry
  history.push({ stage: nextStage, entered_at: now });

  const updates: Record<string, any> = {
    current_stage: nextStage,
    stage_history: history,
    updated_at: now,
  };

  // If advancing to 'active', set completed_at
  if (nextStage === 'active') {
    updates.completed_at = now;
  }

  const { data, error } = await supabase
    .from('driver_onboarding')
    .update(updates)
    .eq('id', driver.id)
    .select()
    .single();

  return { data: data as Driver | null, error };
}

export async function deleteDriver(id: string): Promise<{ error: { message: string } | null }> {
  const { error } = await supabase
    .from('driver_onboarding')
    .delete()
    .eq('id', id);
  return { error };
}
