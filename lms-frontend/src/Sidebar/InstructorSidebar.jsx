// src/Sidebar/InstructorSidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiMenu, FiX, FiGrid, FiFileText, FiUser, FiBarChart2, FiSettings
} from 'react-icons/fi';
import logo from '../assets/log.png';
import '../components/Layout/Layout.css'; // reuse the same CSS

const NAV = [
  { label: 'Dashboard',   to: '/instructor/dashboard',   icon: <FiGrid/>      },
  { label: 'Courses',     to: '/instructor/courses',     icon: <FiFileText/>  },
  { label: 'Quizzes',     to: '/instructor/quizzes',     icon: <FiFileText/>  },
  { label: 'Quiz Submissions', to: '/instructor/quiz-submissions', icon: <FiFileText/> },
  { label: 'Submissions', to: '/instructor/submissions', icon: <FiFileText/>  },
  { label: 'Students',    to: '/instructor/students',    icon: <FiUser/>      },
  { label: 'Analytics',   to: '/instructor/analytics',   icon: <FiBarChart2/> },
  { label: 'Settings',    to: '/instructor/settings',    icon: <FiSettings/>  },
];

export default function InstructorSidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand">
          <img src={logo} alt="logo" className="sidebar-logo" />
          {!collapsed && <span className="sidebar-title">Fluento Instructor</span>}
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
