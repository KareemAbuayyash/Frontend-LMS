import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiGrid, FiFileText } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import logo from '../assets/log.png';
import '../components/Layout/Layout.css';

const NAV = [
  { key: 'Dashboard', to: '/student/dashboard', icon: <FiGrid/> },
  { key: 'Courses',   to: '/student/courses',  icon: <FiFileText/> },
  { key: 'Coursework',to: '/student/coursework',icon: <FiFileText/> },
];

export default function StudentSidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <img src={logo} alt="logo" className="sidebar-logo" />
          {!collapsed && <span className="sidebar-title">{t('Student')}</span>}
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          {collapsed ? <FiMenu size={20}/> : <FiX size={20}/>}
        </button>
      </div>
      <nav className="sidebar-nav">
        {NAV.map(({ key, to, icon }) => (
          <Link
            key={to}
            to={to}
            className={location.pathname === to ? 'active' : ''}
          >
            {icon}
            {!collapsed && <span>{t(key)}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
