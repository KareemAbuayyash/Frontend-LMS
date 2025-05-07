import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/axios';
import {
  FiTrash2,
  FiEdit2,
  FiPlus,
  FiCheck,
  FiSearch
} from 'react-icons/fi';
import './Enrollments.css';

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents]       = useState([]);
  const [courses, setCourses]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState({
    studentId: '',
    courseIds: [],
    enrollmentDate: '',
    completed: false,
  });

  // 1) load enrollments, students, courses
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/enrollments'),
      api.get('/students'),
      api.get('/courses'),
    ])
      .then(([eRes, sRes, cRes]) => {
        // unwrap enrollments
        const embedded = eRes.data._embedded || {};
        const key = Object.keys(embedded)[0];
        const raw = key ? embedded[key] : [];
        setEnrollments(raw.map(item => item.content || item));

        // students response is assumed as simple array
        setStudents(sRes.data);

        // courses unwrap
        const cEmbedded = cRes.data._embedded || {};
        const cKey = Object.keys(cEmbedded)[0];
        setCourses(cKey ? cEmbedded[cKey] : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 2) filter by student name
  const displayed = useMemo(() => {
    return enrollments.filter(e => {
      if (!filter) return true;
      const student = students.find(s => s.id === e.studentId);
      return (student?.username || '').toLowerCase().includes(filter.toLowerCase());
    });
  }, [enrollments, students, filter]);

  // open/close modal
  const openModal = () => {
    setEditing(null);
    setForm({ studentId: '', courseIds: [], enrollmentDate: '', completed: false });
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  // save (create or update)
  const handleSave = async e => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/enrollments/${editing.enrollmentId}`, form);
      } else {
        await api.post('/enrollments/newEnrollment', form);
      }
      await Promise.all([]); // just to await 
      // reload
      window.location.reload();
    } catch (err) {
      console.error('Save failed', err);
      alert(err.response?.data?.details || err.message);
    }
  };

  // delete
  const handleDelete = async id => {
    if (!window.confirm('Really delete this enrollment?')) return;
    try {
      await api.delete(`/enrollments/${id}`);
      setEnrollments(es => es.filter(e => e.enrollmentId !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  // edit
  const startEdit = eItem => {
    setEditing(eItem);
    setForm({
      studentId:      eItem.studentId,
      courseIds:      eItem.courseIds,
      enrollmentDate: eItem.enrollmentDate.slice(0,10),
      completed:      eItem.completed,
    });
    setModalOpen(true);
  };

  // form helper
  const handleChange = (field, value) =>
    setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="enrollments-page">
      <div className="toolbar">
        <div className="search-box">
          <FiSearch className="icon" />
          <input
            type="text"
            placeholder="Search students…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <button className="btn primary" onClick={openModal}>
          <FiPlus /> New Enrollment
        </button>
      </div>

      <div className="table-container">
        <table className="enrollments-table">
          <thead>
            <tr>
              <th>Enrollment ID</th>
              <th>Student</th>
              <th>Courses</th>
              <th>Date</th>
              <th>Completed</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty"><td colSpan={6}>Loading…</td></tr>
            ) : displayed.length === 0 ? (
              <tr className="empty"><td colSpan={6}>No enrollments found.</td></tr>
            ) : displayed.map(e => {
              const student = students.find(s => s.id === e.studentId);
              const courseNames = e.courseIds
                .map(id => courses.find(c => c.courseId === id)?.courseName || id)
                .join(', ');

              return (
                <tr key={e.enrollmentId}>
                  <td>{e.enrollmentId}</td>
                  <td>{student?.username || e.studentId}</td>
                  <td>{courseNames}</td>
                  <td>{new Date(e.enrollmentDate).toLocaleDateString()}</td>
                  <td>{e.completed ? 'Yes' : 'No'}</td>
                  <td className="actions-col">
                    <button className="icon-btn" onClick={() => startEdit(e)}>
                      <FiEdit2 />
                    </button>
                    <button className="icon-btn trash" onClick={() => handleDelete(e.enrollmentId)}>
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editing ? 'Edit Enrollment' : 'New Enrollment'}</h3>
            <form onSubmit={handleSave}>
              <div className="grid2">
                <select
                  required
                  value={form.studentId}
                  onChange={e => handleChange('studentId', Number(e.target.value))}
                >
                  <option value="">Select student</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.username}</option>
                  ))}
                </select>

                <select
                  multiple
                  required
                  value={form.courseIds}
                  onChange={e => {
                    const opts = Array.from(e.target.selectedOptions, o => Number(o.value));
                    handleChange('courseIds', opts);
                  }}
                >
                  {courses.map(c => (
                    <option key={c.courseId} value={c.courseId}>
                      {c.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid2">
                <input
                  type="date"
                  required
                  value={form.enrollmentDate}
                  onChange={e => handleChange('enrollmentDate', e.target.value)}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="checkbox"
                    checked={form.completed}
                    onChange={e => handleChange('completed', e.target.checked)}
                  />
                  Completed
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn primary">
                  <FiCheck /> {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
