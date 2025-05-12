// src/pages/InstructorDashboard/Courses.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './Courses.css';  // you can reuse or tweak your existing CSS

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/instructor/courses')
      .then(res => setCourses(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading your courses…</p>;
  if (!courses.length) return <p>No courses found.</p>;

  return (
    <div className="instructor-courses-page">
      <h1>My Courses</h1>
      <ul>
        {courses.map(c => (
          <li key={c.courseId || c.id}>
            <h3>{c.courseName || c.title}</h3>
            <p>{c.courseDescription || c.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
