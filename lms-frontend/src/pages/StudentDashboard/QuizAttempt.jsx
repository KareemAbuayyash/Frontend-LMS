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

  // load existing submission + quiz
  useEffect(() => {
    async function init() {
      try {
        const { data: existing } = await api.get(
          `/submissions/quizzes/${quizId}/students/me`
        );
        setSubmission(existing);
      } catch (err) {
        if (err.response?.status !== 404) {
          console.error(err);
          setError('Failed to check submission.');
          setLoading(false);
          return;
        }
      }

      try {
        const { data } = await api.get(`/quizzes/${quizId}`);
        setQuiz(data);

        // init empty answers
        const init = {};
        data.questions.forEach((q) => {
          init[q.id] = q.questionType.includes('MULTIPLE_CHOICE_MULTIPLE')
            ? []
            : '';
        });
        setAnswers(init);
      } catch (err) {
        console.error(err);
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
      setAnswers((a) => ({
        ...a,
        [q.id]: curr.includes(val)
          ? curr.filter((x) => x !== val)
          : [...curr, val],
      }));
    } else {
      setAnswers((a) => ({ ...a, [q.id]: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
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
          ? 'You cannot submit again.'
          : 'Submission failed.'
      );
    }
  };

  if (loading) return <p className="qa-error">Loading…</p>;
  if (error) return <p className="qa-error">{error}</p>;

  // If already submitted, show per-question breakdown
  if (submission) {
    const studentArr = submission.answers;
    return (
      <div className="quiz-attempt">
        <h1 className="qa-title">{quiz.title}</h1>
        <p className="qa-overall">
          Your Score: <strong>{submission.score}</strong> /{' '}
          <strong>
            {quiz.questions.reduce((sum, q) => sum + (q.weight || 1), 0)}
          </strong>
        </p>

        {quiz.questions.map((q, idx) => {
          // parse
          const rawStu = studentArr[idx] ?? '';
          const stuSet = rawStu.split(',').map(s => s.trim()).filter(Boolean);
          const corrSet = q.correctAnswer
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);

          // compute earned
          let earned = 0;
          if (
            q.questionType === 'TRUE_FALSE' ||
            q.questionType === 'MULTIPLE_CHOICE_SINGLE'
          ) {
            earned =
              (stuSet[0] || '').toLowerCase() ===
              (corrSet[0] || '').toLowerCase()
                ? q.weight || 1
                : 0;
          } else {
            const got = new Set(stuSet.map(a => a.toLowerCase()));
            const want = new Set(corrSet.map(a => a.toLowerCase()));
            const full =
              got.size === want.size && [...want].every(ans => got.has(ans));
            earned = full ? q.weight || 1 : 0;
          }

          return (
            <div key={q.id} className="qa-block">
              <div className="qa-header">
                <span className="qa-number">Q{idx + 1}.</span>
                <span className="qa-text">{q.text}</span>
                <span className="qa-weight">({q.weight || 1} pts)</span>
              </div>
              <div className="qa-row">
                <span className="label">Your answer:</span>
                <span>{stuSet.join(', ') || <em>(no answer)</em>}</span>
              </div>
              <div className="qa-row">
                <span className="label">Correct:</span>
                <span>{corrSet.join(', ')}</span>
              </div>
              <div className="qa-row">
                <span className="label">Earned:</span>
                <span>
                  {earned} / {q.weight || 1} pts
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // render attempt form
  return (
    <div className="quiz-attempt">
      <h1 className="qa-title">{quiz.title}</h1>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="question-block">
            <p>
              <strong>{idx + 1}.</strong> {q.text}{' '}
              <span className="qa-weight">({q.weight || 1} pts)</span>
            </p>

            {q.questionType === 'TRUE_FALSE' &&
              ['True', 'False'].map((val) => (
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

            {q.questionType === 'MULTIPLE_CHOICE_SINGLE' &&
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

            {q.questionType === 'MULTIPLE_CHOICE_MULTIPLE' &&
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
                rows={5}
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
