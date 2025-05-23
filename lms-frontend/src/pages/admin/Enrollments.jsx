import React, { useState, useEffect, useMemo } from 'react';
import api from '../../api/axios';
import { saveAs } from 'file-saver';
import {
  FiTrash2,
  FiEdit2,
  FiPlus,
  FiCheck,
  FiSearch,
  FiDownload
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import './Enrollments.css';

export default function Enrollments() {
  const { t, i18n } = useTranslation();
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents]       = useState([]);
  const [courses, setCourses]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [studentFilter, setStudentFilter] = useState('');
  const [courseFilter, setCourseFilter]   = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState({
    studentId: '',
    courseIds: [],
    enrollmentDate: '',
    completed: false,
  });

  // Load enrollments, students, courses
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/enrollments'),
      api.get('/students'),
      api.get('/courses'),
    ])
      .then(([eRes, sRes, cRes]) => {
        const embedded = eRes.data._embedded || {};
        const key = Object.keys(embedded)[0] || '';
        const raw = key ? embedded[key] : [];
        setEnrollments(raw.map(item => item.content || item));

        setStudents(sRes.data);

        const cEmbedded = cRes.data._embedded || {};
        const cKey = Object.keys(cEmbedded)[0] || '';
        setCourses(cKey ? cEmbedded[cKey] : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Set responsive table label variables on language change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--label-enrollment-id', `"${t('Enrollment ID')}"`);
    root.style.setProperty('--label-student', `"${t('Student')}"`);
    root.style.setProperty('--label-courses', `"${t('Courses')}"`);
    root.style.setProperty('--label-date', `"${t('Date')}"`);
    root.style.setProperty('--label-completed', `"${t('Completed')}"`);
    root.style.setProperty('--label-actions', `"${t('Actions')}"`);
  }, [t, i18n.language]);

  // Filter by student or course selection
  const displayed = useMemo(() => {
    return enrollments.filter(e => {
      // student filter
      if (studentFilter) {
        const student = students.find(s => s.id === e.studentId);
        if (!student || !student.username.toLowerCase().includes(studentFilter.toLowerCase())) {
          return false;
        }
      }
      // course filter (by courseId)
      if (courseFilter) {
        if (!e.courseIds.includes(Number(courseFilter))) {
          return false;
        }
      }
      return true;
    });
  }, [enrollments, students, studentFilter, courseFilter]);

  // Export enrollments to CSV
  const exportEnrollmentsCSV = () => {
    const header = [
      t('Enrollment ID'),
      t('Student'),
      t('Courses'),
      t('Date'),
      t('Completed')
    ];
    const rows = displayed.map(e => {
      const student = students.find(s => s.id === e.studentId);
      const studentName = student?.username || e.studentId;
      const courseNames = e.courseIds
        .map(id => courses.find(c => c.courseId === id)?.courseName || id)
        .join('; ');
      const date = new Date(e.enrollmentDate).toLocaleDateString();
      const completed = e.completed ? 'Yes' : 'No';
      return [e.enrollmentId, studentName, courseNames, date, completed];
    });
    const csv = [
      header.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\r\n');
    saveAs(new Blob([csv], { type: 'text/csv' }), 'enrollments.csv');
  };

  const openModal = () => {
    setEditing(null);
    setForm({ studentId: '', courseIds: [], enrollmentDate: '', completed: false });
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleSave = async e => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/enrollments/${editing.enrollmentId}`, form);
      } else {
        await api.post('/enrollments/newEnrollment', form);
      }
      window.location.reload();
    } catch (err) {
      console.error('Save failed', err);
      alert(err.response?.data?.details || err.message);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm(t('Really delete this enrollment?'))) return;
    try {
      await api.delete(`/enrollments/${id}`);
      setEnrollments(es => es.filter(e => e.enrollmentId !== id));
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

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

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  return (
    <div className="enrollments-page">
      <div className="toolbar">
        <div className="search-box">
          <FiSearch className="icon" />
          <input
            type="text"
            placeholder={t("Filter by student…")}
            value={studentFilter}
            onChange={e => setStudentFilter(e.target.value)}
          />
        </div>
        <select
          className="search-box"
          value={courseFilter}
          onChange={e => setCourseFilter(e.target.value)}
        >
          <option value="">{t("All Courses")}</option>
          {courses.map(c => (
            <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
          ))}
        </select>
        <button className="btn primary" onClick={openModal}>
          <FiPlus /> {t("New Enrollment")}
        </button>
        <button className="icon-btn" onClick={exportEnrollmentsCSV} title={t("Export CSV")}>
          <FiDownload />
        </button>
      </div>

      <div className="table-container">
        <table className="enrollments-table">
          <thead>
            <tr>
              <th>{t("Enrollment ID")}</th>
              <th>{t("Student")}</th>
              <th>{t("Courses")}</th>
              <th>{t("Date")}</th>
              <th>{t("Completed")}</th>
              <th>{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty"><td colSpan={6}>{t("Loading…")}</td></tr>
            ) : displayed.length === 0 ? (
              <tr className="empty"><td colSpan={6}>{t("No enrollments found.")}</td></tr>
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
                  <td>
                    <button className="icon-btn" onClick={() => startEdit(e)}><FiEdit2 /></button>
                    <button className="icon-btn trash" onClick={() => handleDelete(e.enrollmentId)}><FiTrash2 /></button>
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
            <h3>{editing ? t('Edit Enrollment') : t('New Enrollment')}</h3>
            <form onSubmit={handleSave}>
              <div className="grid2">
                <select
                  required
                  value={form.studentId}
                  onChange={e => handleChange('studentId', Number(e.target.value))}
                >
                  <option value="">{t("Select student")}</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.username}</option>
                  ))}
                </select>

                <select
                  multiple
                  required
                  value={form.courseIds}
                  onChange={e => handleChange(
                    'courseIds',
                    Array.from(e.target.selectedOptions, o => Number(o.value))
                  )}
                >
                  {courses.map(c => (
                    <option key={c.courseId} value={c.courseId}>{c.courseName}</option>
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
                  /> {t("Completed")}
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn" onClick={closeModal}>{t("Cancel")}</button>
                <button type="submit" className="btn primary">
                  <FiCheck /> {editing ? t("Update") : t("Create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}