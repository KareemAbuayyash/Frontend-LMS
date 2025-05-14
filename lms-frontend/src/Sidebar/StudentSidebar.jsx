import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiGrid, FiFileText, FiUser } from 'react-icons/fi';

export default function StudentSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2>LMS Student</h2>}
        <button onClick={() => setCollapsed(c => !c)}>
          {collapsed ? <FiMenu size={20}/> : <FiX size={20}/>}
        </button>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/student/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiGrid />
          {!collapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/student/courses" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiFileText />
          {!collapsed && <span>Courses</span>}
        </NavLink>
        <NavLink to="/student/grades" className={({ isActive }) => isActive ? 'active' : ''}>
          <FiUser />
          {!collapsed && <span>Grades</span>}
        </NavLink>
<NavLink to="/student/coursework" className={({ isActive }) => isActive ? 'active' : ''}>
  <FiFileText />
  {!collapsed && <span>Coursework</span>}
</NavLink>

      </nav>
    </aside>
  );
}