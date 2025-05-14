import React, { useState } from 'react';
import './StudentCourses.css'; // Or StudentDashboard.css

export default function StudentCourses() {
  const [courses, setCourses] = useState([/* your course data */]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  return (
    <div className="student-courses">
      <h1>My Courses</h1>
      <table className="courses-table">
        {/* Table headers */}
        <tbody>
          {courses.map((course) => (
            <tr key={course.courseId}>
              <td>{course.courseName}</td>
              <td>{course.instructorName}</td>
              <td>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${course.progress}%` }} />
                  <span>{course.progress}%</span>
                </div>
              </td>
              <td>{course.completed ? 'Completed' : 'In Progress'}</td>
              <td>
                <button
                  className="view-course-btn"
                  onClick={() => openModal(course)}
                >
                  View Course
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCourse?.courseName}</h2>
            <p><strong>Instructor:</strong> {selectedCourse?.instructorName}</p>
            <p><strong>Description:</strong> {selectedCourse?.description}</p>
            <p><strong>Start Date:</strong> {new Date(selectedCourse?.courseStartDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(selectedCourse?.courseEndDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {selectedCourse?.completed ? 'Completed' : 'In Progress'}</p>
            <button onClick={closeModal} className="btn">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}