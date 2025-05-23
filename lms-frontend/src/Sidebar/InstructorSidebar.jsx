// src/Sidebar/InstructorSidebar.jsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiGrid, FiFileText } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import logo from '../assets/log.png';
import '../components/Layout/Layout.css';

const NAV = [
  { key: 'Dashboard',            to: '/instructor/dashboard',           icon: <FiGrid/>      },
  { key: 'Courses',              to: '/instructor/courses',             icon: <FiFileText/>  },
  { key: 'Quizzes',              to: '/instructor/quizzes',             icon: <FiFileText/>  },
  { key: 'Quiz Submissions',     to: '/instructor/quiz-submissions',    icon: <FiFileText/>  },
  { key: 'Create Assignment',    to: '/instructor/assignments',         icon: <FiFileText/>  },
  { key: 'Assignment Submissions', to: '/instructor/assignments/1/submissions', icon: <FiFileText/> },
];

export default function InstructorSidebar({ collapsed, onToggle }) {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <img src={logo} alt="logo" className="sidebar-logo" />
          {!collapsed && <span className="sidebar-title">{t('Instructor')}</span>}
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
