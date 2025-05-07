// src/components/Layout/Layout.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch, FiBell, FiMenu, FiX,
  FiUser, FiGrid, FiFileText, FiSettings
} from 'react-icons/fi';
import api from '../../api/axios';
import './Layout.css';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard',   to: '/dashboard',        icon: <FiGrid />     },
  { label: 'Courses',     to: '/admin/courses',    icon: <FiFileText /> },
  { label: 'Users',       to: '/admin/users',      icon: <FiUser />     },
  { label: 'Instructors', to: '/admin/instructors',icon: <FiUser />     },
  { label: 'Enrollments', to: '/admin/enrollments',icon: <FiFileText /> },
  { label: 'Content',     to: '/admin/content',    icon: <FiFileText /> },
  { label: 'Permissions', to: '/admin/permissions',icon: <FiSettings /> },
];

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  // Automatically collapse sidebar on screens narrower than 480px
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)');
    const handleMediaChange = e => setCollapsed(e.matches);

    // set initial state
    setCollapsed(mq.matches);
    // listen for changes
    mq.addListener(handleMediaChange);
    return () => mq.removeListener(handleMediaChange);
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
      navigate('/');
    }
  };

  return (
    <div className="layout">
      {/* SIDEBAR */}
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
              className={window.location.pathname === item.to ? 'active' : ''}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <div className="main-content">
        {/* TOP BAR */}
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

        {/* PAGE WRAPPER */}
        <div className="page-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}
