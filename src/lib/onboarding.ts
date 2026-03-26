export type DriverStatus = 'new' | 'documents' | 'background_check' | 'training' | 'active' | 'rejected';

export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string;
  vehicle_type: string;
  license_plate: string;
  status: DriverStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export const DRIVER_STATUSES: { id: DriverStatus; label: string; color: string }[] = [
  { id: 'new', label: 'New', color: 'bg-blue-500' },
  { id: 'documents', label: 'Documents', color: 'bg-amber-500' },
  { id: 'background_check', label: 'Background Check', color: 'bg-purple-500' },
  { id: 'training', label: 'Training', color: 'bg-cyan-500' },
  { id: 'active', label: 'Active', color: 'bg-emerald-500' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-500' },
];

export function getDriverStatusLabel(status: DriverStatus): string {
  return DRIVER_STATUSES.find(s => s.id === status)?.label || status;
}

export function getDriverStatusColor(status: DriverStatus): string {
  return DRIVER_STATUSES.find(s => s.id === status)?.color || 'bg-neutral-500';
}
