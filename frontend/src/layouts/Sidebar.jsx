import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Upload, BarChart3, User, LogOut, Shield, ChevronRight, Home } from 'lucide-react';

export default function Sidebar({ user, logout, exitDashboard, isOpen, setIsOpen }) {
  const userStr = localStorage.getItem('user');
  let userParsed = null;
  try {
      userParsed = userStr ? JSON.parse(userStr) : null;
  } catch(e) {}
  const activeUser = user || userParsed;

  const closeSidebar = () => {
    if (window.innerWidth <= 1024) {
      setIsOpen(false);
    }
  };

  return (
    <aside className={`dashboard-sidebar glass-card ${isOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="logo-icon-premium animate-pulse-glow">S</div>
        <div className="brand-text">
          <h2 className="gradient-text outfit" style={{margin:0, fontSize:'1.75rem'}}>Snapsage</h2>
          <span style={{fontSize:'0.7rem', letterSpacing:'0.1em', fontWeight:700, textTransform:'uppercase', color: 'var(--text-muted)'}}>Enterprise AI</span>
        </div>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" end className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeSidebar}>
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </NavLink>
        <NavLink to="/dashboard/upload" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeSidebar}>
          <Upload size={20} />
          <span>Upload Review</span>
        </NavLink>
        <NavLink to="/dashboard/analytics" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeSidebar}>
          <BarChart3 size={20} />
          <span>Business Insights</span>
        </NavLink>
        <NavLink to="/dashboard/profile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeSidebar}>
          <User size={20} />
          <span>Account Settings</span>
        </NavLink>
        
        <div className="sidebar-divider"></div>
        
        <NavLink to="/dashboard/admin" className={({isActive}) => isActive ? "nav-item active" : "nav-item"} onClick={closeSidebar}>
          <Shield size={20} />
          <span>Admin Console</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <button className="nav-item" onClick={exitDashboard} style={{width:'100%', border:'1px solid var(--glass-border)'}}>
          <Home size={20} />
          <span>Exit Dashboard</span>
        </button>
        <button className="nav-item logout-btn" onClick={logout} style={{marginTop:'0.75rem'}}>
          <LogOut size={20} />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
}
