import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import './QuizAttempt.css';

export default function QuizAttempt() {
  const { quizId } = useParams();
  const [quiz, setQuiz]         = useState(null);
  const [answers, setAnswers]   = useState({});
  const [submission, setSubmission] = useState(null);
  const [page, setPage]         = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    async function load() {
      try {
        // try existing submission
        const existResp = await api
          .get(`/submissions/quizzes/${quizId}/students/me`)
          .catch(e => e.response?.status===404 ? { data: null } : Promise.reject(e));

        // quiz details
        const quizResp = await api.get(`/quizzes/${quizId}`);
        setSubmission(existResp.data);
        setQuiz(quizResp.data);

        // init answers
        const init = {};
        quizResp.data.questions.forEach(q => {
          init[q.id] = q.questionType.includes('MULTIPLE_CHOICE_MULTIPLE') ? [] : '';
        });
        setAnswers(init);
      } catch (e) {
        console.error(e);
        setError('Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [quizId]);

  if (loading) return <p className="qa-error">Loading…</p>;
  if (error)   return <p className="qa-error">{error}</p>;

  // already submitted? show results
  if (submission) {
    const total = quiz.questions.reduce((sum,q)=>(sum+(q.weight||1)),0);
    return (
      <div className="quiz-attempt">
        <h1 className="qa-title">{quiz.title}</h1>
        <p className="qa-overall">
          Score: <strong>{submission.score}</strong> / <strong>{total}</strong>
        </p>
        {quiz.questions.map((q,idx)=> {
          const raw  = submission.answers[idx]||'';
          const stu  = raw.split(',').map(s=>s.trim()).filter(Boolean);
          const corr = q.correctAnswer.split(',').map(s=>s.trim());
          let earned = 0;

          if (
            q.questionType==='TRUE_FALSE' ||
            q.questionType==='MULTIPLE_CHOICE_SINGLE'
          ) {
            earned = stu[0]?.toLowerCase()===corr[0]?.toLowerCase()
              ? q.weight||1
              : 0;
          } else {
            const got  = new Set(stu.map(a=>a.toLowerCase()));
            const want = new Set(corr.map(a=>a.toLowerCase()));
            earned = (
              got.size===want.size &&
              [...want].every(a=>got.has(a))
            ) ? q.weight||1 : 0;
          }

          return (
            <Card key={q.id} className="qa-block">
              <div className="qa-header">
                <span className="qa-number">Q{idx+1}.</span>
                <span className="qa-text">{q.text}</span>
                <span className="qa-weight">({q.weight||1} pts)</span>
              </div>
              <div className="qa-row">
                <span className="label">Your:</span>
                <span>{stu.join(', ')||<em>(no answer)</em>}</span>
              </div>
              <div className="qa-row">
                <span className="label">Correct:</span>
                <span>{corr.join(', ')}</span>
              </div>
              <div className="qa-row">
                <span className="label">Earned:</span>
                <span>{earned} / {q.weight||1}</span>
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  // not yet submitted → attempt form
  const pageSizeVal = quiz.pageSize || quiz.questions.length;
  const navModeVal  = quiz.navigationMode || 'FREE';
  const totalPages  = Math.ceil(quiz.questions.length / pageSizeVal);
  const start       = page * pageSizeVal;
  const slice       = quiz.questions.slice(start, start+pageSizeVal);

  const handleChange = (q,val) => {
    setAnswers(a => {
      const cur = a[q.id];
      if (Array.isArray(cur)) {
        return {
          ...a,
          [q.id]: cur.includes(val)
            ? cur.filter(x=>x!==val)
            : [...cur, val]
        };
      }
      return { ...a, [q.id]: val };
    });
  };

  const pageComplete = slice.every(q => {
    const ans = answers[q.id];
    return Array.isArray(ans) ? ans.length>0 : ans!=='';
  });

  const canNext = () => {
    if (page<totalPages-1) {
      return navModeVal==='FREE' || (navModeVal==='LINEAR' && pageComplete);
    }
    return false;
  };

  const handleNext = () => canNext() && setPage(p=>p+1);
  const handlePrev = () => navModeVal==='FREE' && page>0 && setPage(p=>p-1);

  const handleSubmit = async () => {
    try {
      const payload = quiz.questions.map(q =>
        Array.isArray(answers[q.id])
          ? answers[q.id].join(',')
          : answers[q.id]
      );
      const { data } = await api.post(
        `/submissions/quizzes/${quizId}/students/me`,
        { answers: payload }
      );
      setSubmission(data);
      message.success('Submitted!');
    } catch {
      message.error('Submission failed.');
    }
  };

  return (
    <div className="quiz-attempt">
      <h1 className="qa-title">{quiz.title}</h1>
      {slice.map((q,idx)=>(
        <Card key={q.id} className="question-card">
          <div className="qa-header">
            <span className="qa-number">{start+idx+1}.</span>
            <span className="qa-text">{q.text}</span>
            <span className="qa-weight">({q.weight||1} pts)</span>
          </div>

          {q.questionType==='TRUE_FALSE' &&
            ['True','False'].map(v=>(
              <label key={v}>
                <input
                  type="radio"
                  checked={answers[q.id]===v}
                  onChange={()=>handleChange(q,v)}
                /> {v}
              </label>
            ))}

          {q.questionType==='MULTIPLE_CHOICE_SINGLE' &&
            q.options.map(opt=>(
              <label key={opt}>
                <input
                  type="radio"
                  checked={answers[q.id]===opt}
                  onChange={()=>handleChange(q,opt)}
                /> {opt}
              </label>
            ))}

          {q.questionType==='MULTIPLE_CHOICE_MULTIPLE' &&
            q.options.map(opt=>(
              <label key={opt}>
                <input
                  type="checkbox"
                  checked={answers[q.id].includes(opt)}
                  onChange={()=>handleChange(q,opt)}
                /> {opt}
              </label>
            ))}

          {q.questionType==='ESSAY' && (
            <textarea
              rows={4}
              value={answers[q.id]}
              onChange={e=>handleChange(q,e.target.value)}
              placeholder="Your answer…"
            />
          )}
        </Card>
      ))}

      <div className="pagination-controls">
        <Button onClick={handlePrev} disabled={page===0 || navModeVal!=='FREE'}>
          Previous
        </Button>
        {page<totalPages-1 ? (
          <Button type="primary" onClick={handleNext} disabled={!canNext()}>
            Next
          </Button>
        ) : (
          <Button type="primary" onClick={handleSubmit} disabled={!pageComplete}>
            Submit Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
