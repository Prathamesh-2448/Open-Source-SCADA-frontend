import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { X, ChevronRight } from 'lucide-react';
import { WT_CATEGORIES, ICONS, CONNECTION_TYPES } from './WaterTreatmentData.jsx';

/* ─── Draggable component chip ─────────────────────────────────── */
function DraggableComponent({ comp, catColor, theme }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `wt-palette-${comp.type}`,
    data: { ...comp, isWaterTreatment: true },
  });

  const isDark = theme === 'dark';
  const IconFn = ICONS[comp.icon];

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '6px 8px', borderRadius: 8, marginBottom: 2,
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.35 : 1,
        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
        border: '1px solid transparent',
        transition: 'all 0.12s',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : `${catColor}15`;
        e.currentTarget.style.borderColor = catColor + '60';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';
        e.currentTarget.style.borderColor = 'transparent';
      }}
    >
      {/* Thumbnail SVG icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 6, flexShrink: 0,
        background: isDark ? '#1e293b' : '#f8fafc',
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {IconFn ? (
          <div style={{ transform: 'scale(0.52)', transformOrigin: 'center', lineHeight: 0 }}>
            <IconFn />
          </div>
        ) : (
          <span style={{ fontSize: 16 }}>📦</span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 600,
          color: isDark ? '#e2e8f0' : '#1e293b',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {comp.label}
        </div>
        <div style={{
          fontSize: 9, color: isDark ? '#64748b' : '#94a3b8',
          marginTop: 1,
        }}>
          {Object.entries(comp.ports || {}).map(([side, type]) => `${side}:${type}`).join(' · ')}
        </div>
      </div>
    </div>
  );
}

/* ─── Collapsible category ─────────────────────────────────────── */
function CategorySection({ cat, theme, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const isDark = theme === 'dark';

  return (
    <div style={{ marginBottom: 1 }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '8px 12px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
          borderBottom: `1px solid ${isDark ? '#1e293b' : '#f1f5f9'}`,
        }}
      >
        <span style={{ fontSize: 14, flexShrink: 0 }}>{cat.emoji}</span>
        <span style={{
          flex: 1, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em',
          textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#64748b',
        }}>
          {cat.label}
        </span>
        <span style={{
          fontSize: 9, color: isDark ? '#475569' : '#cbd5e1',
          background: isDark ? '#1e293b' : '#f1f5f9',
          padding: '1px 5px', borderRadius: 4, fontWeight: 600,
        }}>
          {cat.components.length}
        </span>
        <ChevronRight size={13} style={{
          color: isDark ? '#475569' : '#94a3b8',
          transform: open ? 'rotate(90deg)' : 'rotate(0)',
          transition: 'transform 0.18s',
        }} />
      </button>

      {open && (
        <div style={{ padding: '4px 6px 8px' }}>
          {cat.components.map(comp => (
            <DraggableComponent
              key={comp.type}
              comp={comp}
              catColor={cat.color}
              theme={theme}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Connection type picker ───────────────────────────────────── */
function ConnectionPicker({ active, onChange, theme }) {
  const isDark = theme === 'dark';
  const types = Object.values(CONNECTION_TYPES);

  return (
    <div style={{
      padding: '8px 12px',
      borderBottom: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
    }}>
      <div style={{
        fontSize: 9, fontWeight: 600, textTransform: 'uppercase',
        letterSpacing: '0.06em', color: isDark ? '#475569' : '#94a3b8',
        marginBottom: 6,
      }}>
        Connection Type
      </div>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {types.map(t => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            title={t.label}
            style={{
              height: 28, padding: '0 8px',
              borderRadius: 6,
              border: active === t.id
                ? `2px solid ${t.color}`
                : `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
              background: active === t.id
                ? `${t.color}18`
                : isDark ? '#0f172a' : '#f8fafc',
              color: active === t.id ? t.color : (isDark ? '#94a3b8' : '#64748b'),
              fontSize: 10, fontWeight: 600,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
              transition: 'all 0.15s',
              whiteSpace: 'nowrap',
            }}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── Main panel ───────────────────────────────────────────────── */
const WaterTreatmentPanel = ({ isOpen, onClose, theme, activeConnectionType, onConnectionTypeChange }) => {
  const [search, setSearch] = useState('');
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const q = search.toLowerCase().trim();
  const filtered = q
    ? WT_CATEGORIES.map(cat => ({
        ...cat,
        components: cat.components.filter(c =>
          c.label.toLowerCase().includes(q) || c.type.includes(q)
        ),
      })).filter(cat => cat.components.length > 0)
    : WT_CATEGORIES;

  return (
    <div
      onClick={e => e.stopPropagation()}
      style={{
        position: 'fixed', left: 60, top: 40,
        width: 300, height: 'calc(100vh - 40px)',
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        borderRight: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
        boxShadow: '3px 0 16px rgba(0,0,0,0.15)',
        zIndex: 999, display: 'flex', flexDirection: 'column',
        animation: 'wtSlideIn 0.22s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '12px 14px',
        borderBottom: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}`,
        display: 'flex', alignItems: 'center', gap: 8,
        background: isDark ? '#0f172a' : '#f8fafc',
      }}>
        <span style={{ fontSize: 18 }}>🚰</span>
        <span style={{
          flex: 1, fontSize: 13, fontWeight: 700,
          color: isDark ? '#f1f5f9' : '#0f172a',
        }}>
          Water Treatment Plant
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none', border: 'none', cursor: 'pointer', padding: 4,
            color: isDark ? '#64748b' : '#94a3b8', borderRadius: 4,
            display: 'flex', alignItems: 'center',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = isDark ? '#f1f5f9' : '#0f172a'; e.currentTarget.style.background = isDark ? '#1e293b' : '#f1f5f9'; }}
          onMouseLeave={e => { e.currentTarget.style.color = isDark ? '#64748b' : '#94a3b8'; e.currentTarget.style.background = 'none'; }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Search */}
      <div style={{ padding: '8px 12px', borderBottom: `1px solid ${isDark ? '#1e293b' : '#e2e8f0'}` }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search components..."
          style={{
            width: '100%', padding: '7px 10px', borderRadius: 6,
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            background: isDark ? '#1e293b' : '#f8fafc',
            color: isDark ? '#e2e8f0' : '#1e293b', fontSize: 12, outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Connection Type Picker */}
      <ConnectionPicker
        active={activeConnectionType}
        onChange={onConnectionTypeChange}
        theme={theme}
      />

      {/* Hint */}
      <div style={{
        padding: '5px 14px',
        fontSize: 10, color: isDark ? '#475569' : '#94a3b8',
        borderBottom: `1px solid ${isDark ? '#1e293b20' : '#f1f5f9'}`,
      }}>
        Drag equipment onto the canvas
      </div>

      {/* Category list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filtered.map((cat, i) => (
          <CategorySection
            key={cat.id}
            cat={cat}
            theme={theme}
            defaultOpen={i < 2}
          />
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: 24, textAlign: 'center', color: isDark ? '#475569' : '#94a3b8', fontSize: 12 }}>
            No components match "{search}"
          </div>
        )}
      </div>

      <style>{`
        @keyframes wtSlideIn {
          from { opacity: 0; transform: translateX(-18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default WaterTreatmentPanel;
