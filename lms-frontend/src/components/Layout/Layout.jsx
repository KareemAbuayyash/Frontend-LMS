import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiSearch, FiBell, FiMenu, FiX,
  FiUser, FiGrid, FiFileText, FiSettings
} from 'react-icons/fi';
import api from '../../api/axios';
import './Layout.css';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard',   to: '/admin',            icon: <FiGrid />     },
  { label: 'Courses',     to: '/admin/courses',    icon: <FiFileText /> },
  { label: 'Users',       to: '/admin/users',      icon: <FiUser />     },
  { label: 'Enrollments', to: '/admin/enrollments',icon: <FiFileText /> },
];

export default function Layout({ showSidebar, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'User';

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)');
    const listener = e => setCollapsed(e.matches);
    mq.addListener(listener);
    setCollapsed(mq.matches);
    return () => mq.removeListener(listener);
  }, []);

  const logout = async () => {
    try {
      await api.post('/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
      });
    } catch {
      // ignore
    } finally {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="layout">
      {showSidebar && (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            {!collapsed && <h2>LMS Admin</h2>}
            <button onClick={() => setCollapsed(c => !c)}>
              {collapsed ? <FiMenu size={20}/> : <FiX size={20}/>}
            </button>
          </div>
          <nav className="sidebar-nav">
            {SIDEBAR_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={location.pathname === item.to ? 'active' : ''}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </aside>
      )}

      <div className="main-content">
        {/* top bar */}
        <header className="topbar">
          <div className="search-container">
            <FiSearch />
            <input type="text" placeholder="Search anything..." />
          </div>
          <div className="topbar-icons">
            <button className="icon-btn">
              <FiBell /><span className="badge-dot"/>
            </button>
            <button className="icon-btn">
              <FiUser />
            </button>
            <span className="user-name">{username}</span>
            <button onClick={logout} className="logout-btn">
              Log out
            </button>
          </div>
        </header>

        <div className="page-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}
