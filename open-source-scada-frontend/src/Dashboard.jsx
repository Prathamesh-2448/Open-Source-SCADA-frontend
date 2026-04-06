import React, { useState, useCallback, useRef, useEffect } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import MenuBar      from './components/MenuBar';
import LeftNavBar   from './components/LeftNavBar';
import SidePanel    from './components/SidePanel';
import LowCodePanel from './components/LowCodePanel';
import WaterTreatmentPanel from './components/waterTreatment/WaterTreatmentPanel';
import Canvas       from './components/Canvas';

const NAV_WIDTH   = 60;
const PANEL_WIDTH = 300;

export default function Dashboard({ onLogout }) {
  const [activeSidePanel, setActiveSidePanel] = useState(null);
  const [theme, setTheme]                     = useState('dark');
  const [activeDragItem, setActiveDragItem]   = useState(null);
  const [droppedNodes, setDroppedNodes]       = useState([]);
  const [activeConnectionType, setActiveConnectionType] = useState('water_pipe');
  const [isLiveMode, setIsLiveMode]           = useState(false);
  const [isSaved, setIsSaved]                 = useState(true);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showSavedModal, setShowSavedModal]     = useState(false);
  const [pendingNavId, setPendingNavId]       = useState(null);
  const livePointer = useRef({ x:0, y:0 });
  const canvasRef   = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint:{ distance:6 } }),
  );


  const handleNavClick = id => {
    if (id==='create')  { setIsLiveMode(false); setActiveSidePanel(p => p==='dashboard' ? null : 'dashboard'); }
    if (id==='lowcode') {
      if (activeSidePanel !== 'lowcode') {
        if (!isSaved) {
          setPendingNavId(id);
          setShowUnsavedModal(true);
          return;
        }
        // Clear canvas when switching to lowcode
        setDroppedNodes([]);
        setIsSaved(true);
      }
      setIsLiveMode(false);
      setActiveSidePanel(p => p==='lowcode' ? null : 'lowcode');
    }
    if (id==='live')    { setActiveSidePanel(null); setIsLiveMode(prev => !prev); }
  };

  const handleSaveAndContinue = () => {
    if (canvasRef.current) {
      canvasRef.current.openJsonPopup();
      setShowUnsavedModal(false);
      /* Note: We don't automatically redirect yet because the user needs to finish saving in the JSON popup */
    }
  };

  const handleSave = async () => {
    if (canvasRef.current) {
      const success = await canvasRef.current.triggerSave("manual-save");
      if (success) {
        setIsSaved(true);
        alert("Dashboard saved successfully!");
      } else {
        alert("Failed to save dashboard.");
      }
    }
  };
  const handleOpenSavedDashboards = () => setShowSavedModal(true);

  const handleSelectIndustry = useCallback((action) => {
    if (action === 'water_treatment') {
      setActiveSidePanel('water_treatment');
    }
  }, []);

  const handleDragStart = useCallback(({ active }) => {
    setActiveDragItem(active.data.current ?? null);
  }, []);

  const handleDragEnd = useCallback(({ over, active }) => {
    if (isLiveMode) { setActiveDragItem(null); return; } /* no drops in live mode */
    if (over?.id === 'canvas-drop-zone' && active.data.current) {
      const nd = active.data.current;

      /* Water treatment component drop */
      if (nd.isWaterTreatment) {
        setDroppedNodes(prev => [...prev, {
          nodeType:          nd.type,
          id:                `wt_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
          screenX:           livePointer.current.x,
          screenY:           livePointer.current.y,
          isWaterTreatment:  true,
        }]);
      } else {
        /* PLC node drop (existing) */
        setDroppedNodes(prev => [...prev, {
          nodeType:  nd.type,
          id:        `n_${Date.now()}_${Math.random().toString(36).slice(2,6)}`,
          screenX:   livePointer.current.x,
          screenY:   livePointer.current.y,
          hasIn:     nd.hasIn,
          hasOut:    nd.hasOut,
          initVals:  Object.fromEntries((nd.fields ?? []).map(f => [f.k, f.v])),
        }]);
      }
      setIsSaved(false);
    }
    setActiveDragItem(null);
  }, [isLiveMode]);

  const sidePanelOpen = activeSidePanel !== null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        onPointerMove={e => { livePointer.current = { x:e.clientX, y:e.clientY }; }}
        style={{
          width:'100vw', height:'100vh', overflow:'hidden',
          backgroundColor: theme==='dark' ? '#0a0a0a' : '#ffffff',
          display:'flex', flexDirection:'column',
          transition:'background-color 0.25s',
        }}
      >
        <MenuBar 
          theme={theme} 
          onLogout={onLogout} 
          onSave={handleSave} 
          onOpenSavedDashboards={handleOpenSavedDashboards} 
        />

        <div style={{ flex:1, position:'relative', overflow:'hidden', display:'flex' }}>
          <LeftNavBar
            onNavClick={handleNavClick}
            activePanel={activeSidePanel}
            theme={theme}
            onThemeToggle={() => setTheme(p => p==='light'?'dark':'light')}
            isLiveMode={isLiveMode}
          />
          <SidePanel
            isOpen={activeSidePanel==='dashboard'}
            onClose={() => setActiveSidePanel(null)}
            theme={theme}
            onSelectIndustry={handleSelectIndustry}
          />
          <LowCodePanel
            isOpen={activeSidePanel==='lowcode'}
            onClose={() => setActiveSidePanel(null)}
            theme={theme}
          />
          <WaterTreatmentPanel
            isOpen={activeSidePanel==='water_treatment'}
            onClose={() => setActiveSidePanel(null)}
            theme={theme}
            activeConnectionType={activeConnectionType}
            onConnectionTypeChange={setActiveConnectionType}
          />
          <div style={{
            flex:1,
            marginLeft: sidePanelOpen ? `${NAV_WIDTH+PANEL_WIDTH}px` : `${NAV_WIDTH}px`,
            height:'100%',
            transition:'margin-left 0.3s ease',
            position:'relative',
          }}>
            <Canvas
              ref={canvasRef}
              theme={theme}
              droppedNodes={droppedNodes}
              activeConnectionType={activeConnectionType}
              onClear={() => setDroppedNodes([])}
              isLiveMode={isLiveMode}
            />
          </div>
        </div>

        {/* drag ghost */}
        <DragOverlay dropAnimation={null}>
          {activeDragItem ? (
            <div style={{
              display:'flex', alignItems:'center', gap:8,
              padding:'6px 14px',
              background: '#1e293b',
              border: activeDragItem.isWaterTreatment ? '2px solid #22c55e' : '2px solid #3b82f6',
              borderRadius:8,
              fontSize:12, fontWeight:600, color:'#e2e8f0',
              boxShadow:'0 8px 24px rgba(0,0,0,0.5)',
              pointerEvents:'none', whiteSpace:'nowrap',
            }}>
              {activeDragItem.isWaterTreatment ? (
                <span style={{
                  background:'#22c55e', color:'#fff',
                  fontSize:9, fontWeight:700,
                  padding:'2px 6px', borderRadius:3,
                }}>
                   WT
                </span>
              ) : (
                <span style={{
                  background:'#3b82f6', color:'#fff',
                  fontSize:9, fontWeight:700, fontFamily:'monospace',
                  padding:'2px 6px', borderRadius:3,
                }}>
                  {activeDragItem.abbr}
                </span>
              )}
              {activeDragItem.label}
            </div>
          ) : null}
        </DragOverlay>
        {/* Unsaved Changes Modal */}
        {showUnsavedModal && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              width: '400px', padding: '24px', borderRadius: '12px',
              background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? '#333' : '#eee'}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '50%',
                background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <h3 style={{
                fontSize: '18px', fontWeight: 600, margin: '0 0 12px',
                color: theme === 'dark' ? '#fff' : '#111'
              }}>Unsaved Changes</h3>
              <p style={{
                fontSize: '14px', lineHeight: '1.5', margin: '0 0 24px',
                color: theme === 'dark' ? '#aaa' : '#666'
              }}>
                You have unsaved changes on the dashboard. Switching to Low Code will clear the canvas. Do you want to continue?
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleSaveAndContinue}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px',
                    background: '#2563eb', color: '#fff', border: 'none',
                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                  onMouseLeave={e => e.currentTarget.style.background = '#2563eb'}
                >Save</button>
                <button
                  onClick={() => setShowUnsavedModal(false)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px',
                    background: theme === 'dark' ? '#333' : '#f3f4f6',
                    color: theme === 'dark' ? '#eee' : '#374151',
                    border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = theme === 'dark' ? '#444' : '#e5e7eb'}
                  onMouseLeave={e => e.currentTarget.style.background = theme === 'dark' ? '#333' : '#f3f4f6'}
                >Edit</button>
              </div>
            </div>
            <style>{`
              @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            `}</style>
          </div>
        )}
        {/* Dashboard Browser Modal */}
        {showSavedModal && (
          <DashboardListModal
            theme={theme}
            onClose={() => setShowSavedModal(false)}
            onLoad={(layoutData) => {
              if (canvasRef.current) {
                canvasRef.current.loadCanvasData(layoutData);
                setDroppedNodes(layoutData.nodes || []);
                setIsSaved(true);
                setShowSavedModal(false);
              }
            }}
          />
        )}
      </div>
    </DndContext>
  );
}

/* ═══════════════════════════════════════════════════════════
   DASHBOARD LIST MODAL
═══════════════════════════════════════════════════════════ */
function DashboardListModal({ theme, onClose, onLoad }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const token = localStorage.getItem('scada-token');
        const res = await fetch('http://localhost:5000/dashboards/', {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        });
        if (!res.ok) throw new Error("Failed to load list");
        const data = await res.json();
        setList(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  const handleDoubleclick = async (dbId) => {
    try {
      const token = localStorage.getItem('scada-token');
      const res = await fetch(`http://localhost:5000/dashboards/${dbId}`, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      if (!res.ok) throw new Error("Failed to load dashboard data");
      const data = await res.json();
      onLoad(data.layout_data);
    } catch (err) {
      alert("Error loading dashboard: " + err.message);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 11000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.2s ease-out'
    }} onClick={onClose}>
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '500px', maxHeight: '80vh',
          background: theme === 'dark' ? '#18181b' : '#ffffff',
          borderRadius: 16, border: `1px solid ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'}`,
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${theme === 'dark' ? '#27272a' : '#f4f4f5'}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: theme === 'dark' ? '#fafafa' : '#18181b', margin: 0 }}>
            Saved Dashboards
          </h2>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: 24, padding: 4
          }}>&times;</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#71717a' }}>Loading dashboards...</div>
          ) : error ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>{error}</div>
          ) : list.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#71717a' }}>No saved dashboards found.</div>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {list.map(db => (
                <div 
                  key={db.id}
                  onDoubleClick={() => handleDoubleclick(db.id)}
                  style={{
                    padding: '12px 16px', borderRadius: 10,
                    cursor: 'pointer', userSelect: 'none',
                    background: theme === 'dark' ? '#27272a' : '#f4f4f5',
                    border: `1px solid ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'}`,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.background = theme === 'dark' ? '#2a2a2e' : '#eff6ff';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = theme === 'dark' ? '#3f3f46' : '#e4e4e7';
                    e.currentTarget.style.background = theme === 'dark' ? '#27272a' : '#f4f4f5';
                  }}
                >
                  <div style={{ fontWeight: 600, color: theme === 'dark' ? '#fafafa' : '#18181b', marginBottom: 4 }}>
                    {db.name}
                  </div>
                  <div style={{ fontSize: 11, color: '#71717a', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{db.description || 'No description'}</span>
                    <span>{new Date(db.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div style={{ padding: '16px 24px', background: theme === 'dark' ? '#111113' : '#f9fafb', fontSize: 11, color: '#71717a' }}>
          Double-click on a dashboard to load it.
        </div>
      </div>
    </div>
  );
}
