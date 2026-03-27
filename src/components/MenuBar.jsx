import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, User } from 'lucide-react';

const MenuBar = ({ theme }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fileMenuItems = [
    { label: 'New File', shortcut: 'Ctrl+N' },
    { label: 'New Window', shortcut: 'Ctrl+Shift+N' },
    { label: 'Open Folder', shortcut: 'Ctrl+O' },
    { label: 'New Folder', shortcut: '' },
    { type: 'separator' },
    { label: 'Save', shortcut: 'Ctrl+S' },
    { label: 'Save As', shortcut: 'Ctrl+Shift+S' },
    { type: 'separator' },
    { label: 'Share', shortcut: '' },
    { label: 'Copy', shortcut: 'Ctrl+C' },
    { label: 'Paste', shortcut: 'Ctrl+V' },
    { type: 'separator' },
    { label: 'Exit', shortcut: 'Alt+F4', action: 'exit' }
  ];

  const editMenuItems = [
    { label: 'Undo', shortcut: 'Ctrl+Z' },
    { label: 'Redo', shortcut: 'Ctrl+Y' },
    { type: 'separator' },
    { label: 'Copy', shortcut: 'Ctrl+C' },
    { label: 'Paste', shortcut: 'Ctrl+V' },
    { type: 'separator' },
    { label: 'Find', shortcut: 'Ctrl+F' },
    { label: 'Replace', shortcut: 'Ctrl+H' }
  ];

  const projectMenuItems = [
    { label: 'New Project', shortcut: 'Ctrl+Shift+P' },
    { label: 'Open Project', shortcut: 'Ctrl+Shift+O' },
    { type: 'separator' },
    { label: 'Project Settings', shortcut: '' },
    { label: 'Close Project', shortcut: '' }
  ];

  const handleMenuItemClick = (item) => {
    if (item.action === 'exit') {
      setActiveMenu(null);
    }
    // Add other actions here as needed
  };

  const renderDropdownMenu = (items) => (
    <div style={{
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: '2px',
      backgroundColor: theme === 'dark' ? '#2c2c2c' : '#ffffff',
      border: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
      borderRadius: '4px',
      minWidth: '200px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {items.map((item, index) => {
        if (item.type === 'separator') {
          return (
            <div
              key={`separator-${index}`}
              style={{
                height: '1px',
                backgroundColor: theme === 'dark' ? '#404040' : '#e0e0e0',
                margin: '4px 0'
              }}
            />
          );
        }

        return (
          <div
            key={item.label}
            onClick={() => handleMenuItemClick(item)}
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: theme === 'dark' ? '#ffffff' : '#333333',
              fontSize: '13px',
              transition: 'background-color 0.1s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark' ? '#404040' : '#f0f0f0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span>{item.label}</span>
            {item.shortcut && (
              <span style={{
                fontSize: '11px',
                color: theme === 'dark' ? '#888888' : '#666666',
                marginLeft: '20px'
              }}>
                {item.shortcut}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{
      width: '100%',
      height: '40px',
      backgroundColor: theme === 'dark' ? '#2c2c2c' : '#f5f5f5',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 16px',
      color: theme === 'dark' ? '#ffffff' : '#333333',
      fontSize: '14px',
      borderBottom: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
      transition: 'background-color 0.3s ease'
    }}>
      {/* Left side - Menu buttons */}
      <div style={{ display: 'flex', gap: '8px' }} ref={menuRef}>
        {/* File Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setActiveMenu(activeMenu === 'File' ? null : 'File')}
            style={{
              backgroundColor: activeMenu === 'File' ? (theme === 'dark' ? '#404040' : '#e0e0e0') : 'transparent',
              border: 'none',
              color: theme === 'dark' ? '#ffffff' : '#333333',
              padding: '6px 12px',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (activeMenu !== 'File') {
                e.target.style.backgroundColor = theme === 'dark' ? '#383838' : '#e8e8e8';
              }
            }}
            onMouseLeave={(e) => {
              if (activeMenu !== 'File') {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            File
            <ChevronDown size={14} />
          </button>
          {activeMenu === 'File' && renderDropdownMenu(fileMenuItems)}
        </div>

        {/* Edit Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setActiveMenu(activeMenu === 'Edit' ? null : 'Edit')}
            style={{
              backgroundColor: activeMenu === 'Edit' ? (theme === 'dark' ? '#404040' : '#e0e0e0') : 'transparent',
              border: 'none',
              color: theme === 'dark' ? '#ffffff' : '#333333',
              padding: '6px 12px',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (activeMenu !== 'Edit') {
                e.target.style.backgroundColor = theme === 'dark' ? '#383838' : '#e8e8e8';
              }
            }}
            onMouseLeave={(e) => {
              if (activeMenu !== 'Edit') {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            Edit
            <ChevronDown size={14} />
          </button>
          {activeMenu === 'Edit' && renderDropdownMenu(editMenuItems)}
        </div>

        {/* Project Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setActiveMenu(activeMenu === 'Project' ? null : 'Project')}
            style={{
              backgroundColor: activeMenu === 'Project' ? (theme === 'dark' ? '#404040' : '#e0e0e0') : 'transparent',
              border: 'none',
              color: theme === 'dark' ? '#ffffff' : '#333333',
              padding: '6px 12px',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              if (activeMenu !== 'Project') {
                e.target.style.backgroundColor = theme === 'dark' ? '#383838' : '#e8e8e8';
              }
            }}
            onMouseLeave={(e) => {
              if (activeMenu !== 'Project') {
                e.target.style.backgroundColor = 'transparent';
              }
            }}
          >
            Project
            <ChevronDown size={14} />
          </button>
          {activeMenu === 'Project' && renderDropdownMenu(projectMenuItems)}
        </div>
      </div>

      {/* Right side - User Profile */}
      <div style={{ position: 'relative' }} ref={userMenuRef}>
        <div
          onClick={() => setUserMenuOpen(!userMenuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: theme === 'dark' ? '#383838' : '#e0e0e0',
            padding: '4px 12px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#404040' : '#d0d0d0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#383838' : '#e0e0e0';
          }}
        >
          <User size={18} />
          <span style={{ fontSize: '13px' }}>User</span>
          <ChevronDown size={14} />
        </div>

        {/* User Dropdown */}
        {userMenuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '8px',
            backgroundColor: theme === 'dark' ? '#2c2c2c' : '#ffffff',
            border: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
            borderRadius: '4px',
            minWidth: '180px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: 1000,
            overflow: 'hidden'
          }}>
            <div
              onClick={() => {
                console.log('Change Profile clicked');
                setUserMenuOpen(false);
              }}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                color: theme === 'dark' ? '#ffffff' : '#333333',
                fontSize: '13px',
                transition: 'background-color 0.1s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#404040' : '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Change Profile
            </div>
            <div
              style={{
                height: '1px',
                backgroundColor: theme === 'dark' ? '#404040' : '#e0e0e0'
              }}
            />
            <div
              onClick={() => {
                console.log('Logout clicked');
                setUserMenuOpen(false);
              }}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                color: theme === 'dark' ? '#ffffff' : '#333333',
                fontSize: '13px',
                transition: 'background-color 0.1s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#404040' : '#f0f0f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default MenuBar;
