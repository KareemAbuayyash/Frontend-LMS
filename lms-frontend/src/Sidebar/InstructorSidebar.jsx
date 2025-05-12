import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  BookOutlined,
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined
} from '@ant-design/icons';

const InstructorSidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/instructor/dashboard'
    },
    {
      key: 'courses',
      icon: <BookOutlined />,
      label: 'Courses',
      path: '/instructor/courses'
    },
    {
      key: 'submissions',
      icon: <FileTextOutlined />,
      label: 'Submissions',
      path: '/instructor/submissions'
    },
    {
      key: 'students',
      icon: <TeamOutlined />,
      label: 'Students',
      path: '/instructor/students'
    },
    {
      key: 'analytics',
      icon: <BarChartOutlined />,
      label: 'Analytics',
      path: '/instructor/analytics'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      path: '/instructor/settings'
    }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Instructor Portal</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default InstructorSidebar; 