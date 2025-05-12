import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './StudentDashboard.css';

export default function StudentDashboard() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    pendingAssignments: 0,
    averageGrade: 0
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch enrolled courses
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

  // Fetch assignments and stats
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Fetching assignments...');
        const assignmentsRes = await api.get('/api/students/assignments');
        console.log('Assignments response:', assignmentsRes.data);
        setAssignments(assignmentsRes.data);

        console.log('Fetching stats...');
        const statsRes = await api.get('/api/students/stats');
        console.log('Stats response:', statsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.response?.data?.message || 'Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.courseName.toLowerCase().includes(filter.toLowerCase())
  );

  const upcomingAssignments = assignments
    .filter(assignment => !assignment.submitted)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  return (
    <div className="student-dashboard">
      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p>{stats.totalCourses}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Courses</h3>
          <p>{stats.completedCourses}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Assignments</h3>
          <p>{stats.pendingAssignments}</p>
        </div>
        <div className="stat-card">
          <h3>Average Grade</h3>
          <p>{stats.averageGrade}%</p>
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="upcoming-assignments">
        <h2>Upcoming Assignments</h2>
        <div className="assignments-list">
          {upcomingAssignments.map(assignment => (
            <div key={assignment.id} className="assignment-card">
              <h4>{assignment.title}</h4>
              <p>Course: {assignment.courseName}</p>
              <p>Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Courses Section */}
      <div className="courses-section">
        <div className="section-header">
          <h2>My Courses</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search courses…"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
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
              {loading ? (
                <tr className="empty">
                  <td colSpan="5">Loading…</td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr className="empty">
                  <td colSpan="5">No courses found.</td>
                </tr>
              ) : (
                filteredCourses.map(course => (
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
                        className="view-course-btn"
                        onClick={() => handleViewCourse(course)}
                      >
                        View Course
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && selectedCourse && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Course Details</h2>
            <table>
              <tbody>
                <tr>
                  <td><strong>ID</strong></td>
                  <td>{selectedCourse.courseId}</td>
                </tr>
                <tr>
                  <td><strong>Name</strong></td>
                  <td>{selectedCourse.courseName}</td>
                </tr>
                <tr>
                  <td><strong>Instructor</strong></td>
                  <td>{selectedCourse.instructorName}</td>
                </tr>
                <tr>
                  <td><strong>Description</strong></td>
                  <td>{selectedCourse.description || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
            <button className="btn" onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}