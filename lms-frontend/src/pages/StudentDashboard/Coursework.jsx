import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Coursework() {
  const [coursework, setCoursework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [submissionContent, setSubmissionContent] = useState('');
  const [quizAnswers, setQuizAnswers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchCoursework();
  }, []);

  const fetchCoursework = async () => {
    try {
      const response = await axios.get('/server/student_api.php?endpoint=coursework', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Coursework API response:', response.data); // Debug log
      setCoursework(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch coursework');
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async (assignmentId) => {
    try {
      await axios.post('/server/student_api.php?endpoint=submit-assignment', 
        {
          assignmentId,
          submissionContent
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSelectedItem(null);
      setSubmissionContent('');
      fetchCoursework();
    } catch (err) {
      setError('Failed to submit assignment');
    }
  };

  const handleSubmitQuiz = async (quizId) => {
    try {
      await axios.post('/server/student_api.php?endpoint=submit-quiz',
        {
          quizId,
          answers: quizAnswers
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSelectedItem(null);
      setQuizAnswers([]);
      fetchCoursework();
    } catch (err) {
      setError('Failed to submit quiz');
    }
  };

  const handleQuizAnswerChange = (index, value) => {
    const newAnswers = [...quizAnswers];
    newAnswers[index] = value;
    setQuizAnswers(newAnswers);
  };

  return (
    <div className="coursework-container">
      <h1>Coursework</h1>
      {loading && <div>Loading coursework...</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <>
          {Array.isArray(coursework) && coursework.length === 0 ? (
            <div className="no-coursework">No assignments or quizzes found.</div>
          ) : (
            <div className="coursework-list">
              {coursework.map((item) => (
                <div key={`${item.type}-${item.id}`} className="coursework-item">
                  <div className="coursework-header">
                    <h3>{item.title}</h3>
                    <span className={`status ${item.submitted ? 'submitted' : 'pending'}`}>
                      {item.submitted ? 'Submitted' : 'Pending'}
                    </span>
                  </div>
                  <p className="course-name">{item.courseName}</p>
                  {item.description && <p className="description">{item.description}</p>}
                  {item.dueDate && <p className="due-date">Due: {new Date(item.dueDate).toLocaleDateString()}</p>}
                  {item.score !== null && <p className="score">Score: {item.score}/{item.totalPoints}</p>}
                  {!item.submitted && (
                    <button 
                      className="submit-btn"
                      onClick={() => setSelectedItem(item)}
                    >
                      {item.type === 'assignment' ? 'Submit Assignment' : 'Take Quiz'}
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
            {selectedItem.type === 'assignment' ? (
              <div className="assignment-submission">
                <textarea
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Enter your assignment submission..."
                  rows={10}
                />
                <div className="modal-actions">
                  <button onClick={() => handleSubmitAssignment(selectedItem.id)}>
                    Submit
                  </button>
                  <button onClick={() => setSelectedItem(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="quiz-submission">
                <p>Please answer the following questions:</p>
                {selectedItem.questions?.map((question, index) => (
                  <div key={index} className="quiz-question">
                    <p>{question.text}</p>
                    <input
                      type="text"
                      value={quizAnswers[index] || ''}
                      onChange={(e) => handleQuizAnswerChange(index, e.target.value)}
                      placeholder="Your answer..."
                    />
                  </div>
                ))}
                <div className="modal-actions">
                  <button onClick={() => handleSubmitQuiz(selectedItem.id)}>
                    Submit Quiz
                  </button>
                  <button onClick={() => setSelectedItem(null)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .coursework-container {
          padding: 20px;
        }
        .no-coursework {
          color: #888;
          font-size: 1.2em;
          margin: 40px 0;
          text-align: center;
        }
        .coursework-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .coursework-item {
          background: white;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .coursework-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.9em;
        }
        .status.submitted {
          background: #e6f4ea;
          color: #1e7e34;
        }
        .status.pending {
          background: #fff3cd;
          color: #856404;
        }
        .course-name {
          color: #666;
          margin-bottom: 10px;
        }
        .description {
          margin: 10px 0;
        }
        .due-date {
          color: #dc3545;
          font-size: 0.9em;
        }
        .score {
          font-weight: bold;
          margin-top: 10px;
        }
        .submit-btn {
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          margin-top: 10px;
        }
        .submit-btn:hover {
          background: #0056b3;
        }
        .submission-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }
        .assignment-submission textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin: 10px 0;
        }
        .quiz-question {
          margin: 15px 0;
        }
        .quiz-question input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-top: 5px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        .modal-actions button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .modal-actions button:first-child {
          background: #007bff;
          color: white;
        }
        .modal-actions button:last-child {
          background: #6c757d;
          color: white;
        }
      `}</style>
    </div>
  );
} 