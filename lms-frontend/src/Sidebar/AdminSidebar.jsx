// 📦 src/Sidebar/AdminSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiGrid, FiFileText, FiUser } from 'react-icons/fi';
import logo from '../assets/log.png';
import '../components/Layout/Layout.css';
import { useTranslation } from 'react-i18next';

export default function AdminSidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { t } = useTranslation();

  const NAV = [
    { label: t('Dashboard'),   to: '/admin',             icon: <FiGrid /> },
    { label: t('Courses'),     to: '/admin/courses',     icon: <FiFileText /> },
    { label: t('Users'),       to: '/admin/users',       icon: <FiUser /> },
    { label: t('Enrollments'), to: '/admin/enrollments', icon: <FiFileText /> },
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <img src={logo} alt="logo" className="sidebar-logo" />
          {!collapsed && <span className="sidebar-title">{t('Fluento Admin')}</span>}
        </div>
        <button className="toggle-btn" onClick={onToggle}>
          {collapsed ? <FiMenu size={20} /> : <FiX size={20} />}
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
