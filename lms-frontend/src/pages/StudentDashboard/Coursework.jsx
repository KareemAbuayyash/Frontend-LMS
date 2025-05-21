// src/pages/student/Coursework.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation }    from 'react-router-dom';
import api                              from '../../api/axios';
import './Coursework.css';

export default function Coursework() {
  const [coursework, setCoursework] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { refresh, preselectId } = location.state || {};

  // 1) Fetch on mount and whenever `refresh` toggles
  useEffect(() => {
    setLoading(true);
    api.get('/students/assignments')
      .then(res => {
        setCoursework(res.data);
        setError(null);
      })
      .catch(() => setError('Failed to fetch coursework'))
      .finally(() => setLoading(false));
  }, [refresh]);

  // 2) Auto-navigate if preselectId was passed
  useEffect(() => {
    if (!loading && preselectId) {
      const found = coursework.find(a => a.id === preselectId);
      if (found) {
        navigate(
          `/student/courses/${found.courseId}/assignments/${found.id}`,
          { replace: true }
        );
      }
    }
  }, [loading, preselectId, coursework, navigate]);

  // 3) Clear any refresh/preselect state so “Back” doesn’t re-trigger
  useEffect(() => {
    if (refresh || preselectId) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [refresh, preselectId, navigate, location.pathname]);

  if (loading) return <div className="loading">Loading coursework…</div>;
  if (error)   return <div className="error">{error}</div>;

  return (
    <div className="coursework-container">
      <h1>Coursework</h1>

      {coursework.length === 0 ? (
        <div className="no-coursework">No assignments found.</div>
      ) : (
        <div className="coursework-list">
          {coursework.map(item => (
            <div
              key={item.id}
              className="coursework-item"
              onClick={() =>
                navigate(
                  `/student/courses/${item.courseId}/assignments/${item.id}`
                )
              }
            >
              <div className="coursework-header">
                <h3>{item.title}</h3>
                {/* Always show “Submitted” badge (or drop it completely) */}
                {item.submitted && (
                  <span className="status submitted">Submitted</span>
                )}
              </div>

              <p className="course-name">{item.courseName}</p>

              {item.description && (
                <p className="description">{item.description}</p>
              )}

              {item.dueDate && (
                <p
                  className={
                    'due-date ' +
                    (new Date(item.dueDate) < new Date() ? 'overdue' : '')
                  }
                >
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
