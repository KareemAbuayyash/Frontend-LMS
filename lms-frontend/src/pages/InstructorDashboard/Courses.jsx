import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import './Courses.css';

export default function InstructorCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/instructor/courses')
      .then(res => setCourses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="instructor-courses">Loading…</div>;
  }

  if (courses.length === 0) {
    return <div className="instructor-courses">No courses found.</div>;
  }

  return (
    <div className="instructor-courses">
      <h2>My Courses</h2>
      <ul className="courses-list">
        {courses.map(course => (
          <li key={course.id} className="course-item">
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <small>Starts: {new Date(course.startDate).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
