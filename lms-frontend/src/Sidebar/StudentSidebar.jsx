// src/Sidebar/StudentSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiMenu, FiX, FiGrid, FiFileText
} from 'react-icons/fi';
import logo from '../assets/log.png';
import '../components/Layout/Layout.css'; // reuse the same CSS

const NAV = [
  { label: 'Dashboard', to: '/student/dashboard', icon: <FiGrid/> },
  { label: 'Courses',   to: '/student/courses',  icon: <FiFileText/> },
  { label: 'Coursework',to: '/student/coursework',icon: <FiFileText/> },
];

export default function StudentSidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <img src={logo} alt="logo" className="sidebar-logo" />
          {!collapsed && <span className="sidebar-title">Fluento Student</span>}
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          {collapsed ? <FiMenu size={20}/> : <FiX size={20}/>}
        </button>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(({ label, to, icon }) => (
          <Link
            key={to}
            to={to}
            className={location.pathname === to ? 'active' : ''}
          >
            {icon}
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
