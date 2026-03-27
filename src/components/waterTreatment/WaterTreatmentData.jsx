import React from 'react';

/* ═══════════════════════════════════════════════════════════════════
   CONNECTION TYPES — visual profiles for pipes, cables, etc.
═══════════════════════════════════════════════════════════════════ */
export const CONNECTION_TYPES = {
  water_pipe: {
    id: 'water_pipe',
    label: 'Water Pipe',
    icon: '🔵',
    thickness: 14,
    layers: [
      { width: 14, colors: ['#94a3b8','#64748b','#475569','#334155','#1e293b'], opacity: 1 },
      { width: 8,  colors: ['#93c5fd','#3b82f6','#1d4ed8'], opacity: 0.5 },
      { width: 5,  color: '#60a5fa', opacity: 0.3, dashArray: '8 12', animated: true },
    ],
    fitting: { r: 9, fill: '#475569', stroke: '#64748b', sw: 2 },
    elbow:   { r: 9, fill: '#475569', stroke: '#64748b', sw: 2 },
    color: '#3b82f6',
  },
  chemical_pipe: {
    id: 'chemical_pipe',
    label: 'Chemical Pipe',
    icon: '🟢',
    thickness: 12,
    layers: [
      { width: 12, colors: ['#6b7280','#374151','#1f2937','#111827'], opacity: 1 },
      { width: 6,  colors: ['#86efac','#22c55e','#15803d'], opacity: 0.6 },
      { width: 4,  color: '#4ade80', opacity: 0.25, dashArray: '6 10', animated: true },
    ],
    fitting: { r: 8, fill: '#15803d', stroke: '#22c55e', sw: 2 },
    elbow:   { r: 8, fill: '#15803d', stroke: '#22c55e', sw: 2 },
    color: '#22c55e',
  },
  electrical: {
    id: 'electrical',
    label: 'Electrical Cable',
    icon: '⚡',
    thickness: 8,
    layers: [
      { width: 8, colors: ['#57534e','#292524','#1c1917'], opacity: 1 },
      { width: 3, colors: ['#fca5a5','#ef4444','#b91c1c'], opacity: 0.9 },
    ],
    fitting: { r: 6, fill: '#292524', stroke: '#ef4444', sw: 1.5 },
    elbow:   { r: 5, fill: '#292524', stroke: '#78350f', sw: 1.5 },
    color: '#ef4444',
  },
  data_cable: {
    id: 'data_cable',
    label: 'Data Cable',
    icon: '🔷',
    thickness: 6,
    layers: [
      { width: 6, colors: ['#334155','#0f172a','#1e293b'], opacity: 1 },
      { width: 2, color: '#06b6d4', opacity: 0.9 },
      { width: 6, color: '#06b6d4', opacity: 0.15, dashArray: '3 10', animated: true },
    ],
    fitting: { r: 5, fill: '#0f172a', stroke: '#06b6d4', sw: 1.5 },
    elbow:   { r: 4, fill: '#0f172a', stroke: '#1e293b', sw: 1.5 },
    color: '#06b6d4',
  },
};

/* ═══════════════════════════════════════════════════════════════════
   PORT TYPES
═══════════════════════════════════════════════════════════════════ */
export const PORT_COLORS = {
  water:      '#3b82f6',
  chemical:   '#22c55e',
  electrical: '#ef4444',
  data:       '#06b6d4',
  waste:      '#a16207',
  any:        '#94a3b8',
};

/* ═══════════════════════════════════════════════════════════════════
   SVG ICON COMPONENTS — clean industrial P&ID style
   Each returns an SVG element sized to 64x64, viewBox "0 0 64 64"
═══════════════════════════════════════════════════════════════════ */
// Helper: standard SVG wrapper
const Ic = ({ children, bg }) => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:'block' }}>
    {bg && <rect width="64" height="64" rx="8" fill={bg} opacity="0.15"/>}
    {children}
  </svg>
);

export const ICONS = {
  /* ── 1. Flow System ── */
  pump: () => (
    <Ic bg="#3b82f6">
      <circle cx="32" cy="32" r="16" stroke="#3b82f6" strokeWidth="2.5" fill="#1e3a5f"/>
      <path d="M32 16 L32 10 M32 48 L32 54" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
      <path d="M20 32 L44 32" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" markerEnd="url(#arrowBlue)"/>
      <polygon points="42,28 50,32 42,36" fill="#60a5fa"/>
      <circle cx="32" cy="32" r="6" fill="#3b82f6" opacity="0.4"/>
      <path d="M26 32 C26 26 38 26 38 32 C38 38 26 38 26 32" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
    </Ic>
  ),
  pipe_section: () => (
    <Ic bg="#64748b">
      <rect x="8" y="26" width="48" height="12" rx="6" fill="#475569" stroke="#64748b" strokeWidth="1.5"/>
      <rect x="8" y="28" width="48" height="4" rx="2" fill="#94a3b8" opacity="0.3"/>
      <rect x="6" y="24" width="6" height="16" rx="2" fill="#64748b"/>
      <rect x="52" y="24" width="6" height="16" rx="2" fill="#64748b"/>
    </Ic>
  ),
  valve: () => (
    <Ic bg="#14b8a6">
      <rect x="8" y="28" width="48" height="8" rx="4" fill="#475569"/>
      <polygon points="24,22 40,22 44,28 20,28" fill="#0f766e" stroke="#14b8a6" strokeWidth="1.5"/>
      <polygon points="24,42 40,42 44,36 20,36" fill="#0f766e" stroke="#14b8a6" strokeWidth="1.5"/>
      <rect x="30" y="12" width="4" height="12" rx="2" fill="#14b8a6"/>
      <circle cx="32" cy="10" r="4" fill="#14b8a6" stroke="#0f766e" strokeWidth="1.5"/>
    </Ic>
  ),
  flow_meter: () => (
    <Ic bg="#f59e0b">
      <circle cx="32" cy="32" r="14" stroke="#f59e0b" strokeWidth="2" fill="#451a03" opacity="0.8"/>
      <circle cx="32" cy="32" r="14" stroke="#f59e0b" strokeWidth="2" fill="none"/>
      <path d="M22 32 L42 32" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 2"/>
      <polygon points="40,29 46,32 40,35" fill="#fbbf24"/>
      <text x="32" y="24" textAnchor="middle" fontSize="7" fill="#fde68a" fontWeight="600">F</text>
      <rect x="4" y="28" width="12" height="8" rx="4" fill="#475569"/>
      <rect x="48" y="28" width="12" height="8" rx="4" fill="#475569"/>
    </Ic>
  ),

  /* ── 2. Containers ── */
  raw_water_tank: () => (
    <Ic bg="#6366f1">
      <rect x="12" y="14" width="40" height="38" rx="3" stroke="#6366f1" strokeWidth="2" fill="#1e1b4b"/>
      <path d="M14 35 Q22 30 32 35 Q42 40 50 35 L50 50 Q50 52 48 52 L16 52 Q14 52 14 50 Z" fill="#3b82f6" opacity="0.4"/>
      <path d="M14 35 Q22 30 32 35 Q42 40 50 35" stroke="#60a5fa" strokeWidth="1.5" fill="none"/>
      <text x="32" y="26" textAnchor="middle" fontSize="7" fill="#a5b4fc" fontWeight="600">RAW</text>
    </Ic>
  ),
  mixing_tank: () => (
    <Ic bg="#8b5cf6">
      <rect x="12" y="14" width="40" height="38" rx="3" stroke="#8b5cf6" strokeWidth="2" fill="#2e1065"/>
      <rect x="12" y="30" width="40" height="22" rx="0 0 3 3" fill="#7c3aed" opacity="0.25"/>
      <line x1="32" y1="8" x2="32" y2="40" stroke="#a78bfa" strokeWidth="2"/>
      <path d="M26 36 L32 40 L38 36" stroke="#c4b5fd" strokeWidth="1.5" fill="none"/>
      <path d="M26 32 L32 36 L38 32" stroke="#c4b5fd" strokeWidth="1.5" fill="none"/>
      <circle cx="32" cy="8" r="3" fill="#8b5cf6"/>
    </Ic>
  ),
  settling_tank: () => (
    <Ic bg="#0ea5e9">
      <rect x="10" y="14" width="44" height="36" rx="3" stroke="#0ea5e9" strokeWidth="2" fill="#0c4a6e"/>
      <rect x="12" y="38" width="40" height="10" rx="1" fill="#92400e" opacity="0.5"/>
      <path d="M12 32 Q22 28 32 32 Q42 36 52 32" stroke="#38bdf8" strokeWidth="1" fill="none" opacity="0.5"/>
      <circle cx="20" cy="40" r="1.5" fill="#a16207" opacity="0.6"/>
      <circle cx="28" cy="42" r="2" fill="#a16207" opacity="0.5"/>
      <circle cx="38" cy="41" r="1.5" fill="#a16207" opacity="0.6"/>
      <circle cx="44" cy="43" r="1" fill="#a16207" opacity="0.5"/>
      <text x="32" y="24" textAnchor="middle" fontSize="6" fill="#7dd3fc" fontWeight="500">SETTLE</text>
    </Ic>
  ),
  storage_tank: () => (
    <Ic bg="#3b82f6">
      <rect x="12" y="10" width="40" height="42" rx="3" stroke="#3b82f6" strokeWidth="2" fill="#172554"/>
      <rect x="12" y="24" width="40" height="28" rx="0 0 3 3" fill="#1d4ed8" opacity="0.3"/>
      <path d="M12 24 L52 24" stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 2"/>
      <text x="32" y="20" textAnchor="middle" fontSize="6" fill="#93c5fd" fontWeight="600">CLEAN</text>
      <rect x="46" y="30" width="6" height="12" rx="1" fill="#3b82f6" opacity="0.5"/>
      <text x="49" y="38" textAnchor="middle" fontSize="5" fill="#bfdbfe">L</text>
    </Ic>
  ),

  /* ── 3. Filters ── */
  sand_filter: () => (
    <Ic bg="#d97706">
      <rect x="14" y="10" width="36" height="44" rx="4" stroke="#d97706" strokeWidth="2" fill="#451a03"/>
      <rect x="16" y="30" width="32" height="6" fill="#92400e" opacity="0.6"/>
      <rect x="16" y="36" width="32" height="6" fill="#78350f" opacity="0.7"/>
      <rect x="16" y="42" width="32" height="10" rx="0 0 2 2" fill="#713f12" opacity="0.8"/>
      <circle cx="22" cy="34" r="1" fill="#fbbf24" opacity="0.4"/><circle cx="30" cy="38" r="1.5" fill="#fbbf24" opacity="0.3"/>
      <circle cx="38" cy="34" r="1" fill="#fbbf24" opacity="0.4"/><circle cx="26" cy="44" r="1" fill="#fbbf24" opacity="0.3"/>
      <text x="32" y="22" textAnchor="middle" fontSize="6" fill="#fde68a" fontWeight="600">SAND</text>
    </Ic>
  ),
  carbon_filter: () => (
    <Ic bg="#6b7280">
      <rect x="14" y="10" width="36" height="44" rx="4" stroke="#6b7280" strokeWidth="2" fill="#111827"/>
      <rect x="16" y="28" width="32" height="24" rx="0 0 2 2" fill="#1f2937"/>
      <circle cx="22" cy="36" r="2" fill="#374151"/><circle cx="32" cy="34" r="2.5" fill="#374151"/>
      <circle cx="40" cy="38" r="2" fill="#374151"/><circle cx="26" cy="42" r="2" fill="#374151"/>
      <circle cx="36" cy="44" r="2" fill="#374151"/><circle cx="30" cy="48" r="1.5" fill="#374151"/>
      <text x="32" y="22" textAnchor="middle" fontSize="5.5" fill="#d1d5db" fontWeight="600">CARBON</text>
    </Ic>
  ),
  cartridge_filter: () => (
    <Ic bg="#a855f7">
      <rect x="18" y="8" width="28" height="48" rx="4" stroke="#a855f7" strokeWidth="2" fill="#3b0764"/>
      {[18,24,30,36,42].map(y => (
        <line key={y} x1="22" y1={y} x2="42" y2={y} stroke="#7c3aed" strokeWidth="0.8" opacity="0.5"/>
      ))}
      <rect x="22" y="12" width="20" height="40" rx="2" fill="#6d28d9" opacity="0.2"/>
      <text x="32" y="34" textAnchor="middle" fontSize="5" fill="#c4b5fd" fontWeight="600">CART</text>
    </Ic>
  ),
  uf_membrane: () => (
    <Ic bg="#0284c7">
      <rect x="12" y="12" width="40" height="40" rx="4" stroke="#0284c7" strokeWidth="2" fill="#082f49"/>
      {[20,26,32,38,44].map(y => (
        <rect key={y} x="16" y={y-1} width="32" height="2" rx="1" fill="#0369a1" opacity="0.5"/>
      ))}
      <text x="32" y="18" textAnchor="middle" fontSize="5.5" fill="#7dd3fc" fontWeight="600">UF</text>
      <path d="M16 28 L48 28" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.4"/>
    </Ic>
  ),

  /* ── 4. RO System ── */
  ro_membrane: () => (
    <Ic bg="#0891b2">
      <ellipse cx="32" cy="32" rx="22" ry="14" stroke="#0891b2" strokeWidth="2" fill="#083344"/>
      <ellipse cx="32" cy="32" rx="16" ry="10" stroke="#06b6d4" strokeWidth="1" fill="none" strokeDasharray="3 2"/>
      <ellipse cx="32" cy="32" rx="10" ry="6" stroke="#22d3ee" strokeWidth="1" fill="#06b6d4" opacity="0.2"/>
      <text x="32" y="35" textAnchor="middle" fontSize="7" fill="#67e8f9" fontWeight="700">RO</text>
    </Ic>
  ),
  pressure_vessel: () => (
    <Ic bg="#475569">
      <rect x="10" y="18" width="44" height="28" rx="14" stroke="#64748b" strokeWidth="2" fill="#1e293b"/>
      <ellipse cx="12" cy="32" rx="4" ry="12" fill="#334155" stroke="#64748b" strokeWidth="1.5"/>
      <ellipse cx="52" cy="32" rx="4" ry="12" fill="#334155" stroke="#64748b" strokeWidth="1.5"/>
      <line x1="20" y1="24" x2="44" y2="24" stroke="#94a3b8" strokeWidth="0.8" opacity="0.3"/>
      <line x1="20" y1="40" x2="44" y2="40" stroke="#94a3b8" strokeWidth="0.8" opacity="0.3"/>
      <text x="32" y="35" textAnchor="middle" fontSize="6" fill="#cbd5e1" fontWeight="600">PV</text>
    </Ic>
  ),
  hp_pump: () => (
    <Ic bg="#2563eb">
      <circle cx="32" cy="32" r="16" stroke="#2563eb" strokeWidth="2.5" fill="#1e3a5f"/>
      <polygon points="42,28 52,32 42,36" fill="#60a5fa"/>
      <circle cx="32" cy="32" r="6" fill="#2563eb" opacity="0.5"/>
      <path d="M26 32 C26 26 38 26 38 32 C38 38 26 38 26 32" stroke="#93c5fd" strokeWidth="1.5" fill="none"/>
      <text x="32" y="12" textAnchor="middle" fontSize="6" fill="#93c5fd" fontWeight="700">HP</text>
      <path d="M10 32 L16 32" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
    </Ic>
  ),

  /* ── 5. Chemical System ── */
  dosing_pump: () => (
    <Ic bg="#22c55e">
      <rect x="16" y="18" width="32" height="28" rx="4" stroke="#22c55e" strokeWidth="2" fill="#052e16"/>
      <circle cx="32" cy="32" r="8" stroke="#4ade80" strokeWidth="1.5" fill="#166534" opacity="0.7"/>
      <polygon points="36,30 40,32 36,34" fill="#4ade80"/>
      <rect x="12" y="28" width="8" height="8" rx="2" fill="#15803d"/>
      <rect x="44" y="28" width="8" height="8" rx="2" fill="#15803d"/>
      <text x="32" y="16" textAnchor="middle" fontSize="5" fill="#86efac" fontWeight="600">DOSE</text>
    </Ic>
  ),
  chemical_tank: () => (
    <Ic bg="#16a34a">
      <rect x="14" y="12" width="36" height="40" rx="3" stroke="#16a34a" strokeWidth="2" fill="#052e16"/>
      <rect x="14" y="28" width="36" height="24" rx="0 0 3 3" fill="#15803d" opacity="0.3"/>
      <polygon points="26,20 32,14 38,20" fill="#f59e0b" stroke="#eab308" strokeWidth="1"/>
      <text x="32" y="26" textAnchor="middle" fontSize="4" fill="#fde68a" fontWeight="600">⚠</text>
      <text x="32" y="40" textAnchor="middle" fontSize="6" fill="#86efac" fontWeight="600">CHEM</text>
    </Ic>
  ),
  chemical_pipe: () => (
    <Ic bg="#22c55e">
      <rect x="8" y="26" width="48" height="12" rx="6" fill="#1f2937" stroke="#374151" strokeWidth="1.5"/>
      <rect x="8" y="29" width="48" height="6" rx="3" fill="#22c55e" opacity="0.3"/>
      <rect x="6" y="24" width="6" height="16" rx="2" fill="#15803d" stroke="#22c55e" strokeWidth="1"/>
      <rect x="52" y="24" width="6" height="16" rx="2" fill="#15803d" stroke="#22c55e" strokeWidth="1"/>
      <line x1="14" y1="32" x2="50" y2="32" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 3" opacity="0.5"/>
    </Ic>
  ),

  /* ── 6. Disinfection ── */
  uv_system: () => (
    <Ic bg="#a855f7">
      <rect x="14" y="20" width="36" height="24" rx="4" stroke="#a855f7" strokeWidth="2" fill="#2e1065"/>
      <rect x="20" y="26" width="24" height="12" rx="2" fill="#7c3aed" opacity="0.3"/>
      <line x1="26" y1="32" x2="38" y2="32" stroke="#e9d5ff" strokeWidth="2" strokeLinecap="round"/>
      {[22,28,34,42].map(x => (
        <line key={x} x1={x} y1="18" x2={x} y2="14" stroke="#c084fc" strokeWidth="1" opacity="0.6" strokeLinecap="round"/>
      ))}
      <text x="32" y="52" textAnchor="middle" fontSize="6" fill="#c4b5fd" fontWeight="600">UV</text>
    </Ic>
  ),
  chlorine_system: () => (
    <Ic bg="#eab308">
      <rect x="18" y="12" width="28" height="40" rx="6" stroke="#eab308" strokeWidth="2" fill="#422006"/>
      <circle cx="32" cy="28" r="8" fill="#854d0e" stroke="#fbbf24" strokeWidth="1.5"/>
      <text x="32" y="31" textAnchor="middle" fontSize="7" fill="#fde68a" fontWeight="700">Cl</text>
      <rect x="26" y="40" width="12" height="4" rx="1" fill="#a16207"/>
      <rect x="29" y="44" width="6" height="6" rx="1" fill="#78350f" stroke="#a16207" strokeWidth="1"/>
    </Ic>
  ),
  ozone_system: () => (
    <Ic bg="#06b6d4">
      <rect x="14" y="16" width="36" height="32" rx="4" stroke="#06b6d4" strokeWidth="2" fill="#083344"/>
      <circle cx="32" cy="30" r="10" fill="#0e7490" opacity="0.5" stroke="#22d3ee" strokeWidth="1"/>
      <text x="32" y="34" textAnchor="middle" fontSize="8" fill="#67e8f9" fontWeight="700">O₃</text>
      <path d="M22 44 L26 40 L30 44 L34 40 L38 44 L42 40" stroke="#22d3ee" strokeWidth="1" fill="none" opacity="0.5"/>
    </Ic>
  ),

  /* ── 7. Waste Handling ── */
  sludge_tank: () => (
    <Ic bg="#92400e">
      <rect x="12" y="14" width="40" height="38" rx="3" stroke="#92400e" strokeWidth="2" fill="#451a03"/>
      <rect x="12" y="30" width="40" height="22" rx="0 0 3 3" fill="#78350f" opacity="0.6"/>
      <path d="M14 30 Q24 26 34 30 Q44 34 52 30" stroke="#a16207" strokeWidth="1.5" fill="none"/>
      <text x="32" y="22" textAnchor="middle" fontSize="5" fill="#fbbf24" fontWeight="600">SLUDGE</text>
    </Ic>
  ),
  filter_press: () => (
    <Ic bg="#9ca3af">
      <rect x="10" y="20" width="44" height="24" rx="2" stroke="#9ca3af" strokeWidth="2" fill="#1f2937"/>
      {[16,22,28,34,40,46].map(x => (
        <rect key={x} x={x} y="22" width="3" height="20" rx="1" fill="#4b5563" stroke="#6b7280" strokeWidth="0.5"/>
      ))}
      <rect x="8" y="26" width="6" height="12" rx="2" fill="#6b7280"/>
      <rect x="50" y="26" width="6" height="12" rx="2" fill="#6b7280"/>
      <polygon points="6,32 2,28 2,36" fill="#9ca3af"/>
    </Ic>
  ),
  drain_system: () => (
    <Ic bg="#64748b">
      <rect x="16" y="8" width="32" height="12" rx="2" fill="#334155" stroke="#64748b" strokeWidth="1.5"/>
      <line x1="32" y1="20" x2="32" y2="40" stroke="#64748b" strokeWidth="3"/>
      <circle cx="32" cy="46" r="8" stroke="#64748b" strokeWidth="2" fill="#1e293b"/>
      {[0,1,2,3,4,5].map(i => (
        <line key={i} x1={26+i*2.4} y1="42" x2={26+i*2.4} y2="50" stroke="#475569" strokeWidth="0.8"/>
      ))}
    </Ic>
  ),

  /* ── 8. Control & Monitoring ── */
  control_panel: () => (
    <Ic bg="#ef4444">
      <rect x="12" y="8" width="40" height="48" rx="3" stroke="#dc2626" strokeWidth="2" fill="#1c1917"/>
      <rect x="16" y="12" width="32" height="20" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1"/>
      <rect x="18" y="14" width="12" height="6" rx="1" fill="#22c55e" opacity="0.6"/>
      <rect x="34" y="14" width="12" height="6" rx="1" fill="#3b82f6" opacity="0.6"/>
      <circle cx="24" cy="26" r="2" fill="#ef4444"/><circle cx="32" cy="26" r="2" fill="#22c55e"/>
      <circle cx="40" cy="26" r="2" fill="#f59e0b"/>
      <rect x="18" y="38" width="8" height="4" rx="1" fill="#374151"/><rect x="28" y="38" width="8" height="4" rx="1" fill="#374151"/>
      <rect x="38" y="38" width="8" height="4" rx="1" fill="#374151"/>
      <text x="32" y="50" textAnchor="middle" fontSize="5" fill="#fca5a5" fontWeight="600">PLC</text>
    </Ic>
  ),
  sensors: () => (
    <Ic bg="#06b6d4">
      <rect x="22" y="8" width="20" height="14" rx="3" stroke="#06b6d4" strokeWidth="2" fill="#083344"/>
      <text x="32" y="18" textAnchor="middle" fontSize="6" fill="#67e8f9" fontWeight="600">pH</text>
      <rect x="29" y="22" width="6" height="26" rx="3" fill="#155e75" stroke="#06b6d4" strokeWidth="1.5"/>
      <circle cx="32" cy="52" r="5" fill="#0e7490" stroke="#06b6d4" strokeWidth="1.5"/>
      <circle cx="32" cy="52" r="2" fill="#22d3ee"/>
    </Ic>
  ),
  gauges: () => (
    <Ic bg="#f59e0b">
      <circle cx="32" cy="32" r="18" stroke="#f59e0b" strokeWidth="2" fill="#451a03"/>
      <circle cx="32" cy="32" r="14" stroke="#fbbf24" strokeWidth="1" fill="none" opacity="0.3"/>
      <path d="M22 42 A14 14 0 0 1 42 42" stroke="#fde68a" strokeWidth="1.5" fill="none"/>
      <line x1="32" y1="32" x2="38" y2="22" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="32" cy="32" r="2.5" fill="#f59e0b"/>
      <text x="32" y="48" textAnchor="middle" fontSize="5" fill="#fde68a" fontWeight="500">PSI</text>
    </Ic>
  ),
};


/* ═══════════════════════════════════════════════════════════════════
   COMPONENT DEFINITIONS — organized by category
═══════════════════════════════════════════════════════════════════ */
export const WT_CATEGORIES = [
  {
    id: 'flow_system',
    label: 'Water Moving Parts',
    emoji: '💧',
    colorKey: 'blue',
    color: '#3b82f6',
    components: [
      { type: 'wt_pump',       label: 'Pump',       icon: 'pump',         ports: { left: 'water', right: 'water', bottom: 'electrical' } },
      { type: 'wt_valve',      label: 'Valve',       icon: 'valve',        ports: { left: 'water', right: 'water' } },
      { type: 'wt_flow_meter', label: 'Flow Meter',  icon: 'flow_meter',   ports: { left: 'water', right: 'water', bottom: 'data' } },
    ],
  },
  {
    id: 'containers',
    label: 'Big Containers',
    emoji: '🛢️',
    colorKey: 'indigo',
    color: '#6366f1',
    components: [
      { type: 'wt_raw_tank',     label: 'Raw Water Tank',  icon: 'raw_water_tank', ports: { left: 'water', right: 'water' } },
      { type: 'wt_mixing_tank',  label: 'Mixing Tank',     icon: 'mixing_tank',    ports: { left: 'water', right: 'water', top: 'chemical' } },
      { type: 'wt_settling_tank',label: 'Settling Tank',    icon: 'settling_tank',  ports: { left: 'water', right: 'water', bottom: 'waste' } },
      { type: 'wt_storage_tank', label: 'Storage Tank',     icon: 'storage_tank',   ports: { left: 'water', right: 'water', bottom: 'data' } },
    ],
  },
  {
    id: 'filters',
    label: 'Cleaning Filters',
    emoji: '🔽',
    colorKey: 'amber',
    color: '#d97706',
    components: [
      { type: 'wt_sand_filter',     label: 'Sand Filter',     icon: 'sand_filter',     ports: { left: 'water', right: 'water' } },
      { type: 'wt_carbon_filter',   label: 'Carbon Filter',   icon: 'carbon_filter',   ports: { left: 'water', right: 'water' } },
      { type: 'wt_cartridge_filter',label: 'Cartridge Filter', icon: 'cartridge_filter', ports: { left: 'water', right: 'water' } },
      { type: 'wt_uf_membrane',     label: 'UF Membrane',     icon: 'uf_membrane',     ports: { left: 'water', right: 'water', bottom: 'waste' } },
    ],
  },
  {
    id: 'ro_system',
    label: 'RO System',
    emoji: '🔬',
    colorKey: 'cyan',
    color: '#0891b2',
    components: [
      { type: 'wt_ro_membrane',    label: 'RO Membrane',     icon: 'ro_membrane',    ports: { left: 'water', right: 'water', bottom: 'waste' } },
      { type: 'wt_pressure_vessel',label: 'Pressure Vessel', icon: 'pressure_vessel', ports: { left: 'water', right: 'water' } },
      { type: 'wt_hp_pump',        label: 'High-Pressure Pump', icon: 'hp_pump',     ports: { left: 'water', right: 'water', bottom: 'electrical' } },
    ],
  },
  {
    id: 'chemical_system',
    label: 'Chemical System',
    emoji: '🧪',
    colorKey: 'green',
    color: '#22c55e',
    components: [
      { type: 'wt_dosing_pump',  label: 'Dosing Pump',   icon: 'dosing_pump',  ports: { left: 'chemical', right: 'chemical', bottom: 'electrical' } },
      { type: 'wt_chemical_tank',label: 'Chemical Tank',  icon: 'chemical_tank', ports: { right: 'chemical', bottom: 'data' } },
    ],
  },
  {
    id: 'disinfection',
    label: 'Disinfection',
    emoji: '🦠',
    colorKey: 'purple',
    color: '#a855f7',
    components: [
      { type: 'wt_uv_system',      label: 'UV Light System',  icon: 'uv_system',       ports: { left: 'water', right: 'water', bottom: 'electrical' } },
      { type: 'wt_chlorine_system', label: 'Chlorine System',  icon: 'chlorine_system',  ports: { left: 'water', right: 'water' } },
      { type: 'wt_ozone_system',    label: 'Ozone System',     icon: 'ozone_system',     ports: { left: 'water', right: 'water', bottom: 'electrical' } },
    ],
  },
  {
    id: 'waste_handling',
    label: 'Waste Handling',
    emoji: '🗑️',
    colorKey: 'brown',
    color: '#92400e',
    components: [
      { type: 'wt_sludge_tank',  label: 'Sludge Tank',    icon: 'sludge_tank',  ports: { left: 'waste', right: 'waste' } },
      { type: 'wt_filter_press', label: 'Filter Press',    icon: 'filter_press', ports: { left: 'waste', right: 'waste' } },
      { type: 'wt_drain_system', label: 'Drain System',    icon: 'drain_system', ports: { left: 'waste' } },
    ],
  },
  {
    id: 'control_monitoring',
    label: 'Control & Monitoring',
    emoji: '🧠',
    colorKey: 'red',
    color: '#ef4444',
    components: [
      { type: 'wt_control_panel', label: 'Control Panel (PLC)', icon: 'control_panel', ports: { left: 'electrical', right: 'data' } },
      { type: 'wt_sensors',       label: 'Sensors (pH/TDS)',    icon: 'sensors',       ports: { top: 'data', bottom: 'water' } },
      { type: 'wt_gauges',        label: 'Gauges',              icon: 'gauges',        ports: { left: 'data' } },
    ],
  },
];

/* Flat lookup map for quick access */
export const WT_COMPONENTS = {};
WT_CATEGORIES.forEach(cat => {
  cat.components.forEach(comp => {
    WT_COMPONENTS[comp.type] = { ...comp, category: cat.id, categoryColor: cat.color };
  });
});
