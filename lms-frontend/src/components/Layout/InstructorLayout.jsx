import React from 'react';
import InstructorSidebar from '../Sidebar/InstructorSidebar';
import './InstructorLayout.css';

export default function InstructorLayout({ children }) {
  return (
    <div className="layout">
      <InstructorSidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  );
}
