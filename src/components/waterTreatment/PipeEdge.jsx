import React, { useMemo } from 'react';
import { EdgeLabelRenderer, getSmoothStepPath } from 'reactflow';
import { CONNECTION_TYPES } from './WaterTreatmentData.jsx';

/* ═══════════════════════════════════════════════════════════════════
   GRADIENT IDS — Unique per connection type + orientation
═══════════════════════════════════════════════════════════════════ */
let gradientCounter = 0;

/* ═══════════════════════════════════════════════════════════════════
   PipeEdge — Realistic pipe/cable/wire with:
   - Layered SVG strokes (gradient + inner + flow animation)
   - Elbow fittings at bend points
   - Delete button at midpoint
═══════════════════════════════════════════════════════════════════ */
function PipeEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition,
  style = {}, markerEnd, data,
}) {
  const connType = data?.connectionType || 'water_pipe';
  const connStyle = CONNECTION_TYPES[connType];

  /* Use smoothStepPath for orthogonal routing with rounded bends */
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 12,
  });

  /* Unique gradient IDs so multiple edges don't clash */
  const gradId = useMemo(() => `pipe-grad-${id}-${gradientCounter++}`, [id]);

  if (!connStyle) return null;

  const fitting = connStyle.fitting;

  return (
    <>
      {/* ── SVG DEFS for gradients ── */}
      <defs>
        {connStyle.layers.map((layer, i) => {
          if (!layer.colors) return null;
          return (
            <linearGradient
              key={`${gradId}-${i}`}
              id={`${gradId}-${i}`}
              x1="0" y1="0" x2="0" y2="1"
            >
              {layer.colors.map((c, ci) => (
                <stop
                  key={ci}
                  offset={`${(ci / (layer.colors.length - 1)) * 100}%`}
                  stopColor={c}
                />
              ))}
            </linearGradient>
          );
        })}
      </defs>

      {/* ── PIPE LAYERS — drawn bottom-to-top (thickest first) ── */}
      {connStyle.layers.map((layer, i) => (
        <path
          key={`${id}-layer-${i}`}
          d={edgePath}
          fill="none"
          stroke={layer.colors ? `url(#${gradId}-${i})` : layer.color}
          strokeWidth={layer.width}
          strokeOpacity={layer.opacity}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={layer.dashArray || 'none'}
          style={layer.animated ? {
            animation: 'pipeFlow 1.5s linear infinite',
          } : {}}
          className={layer.animated ? 'pipe-flow-animated' : ''}
        />
      ))}

      {/* ── FITTINGS at source and target ── */}
      <circle
        cx={sourceX} cy={sourceY} r={fitting.r}
        fill={fitting.fill} stroke={fitting.stroke} strokeWidth={fitting.sw}
      />
      <circle
        cx={sourceX} cy={sourceY} r={fitting.r * 0.4}
        fill={fitting.stroke} opacity="0.4"
      />
      <circle
        cx={targetX} cy={targetY} r={fitting.r}
        fill={fitting.fill} stroke={fitting.stroke} strokeWidth={fitting.sw}
      />
      <circle
        cx={targetX} cy={targetY} r={fitting.r * 0.4}
        fill={fitting.stroke} opacity="0.4"
      />

      {/* ── LABEL + DELETE BUTTON at midpoint ── */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 10,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          }}
          className="nodrag nopan"
        >
          {/* Connection type badge */}
          <div style={{
            background: '#0f172a',
            color: connStyle.color || '#94a3b8',
            fontSize: 8,
            fontWeight: 600,
            padding: '2px 6px',
            borderRadius: 3,
            border: `1px solid ${connStyle.color || '#334155'}30`,
            whiteSpace: 'nowrap',
            userSelect: 'none',
            letterSpacing: '0.02em',
          }}>
            {connStyle.label}
          </div>

          {/* Delete button */}
          <button
            onClick={e => {
              e.stopPropagation();
              data?.onDelete?.(id);
            }}
            title="Delete connection"
            style={{
              width: 18, height: 18,
              borderRadius: '50%',
              background: '#ef4444',
              border: '2px solid #0f172a',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
              transition: 'transform 0.1s, background 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; e.currentTarget.style.background = '#b91c1c'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = '#ef4444'; }}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default PipeEdge;
