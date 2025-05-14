import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './StudentGrades.css';

export default function StudentGrades() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // load enrolled courses
  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data } = await api.get('/students/enrolled-courses');
        setCourses(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch courses.');
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  // load grades when a course is selected
  const fetchGrades = async courseId => {
    setLoading(true);
    try {
      const { data } = await api.get(`/students/grades/${courseId}`);
      setGrades(data);
      setSelectedCourse(courseId);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch grades.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="student-grades">
      <h1>Grades</h1>
      {selectedCourse ? (
        <>
          <button
            className="back-button"
            onClick={() => setSelectedCourse(null)}
          >
            Back to Courses
          </button>
          <h2>Grades for Course ID: {selectedCourse}</h2>
          {grades.length === 0 ? (
            <p>No graded items yet.</p>
          ) : (
            <table className="grades-table">
              <thead>
                <tr>
                  <th>Coursework</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {grades.map(g => (
                  <tr key={g.id}>
                    <td>{g.coursework}</td>
                    <td>{g.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
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
            {courses.length === 0 ? (
              <tr><td colSpan="5">No courses found.</td></tr>
            ) : (
              courses.map(course => (
                <tr key={course.courseId}>
                  <td>{course.courseName}</td>
                  <td>{course.instructorName}</td>
                  <td>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${course.progress}%` }}
                      />
                      <span>{course.progress}%</span>
                    </div>
                  </td>
                  <td>{course.completed ? 'Completed' : 'In Progress'}</td>
                  <td>
                    <button
                      className="view-grades-btn"
                      onClick={() => fetchGrades(course.courseId)}
                    >
                      View Grades
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
