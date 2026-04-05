import React from 'react';
import { Handle, Position } from 'reactflow';
import { WT_COMPONENTS, ICONS, PORT_COLORS } from './WaterTreatmentData.jsx';

/* ═══════════════════════════════════════════════════════════════════
   WaterNode — Image-based equipment node for ReactFlow canvas
   Renders SVG icons with zero border/padding, typed colored ports
   + parameter data-flash boxes when params are configured
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
  const configuredParams = data.configuredParams || [];
  const liveValues = data.liveValues || {};
  const isLive = data.isLiveMode || false;

  /* Does this node have any configured params? */
  const hasParams = configuredParams.length > 0;

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

        {/* ── Configured indicator badge ── */}
        {hasParams && !isLive && (
          <div style={{
            marginTop: 3,
            fontSize: 8, fontWeight: 700, letterSpacing: '0.05em',
            color: '#22c55e',
            background: 'rgba(34,197,94,0.15)',
            padding: '1px 6px', borderRadius: 3,
            lineHeight: '14px',
          }}>
            {configuredParams.length} PARAM{configuredParams.length > 1 ? 'S' : ''}
          </div>
        )}
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

      {/* ═══════════ PARAMETER DATA-FLASH BOXES ═══════════ */}
      {hasParams && (
        <div
          className="nodrag nopan"
          style={{
            position: 'absolute',
            top: 0,
            left: 82,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            pointerEvents: 'none',
            lineHeight: 'normal',
          }}
        >
          {configuredParams.map(param => {
            const value = liveValues[param.key];
            const displayVal = value !== undefined
              ? (typeof value === 'number' ? value.toFixed(param.decimals) : value)
              : '—';
            const hasValue = value !== undefined;

            return (
              <div
                key={param.key}
                style={{
                  background: '#fff',
                  border: '1.5px solid #d1d5db',
                  borderRadius: 6,
                  padding: '3px 8px',
                  minWidth: 62,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 0,
                  transition: 'border-color 0.3s',
                  borderColor: hasValue ? '#22c55e' : '#d1d5db',
                }}
              >
                {/* param label */}
                <div style={{
                  fontSize: 7, fontWeight: 600, color: '#64748b',
                  letterSpacing: '0.04em', textTransform: 'uppercase',
                  lineHeight: '10px',
                  display: 'flex', alignItems: 'center', gap: 3,
                }}>
                  {/* live pulse dot */}
                  {hasValue && (
                    <span style={{
                      width: 5, height: 5, borderRadius: '50%',
                      background: '#22c55e',
                      display: 'inline-block',
                      animation: 'livePulse 1.5s infinite',
                      flexShrink: 0,
                    }} />
                  )}
                  {param.label}
                </div>
                {/* value */}
                <div style={{
                  fontSize: 13, fontWeight: 800, color: '#0f172a',
                  lineHeight: '16px',
                  fontFamily: 'ui-monospace, "Cascadia Code", monospace',
                  letterSpacing: '-0.02em',
                }}>
                  {displayVal}
                  {param.unit && (
                    <span style={{
                      fontSize: 8, fontWeight: 500, color: '#94a3b8',
                      marginLeft: 2,
                    }}>
                      {param.unit}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes livePulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.7); }
        }
      `}</style>
    </div>
  );
}

export default WaterNode;
