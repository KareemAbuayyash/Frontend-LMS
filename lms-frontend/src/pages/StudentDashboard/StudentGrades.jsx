import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './StudentGrades.css';

export default function StudentGrades() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch courses the student is currently taking
  useEffect(() => {
    setLoading(true);
    api.get('/students/current-courses')
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
      })
      .finally(() => {
        setLoading(false);
      });
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
      ) : selectedCourse ? (
        <div>
          <button onClick={() => setSelectedCourse(null)}>Back to Courses</button>
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
          <h2>Courses</h2>
          <ul>
            {courses.map((course) => (
              <li key={course.courseId}>
                <button onClick={() => fetchGrades(course.courseId)}>
                  {course.courseName}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}