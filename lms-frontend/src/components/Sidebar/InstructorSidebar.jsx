// src/components/Sidebar/InstructorSidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiBookOpen,
  FiFileText,
  FiUsers,
  FiSettings,
  FiMenu,
  FiX
} from 'react-icons/fi';
import './InstructorSidebar.css';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard',   to: '/instructor',             icon: <FiHome />     },
  { label: 'My Courses',  to: '/instructor/courses',     icon: <FiBookOpen /> },
  { label: 'Assignments', to: '/instructor/assignments', icon: <FiFileText /> },
  { label: 'Submissions', to: '/instructor/submissions', icon: <FiUsers />    },
  { label: 'Profile',     to: '/instructor/profile',     icon: <FiSettings /> }
];

export default function InstructorSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)');
    const onChange = e => setCollapsed(e.matches);
    mq.addListener(onChange);
    setCollapsed(mq.matches);
    return () => mq.removeListener(onChange);
  }, []);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2>Instructor</h2>}
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
  );
}
