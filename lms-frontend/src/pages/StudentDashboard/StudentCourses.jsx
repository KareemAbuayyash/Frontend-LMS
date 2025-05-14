// src/pages/StudentDashboard/StudentCourses.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './StudentCourses.css';

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data } = await api.get('/students/enrolled-courses');
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load courses.');
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (loading) return <div className="loading">Loading courses…</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="student-courses">
      <h1>My Courses</h1>

      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.courseId} className="course-card">
            <h3 className="card-title">{course.courseName}</h3>

            {course.courseDescription && (
              <p className="card-description">
                {course.courseDescription}
              </p>
            )}

            <p className="card-instructor">
              <strong>Instructor:</strong> {course.instructorName || 'N/A'}
            </p>

            <div className="card-actions">
              <button
                className="view-btn"
                onClick={() => navigate(`/student/courses/${course.courseId}`)}
              >
                View Course
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
