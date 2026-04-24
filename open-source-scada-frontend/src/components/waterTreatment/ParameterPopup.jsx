import React, { useState } from 'react';
import { WT_COMPONENTS, ICONS } from './WaterTreatmentData.jsx';

/* ═══════════════════════════════════════════════════════════════════
   ParameterPopup — configure multiple WS sensor endpoints per node
═══════════════════════════════════════════════════════════════════ */
export default function ParameterPopup({ nodeId, nodeType, currentSensors, onSave, onClose, isDark }) {
  const comp = WT_COMPONENTS[nodeType];
  const IconFn = comp ? ICONS[comp.icon] : null;

  /* array of { id: string, unit: string } */
  const [customSensors, setCustomSensors] = useState(currentSensors || []);
  
  const [newSensorId, setNewSensorId] = useState('');
  const [newUnit, setNewUnit] = useState('');

  const handleAddSensor = () => {
    if (!newSensorId.trim()) return;
    const id = newSensorId.trim();
    
    // Don't add duplicate IDs
    if (customSensors.find(s => s.id === id)) return;
    
    setCustomSensors([...customSensors, {
      id: id,
      unit: newUnit.trim()
    }]);
    
    setNewSensorId('');
    setNewUnit('');
  };

  const handleRemoveSensor = (idToRemove) => {
    setCustomSensors(customSensors.filter(s => s.id !== idToRemove));
  };

  const handleSave = () => {
    onSave(nodeId, customSensors);
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
          width: 'min(460px, 95vw)',
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
              Configure WebSocket Sensor Streams
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

        {/* Custom Sensors Section */}
        <div style={{ padding: '16px 18px 6px' }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: isDark ? '#94a3b8' : '#64748b', display: 'block', marginBottom: 8 }}>
            Add WebSocket Endpoints
          </label>
          
          {/* Add New Sensor */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              type="text"
              value={newSensorId}
              onChange={e => setNewSensorId(e.target.value)}
              placeholder="Sensor ID (e.g. Tank_01)"
              onKeyDown={e => e.key === 'Enter' && handleAddSensor()}
              style={{
                flex: 2, padding: '8px 12px', borderRadius: 8,
                border: `1px solid ${isDark ? '#2a2d32' : '#e2e8f0'}`,
                background: isDark ? '#1a1c20' : '#f8fafc',
                color: isDark ? '#f1f5f9' : '#0f172a',
                outline: 'none', fontSize: 13,
              }}
            />
            <input
              type="text"
              value={newUnit}
              onChange={e => setNewUnit(e.target.value)}
              placeholder="Unit (e.g. °C)"
              onKeyDown={e => e.key === 'Enter' && handleAddSensor()}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8,
                border: `1px solid ${isDark ? '#2a2d32' : '#e2e8f0'}`,
                background: isDark ? '#1a1c20' : '#f8fafc',
                color: isDark ? '#f1f5f9' : '#0f172a',
                outline: 'none', fontSize: 13,
              }}
            />
            <button
              onClick={handleAddSensor}
              style={{
                width: 36, flexShrink: 0, borderRadius: 8,
                background: catColor, border: 'none',
                color: '#fff', fontSize: 18, fontWeight: 'bold',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 2px 8px ${catColor}40`,
              }}
            >
              +
            </button>
          </div>

          {/* List of Added Sensors */}
          <div style={{ maxHeight: 220, overflowY: 'auto' }}>
            {customSensors.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: 16,
                color: isDark ? '#475569' : '#94a3b8', fontSize: 13,
              }}>
                No sensor endpoints added yet.
              </div>
            ) : (
              customSensors.map(sensor => (
                <div
                  key={sensor.id}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', borderRadius: 8, marginBottom: 6,
                    background: isDark ? '#151618' : '#fafafa',
                    border: `1px solid ${isDark ? '#1e2025' : '#e8ecf0'}`,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#e2e8f0' : '#1e293b' }}>
                      {sensor.id}
                    </div>
                    {sensor.unit && (
                      <div style={{ fontSize: 11, color: isDark ? '#64748b' : '#94a3b8' }}>
                        Unit: {sensor.unit}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveSensor(sensor.id)}
                    style={{
                      background: 'none', border: 'none',
                      color: '#ef4444', fontSize: 20, cursor: 'pointer',
                      padding: '0 4px', lineHeight: 1
                    }}
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 18px 16px',
          borderTop: `1px solid ${isDark ? '#1e2025' : '#f1f5f9'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: 8,
        }}>
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
            Save Endpoints
          </button>
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
