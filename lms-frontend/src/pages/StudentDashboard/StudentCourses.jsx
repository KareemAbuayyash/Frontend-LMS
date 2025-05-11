import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './StudentCourses.css';

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/students/enrolled-courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError('Failed to fetch courses. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="student-courses">
      <h1>My Courses</h1>
      {loading ? (
        <p>Loading courses...</p>
      ) : error ? (
        <p>{error}</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <table className="courses-table">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Instructor</th>
              <th>Progress</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.courseId}>
                <td>{course.courseName}</td>
                <td>{course.instructorName}</td>
                <td>{/* Add progress logic here */}</td>
                <td>{course.completed ? 'Completed' : 'In Progress'}</td>
                <td>
                  {/* Add action buttons */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}