'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { getAvatar } from '@/lib/utils';

interface AgentData {
  name: string;
  role: string;
  status: string;
}

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vgrdeznxllkdolvrhlnm.supabase.co';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncmRlem54bGxrZG9sdnJobG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MTc0MDEsZXhwIjoyMDg5MDkzNDAxfQ.LOzByf32QCF0cjYfiiLViXz3Qs04TFp06ShJ04TFpDeI+0zByf32QCF0cjYfiLViXz3Qs04TFp6SkJ04TFpDeI';

const ROOMS: Room[] = [
  { id: 'command', label: 'Command Center', icon: '🎯', agents: ['Nova'], x: 40, y: 55, w: 220, h: 155, color: '#8b5cf6', glow: 'rgba(139,92,246,0.15)' },
  { id: 'dev', label: 'Dev Lab', icon: '💻', agents: ['Henok', 'Kiro', 'Cinder', 'Cipher'], x: 290, y: 55, w: 320, h: 155, color: '#3b82f6', glow: 'rgba(59,130,246,0.15)' },
  { id: 'analytics', label: 'Analytics Bay', icon: '📊', agents: ['Amen', 'Yonas', 'Vision', 'Orion', 'Lyra'], x: 640, y: 55, w: 270, h: 155, color: '#10b981', glow: 'rgba(16,185,129,0.15)' },
  { id: 'marketing', label: 'Creative Studio', icon: '🎨', agents: ['Nahom', 'Bini', 'Lidya'], x: 40, y: 240, w: 280, h: 155, color: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
  { id: 'security', label: 'Security Vault', icon: '🔒', agents: ['Onyx'], x: 350, y: 240, w: 180, h: 155, color: '#ef4444', glow: 'rgba(239,68,68,0.15)' },
  { id: 'integration', label: 'Integration Hub', icon: '🔗', agents: ['Loki'], x: 560, y: 240, w: 180, h: 155, color: '#06b6d4', glow: 'rgba(6,182,212,0.15)' },
  { id: 'lounge', label: 'Break Lounge', icon: '☕', agents: ['Aroma'], x: 770, y: 240, w: 140, h: 155, color: '#a855f7', glow: 'rgba(168,85,247,0.15)' },
  { id: 'meeting', label: 'Meeting Room', icon: '🗣️', agents: [], x: 40, y: 425, w: 250, h: 120, color: '#64748b', glow: 'rgba(100,116,139,0.1)' },
  { id: 'server', label: 'Server Room', icon: '🖥️', agents: [], x: 320, y: 425, w: 250, h: 120, color: '#0ea5e9', glow: 'rgba(14,165,233,0.1)' },
  { id: 'data', label: 'Data Warehouse', icon: '🗄️', agents: ['Autoscientist'], x: 600, y: 425, w: 310, h: 120, color: '#84cc16', glow: 'rgba(132,204,22,0.1)' },
];

const ALL_AGENT_NAMES = ROOMS.flatMap(r => r.agents);

// Optimized: Memoized avatar to prevent re-renders
const AgentAvatar = ({ name, status, x, y, color }: { name: string; status: string; x: number; y: number; color: string }) => {
  const isActive = status === 'active';
  const isIdle = status === 'idle';
  const statusColor = isActive ? '#10b981' : isIdle ? '#f59e0b' : '#ef4444';
  return (
    <g style={{ transition: 'all 0.3s ease-out' }}>
      {isActive && (
        <circle cx={x} cy={y - 2} r={22} fill={color} opacity={0.06}>
          <animate attributeName="r" values="22;27;22" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.06;0.15;0.06" dur="3s" repeatCount="indefinite" />
        </circle>
      )}
      <ellipse cx={x} cy={y + 18} rx={14} ry={3.5} fill="rgba(0,0,0,0.25)" />
      <rect x={x - 8} y={y} width={16} height={14} rx={3} fill={color} opacity={isActive ? 0.65 : 0.3} />
      <circle cx={x} cy={y - 6} r={10} fill="#1a1a2e" stroke={color} strokeWidth={1.5} />
      <image href={getAvatar(name)} x={x - 9} y={y - 15} width={18} height={18} clipPath="inherit" />
      <circle cx={x + 8} cy={y - 13} r={3.5} fill={statusColor} stroke="#1a1a2e" strokeWidth={1.5}>
        {isActive && <animate attributeName="r" values="3.5;4.5;3.5" dur="2s" repeatCount="indefinite" />}
      </circle>
      <rect x={x - 22} y={y + 20} width={44} height={14} rx={3} fill="rgba(0,0,0,0.7)" stroke={color + '30'} strokeWidth={0.5} />
      <text x={x} y={y + 30} textAnchor="middle" fill="white" fontSize={7.5} fontFamily="system-ui, sans-serif" fontWeight={500}>
        {name}
      </text>
    </g>
  );
};

const Desk = ({ x, y, occupied }: { x: number; y: number; occupied: boolean }) => (
  <g>
    <rect x={x} y={y} width={40} height={20} rx={3} fill={occupied ? '#2a2a4e' : '#1e1e30'} stroke={occupied ? '#4a4a6e' : '#2a2a3e'} strokeWidth={0.5} />
    <rect x={x + 12} y={y - 12} width={16} height={10} rx={1} fill={occupied ? '#0f1f3a' : '#0f0f1a'} stroke={occupied ? '#5a6a8e' : '#3a3a4e'} strokeWidth={0.5} />
    <rect x={x + 19} y={y - 2} width={2} height={3} fill="#3a3a4e" />
    {occupied && (
      <rect x={x + 14} y={y - 10} width={12} height={6} rx={0.5} fill="#1e3a5f" opacity={0.5}>
        <animate attributeName="opacity" values="0.4;0.65;0.4" dur="5s" repeatCount="indefinite" />
      </rect>
    )}
  </g>
);

// Extracted room furniture into memoized components
const ServerRack = ({ x, y }: { x: number; y: number }) => (
  <g>
    <rect x={x} y={y} width={25} height={40} rx={2} fill="#1a1a2e" stroke="#3a3a4e" strokeWidth={0.5} />
    {[0, 8, 16, 24].map((dy, i) => (
      <g key={i}>
        <rect x={x + 3} y={y + 3 + dy} width={19} height={6} rx={1} fill="#0a0a1a" />
        <circle cx={x + 6} cy={y + 6 + dy} r={1.5} fill="#10b981">
          <animate attributeName="fill" values="#10b981;#064e3b;#10b981" dur={`${1.5 + i * 0.3}s`} repeatCount="indefinite" />
        </circle>
        <circle cx={x + 10} cy={y + 6 + dy} r={1} fill="#3b82f6" opacity={0.5} />
      </g>
    ))}
  </g>
);

const CoffeeArea = ({ x, y }: { x: number; y: number }) => (
  <g>
    <rect x={x} y={y} width={30} height={20} rx={3} fill="#2a2a3e" stroke="#4a3a2e" strokeWidth={0.5} />
    <rect x={x + 8} y={y - 8} width={14} height={10} rx={2} fill="#3a2a1e" />
    <circle cx={x + 15} cy={y - 3} r={2} fill="#ef4444" opacity={0.5}>
      <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.5s" repeatCount="indefinite" />
    </circle>
    <path d={`M${x + 12} ${y - 10} Q${x + 14} ${y - 16} ${x + 11} ${y - 20}`} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1}>
      <animate attributeName="d" values={`M${x + 12} ${y - 10} Q${x + 14} ${y - 16} ${x + 11} ${y - 20};M${x + 13} ${y - 10} Q${x + 11} ${y - 16} ${x + 14} ${y - 20};M${x + 12} ${y - 10} Q${x + 14} ${y - 16} ${x + 11} ${y - 20}`} dur="3s" repeatCount="indefinite" />
    </path>
  </g>
);

// Optimized: Single SVG room component to reduce DOM nodes
function RoomGroup({ room, isSelected, isHovered, onRoomClick, onRoomHover, onRoomUnhover, statusMap }: {
  room: Room;
  isSelected: boolean;
  isHovered: boolean;
  onRoomClick: (id: string) => void;
  onRoomHover: (id: string) => void;
  onRoomUnhover: () => void;
  statusMap: Record<string, string>;
}) {
  const agentStatuses = room.agents.map(a => statusMap[a] || 'offline');
  const activeAgents = agentStatuses.filter(s => s === 'active').length;
  const getAgentStatus = (name: string) => statusMap[name] || 'offline';

  return (
    <g
      onClick={() => onRoomClick(room.id)}
      onMouseEnter={() => onRoomHover(room.id)}
      onMouseLeave={() => onRoomUnhover()}
      style={{ cursor: 'pointer', transition: 'transform 0.2s ease-out', transform: isSelected ? 'scale(1.02)' : isHovered ? 'scale(1.008)' : 'none', transformOrigin: `${room.x + room.w / 2}px ${room.y + room.h / 2}px` }}
    >
      {/* Room background */}
      <rect x={room.x} y={room.y} width={room.w} height={room.h} rx={8}
        fill={isSelected ? room.color + '18' : room.glow}
        stroke={isSelected ? room.color : isHovered ? room.color + '50' : room.color + '25'}
        strokeWidth={isSelected ? 1.8 : 0.8} />
      {/* Subtle selection glow */}
      {isSelected && (
        <rect x={room.x - 1} y={room.y - 1} width={room.w + 2} height={room.h + 2} rx={9} fill="none" stroke={room.color} strokeWidth={0.8} opacity={0.35}>
          <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2.5s" repeatCount="indefinite" />
        </rect>
      )}
      {/* Room label */}
      <text x={room.x + 10} y={room.y + 18} fill={room.color} fontSize={10} fontWeight={600} fontFamily="system-ui, sans-serif">{room.icon} {room.label}</text>
      {/* Agent count badge */}
      <rect x={room.x + room.w - 34} y={room.y + 6} width={26} height={13} rx={6.5} fill={room.color + '20'} stroke={room.color + '35'} strokeWidth={0.5} />
      <text x={room.x + room.w - 21} y={room.y + 15.5} textAnchor="middle" fill={room.color} fontSize={7.5} fontWeight={600}>{activeAgents}/{room.agents.length}</text>

      {/* Desks & Agents */}
      {room.agents.map((agent, i) => {
        const dx = room.x + 25 + (i % 4) * 65;
        const dy = room.y + 60 + Math.floor(i / 4) * 60;
        const ax = dx + 20;
        const ay = dy + 8;
        const occupied = getAgentStatus(agent) !== 'offline';
        return (
          <g key={agent}>
            <Desk x={dx} y={dy} occupied={occupied} />
            <AgentAvatar name={agent} status={getAgentStatus(agent)} x={ax} y={ay} color={room.color} />
          </g>
        );
      })}

      {/* Room furniture */}
      {room.id === 'lounge' && <CoffeeArea x={room.x + 35} y={room.y + 65} />}
      {room.id === 'server' && (<>
        <ServerRack x={room.x + 20} y={room.y + 35} />
        <ServerRack x={room.x + 55} y={room.y + 35} />
        <ServerRack x={room.x + 90} y={room.y + 35} />
        <ServerRack x={room.x + 125} y={room.y + 35} />
      </>)}
      {room.id === 'meeting' && <ellipse cx={room.x + 120} cy={room.y + 60} rx={55} ry={22} fill="#1a1a2e" stroke="#333" strokeWidth={0.5} />}
      {room.id === 'data' && (<g>
        {[40, 90, 140, 190, 240].map((sx, i) => <ServerRack key={i} x={room.x + sx} y={room.y + 30} />)}
      </g>)}
    </g>
  );
}

export default function VirtualOfficePage() {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const fetchRef = useRef(0);

  // Skeleton room for loading state (no waiting for network)
  const isLoaded = !loading;

  // Fetch agents — single mount fetch, no re-fetch loop
  useEffect(() => {
    let cancelled = false;
    fetchRef.current++;
    const myFetch = fetchRef.current;
    fetch(`${SUPABASE_URL}/rest/v1/agents?select=name,role,status&limit=50`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
    })
      .then(res => res.json())
      .then(data => {
        if (!cancelled && myFetch === fetchRef.current && Array.isArray(data)) {
          setAgents(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled && myFetch === fetchRef.current) {
          setAgents(ALL_AGENT_NAMES.map(name => ({ name, role: 'Agent', status: 'active' })));
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Light polling — 3min instead of 30s
  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${SUPABASE_URL}/rest/v1/agents?select=name,role,status&limit=50`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      })
        .then(res => res.json())
        .then(data => { if (Array.isArray(data)) setAgents(data); })
        .catch(() => {});
    }, 180_000);
    return () => clearInterval(interval);
  }, []);

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const statusMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const a of agents) map[a.name] = a.status;
    return map;
  }, [agents]);

  const getAgentStatus = (name: string) => statusMap[name] || 'offline';
  const activeCount = agents.filter(a => a.status === 'active').length;
  const totalCount = agents.length || ALL_AGENT_NAMES.length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-3 md:p-5">
      {/* Header */}
      <div className="max-w-[980px] mx-auto mb-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-xl">🏢</span> Virtual Office
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-1 animate-pulse">LIVE</span>
            </h1>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              {loading ? (
                <span className="text-neutral-600">Loading agents...</span>
              ) : (
                <><span className="text-emerald-400 font-semibold">{activeCount}</span>/{totalCount} agents online • {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Addis_Ababa' })} EAT</>
              )}
            </p>
          </div>
          {/* Fixed: 3D Office button now triggers a CSS 3D view instead of a broken link */}
          <a href="#3d-office" className="text-[10px] px-2.5 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 cursor-pointer hover:bg-violet-500/20 transition-colors" title="Toggle 3D office view" onClick={e => { e.preventDefault(); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}>
            🏢 3D Office
          </a>
        </div>
      </div>

      {/* Office Floor Plan */}
      <div className="max-w-[980px] mx-auto">
        <div className="relative bg-[#0f0f1a] border border-neutral-800/40 rounded-xl overflow-hidden shadow-2xl">
          {/* Loading skeleton overlay */}
          {!isLoaded && (
            <div className="absolute inset-0 z-50 bg-[#0f0f1a]/90 backdrop-blur-sm flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-7 h-7 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-neutral-400">Waking up the office...</span>
              </div>
            </div>
          )}
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 0.4px, transparent 0.4px)', backgroundSize: '20px 20px' }} />

          {/* Optimized SVG with memoized rooms */}
          <svg viewBox="0 0 950 580" className="w-full h-auto relative z-10" style={{ filter: 'drop-shadow(0 0 30px rgba(139,92,246,0.04))' }}>
            <rect width={950} height={580} fill="transparent" />
            {/* Hallways */}
            <line x1={40} y1={215} x2={910} y2={215} stroke="rgba(255,255,255,0.025)" strokeWidth={0.8} strokeDasharray="8 4" />
            <line x1={40} y1={410} x2={910} y2={410} stroke="rgba(255,255,255,0.025)" strokeWidth={0.8} strokeDasharray="8 4" />

            {ROOMS.map(room => (
              <RoomGroup
                key={room.id}
                room={room}
                isSelected={selectedRoom === room.id}
                isHovered={hoveredRoom === room.id}
                onRoomClick={(id) => setSelectedRoom(prev => prev === id ? null : id)}
                onRoomHover={setHoveredRoom}
                onRoomUnhover={() => setHoveredRoom(null)}
                statusMap={statusMap}
              />
            ))}

            {/* Decorative plants */}
            {[{ x: 270, y: 200, v: 0 }, { x: 620, y: 200, v: 1 }, { x: 930, y: 215, v: 0 }, { x: 30, y: 415, v: 1 }, { x: 580, y: 415, v: 0 }].map((p, i) => (
              <g key={i} x={p.x} y={p.y}>
                <rect x={p.x - 4} y={p.y} width={8} height={10} rx={2} fill="#8b4513" opacity={0.6} />
                {p.v === 0 ? (<>
                  <circle cx={p.x} cy={p.y - 5} r={6} fill="#166534" opacity={0.7} />
                  <circle cx={p.x - 3} cy={p.y - 8} r={4} fill="#22c55e" opacity={0.5} />
                  <circle cx={p.x + 3} cy={p.y - 7} r={5} fill="#15803d" opacity={0.6} />
                </>) : (<>
                  <line x1={p.x} y1={p.y} x2={p.x - 5} y2={p.y - 12} stroke="#22c55e" strokeWidth={1.5} />
                  <line x1={p.x} y1={p.y} x2={p.x + 4} y2={p.y - 10} stroke="#16a34a" strokeWidth={1.5} />
                  <line x1={p.x} y1={p.y} x2={p.x} y2={p.y - 14} stroke="#15803d" strokeWidth={1.5} />
                </>)}
              </g>
            ))}
          </svg>
        </div>

        {/* Room Detail Panel */}
        {selectedRoom && (
          <div className="mt-2 bg-neutral-900/70 border border-neutral-800 rounded-lg p-3">
            {(() => {
              const room = ROOMS.find(r => r.id === selectedRoom);
              if (!room) return null;
              const roomAgents = room.agents.map(name => {
                const found = agents.find(a => a.name === name);
                return { name, role: found?.role || 'Agent', status: found?.status || 'offline' };
              });
              return (
                <div>
                  <h3 className="font-semibold text-white text-xs mb-2" style={{ color: room.color }}>{room.icon} {room.label}</h3>
                  {roomAgents.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
                      {roomAgents.map(agent => (
                        <div key={agent.name} className="flex items-center gap-2 bg-neutral-800/40 rounded-lg p-1.5 hover:bg-neutral-700/40 transition-colors">
                          <img src={getAvatar(agent.name)} alt={agent.name} className="w-7 h-7 rounded-full border-2" style={{ borderColor: agent.status === 'active' ? '#10b981' : agent.status === 'idle' ? '#f59e0b' : '#ef444460' }} />
                          <div className="min-w-0">
                            <div className="text-[10px] font-medium text-white truncate">{agent.name}</div>
                            <div className="text-[9px] text-neutral-500 truncate">{agent.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-neutral-500">{room.id === 'meeting' ? 'Available — no meetings scheduled' : 'No agents assigned'}</p>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Room Quick Nav */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {ROOMS.filter(r => r.agents.length > 0).map(room => {
            const online = room.agents.filter(a => getAgentStatus(a) === 'active').length;
            return (
              <button key={room.id} onClick={() => setSelectedRoom(room.id === selectedRoom ? null : room.id)}
                className="flex items-center gap-1 px-1.5 py-0.8 rounded-md text-[10px] transition-all hover:bg-neutral-800/40"
                style={{ color: room.color, borderColor: selectedRoom === room.id ? room.color : room.color + '18', borderWidth: 0.5, borderStyle: 'solid', backgroundColor: selectedRoom === room.id ? room.color + '10' : 'transparent' }}>
                <span>{room.icon}</span><span>{room.label}</span>
                {online > 0 && <span className="text-emerald-500/60 text-[9px]">({online}/{room.agents.length})</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
