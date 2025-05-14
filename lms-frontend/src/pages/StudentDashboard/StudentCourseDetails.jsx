import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import './StudentCourseDetails.css';

export default function StudentCourseDetails() {
  const { courseId } = useParams();
  const navigate      = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [quizzes,     setQuizzes]     = useState([]);
  const [content,     setContent]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  const [showAssign, setShowAssign] = useState(true);
  const [showQuiz,   setShowQuiz]   = useState(true);
  const [showCont,   setShowCont]   = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [aRes, qRes, cRes] = await Promise.all([
          api.get(`/assignments/course/${courseId}`),
          api.get(`/quizzes/course/${courseId}`),
          api.get(`/content/course/${courseId}`)
        ]);
        setAssignments(aRes.data);
        setQuizzes(qRes.data);
        setContent(cRes.data);
      } catch {
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [courseId]);

  // navigate to coursework & auto-open modal for this assignment
  const goToSubmit = (assignmentId) => {
    navigate('/student/coursework', { state: { assignmentId } });
  };

  if (loading) return <p>Loading…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="course-details">
      <h1>Course Details</h1>

      {/* Assignments */}
      <div className="section-container">
        <div className="toggle-header" onClick={() => setShowAssign(!showAssign)}>
          <span className={`arrow ${!showAssign ? 'collapsed' : ''}`}>▶</span>
          <h2>Assignments</h2>
        </div>
        {showAssign && (
          <div className="section-content">
            {assignments.length === 0
              ? <p>No assignments.</p>
              : <ul>
                  {assignments.map(a => (
                    <li
                      key={a.id}
                      className="assignment-item"
                      onClick={() => !a.submitted && goToSubmit(a.id)}
                      style={{ cursor: a.submitted ? 'default' : 'pointer' }}
                      title={a.submitted ? 'Already submitted' : 'Click to submit'}
                    >
                      <div className="assignment-details">
                        <span className="assignment-title">{a.title}</span>
                        <span className="assignment-date">
                          Due: {new Date(a.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      {a.submitted && (
                        <span className="status">Submitted</span>
                      )}
                    </li>
                  ))}
                </ul>
            }
          </div>
        )}
      </div>

      {/* Quizzes */}
      <div className="section-container">
        <div className="toggle-header" onClick={() => setShowQuiz(!showQuiz)}>
          <span className={`arrow ${!showQuiz ? 'collapsed' : ''}`}>▶</span>
          <h2>Quizzes</h2>
        </div>
        {showQuiz && (
          <div className="section-content">
            {quizzes.length === 0
              ? <p>No quizzes.</p>
              : <ul>
                  {quizzes.map(q => (
                    <li key={q.id} className="quiz-item">
                      <Link className="quiz-link"
                            to={`/student/courses/${courseId}/quizzes/${q.id}`}>
                        {q.title}
                      </Link>
                    </li>
                  ))}
                </ul>
            }
          </div>
        )}
      </div>

      {/* Content */}
      <div className="section-container">
        <div className="toggle-header" onClick={() => setShowCont(!showCont)}>
          <span className={`arrow ${!showCont ? 'collapsed' : ''}`}>▶</span>
          <h2>Content</h2>
        </div>
        {showCont && (
          <div className="section-content">
            {content.length === 0
              ? <p>No content available.</p>
              : <ul>
                  {content.map(item => (
                    <li key={item.id} className="content-item">
                      <strong>{item.title}</strong>
                      {item.description && <p>{item.description}</p>}
                      <button
                        className="download-button"
                        onClick={async () => {
                          const resp = await api.get(`/content/${item.id}/download`, { responseType: 'blob' });
                          const url  = window.URL.createObjectURL(resp.data);
                          const a    = document.createElement('a');
                          a.href     = url;
                          a.download = item.title + '.pdf';
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                          window.URL.revokeObjectURL(url);
                        }}
                      >
                        Download
                      </button>
                      <button
                        className="view-button"
                        onClick={async () => {
                          const resp = await api.get(`/content/${item.id}/download`, { responseType: 'blob' });
                          const url = window.URL.createObjectURL(resp.data);
                          window.open(url, '_blank');
                          setTimeout(() => window.URL.revokeObjectURL(url), 60000);
                        }}
                      >
                        View
                      </button>
                    </li>
                  ))}
                </ul>
            }
          </div>
        )}
      </div>
    </div>
  );
}
