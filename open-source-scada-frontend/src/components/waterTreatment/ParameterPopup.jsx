import React, { useState } from 'react';
import { COMPONENT_PARAMETERS, WT_COMPONENTS, ICONS } from './WaterTreatmentData.jsx';

/* ═══════════════════════════════════════════════════════════════════
   ParameterPopup — configure which live-data params to show
   on a water treatment node
═══════════════════════════════════════════════════════════════════ */
export default function ParameterPopup({ nodeId, nodeType, currentParams, currentSensorId, onSave, onClose, isDark }) {
  const available = COMPONENT_PARAMETERS[nodeType] || [];
  const comp = WT_COMPONENTS[nodeType];
  const IconFn = comp ? ICONS[comp.icon] : null;

  /* initialise from currentParams or empty */
  const [selected, setSelected] = useState(() => {
    if (currentParams && currentParams.length > 0) {
      return currentParams.map(p => p.key);
    }
    return [];
  });

  const [sensorId, setSensorId] = useState(currentSensorId || '');

  const toggle = (key) => {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSave = () => {
    const params = available.filter(p => selected.includes(p.key));
    onSave(nodeId, params, sensorId);
    onClose();
  };

  const catColor = comp?.categoryColor || '#64748b';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 10000,
        animation: 'paramFadeIn 0.18s ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 'min(420px, 90vw)',
          background: isDark ? '#111214' : '#ffffff',
          border: `1px solid ${isDark ? '#2a2d32' : '#e2e8f0'}`,
          borderRadius: 16,
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          animation: 'paramScaleIn 0.22s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 22px 14px',
          borderBottom: `1px solid ${isDark ? '#1e2025' : '#f1f5f9'}`,
          display: 'flex', alignItems: 'center', gap: 12,
          background: isDark ? '#111214' : '#f8fafc',
        }}>
          {/* Icon thumbnail */}
          {IconFn && (
            <div style={{
              width: 44, height: 44, borderRadius: 10, flexShrink: 0,
              background: isDark ? '#1a1c20' : '#f1f5f9',
              border: `1.5px solid ${catColor}50`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <div style={{ transform: 'scale(0.62)', transformOrigin: 'center', lineHeight: 0 }}>
                <IconFn />
              </div>
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 15, fontWeight: 700,
              color: isDark ? '#f1f5f9' : '#0f172a',
            }}>
              {comp?.label || nodeType}
            </div>
            <div style={{
              fontSize: 11, color: isDark ? '#64748b' : '#94a3b8',
              marginTop: 2,
            }}>
              Configure live data parameters
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: isDark ? '#475569' : '#94a3b8', fontSize: 22,
              lineHeight: 1, padding: '0 4px',
              display: 'flex', alignItems: 'center',
            }}
          >×</button>
        </div>

        {/* Sensor ID Input */}
        <div style={{
          padding: '12px 18px 0',
          display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b' }}>
            WebSocket Sensor ID
          </label>
          <input
            type="text"
            value={sensorId}
            onChange={e => setSensorId(e.target.value)}
            placeholder="e.g. Engine_01"
            style={{
              padding: '8px 12px', borderRadius: 8,
              border: `1px solid ${isDark ? '#2a2d32' : '#e2e8f0'}`,
              background: isDark ? '#1a1c20' : '#f8fafc',
              color: isDark ? '#f1f5f9' : '#0f172a',
              outline: 'none', fontSize: 13,
            }}
          />
        </div>

        {/* Parameter list */}
        <div style={{
          padding: '12px 18px 6px',
          maxHeight: 320, overflowY: 'auto',
        }}>
          {available.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: 24,
              color: isDark ? '#475569' : '#94a3b8', fontSize: 13,
            }}>
              No parameters available for this component.
            </div>
          ) : (
            available.map(param => {
              const isOn = selected.includes(param.key);
              return (
                <div
                  key={param.key}
                  onClick={() => toggle(param.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10, marginBottom: 6,
                    cursor: 'pointer',
                    background: isOn
                      ? (isDark ? `${catColor}15` : `${catColor}10`)
                      : (isDark ? '#151618' : '#fafafa'),
                    border: `1.5px solid ${isOn ? catColor + '60' : (isDark ? '#1e2025' : '#e8ecf0')}`,
                    transition: 'all 0.15s',
                  }}
                >
                  {/* Toggle switch */}
                  <div style={{
                    width: 38, height: 20, borderRadius: 10, flexShrink: 0,
                    background: isOn ? catColor : (isDark ? '#2a2d32' : '#d1d5db'),
                    position: 'relative',
                    transition: 'background 0.2s',
                  }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%',
                      background: '#fff',
                      position: 'absolute', top: 2,
                      left: isOn ? 20 : 2,
                      transition: 'left 0.2s',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                    }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: isDark ? '#e2e8f0' : '#1e293b',
                    }}>
                      {param.label}
                    </div>
                    <div style={{
                      fontSize: 10, color: isDark ? '#64748b' : '#94a3b8',
                      marginTop: 1,
                    }}>
                      {param.unit ? `Unit: ${param.unit}` : 'Unitless'} · Range: {param.min}–{param.max}
                    </div>
                  </div>

                  {isOn && (
                    <div style={{
                      fontSize: 9, fontWeight: 700, color: catColor,
                      background: `${catColor}20`, padding: '2px 6px',
                      borderRadius: 4, letterSpacing: '0.05em',
                    }}>
                      ACTIVE
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 18px 16px',
          borderTop: `1px solid ${isDark ? '#1e2025' : '#f1f5f9'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8,
        }}>
          <div style={{
            fontSize: 11, color: isDark ? '#475569' : '#94a3b8',
          }}>
            {selected.length} of {available.length} selected
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onClose}
              style={{
                padding: '8px 18px', borderRadius: 8,
                background: isDark ? '#1a1c20' : '#f1f5f9',
                border: `1px solid ${isDark ? '#2a2d32' : '#e2e8f0'}`,
                color: isDark ? '#94a3b8' : '#64748b',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '8px 22px', borderRadius: 8,
                background: catColor,
                border: 'none',
                color: '#fff',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                boxShadow: `0 2px 10px ${catColor}50`,
                transition: 'all 0.15s',
              }}
            >
              Save Parameters
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes paramFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes paramScaleIn {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
