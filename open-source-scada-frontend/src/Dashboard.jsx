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
  const [showExitModal, setShowExitModal]       = useState(false);
  const [modalMode, setModalMode]             = useState('open');
  const [pendingNavId, setPendingNavId]       = useState(null);
  const [currentDb, setCurrentDb]             = useState(null);
  const livePointer = useRef({ x:0, y:0 });
  const canvasRef   = useRef(null);

  useEffect(() => {
    // Load last dashboard layout state when component mounts
    const savedLastState = localStorage.getItem('scada-last-dashboard');
    if (savedLastState) {
      try {
        const parsedState = JSON.parse(savedLastState);
        setTimeout(() => {
          if (canvasRef.current) {
            canvasRef.current.loadCanvasData(parsedState.layout_data);
            setDroppedNodes(parsedState.layout_data.nodes || []);
            setCurrentDb({ id: parsedState.id, name: parsedState.name });
            setIsSaved(true);
          }
        }, 300);
      } catch (e) {
        console.error("Failed to restore last dashboard state:", e);
      }
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint:{ distance:6 } }),
  );


  const handleNavClick = id => {
    if (id==='create') {
      /* Clear canvas when switching from Low Code platform to Dashboard */
      if (activeSidePanel === 'lowcode') {
        setDroppedNodes([]);
        setIsSaved(true);
      }
      setIsLiveMode(false);
      setActiveSidePanel(p => p==='dashboard' ? null : 'dashboard');
    }
    if (id==='lowcode') {
      if (activeSidePanel !== 'lowcode') {
        if (!isSaved && canvasRef.current?.hasNodes()) {
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
    }
  };

  /* Issue 4: Called by JsonPopup on successful save/deploy.
     Marks canvas as saved and navigates to Low Code if that was the pending destination. */
  const handleSaveSuccess = () => {
    setIsSaved(true);
    if (pendingNavId === 'lowcode' || activeSidePanel === 'lowcode') {
      setDroppedNodes([]);
      setIsLiveMode(false);
      setActiveSidePanel('lowcode');
      setPendingNavId(null);
    }
  };

  const handleSave = async () => {
    if (canvasRef.current) {
      if (!currentDb) {
        setModalMode('saveAs');
        setShowSavedModal(true);
        return;
      }
      
      const payloadMeta = currentDb;
      const success = await canvasRef.current.triggerSave(payloadMeta);
      if (success) {
        setIsSaved(true);
        alert("Dashboard updated successfully!");
      } else {
        alert("Failed to save dashboard.");
      }
    }
  };

  const handleSaveAsSubmit = async (newName) => {
    if (canvasRef.current) {
      const success = await canvasRef.current.triggerSave({ name: newName });
      if (success) {
        setIsSaved(true);
        setCurrentDb({ id: success.id, name: newName });
        localStorage.setItem('scada-last-dashboard', JSON.stringify({
           id: success.id, name: newName, layout_data: canvasRef.current.getCanvasData()
        }));
        setShowSavedModal(false);
        alert("Dashboard saved successfully!");
      } else {
        alert("Failed to save dashboard.");
      }
    }
  };

  const handleNew = () => {
    setDroppedNodes([]);
    setCurrentDb(null);
    setIsSaved(true);
    localStorage.removeItem('scada-last-dashboard');
    if (canvasRef.current && canvasRef.current.loadCanvasData) {
      canvasRef.current.loadCanvasData({ nodes: [], edges: [] });
    }
  };

  const handleExit = () => {
    window.close();
    if (onLogout) onLogout();
  };

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
          onOpenSavedDashboards={() => { setModalMode('open'); setShowSavedModal(true); }}
          onNew={handleNew}
          onSaveAs={() => { setModalMode('saveAs'); setShowSavedModal(true); }}
          onExit={() => setShowExitModal(true)}
          isSaved={isSaved}
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
              isLowCode={activeSidePanel === 'lowcode' || pendingNavId === 'lowcode'}
              onSaveSuccess={handleSaveSuccess}
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
        
        {/* Exit Modal */}
        {showExitModal && (
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
              <h3 style={{ fontSize: '18px', fontWeight: 600, margin: '0 0 12px', color: theme === 'dark' ? '#fff' : '#111' }}>
                Exit Application?
              </h3>
              <p style={{ fontSize: '14px', lineHeight: '1.5', margin: '0 0 24px', color: theme === 'dark' ? '#aaa' : '#666' }}>
                Are you sure you want to exit? {!isSaved && "You have unsaved changes that will be lost."} 
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={handleExit}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px',
                    background: '#ef4444', color: '#fff', border: 'none',
                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >Force Exit</button>
                <button
                  onClick={() => setShowExitModal(false)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px',
                    background: theme === 'dark' ? '#333' : '#f3f4f6',
                    color: theme === 'dark' ? '#eee' : '#374151',
                    border: 'none', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                >Cancel</button>
              </div>
            </div>
          </div>
        )}
        {/* Dashboard Browser Modal */}
        {showSavedModal && (
          <DashboardListModal
            theme={theme}
            mode={modalMode}
            onClose={() => setShowSavedModal(false)}
            onSaveAs={handleSaveAsSubmit}
            onLoad={(dbRecord) => {
              if (canvasRef.current) {
                let layoutData = dbRecord.layout_data;
                let parsedLayout = typeof layoutData === 'string' ? JSON.parse(layoutData) : layoutData;
                canvasRef.current.loadCanvasData(parsedLayout);
                setDroppedNodes(parsedLayout.nodes || []);
                setCurrentDb({ id: dbRecord.id, name: dbRecord.name });
                setIsSaved(true);
                setShowSavedModal(false);
                localStorage.setItem('scada-last-dashboard', JSON.stringify({
                  id: dbRecord.id,
                  name: dbRecord.name,
                  layout_data: parsedLayout
                }));
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
function DashboardListModal({ theme, onClose, onLoad, mode = 'open', onSaveAs }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDb, setSelectedDb] = useState(null);
  const [saveName, setSaveName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dbToDelete, setDbToDelete] = useState(null);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const token = localStorage.getItem('scada-token');
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/dashboards/`, {
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

  const confirmDelete = async () => {
    if (!dbToDelete) return;
    try {
      const token = localStorage.getItem('scada-token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/dashboards/${dbToDelete}`, {
        method: 'DELETE',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      if (!res.ok) throw new Error("Failed to delete dashboard");
      
      setList(prev => prev.filter(db => db.id !== dbToDelete));
      if (selectedDb === dbToDelete) setSelectedDb(null);
      setDbToDelete(null);
    } catch (err) {
      alert("Error deleting dashboard: " + err.message);
      setDbToDelete(null);
    }
  };

  const filteredList = list.filter(db => 
    db.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (db.description && db.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleLoadSelected = async () => {
    if (!selectedDb) return;
    try {
      const token = localStorage.getItem('scada-token');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/dashboards/${selectedDb}`, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '' }
      });
      if (!res.ok) throw new Error("Failed to load dashboard data");
      const data = await res.json();
      onLoad(data);
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

        <div style={{ padding: '12px 24px', borderBottom: `1px solid ${theme === 'dark' ? '#27272a' : '#f4f4f5'}`, background: theme === 'dark' ? '#18181b' : '#fff' }}>
          <input
            type="text"
            placeholder="Search dashboards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '6px',
              border: `1px solid ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'}`,
              background: theme === 'dark' ? '#27272a' : '#f4f4f5',
              color: theme === 'dark' ? '#fafafa' : '#18181b',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#71717a' }}>Loading dashboards...</div>
          ) : error ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>{error}</div>
          ) : filteredList.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#71717a' }}>
              {list.length === 0 ? "No saved dashboards found." : "No dashboards match your search."}
            </div>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {filteredList.map(db => (
                <div 
                  key={db.id}
                  onClick={() => {
                    setSelectedDb(db.id);
                    if (mode === 'saveAs') setSaveName(db.name);
                  }}
                  onDoubleClick={() => {
                    setSelectedDb(db.id);
                    if (mode === 'saveAs') {
                      setSaveName(db.name);
                      setTimeout(() => onSaveAs(db.name), 0);
                    } else {
                      setTimeout(() => handleLoadSelected(), 0);
                    }
                  }}
                  style={{
                    padding: '12px 16px', borderRadius: 10,
                    cursor: 'pointer', userSelect: 'none',
                    background: selectedDb === db.id ? (theme === 'dark' ? '#2a2a2e' : '#eff6ff') : (theme === 'dark' ? '#27272a' : '#f4f4f5'),
                    border: `1px solid ${selectedDb === db.id ? '#3b82f6' : (theme === 'dark' ? '#3f3f46' : '#e4e4e7')}`,
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={e => {
                    if (selectedDb !== db.id) {
                      e.currentTarget.style.borderColor = '#3b82f6';
                      e.currentTarget.style.background = theme === 'dark' ? '#2a2a2e' : '#eff6ff';
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedDb !== db.id) {
                      e.currentTarget.style.borderColor = theme === 'dark' ? '#3f3f46' : '#e4e4e7';
                      e.currentTarget.style.background = theme === 'dark' ? '#27272a' : '#f4f4f5';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ fontWeight: 600, color: theme === 'dark' ? '#fafafa' : '#18181b' }}>
                      {db.name}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDbToDelete(db.id);
                      }}
                      title="Delete Dashboard"
                      style={{
                        background: 'transparent', border: 'none', color: '#ef4444',
                        cursor: 'pointer', padding: '4px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '4px', transition: 'background 0.2s', zIndex: 2
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = theme === 'dark' ? 'rgba(239,68,68,0.2)' : 'rgba(239,68,68,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
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
        
        <div style={{ 
          padding: '16px 24px', background: theme === 'dark' ? '#111113' : '#f9fafb', 
          display: 'flex', justifyContent: mode === 'saveAs' ? 'space-between' : 'flex-end', alignItems: 'center', gap: '12px', borderTop: `1px solid ${theme === 'dark' ? '#27272a' : '#f4f4f5'}`
        }}>
          {mode === 'saveAs' && (
            <input 
              type="text" 
              placeholder="Dashboard Name..." 
              value={saveName} 
              onChange={e => setSaveName(e.target.value)} 
              style={{
                flex: 1, padding: '8px 12px', borderRadius: '6px', 
                background: theme === 'dark' ? '#27272a' : '#fff',
                color: theme === 'dark' ? '#fafafa' : '#18181b',
                border: `1px solid ${theme === 'dark' ? '#3f3f46' : '#d1d5db'}`,
                outline: 'none', maxWidth: '60%'
              }}
            />
          )}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} style={{
              padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
              background: theme === 'dark' ? '#3f3f46' : '#e4e4e7',
              color: theme === 'dark' ? '#fafafa' : '#18181b', border: 'none', fontWeight: 600
            }}>Cancel</button>
            {mode === 'open' ? (
              <button onClick={handleLoadSelected} disabled={!selectedDb} style={{
                padding: '8px 16px', borderRadius: '6px', cursor: selectedDb ? 'pointer' : 'not-allowed',
                background: '#3b82f6', color: '#fff', border: 'none', fontWeight: 600,
                opacity: selectedDb ? 1 : 0.5
              }}>Load Dashboard</button>
            ) : (
              <button onClick={() => { if (saveName.trim()) onSaveAs(saveName.trim()); }} disabled={!saveName.trim()} style={{
                padding: '8px 16px', borderRadius: '6px', cursor: saveName.trim() ? 'pointer' : 'not-allowed',
                background: '#10b981', color: '#fff', border: 'none', fontWeight: 600,
                opacity: saveName.trim() ? 1 : 0.5
              }}>Save Dashboard</button>
            )}
          </div>
        </div>
        
        {/* Delete Confirmation Overlay */}
        {dbToDelete !== null && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 12000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(2px)'
          }}>
            <div style={{
              width: '320px', padding: '20px', borderRadius: '10px',
              background: theme === 'dark' ? '#27272a' : '#ffffff',
              border: `1px solid ${theme === 'dark' ? '#3f3f46' : '#e4e4e7'}`,
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 10px', fontSize: '16px', color: theme === 'dark' ? '#fff' : '#111' }}>Delete Dashboard?</h3>
              <p style={{ margin: '0 0 20px', fontSize: '14px', color: theme === 'dark' ? '#aaa' : '#666' }}>
                Are you sure you want to permanently delete this dashboard? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={confirmDelete}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '6px', cursor: 'pointer',
                    background: '#ef4444', color: '#fff', border: 'none', fontWeight: 600
                  }}>Delete</button>
                <button
                  onClick={() => setDbToDelete(null)}
                  style={{
                    flex: 1, padding: '8px', borderRadius: '6px', cursor: 'pointer',
                    background: theme === 'dark' ? '#3f3f46' : '#f3f4f6', color: theme === 'dark' ? '#eee' : '#374151', border: 'none', fontWeight: 600
                  }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
