import React, { useState } from 'react';
import { LayoutDashboard, Activity, Code, Sun, Moon } from 'lucide-react';

const LeftNavBar = ({ onNavClick, activePanel, theme, onThemeToggle, isLiveMode }) => {
  const [hoveredIcon, setHoveredIcon] = useState(null);

  const navItems = [
    { id: 'create',  icon: LayoutDashboard, label: 'Create Dashboard' },
    { id: 'live',    icon: Activity,        label: 'Live Dashboard' },
    { id: 'lowcode', icon: Code,            label: 'Low Code Platform' },
  ];

  const isDark = theme === 'dark';
  const bg       = isDark ? '#1e1e1e' : '#f5f5f5';
  const border   = isDark ? '#404040' : '#e0e0e0';
  const iconCol  = isDark ? '#ffffff' : '#333333';
  const activeBg = isDark ? '#2c2c2c' : '#e0e0e0';
  const hoverBg  = isDark ? '#262626' : '#ebebeb';

  return (
    <div style={{
      position: 'fixed', left: 0, top: '40px',
      width: '60px', height: 'calc(100vh - 40px)',
      backgroundColor: bg,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', paddingTop: '16px',
      borderRight: `1px solid ${border}`,
      zIndex: 100, transition: 'background-color 0.3s ease'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        {navItems.map((item) => {
          const isActive = (item.id === 'live') ? isLiveMode : (activePanel === item.id);
          const isLiveBtn = item.id === 'live';
          return (
            <div
              key={item.id}
              style={{ position: 'relative' }}
              onMouseEnter={() => setHoveredIcon(item.id)}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              <button
                onClick={() => onNavClick(item.id)}
                title={item.label}
                style={{
                  backgroundColor: isActive ? activeBg : 'transparent',
                  border: 'none',
                  color: isActive ? (isLiveBtn ? '#10b981' : (isDark ? '#60a5fa' : '#185FA5')) : iconCol,
                  cursor: 'pointer',
                  width: '44px', height: '44px',
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                  borderLeft: isActive ? `3px solid ${isLiveBtn ? '#10b981' : (isDark ? '#60a5fa' : '#185FA5')}` : '3px solid transparent',
                  boxShadow: (isLiveBtn && isActive) ? '0 0 12px rgba(16,185,129,0.3)' : 'none',
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = hoverBg; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <item.icon size={22} />
              </button>

              {hoveredIcon === item.id && (
                <div style={{
                  position: 'absolute', left: '54px', top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: isDark ? '#2c2c2c' : '#1e1e1e',
                  color: '#fff', padding: '5px 10px',
                  borderRadius: '4px', fontSize: '12px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)', zIndex: 1000,
                }}>
                  {item.label}
                  <div style={{
                    position: 'absolute', left: '-5px', top: '50%',
                    transform: 'translateY(-50%)',
                    width: 0, height: 0,
                    borderTop: '5px solid transparent',
                    borderBottom: '5px solid transparent',
                    borderRight: `5px solid ${isDark ? '#2c2c2c' : '#1e1e1e'}`,
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Theme toggle */}
      <div style={{ paddingBottom: '20px' }}>
        <button
          onClick={onThemeToggle}
          style={{
            width: '38px', height: '38px', borderRadius: '50%', border: 'none',
            backgroundColor: isDark ? '#2c2c2c' : '#e0e0e0',
            color: isDark ? '#ffd700' : '#ff8c00',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </div>
  );
};

export default LeftNavBar;
