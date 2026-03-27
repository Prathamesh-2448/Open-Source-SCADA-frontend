import React, { useState, useCallback, useRef } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import MenuBar      from './components/MenuBar';
import LeftNavBar   from './components/LeftNavBar';
import SidePanel    from './components/SidePanel';
import LowCodePanel from './components/LowCodePanel';
import WaterTreatmentPanel from './components/waterTreatment/WaterTreatmentPanel';
import Canvas       from './components/Canvas';

const NAV_WIDTH   = 60;
const PANEL_WIDTH = 300;

export default function App() {
  const [activeSidePanel, setActiveSidePanel] = useState(null);
  const [theme, setTheme]                     = useState('dark');
  const [activeDragItem, setActiveDragItem]   = useState(null);
  const [droppedNodes, setDroppedNodes]       = useState([]);
  const [activeConnectionType, setActiveConnectionType] = useState('water_pipe');
  const livePointer = useRef({ x:0, y:0 });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint:{ distance:6 } }),
  );

  const handleNavClick = id => {
    if (id==='create')  setActiveSidePanel(p => p==='dashboard' ? null : 'dashboard');
    if (id==='lowcode') setActiveSidePanel(p => p==='lowcode'   ? null : 'lowcode');
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
    }
    setActiveDragItem(null);
  }, []);

  const sidePanelOpen = activeSidePanel !== null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        onPointerMove={e => { livePointer.current = { x:e.clientX, y:e.clientY }; }}
        style={{
          width:'100vw', height:'100vh', overflow:'hidden',
          backgroundColor: theme==='dark' ? '#111827' : '#ffffff',
          display:'flex', flexDirection:'column',
          transition:'background-color 0.25s',
        }}
      >
        <MenuBar theme={theme} />

        <div style={{ flex:1, position:'relative', overflow:'hidden', display:'flex' }}>
          <LeftNavBar
            onNavClick={handleNavClick}
            activePanel={activeSidePanel}
            theme={theme}
            onThemeToggle={() => setTheme(p => p==='light'?'dark':'light')}
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
              theme={theme}
              droppedNodes={droppedNodes}
              activeConnectionType={activeConnectionType}
              onClear={() => setDroppedNodes([])}
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
      </div>
    </DndContext>
  );
}
