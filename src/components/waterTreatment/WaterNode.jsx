import React from 'react';
import { Handle, Position } from 'reactflow';
import { WT_COMPONENTS, ICONS, PORT_COLORS } from './WaterTreatmentData.jsx';

/* ═══════════════════════════════════════════════════════════════════
   WaterNode — Image-based equipment node for ReactFlow canvas
   Renders SVG icons with zero border/padding, typed colored ports
═══════════════════════════════════════════════════════════════════ */
function WaterNode({ data, selected }) {
  const comp = WT_COMPONENTS[data.nodeType];
  if (!comp) return <div>?</div>;

  const IconFn = ICONS[comp.icon];
  const catColor = comp.categoryColor || '#64748b';

  /* port handle style helper */
  const portStyle = (portType, extraStyle) => ({
    width: 10, height: 10,
    background: PORT_COLORS[portType] || PORT_COLORS.any,
    border: '2px solid #0f172a',
    borderRadius: '50%',
    zIndex: 10,
    cursor: 'crosshair',
    ...extraStyle,
  });

  const ports = comp.ports || {};

  return (
    <div style={{
      position: 'relative',
      background: 'transparent',
      border: 'none',
      padding: 0,
      margin: 0,
      lineHeight: 0,
      filter: selected ? 'drop-shadow(0 0 8px rgba(96,165,250,0.6))' : 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
    }}>

      {/* ── LEFT PORT ── */}
      {ports.left && (
        <Handle
          type="target"
          position={Position.Left}
          id="left"
          style={portStyle(ports.left, { left: -5, top: '50%', transform: 'translateY(-50%)' })}
        />
      )}

      {/* ── TOP PORT ── */}
      {ports.top && (
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          style={portStyle(ports.top, { top: -5, left: '50%', transform: 'translateX(-50%)' })}
        />
      )}

      {/* ── NODE BODY: Icon + Label ── */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: 0, margin: 0, background: 'transparent',
        minWidth: 80,
      }}>
        {/* Equipment SVG icon — ZERO border/padding */}
        <div style={{
          width: 72, height: 72,
          borderRadius: 10,
          background: '#0f172a',
          border: selected ? '2px solid #60a5fa' : `2px solid ${catColor}80`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          transition: 'border-color 0.15s',
          lineHeight: 0,
          padding: 0,
          margin: 0,
        }}>
          {IconFn ? (
            <div style={{ transform: 'scale(1.08)', transformOrigin: 'center', lineHeight: 0 }}>
              <IconFn />
            </div>
          ) : (
            <span style={{ fontSize: 32, lineHeight: 1 }}>📦</span>
          )}
        </div>

        {/* Label below icon */}
        <div style={{
          marginTop: 4,
          fontSize: 10,
          fontWeight: 600,
          color: selected ? '#93c5fd' : '#94a3b8',
          textAlign: 'center',
          maxWidth: 90,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          lineHeight: '14px',
        }}>
          {comp.label}
        </div>
      </div>

      {/* ── RIGHT PORT ── */}
      {ports.right && (
        <Handle
          type="source"
          position={Position.Right}
          id="right"
          style={portStyle(ports.right, { right: -5, top: '38%', transform: 'translateY(-50%)' })}
        />
      )}

      {/* ── BOTTOM PORT ── */}
      {ports.bottom && (
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
          style={portStyle(ports.bottom, { bottom: -5, left: '50%', transform: 'translateX(-50%)' })}
        />
      )}
    </div>
  );
}

export default WaterNode;
