'use client';

import { useState } from 'react';
import { cn, getThemeClasses } from '@/lib/utils';
import { Driver, DriverStatus, DRIVER_STATUSES } from '@/lib/onboarding';
import { X } from 'lucide-react';

interface AddDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (driver: Omit<Driver, 'id' | 'created_at' | 'updated_at'>) => void;
  theme: 'dark' | 'light';
}

export default function AddDriverModal({ isOpen, onClose, onAdd, theme }: AddDriverModalProps) {
  const isDark = theme === 'dark';
  const classes = getThemeClasses(isDark);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    vehicle_type: '',
    license_plate: '',
    status: 'new' as DriverStatus,
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onAdd(form);
    setForm({ name: '', phone: '', email: '', vehicle_type: '', license_plate: '', status: 'new', notes: '' });
    onClose();
  };

  const inputClass = cn("w-full rounded-lg px-3 py-2 text-sm outline-none", classes.input);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative w-full max-w-md rounded-xl border shadow-2xl", classes.card)}>
        <div className={cn("flex items-center justify-between px-5 py-4 border-b", classes.divider)}>
          <h3 className={cn("text-sm font-semibold", classes.heading)}>Add New Driver</h3>
          <button onClick={onClose} className={cn("p-1 rounded", classes.hover)}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-3">
          <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputClass} required />
          <input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className={inputClass} />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputClass} />
          <input type="text" placeholder="Vehicle Type" value={form.vehicle_type} onChange={e => setForm(f => ({ ...f, vehicle_type: e.target.value }))} className={inputClass} />
          <input type="text" placeholder="License Plate" value={form.license_plate} onChange={e => setForm(f => ({ ...f, license_plate: e.target.value }))} className={inputClass} />
          <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as DriverStatus }))} className={inputClass}>
            {DRIVER_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <textarea placeholder="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className={cn(inputClass, "h-20 resize-none")} />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className={cn("px-4 py-2 rounded-lg text-sm", classes.hover)}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm bg-violet-600 hover:bg-violet-700 text-white">Add Driver</button>
          </div>
        </form>
      </div>
    </div>
  );
}
