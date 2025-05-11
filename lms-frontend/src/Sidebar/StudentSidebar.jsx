import React from 'react';
import { NavLink } from 'react-router-dom';

export default function StudentSidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <NavLink to="/student/dashboard" activeClassName="active">
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/student/courses" activeClassName="active">
            Courses
          </NavLink>
        </li>
        <li>
          <NavLink to="/student/grades" activeClassName="active">
            Grades
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}