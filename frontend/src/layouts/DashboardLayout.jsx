import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Upload, BarChart3, User, Settings, Shield, Search, Bell, Menu, Sun, Moon } from 'lucide-react';
import './DashboardLayout.css';
import Sidebar from './Sidebar';
import api from '../services/api';


export default function DashboardLayout() {
  const navigate = useNavigate();
  const userStr = localStorage.getItem('user');
  let user = null;
  try {
      user = userStr ? JSON.parse(userStr) : null;
  } catch (e) {
      console.error("Failed to parse user from localStorage", e);
  }
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Notification sync failed');
    }
  };

  const logout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // For absolute security, clear all except theme
      const currentTheme = localStorage.getItem('theme');
      localStorage.clear();
      if (currentTheme) localStorage.setItem('theme', currentTheme);
      
      navigate('/login');
  };

  const exitDashboard = () => {
      navigate('/');
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <div className={`dashboard-shell animate-fade-in ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar user={user} logout={logout} exitDashboard={exitDashboard} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
      
      <main className="dashboard-main">
        <header className="dashboard-header glass-card">
          <div className="header-left">
              <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
                  <Menu size={24}/>
              </button>
              <div className="header-search">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Deep search reviews..." 
                  className="search-input" 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        // Search logic here
                    }
                  }} 
                />
              </div>
          </div>
          
          <div className="header-right">
            <div className="header-action-btns">
                <button className="btn-icon theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>
                <button className="btn-icon" onClick={() => setShowNotifications(!showNotifications)} style={{position:'relative'}}>
                    <Bell size={20} />
                    {notifications.length > 0 && <span style={{position:'absolute', top:0, right:0, width:'8px', height:'8px', background:'#ef4444', borderRadius:'50%', border:'2px solid var(--bg-soft)'}}></span>}
                </button>
                <button className="btn-icon" onClick={() => navigate('/dashboard/profile')}><Settings size={20} /></button>
            </div>
            
            <div className="header-profile" onClick={() => navigate('/dashboard/profile')} style={{cursor:'pointer'}}>
                <div className="profile-info text-right">
                    <span className="user-name">{user?.firstName} {user?.lastName}</span>
                    <span className="user-role">{user?.roles?.includes('ROLE_ADMIN') ? 'Administrator' : 'Verified User'}</span>
                </div>
                <div className="avatar shadow-glow">
                    {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                    ) : (user?.firstName?.charAt(0) || 'U')}
                </div>
            </div>

            {showNotifications && (
                <div className="notifications-dropdown glass-card animate-slide-up" style={{position:'absolute', top:'100px', right:'2rem', width:'320px', zIndex:1000, padding:'1.5rem'}}>
                    <h5 style={{marginBottom:'1rem', fontSize:'1rem'}}>Center Insights</h5>
                    <div className="notif-list" style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
                        {notifications.length > 0 ? notifications.map(n => (
                            <div key={n.id} style={{fontSize:'0.85rem', paddingBottom:'0.75rem', borderBottom:'1px solid var(--border-light)'}}>
                                <div style={{fontWeight:600}}>{n.title}</div>
                                <div style={{color:'var(--text-muted)'}}>{n.message}</div>
                                <div style={{fontSize:'0.7rem', color:'var(--primary)', marginTop:'4px'}}>{n.time}</div>
                            </div>
                        )) : (
                            <div style={{fontSize:'0.85rem', color:'var(--text-muted)', textAlign:'center'}}>No new alerts</div>
                        )}
                    </div>
                </div>
            )}
          </div>
        </header>
        <div className="dashboard-content-container">
            <div className="dashboard-content">
                <Outlet />
            </div>
        </div>
      </main>
    </div>
  );
}
