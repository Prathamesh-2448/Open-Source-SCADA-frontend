import React, { useState } from 'react';
import { X, FolderOpen, PlusCircle, ChevronRight, File } from 'lucide-react';

const SidePanel = ({ isOpen, onClose, theme, onSelectIndustry }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  
  const industries = [
    { id: 'wtp', name: 'Water Treatment Plant', icon: '🚰', action: 'water_treatment' },
    { id: 'i1', name: 'Technology', icon: '💻' },
    { id: 'i2', name: 'Healthcare', icon: '🏥' },
    // { id: 'i3', name: 'Finance', icon: '💰' },
    // { id: 'i4', name: 'Retail', icon: '🛍️' }
  ];

  const toggleExpand = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!isOpen) return null;

  return (
    <div 
      onClick={(e) => e.stopPropagation()} 
      style={{
        position: 'fixed',
        left: '60px',
        top: '40px',
        width: '320px',
        height: 'calc(100vh - 40px)',
        backgroundColor: theme === 'dark' ? '#252525' : '#f9f9f9',
        boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInFromLeft 0.3s ease-out',
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{
          color: theme === 'dark' ? '#ffffff' : '#333333',
          fontSize: '16px',
          fontWeight: '600',
          margin: 0
        }}>
          Create Dashboard
        </h3>
        <button
          onClick={onClose}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: theme === 'dark' ? '#ffffff' : '#333333',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme === 'dark' ? '#404040' : '#e0e0e0';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: '16px', flex: 1, overflowY: 'auto' }}>
        {/* Main Options */}
        {!selectedOption && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button
              onClick={() => setSelectedOption('existing')}
              style={{
                backgroundColor: theme === 'dark' ? '#2c2c2c' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
                color: theme === 'dark' ? '#ffffff' : '#333333',
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#333333' : '#f0f0f0';
                e.currentTarget.style.borderColor = theme === 'dark' ? '#505050' : '#d0d0d0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#2c2c2c' : '#ffffff';
                e.currentTarget.style.borderColor = theme === 'dark' ? '#404040' : '#e0e0e0';
              }}
            >
              <FolderOpen size={20} />
              <span>Select Existing Dashboards</span>
            </button>

            <button
              onClick={() => setSelectedOption('new')}
              style={{
                backgroundColor: theme === 'dark' ? '#2c2c2c' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#404040' : '#e0e0e0'}`,
                color: theme === 'dark' ? '#ffffff' : '#333333',
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#333333' : '#f0f0f0';
                e.currentTarget.style.borderColor = theme === 'dark' ? '#505050' : '#d0d0d0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme === 'dark' ? '#2c2c2c' : '#ffffff';
                e.currentTarget.style.borderColor = theme === 'dark' ? '#404040' : '#e0e0e0';
              }}
            >
              <PlusCircle size={20} />
              <span>Create New Industry Dashboards</span>
            </button>
          </div>
        )}

        {/* Industry List - VS Code Style */}
        {selectedOption === 'existing' && (
          <div>
            <button
              onClick={() => setSelectedOption(null)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: theme === 'dark' ? '#888888' : '#666666',
                cursor: 'pointer',
                fontSize: '13px',
                marginBottom: '16px',
                padding: '4px 0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme === 'dark' ? '#ffffff' : '#333333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme === 'dark' ? '#888888' : '#666666';
              }}
            >
              ← Back
            </button>

            <h4 style={{
              color: theme === 'dark' ? '#ffffff' : '#333333',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              Select Industry
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {industries.map((industry) => (
                <div key={industry.id}>
                  {/* Folder Item */}
                  <div
                    onClick={() => {
                      if (industry.action) {
                        onSelectIndustry?.(industry.action);
                      } else {
                        toggleExpand(industry.id);
                      }
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px 8px',
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      borderRadius: '4px',
                      transition: 'background-color 0.1s',
                      color: theme === 'dark' ? '#cccccc' : '#333333'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? '#2a2a2a' : '#e8e8e8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Arrow Icon */}
                    <ChevronRight 
                      size={16} 
                      style={{
                        marginRight: '4px',
                        transform: expandedItems[industry.id] ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                    
                    {/* Folder Icon/Emoji */}
                    <span style={{ 
                      marginRight: '6px',
                      fontSize: '16px'
                    }}>
                      {industry.icon}
                    </span>
                    
                    {/* Industry Name */}
                    <span style={{ 
                      fontSize: '13px',
                      flex: 1
                    }}>
                      {industry.name}
                    </span>
                  </div>

                  {/* Expanded Content */}
                  {expandedItems[industry.id] && (
                    <div style={{
                      paddingLeft: '36px',
                      marginTop: '2px',
                      marginBottom: '4px'
                    }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          backgroundColor: 'transparent',
                          borderRadius: '4px',
                          transition: 'background-color 0.1s',
                          color: theme === 'dark' ? '#cccccc' : '#333333',
                          fontSize: '13px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = theme === 'dark' ? '#2a2a2a' : '#e8e8e8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <File size={14} style={{ marginRight: '6px', opacity: 0.7 }} />
                        <span>Dashboard Config</span>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '4px 8px',
                          cursor: 'pointer',
                          backgroundColor: 'transparent',
                          borderRadius: '4px',
                          transition: 'background-color 0.1s',
                          color: theme === 'dark' ? '#cccccc' : '#333333',
                          fontSize: '13px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = theme === 'dark' ? '#2a2a2a' : '#e8e8e8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <File size={14} style={{ marginRight: '6px', opacity: 0.7 }} />
                        <span>Analytics Setup</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create New Industry */}
        {selectedOption === 'new' && (
          <div>
            <button
              onClick={() => setSelectedOption(null)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: theme === 'dark' ? '#888888' : '#666666',
                cursor: 'pointer',
                fontSize: '13px',
                marginBottom: '16px',
                padding: '4px 0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = theme === 'dark' ? '#ffffff' : '#333333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = theme === 'dark' ? '#888888' : '#666666';
              }}
            >
              ← Back
            </button>

            <h4 style={{
              color: theme === 'dark' ? '#ffffff' : '#333333',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '12px'
            }}>
              Create New Industry Dashboard
            </h4>

            <input
              type="text"
              placeholder="Enter industry name..."
              style={{
                width: '100%',
                backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
                border: `1px solid ${theme === 'dark' ? '#404040' : '#d0d0d0'}`,
                color: theme === 'dark' ? '#ffffff' : '#333333',
                padding: '12px',
                borderRadius: '6px',
                fontSize: '14px',
                marginBottom: '12px',
                outline: 'none'
              }}
            />

            <button
              style={{
                width: '100%',
                backgroundColor: '#0066cc',
                border: 'none',
                color: '#ffffff',
                padding: '12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0052a3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0066cc';
              }}
            >
              Create Dashboard
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SidePanel;
