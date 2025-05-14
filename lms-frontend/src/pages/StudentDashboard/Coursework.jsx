import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { getAccessToken } from '../../utils/auth';
import './Coursework.css';

export default function Coursework() {
  const [coursework, setCoursework]     = useState([]);
  const [loading,     setLoading]       = useState(true);
  const [error,       setError]         = useState(null);

  const [selectedItem,      setSelectedItem]      = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [submissionFile,    setSubmissionFile]    = useState(null);

  const location    = useLocation();
  const preselectId = location.state?.assignmentId;

  // fetch on mount
  useEffect(() => {
    fetchCoursework();
  }, []);

  // auto-open if navigated with assignmentId
  useEffect(() => {
    if (!loading && preselectId) {
      const found = coursework.find(it => it.id === preselectId);
      if (found && !found.submitted) setSelectedItem(found);
    }
  }, [loading, preselectId, coursework]);

  const fetchCoursework = async () => {
    try {
      const { data } = await api.get('/students/assignments');
      setCoursework(data);
    } catch {
      setError('Failed to fetch coursework');
    } finally {
      setLoading(false);
    }
  };

  const getStudentIdFromToken = () => {
    const token = getAccessToken();
    if (!token) return null;
    try {
      const [, b64] = token.split('.');
      const p = JSON.parse(atob(b64));
      return p.id || p.sub;
    } catch {
      return null;
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    const studentId = getStudentIdFromToken();
    if (!studentId) {
      setError('Unable to determine student ID');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('submissionContent', submissionContent);
      if (submissionFile) formData.append('file', submissionFile);

      await api.post(
        `/submissions/assignments/${assignmentId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      await fetchCoursework();
      setSelectedItem(null);
      setSubmissionContent('');
      setSubmissionFile(null);
    } catch {
      setError('Failed to submit assignment');
    }
  };

  if (loading) return <div className="loading">Loading coursework...</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="coursework-container">
      <h1>Coursework</h1>

      {coursework.length === 0 ? (
        <div className="no-coursework">No assignments found.</div>
      ) : (
        <div className="coursework-list">
          {coursework.map(item => (
            <div key={item.id} className="coursework-item">
              <div className="coursework-header">
                <h3
                  style={{ cursor: item.submitted ? 'default' : 'pointer' }}
                  onClick={() => !item.submitted && setSelectedItem(item)}
                >
                  {item.title}
                </h3>
                {item.submitted && (
                  <span className="status">Submitted</span>
                )}
              </div>
              <p className="course-name">{item.courseName}</p>
              {item.description && <p className="description">{item.description}</p>}
              {item.dueDate && (
                <p className={`due-date ${new Date(item.dueDate) < new Date() ? 'overdue' : ''}`}>
                  Due: {new Date(item.dueDate).toLocaleDateString()}
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

      {selectedItem && (
        <div className="submission-modal">
          <div className="modal-content">
            <h2>Submit: {selectedItem.title}</h2>
            <div className="submission-form">
              <div className="form-group">
                <label>Your Submission:</label>
                <textarea
                  value={submissionContent}
                  onChange={e => setSubmissionContent(e.target.value)}
                  placeholder="Enter your submission..."
                />
              </div>
              <div className="form-group">
                <label>Attach File (optional):</label>
                <input type="file" onChange={e => setSubmissionFile(e.target.files[0])} />
              </div>
              <div className="modal-actions">
                <button className="submit-button"
                        onClick={() => handleSubmitAssignment(selectedItem.id)}>
                  Submit
                </button>
                <button className="cancel-button"
                        onClick={() => setSelectedItem(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
