import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './Coursework.css';

export default function Coursework() {
  const [coursework, setCoursework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState([]);

  useEffect(() => {
    fetchCoursework();
  }, []);

  const fetchCoursework = async () => {
    try {
      const response = await api.get('/api/student/assignments');
      setCoursework(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch coursework');
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    try {
      const formData = new FormData();
      formData.append('assignmentId', assignmentId);
      formData.append('submissionContent', submissionContent);
      if (submissionFile) {
        formData.append('file', submissionFile);
      }

      await api.post('/api/student/submit-assignment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setSelectedItem(null);
      setSubmissionContent('');
      setSubmissionFile(null);
      fetchCoursework();
    } catch (err) {
      setError('Failed to submit assignment');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubmissionFile(file);
    }
  };

  return (
    <div className="coursework-container">
      <h1>Coursework</h1>
      {loading && <div className="loading">Loading coursework...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <>
          {coursework.length === 0 ? (
            <div className="no-coursework">No assignments found.</div>
          ) : (
            <div className="coursework-list">
              {coursework.map((item) => (
                <div key={item.id} className="coursework-item">
                  <div className="coursework-header">
                    <h3>{item.title}</h3>
                    <span className={`status ${item.submitted ? 'submitted' : 'pending'}`}>
                      {item.submitted ? 'Submitted' : 'Pending'}
                    </span>
                  </div>
                  <p className="course-name">{item.courseName}</p>
                  {item.description && <p className="description">{item.description}</p>}
                  {item.dueDate && (
                    <p className={`due-date ${new Date(item.dueDate) < new Date() ? 'overdue' : ''}`}>
                      Due: {new Date(item.dueDate).toLocaleDateString()}
                    </p>
                  )}
                  {item.score !== null && (
                    <p className="score">
                      Score: {item.score}/{item.totalPoints}
                    </p>
                  )}
                  {!item.submitted && (
                    <button 
                      className="submit-btn"
                      onClick={() => setSelectedItem(item)}
                    >
                      Submit Assignment
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedItem && (
        <div className="submission-modal">
          <div className="modal-content">
            <h2>{selectedItem.title}</h2>
            <div className="assignment-submission">
              <div className="submission-form">
                <div className="form-group">
                  <label htmlFor="submission-content">Your Submission:</label>
                  <textarea
                    id="submission-content"
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    placeholder="Enter your assignment submission..."
                    rows={10}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="submission-file">Attach File (optional):</label>
                  <input
                    type="file"
                    id="submission-file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                  />
                </div>
                <div className="modal-actions">
                  <button 
                    className="submit-button"
                    onClick={() => handleSubmitAssignment(selectedItem.id)}
                  >
                    Submit
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={() => {
                      setSelectedItem(null);
                      setSubmissionContent('');
                      setSubmissionFile(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 