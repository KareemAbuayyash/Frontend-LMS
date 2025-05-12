import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './Submissions.css';
import { FiCheck, FiXCircle } from 'react-icons/fi';

export default function Submissions() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/instructor/submissions')
      .then(res => setSubs(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const grade = (id, ok) => {
    api.post(`/instructor/submissions/${id}/grade`, { passed: ok })
      .then(() => setSubs(s => s.map(x => x.id === id ? { ...x, graded: true, passed: ok } : x)))
      .catch(console.error);
  };

  return (
    <div className="submissions-page">
      <h2>Student Submissions</h2>
      {loading ? (
        <p>Loading…</p>
      ) : subs.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        <table className="submissions-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Assignment</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(s => (
              <tr key={s.id}>
                <td>{s.studentName}</td>
                <td>{s.assignmentTitle}</td>
                <td>{new Date(s.submittedAt).toLocaleDateString()}</td>
                <td>{s.graded ? (s.passed ? 'Passed' : 'Failed') : 'Pending'}</td>
                <td>
                  {!s.graded && (
                    <>
                      <button onClick={() => grade(s.id, true)}><FiCheck /></button>
                      <button onClick={() => grade(s.id, false)}><FiXCircle /></button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
