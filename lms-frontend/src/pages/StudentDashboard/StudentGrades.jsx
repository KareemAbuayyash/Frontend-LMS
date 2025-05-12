import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './StudentGrades.css';

export default function StudentGrades() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch courses the student is currently taking
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

  // Fetch grades for the selected course
  const fetchGrades = (courseId) => {
    setLoading(true);
    api.get(`/students/grades/${courseId}`)
      .then((response) => {
        setGrades(response.data);
        setSelectedCourse(courseId);
      })
      .catch((error) => {
        console.error('Error fetching grades:', error);
        setError('Failed to fetch grades. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="student-grades">
      <h1>Grades</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : selectedCourse ? (
        <div>
          <button 
            className="back-button"
            onClick={() => setSelectedCourse(null)}
          >
            Back to Courses
          </button>
          <h2>Grades for Course ID: {selectedCourse}</h2>
          <table className="grades-table">
            <thead>
              <tr>
                <th>Coursework</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((grade) => (
                <tr key={grade.id}>
                  <td>{grade.coursework}</td>
                  <td>{grade.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>
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
                <tr className="empty">
                  <td colSpan="5">No courses found.</td>
                </tr>
              ) : (
                courses.map((course) => (
                  <tr key={course.courseId}>
                    <td>{course.courseName}</td>
                    <td>{course.instructorName}</td>
                    <td>{/* Add progress logic here */}</td>
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
        </div>
      )}
    </div>
  );
}