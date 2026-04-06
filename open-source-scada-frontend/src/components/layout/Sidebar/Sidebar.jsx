import React from 'react';
import { LayoutDashboard, Settings, User, LogIn, LogOut, UserPlus, Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isAuth, theme, onThemeToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isLogin = location.pathname === '/login';
  const isRegister = location.pathname === '/register';

  return (
    <div className={`auth-sidebar ${theme}`}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '24px 0',
        alignItems: 'center',
        gap: '20px'
      }}>
        {isAuth ? (
          <>
            {/* Login Icon */}
            <div 
              className={`sidebar-icon ${isLogin ? 'active' : ''}`} 
              onClick={() => navigate('/login')}
              title="Login"
            >
              <LogIn size={20} />
            </div>

            {/* Register Icon */}
            <div 
              className={`sidebar-icon ${isRegister ? 'active' : ''}`} 
              onClick={() => navigate('/register')}
              title="Register"
            >
              <UserPlus size={20} />
            </div>
            
            <div className="sidebar-bottom">
              {/* Theme Toggle */}
              <div className="sidebar-icon" onClick={onThemeToggle} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </div>

              {/* Back to Home Icon or User */}
              <div className="sidebar-icon" onClick={() => navigate('/home')} title="Back to Home">
                <LogOut size={20} />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="sidebar-icon active">
              <LayoutDashboard size={20} />
            </div>
            <div className="sidebar-icon">
              <Settings size={20} />
            </div>
            
            <div className="sidebar-bottom">
              <div className="sidebar-icon">
                <User size={20} />
              </div>
              <div className="sidebar-icon" onClick={() => navigate('/home')}>
                <LogOut size={20} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
