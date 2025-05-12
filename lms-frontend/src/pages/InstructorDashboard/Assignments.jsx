import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './Assignments.css';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/instructor/assignments')
      .then(res => setAssignments(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = id => {
    if (!window.confirm('Delete this assignment?')) return;
    api.delete(`/instructor/assignments/${id}`)
      .then(() => setAssignments(a => a.filter(x => x.id !== id)))
      .catch(console.error);
  };

  return (
    <div className="assignments-page">
      <header className="page-header">
        <h2>My Assignments</h2>
        <button className="btn primary"><FiPlus /> New Assignment</button>
      </header>

      {loading ? (
        <p>Loading…</p>
      ) : assignments.length === 0 ? (
        <p>No assignments yet.</p>
      ) : (
        <ul className="assignments-list">
          {assignments.map(a => (
            <li key={a.id}>
              <div>
                <strong>{a.title}</strong>
                <p>{a.description}</p>
                <small>Due: {new Date(a.dueDate).toLocaleDateString()}</small>
              </div>
              <div className="actions">
                <button><FiEdit2 /></button>
                <button className="trash" onClick={() => handleDelete(a.id)}><FiTrash2 /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
