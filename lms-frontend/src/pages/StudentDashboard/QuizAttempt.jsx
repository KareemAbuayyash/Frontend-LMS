// src/components/quizzes/QuizAttempt.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import './QuizAttempt.css';

export default function QuizAttempt() {
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function init() {
      try {
        // 1) check for existing submission
        const { data: existing } = await api.get(
          `/submissions/quizzes/${quizId}/students/me`
        );
        setSubmission(existing);
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error('Error checking submission:', err);
          setError('Failed to check submission status.');
        }
        // 404 → no submission yet
      }

      // 2) fetch quiz data
      try {
        const { data } = await api.get(`/quizzes/${quizId}`);
        setQuiz(data);

        // initialize answers state
        const init = {};
        data.questions.forEach((q) => {
          init[q.id] = q.questionType.includes('MULTIPLE_CHOICE_MULTIPLE')
            ? []
            : '';
        });
        setAnswers(init);
      } catch (err) {
        console.error('Failed to load quiz:', err);
        setError('Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [quizId]);

  const handleChange = (q, val) => {
    const curr = answers[q.id];
    if (Array.isArray(curr)) {
      // multiple-choice-multiple
      setAnswers((a) => ({
        ...a,
        [q.id]: curr.includes(val)
          ? curr.filter((x) => x !== val)
          : [...curr, val],
      }));
    } else {
      // single-value
      setAnswers((a) => ({ ...a, [q.id]: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // flatten arrays into comma-separated strings
      const payload = quiz.questions.map((q) => {
        const ans = answers[q.id];
        return Array.isArray(ans) ? ans.join(',') : ans;
      });

      const { data } = await api.post(
        `/submissions/quizzes/${quizId}/students/me`,
        { answers: payload }
      );
      setSubmission(data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.status === 400
          ? 'You cannot submit this quiz again.'
          : 'Submission failed.'
      );
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="error">{error}</p>;

  // already submitted?
  if (submission) {
    return (
      <div className="quiz-attempt">
        <h1>{quiz?.title || 'Quiz'}</h1>
        <p><strong>Your Score:</strong> {submission.score}</p>
        <p><strong>Submitted:</strong> {new Date(submission.submissionDate).toLocaleString()}</p>
      </div>
    );
  }

  // render the attempt form
  return (
    <div className="quiz-attempt">
      <h1>{quiz.title}</h1>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="question-block">
            <p><strong>{idx + 1}.</strong> {q.text}</p>

            {q.questionType === 'TRUE_FALSE' &&
              ['true', 'false'].map((val) => (
                <label key={val}>
                  <input
                    type="radio"
                    name={String(q.id)}
                    checked={answers[q.id] === val}
                    onChange={() => handleChange(q, val)}
                  />
                  {val}
                </label>
              ))}

            {q.questionType.includes('MULTIPLE_CHOICE_SINGLE') &&
              q.options.map((opt) => (
                <label key={opt}>
                  <input
                    type="radio"
                    name={String(q.id)}
                    checked={answers[q.id] === opt}
                    onChange={() => handleChange(q, opt)}
                  />
                  {opt}
                </label>
              ))}

            {q.questionType.includes('MULTIPLE_CHOICE_MULTIPLE') &&
              q.options.map((opt) => (
                <label key={opt}>
                  <input
                    type="checkbox"
                    checked={answers[q.id].includes(opt)}
                    onChange={() => handleChange(q, opt)}
                  />
                  {opt}
                </label>
              ))}

            {q.questionType === 'ESSAY' && (
              <textarea
                rows={6}
                value={answers[q.id]}
                onChange={(e) => handleChange(q, e.target.value)}
                placeholder="Your answer…"
              />
            )}
          </div>
        ))}

        <button type="submit" className="submit-quiz-btn">
          Submit Quiz
        </button>
      </form>
    </div>
  );
}
