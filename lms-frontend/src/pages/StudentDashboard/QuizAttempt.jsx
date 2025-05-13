import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './QuizAttempt.css';

export default function QuizAttempt() {
  const { quizId } = useParams();
  const navigate   = useNavigate();

  const [quiz,    setQuiz]    = useState(null);
  const [answers, setAnswers] = useState({});
  const [error,   setError]   = useState('');

  // 1) fetch the quiz
  useEffect(() => {
    api.get(`/quizzes/${quizId}`)
      .then(res => {
        setQuiz(res.data);
        // init answers
        const init = {};
        res.data.questions.forEach(q => {
          init[q.id] = q.questionType.includes('MULTIPLE_CHOICE_MULTIPLE')
            ? []
            : '';
        });
        setAnswers(init);
      })
      .catch(() => setError('Failed to load quiz'));
  }, [quizId]);

  const handleChange = (q, val) => {
    const current = answers[q.id];
    if (Array.isArray(current)) {
      // toggle for multiple‐choice‐multiple
      setAnswers(a => ({
        ...a,
        [q.id]: current.includes(val)
          ? current.filter(x => x !== val)
          : [...current, val]
      }));
    } else {
      // radio / text
      setAnswers(a => ({ ...a, [q.id]: val }));
    }
  };

  // 2) submit against the new “me” shortcut endpoint
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const payload = quiz.questions.map(q => answers[q.id]);
      await api.post(
        `/submissions/quizzes/${quizId}/students/me`,
        { answers: payload }
      );
      navigate('/student/grades');
    } catch {
      setError('Submission failed');
    }
  };

  if (!quiz) return <p>Loading quiz…</p>;

  return (
    <div className="quiz-attempt">
      <h1>{quiz.title}</h1>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="question-block">
            <p><strong>{idx + 1}.</strong> {q.text}</p>

            {q.questionType === 'TRUE_FALSE' &&
              ['true','false'].map(val => (
                <label key={val}>
                  <input
                    type="radio"
                    name={String(q.id)}
                    checked={answers[q.id] === val}
                    onChange={() => handleChange(q, val)}
                  />
                  {val}
                </label>
              ))
            }

            {q.questionType.includes('MULTIPLE_CHOICE_SINGLE') &&
              q.options.map(opt => (
                <label key={opt}>
                  <input
                    type="radio"
                    name={String(q.id)}
                    checked={answers[q.id] === opt}
                    onChange={() => handleChange(q, opt)}
                  />
                  {opt}
                </label>
              ))
            }

            {q.questionType.includes('MULTIPLE_CHOICE_MULTIPLE') &&
              q.options.map(opt => (
                <label key={opt}>
                  <input
                    type="checkbox"
                    checked={answers[q.id].includes(opt)}
                    onChange={() => handleChange(q, opt)}
                  />
                  {opt}
                </label>
              ))
            }

            {q.questionType === 'ESSAY' && (
              <textarea
                rows={6}
                value={answers[q.id]}
                onChange={e => handleChange(q, e.target.value)}
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
