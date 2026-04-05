import React from 'react';
import { LayoutDashboard, Settings, User, LogIn, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isAuth }) => {
  const navigate = useNavigate();

  return (
    <div className="auth-sidebar">
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '24px 0',
        alignItems: 'center',
        gap: '20px'
      }}>
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
          {isAuth ? (
             <div className="sidebar-icon" onClick={() => navigate('/login')}>
               <LogIn size={20} />
             </div>
          ) : (
             <div className="sidebar-icon" onClick={() => navigate('/home')}>
               <LogOut size={20} />
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
