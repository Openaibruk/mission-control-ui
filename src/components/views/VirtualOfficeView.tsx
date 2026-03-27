'use client';

import { useState, useEffect } from 'react';
import { Agent, Activity, Task } from '@/lib/types';
import { getAvatar, getAgentStatusInfo } from '@/lib/utils';
import { useThemeClasses } from '@/hooks/useTheme';

interface Room {
  id: string;
  label: string;
  icon: string;
  agents: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  glow: string;
}

const ROOMS: Room[] = [
  { id: 'command', label: 'Command Center', icon: '🎯', agents: ['Nova'], x: 40, y: 55, w: 220, h: 155, color: '#8b5cf6', glow: 'rgba(139,92,246,0.15)' },
  { id: 'dev', label: 'Dev Lab', icon: '💻', agents: ['Henok', 'Kiro', 'Cinder', 'Cipher'], x: 290, y: 55, w: 320, h: 155, color: '#3b82f6', glow: 'rgba(59,130,246,0.15)' },
  { id: 'analytics', label: 'Analytics Bay', icon: '📊', agents: ['Amen', 'Yonas', 'Vision', 'Orion', 'Lyra'], x: 640, y: 55, w: 270, h: 155, color: '#10b981', glow: 'rgba(16,185,129,0.15)' },
  { id: 'marketing', label: 'Creative Studio', icon: '🎨', agents: ['Nahom', 'Bini', 'Lidya'], x: 40, y: 240, w: 280, h: 155, color: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
  { id: 'security', label: 'Security Vault', icon: '🔒', agents: ['Onyx'], x: 350, y: 240, w: 180, h: 155, color: '#ef4444', glow: 'rgba(239,68,68,0.15)' },
  { id: 'integration', label: 'Integration Hub', icon: '🔗', agents: ['Loki'], x: 560, y: 240, w: 180, h: 155, color: '#06b6d4', glow: 'rgba(6,182,212,0.15)' },
  { id: 'lounge', label: 'Break Lounge', icon: '☕', agents: [], x: 770, y: 240, w: 140, h: 155, color: '#a855f7', glow: 'rgba(168,85,247,0.15)' },
  { id: 'meeting', label: 'Meeting Room', icon: '🗣️', agents: [], x: 40, y: 425, w: 250, h: 120, color: '#64748b', glow: 'rgba(100,116,139,0.1)' },
  { id: 'server', label: 'Server Room', icon: '🖥️', agents: [], x: 320, y: 425, w: 250, h: 120, color: '#0ea5e9', glow: 'rgba(14,165,233,0.1)' },
  { id: 'data', label: 'Data Warehouse', icon: '🗄️', agents: [], x: 600, y: 425, w: 310, h: 120, color: '#84cc16', glow: 'rgba(132,204,22,0.1)' },
];

function AgentAvatar({ name, status, x, y, color }: { name: string; status: string; x: number; y: number; color: string }) {
  const isActive = status === 'active';
  return (
    <g className="agent-avatar">
      {/* Glow effect */}
      {isActive && (
        <circle cx={x} cy={y - 2} r={22} fill={color} opacity={0.08}>
          <animate attributeName="r" values="22;26;22" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.08;0.15;0.08" dur="3s" repeatCount="indefinite" />
        </circle>
      )}
      {/* Chair/desk shadow */}
      <ellipse cx={x} cy={y + 18} rx={14} ry={4} fill="rgba(0,0,0,0.3)" />
      {/* Body */}
      <rect x={x - 8} y={y} width={16} height={14} rx={3} fill={color} opacity={0.6} />
      {/* Head */}
      <circle cx={x} cy={y - 6} r={10} fill="#1a1a2e" stroke={color} strokeWidth={1.5} />
      {/* Avatar image */}
      <clipPath id={`clip-${name}`}><circle cx={x} cy={y - 6} r={9} /></clipPath>
      <image href={getAvatar(name)} x={x - 9} y={y - 15} width={18} height={18} clipPath={`url(#clip-${name})`} />
      {/* Status indicator */}
      <circle cx={x + 8} cy={y - 13} r={3.5} fill={isActive ? '#10b981' : '#ef4444'} stroke="#1a1a2e" strokeWidth={1.5}>
        {isActive && <animate attributeName="r" values="3.5;4.5;3.5" dur="2s" repeatCount="indefinite" />}
      </circle>
      {/* Name tag */}
      <rect x={x - 20} y={y + 20} width={40} height={14} rx={3} fill="rgba(0,0,0,0.7)" />
      <text x={x} y={y + 30} textAnchor="middle" fill="white" fontSize={8} fontFamily="'Inter', monospace" fontWeight={500}>
        {name}
      </text>
    </g>
  );
}

function Desk({ x, y, w }: { x: number; y: number; w?: number }) {
  const dw = w || 40;
  return (
    <g>
      <rect x={x} y={y} width={dw} height={20} rx={2} fill="#2a2a3e" stroke="#3a3a4e" strokeWidth={0.5} />
      {/* Monitor */}
      <rect x={x + dw/2 - 8} y={y - 12} width={16} height={10} rx={1} fill="#0f0f1a" stroke="#4a4a5e" strokeWidth={0.5} />
      <rect x={x + dw/2 - 1} y={y - 2} width={2} height={3} fill="#3a3a4e" />
      {/* Screen glow */}
      <rect x={x + dw/2 - 6} y={y - 10} width={12} height={6} rx={0.5} fill="#1e3a5f" opacity={0.5}>
        <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
      </rect>
    </g>
  );
}

function ServerRack({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={25} height={40} rx={2} fill="#1a1a2e" stroke="#3a3a4e" strokeWidth={0.5} />
      {[0, 8, 16, 24].map((dy, i) => (
        <g key={i}>
          <rect x={x + 3} y={y + 3 + dy} width={19} height={6} rx={1} fill="#0a0a1a" />
          <circle cx={x + 6} cy={y + 6 + dy} r={1.5} fill="#10b981">
            <animate attributeName="fill" values="#10b981;#064e3b;#10b981" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
          </circle>
          <circle cx={x + 10} cy={y + 6 + dy} r={1} fill="#3b82f6" opacity={0.6}>
            <animate attributeName="opacity" values="0.3;0.8;0.3" dur={`${2 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        </g>
      ))}
    </g>
  );
}

function Plant({ x, y, variant }: { x: number; y: number; variant?: number }) {
  const v = variant || 0;
  return (
    <g>
      <rect x={x - 4} y={y} width={8} height={10} rx={2} fill="#8b4513" opacity={0.7} />
      {v === 0 ? (
        <>
          <circle cx={x} cy={y - 5} r={6} fill="#166534" opacity={0.8} />
          <circle cx={x - 3} cy={y - 8} r={4} fill="#22c55e" opacity={0.6} />
          <circle cx={x + 3} cy={y - 7} r={5} fill="#15803d" opacity={0.7} />
        </>
      ) : (
        <>
          <line x1={x} y1={y} x2={x - 5} y2={y - 12} stroke="#22c55e" strokeWidth={1.5} />
          <line x1={x} y1={y} x2={x + 4} y2={y - 10} stroke="#16a34a" strokeWidth={1.5} />
          <line x1={x} y1={y} x2={x} y2={y - 14} stroke="#15803d" strokeWidth={1.5} />
        </>
      )}
    </g>
  );
}

function CoffeeArea({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={30} height={20} rx={3} fill="#2a2a3e" stroke="#4a3a2e" strokeWidth={0.5} />
      {/* Coffee machine */}
      <rect x={x + 8} y={y - 8} width={14} height={10} rx={2} fill="#3a2a1e" />
      <circle cx={x + 15} cy={y - 3} r={2} fill="#ef4444" opacity={0.6}>
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Steam */}
      <path d={`M${x + 12} ${y - 10} Q${x + 14} ${y - 16} ${x + 11} ${y - 20}`} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={1}>
        <animate attributeName="d" values={`M${x+12} ${y-10} Q${x+14} ${y-16} ${x+11} ${y-20};M${x+13} ${y-10} Q${x+11} ${y-16} ${x+14} ${y-20};M${x+12} ${y-10} Q${x+14} ${y-16} ${x+11} ${y-20}`} dur="3s" repeatCount="indefinite" />
      </path>
    </g>
  );
}

interface VirtualOfficeViewProps {
  agents: Agent[];
  activities: Activity[];
  tasks: Task[];
  theme: 'dark' | 'light';
}

export function VirtualOfficeView({ agents, activities, tasks, theme }: VirtualOfficeViewProps) {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Compute live statuses just like LiveAgentsView
  const getAgentStatus = (name: string) => {
    const agent = agents.find(a => a.name === name);
    if (!agent) return 'offline';
    const agentTasks = tasks.filter(t => t.assignees?.some(a => a.replace(/^@+/, '') === name));
    const agentActivities = activities.filter(a => a.agent_name?.replace(/^@+/, '') === name);
    
    let lastDate: Date | null = null;
    const currentTask = agentTasks.filter(t => t.status === 'in_progress').sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())[0];
    if (currentTask?.updated_at) lastDate = new Date(currentTask.updated_at);
    if (agentActivities.length > 0) {
      const latestAct = new Date(agentActivities[0].created_at);
      if (!lastDate || latestAct > lastDate) lastDate = latestAct;
    }
    
    return lastDate && (new Date().getTime() - lastDate.getTime()) < 600000 ? 'active' : lastDate && (new Date().getTime() - lastDate.getTime()) < 3600000 ? 'idle' : 'offline';
  };

  const getAgentRole = (name: string) => agents.find(a => a.name === name)?.role || 'Agent';

  const activeCount = agents.filter(a => getAgentStatus(a.name || '') === 'active').length;
  const totalCount = agents.length;

  return (
    <div className="p-4 md:p-6 w-full h-full">
      {/* Header */}
      <div className="max-w-[960px] mx-auto mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl">🏢</span> Virtual Office
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-2">
                LIVE
              </span>
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              {activeCount}/{totalCount} agents online • {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Africa/Addis_Ababa' })} EAT
            </p>
          </div>
          <div className="flex gap-2">
            <a href="http://16.170.169.167:5180" target="_blank" rel="noopener" className="text-[10px] px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition">
              🏢 3D Office
            </a>
          </div>
        </div>
      </div>

      {/* Office Floor Plan */}
      <div className="max-w-[960px] mx-auto">
        <div className="relative bg-[#0f0f1a] border border-neutral-800/50 rounded-xl overflow-hidden shadow-2xl">
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 0.5px, transparent 0.5px)',
            backgroundSize: '20px 20px'
          }} />

          <svg viewBox="0 0 950 580" className="w-full h-auto relative z-10" style={{ filter: 'drop-shadow(0 0 40px rgba(139,92,246,0.05))' }}>
            <defs>
              {ROOMS.map(room => (
                <filter key={`glow-${room.id}`} id={`glow-${room.id}`}>
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              ))}
              <pattern id="floor-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
                <rect width="20" height="20" fill="none" />
                <rect width="10" height="10" fill="rgba(255,255,255,0.01)" />
                <rect x="10" y="10" width="10" height="10" fill="rgba(255,255,255,0.01)" />
              </pattern>
            </defs>

            {/* Floor */}
            <rect x="0" y="0" width="950" height="580" fill="url(#floor-pattern)" />

            {/* Hallway lines */}
            <line x1="40" y1="222" x2="910" y2="222" stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="8 4" />
            <line x1="40" y1="410" x2="910" y2="410" stroke="rgba(255,255,255,0.03)" strokeWidth={1} strokeDasharray="8 4" />

            {/* Rooms */}
            {ROOMS.map(room => {
              const isSelected = selectedRoom === room.id;
              const roomAgents = room.agents.filter(a => getAgentStatus(a) === 'active');
              return (
                <g key={room.id} onClick={() => setSelectedRoom(isSelected ? null : room.id)} style={{ cursor: 'pointer' }}>
                  {/* Room background */}
                  <rect x={room.x} y={room.y} width={room.w} height={room.h} rx={8}
                    fill={room.glow} stroke={room.color + '30'} strokeWidth={isSelected ? 2 : 1} />
                  {/* Room highlight on hover */}
                  {isSelected && (
                    <rect x={room.x} y={room.y} width={room.w} height={room.h} rx={8}
                      fill="none" stroke={room.color} strokeWidth={1.5} opacity={0.5}>
                      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite" />
                    </rect>
                  )}
                  {/* Room label */}
                  <text x={room.x + 12} y={room.y + 20} fill={room.color} fontSize={11} fontWeight={700} fontFamily="'Inter', sans-serif">
                    {room.icon} {room.label}
                  </text>
                  {/* Agent count badge */}
                  <rect x={room.x + room.w - 35} y={room.y + 8} width={26} height={14} rx={7} fill={room.color + '20'} />
                  <text x={room.x + room.w - 22} y={room.y + 18.5} textAnchor="middle" fill={room.color} fontSize={8} fontWeight={600} fontFamily="'Inter', monospace">
                    {roomAgents.length}/{room.agents.length}
                  </text>

                  {/* Desks */}
                  {room.agents.map((_, i) => {
                    const dx = room.x + 30 + (i % 4) * 65;
                    const dy = room.y + 65 + Math.floor(i / 4) * 60;
                    return <Desk key={`desk-${room.id}-${i}`} x={dx} y={dy} />;
                  })}

                  {/* Agents */}
                  {room.agents.map((agent, i) => {
                    const ax = room.x + 50 + (i % 4) * 65;
                    const ay = room.y + 70 + Math.floor(i / 4) * 60;
                    return (
                      <AgentAvatar key={agent} name={agent} status={getAgentStatus(agent)} x={ax} y={ay} color={room.color} />
                    );
                  })}

                  {/* Furniture for empty rooms */}
                  {room.agents.length === 0 && room.id === 'lounge' && (
                    <>
                      <CoffeeArea x={room.x + 40} y={room.y + 70} />
                      <rect x={room.x + 20} y={room.y + 100} width={50} height={18} rx={9} fill="#3a2a3e" opacity={0.5} />
                      <text x={room.x + 45} y={room.y + 112} textAnchor="middle" fill="#666" fontSize={8}>sofa</text>
                    </>
                  )}
                  {room.agents.length === 0 && room.id === 'server' && (
                    <>
                      <ServerRack x={room.x + 30} y={room.y + 40} />
                      <ServerRack x={room.x + 70} y={room.y + 40} />
                      <ServerRack x={room.x + 110} y={room.y + 40} />
                      <ServerRack x={room.x + 150} y={room.y + 40} />
                    </>
                  )}
                  {room.agents.length === 0 && room.id === 'meeting' && (
                    <>
                      <rect x={room.x + 60} y={room.y + 40} width={120} height={50} rx={25} fill="#1a1a2e" stroke="#333" strokeWidth={0.5} />
                      <text x={room.x + 120} y={room.y + 68} textAnchor="middle" fill="#444" fontSize={9}>Conference Table</text>
                    </>
                  )}
                  {room.agents.length === 0 && room.id === 'data' && (
                    <>
                      <ServerRack x={room.x + 40} y={room.y + 35} />
                      <ServerRack x={room.x + 80} y={room.y + 35} />
                      <ServerRack x={room.x + 120} y={room.y + 35} />
                      <ServerRack x={room.x + 160} y={room.y + 35} />
                      <ServerRack x={room.x + 200} y={room.y + 35} />
                      <ServerRack x={room.x + 240} y={room.y + 35} />
                    </>
                  )}
                </g>
              );
            })}

            {/* Plants scattered around */}
            <Plant x={270} y={200} variant={0} />
            <Plant x={620} y={200} variant={1} />
            <Plant x={930} y={215} variant={0} />
            <Plant x={30} y={415} variant={1} />
            <Plant x={580} y={415} variant={0} />
          </svg>
        </div>

        {/* Room Detail Panel */}
        {selectedRoom && (
          <div className="mt-3 bg-neutral-900/80 border border-neutral-800 rounded-lg p-4 animate-in slide-in-from-bottom-2">
            {(() => {
              const room = ROOMS.find(r => r.id === selectedRoom);
              if (!room) return null;
              const roomAgents = room.agents.map(name => ({
                name,
                role: getAgentRole(name),
                status: getAgentStatus(name)
              }));
              return (
                <div>
                  <h3 className="font-semibold text-white text-sm mb-3" style={{ color: room.color }}>
                    {room.icon} {room.label}
                  </h3>
                  {roomAgents.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {roomAgents.map(agent => (
                        <div key={agent.name} className="flex items-center gap-2 bg-neutral-800/50 rounded-lg p-2">
                          <img src={getAvatar(agent.name)} alt={agent.name} className="w-8 h-8 rounded-full" />
                          <div className="min-w-0">
                            <div className="text-xs font-medium text-white truncate">{agent.name}</div>
                            <div className="text-[10px] text-neutral-500 truncate">{agent.role || 'Agent'}</div>
                            <div className={`text-[9px] ${agent.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {agent.status === 'active' ? '● Online' : '○ Offline'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-neutral-500">No agents assigned to this room</p>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Status Bar */}
        <div className="mt-3 flex flex-wrap gap-2">
          {ROOMS.filter(r => r.agents.length > 0).map(room => {
            const online = room.agents.filter(a => getAgentStatus(a) === 'active').length;
            return (
              <button key={room.id} onClick={() => setSelectedRoom(room.id)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] transition-colors hover:bg-neutral-800/50"
                style={{ color: room.color, borderColor: room.color + '20', borderWidth: 1 }}>
                <span>{room.icon}</span>
                <span>{room.label}</span>
                <span className="text-neutral-600">({online}/{room.agents.length})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
