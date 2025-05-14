// src/Sidebar/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiMenu, FiX, FiGrid, FiFileText, FiUser
} from 'react-icons/fi';
import logo from '../assets/log.png';
import '../components/Layout/Layout.css'; // Assuming you have a CSS file for styles

const NAV = [
  { label:'Dashboard',   to:'/admin',             icon:<FiGrid/>     },
  { label:'Courses',     to:'/admin/courses',     icon:<FiFileText/> },
  { label:'Users',       to:'/admin/users',       icon:<FiUser/>     },
  { label:'Enrollments', to:'/admin/enrollments', icon:<FiFileText/> },
];

export default function AdminSidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <img src={logo} alt="logo" className="sidebar-logo" />
          {!collapsed && <span className="sidebar-title">Fluento Admin</span>}
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
