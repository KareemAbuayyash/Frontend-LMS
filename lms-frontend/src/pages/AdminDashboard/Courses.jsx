import React, { useEffect, useState, useMemo, useCallback } from 'react';
import api from '../../api/axios';
import {
  FiTrash2,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiCheck,
  FiXCircle
} from 'react-icons/fi';
import './Courses.css';

export default function Courses() {
  const [courses, setCourses]         = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [instructorFilter, setInstructorFilter] = useState('ALL');
  const [sortField, setSortField]     = useState('courseName');
  const [sortDir, setSortDir]         = useState('asc');
  const [modalOpen, setModalOpen]     = useState(false);

  const [newCourse, setNewCourse] = useState({
    courseName: '',
    courseDescription: '',
    courseDuration: '',
    courseInstructor: '',
    coursePrice: '',
    courseStartDate: '',
    courseEndDate: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft]         = useState({});

  // 1) Load all courses
  useEffect(() => {
    api.get('/courses')
      .then(res => {
        const list =
          res.data._embedded?.courses ||
          res.data._embedded?.courseDTOList ||
          [];
        setCourses(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 2) Load instructors
  useEffect(() => {
    api.get('/instructors')
      .then(res => setInstructors(res.data))
      .catch(console.error);
  }, []);

  // 3) Sort toggler
  const changeSort = field => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // 4) Helper to display instructor name
  const getInsName = useCallback(id =>
    instructors.find(i => i.id.toString() === id)?.username || '',
    [instructors]
  );

  // 5) Filter / Search / Sort
  const displayed = useMemo(() => {
    let arr = [...courses];

    if (instructorFilter !== 'ALL') {
      arr = arr.filter(c => c.courseInstructor === instructorFilter);
    }
    if (search) {
      const s = search.toLowerCase();
      arr = arr.filter(c =>
        c.courseName.toLowerCase().includes(s) ||
        c.courseDescription.toLowerCase().includes(s)
      );
    }

    arr.sort((a, b) => {
      let va, vb;
      switch (sortField) {
        case 'instructor':
          va = getInsName(a.courseInstructor).toLowerCase();
          vb = getInsName(b.courseInstructor).toLowerCase();
          break;
        case 'start':
          va = new Date(a.courseStartDate);
          vb = new Date(b.courseStartDate);
          break;
        case 'price':
          va = Number(a.coursePrice);
          vb = Number(b.coursePrice);
          break;
        default:
          va = a.courseName.toLowerCase();
          vb = b.courseName.toLowerCase();
      }
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return arr;
  }, [courses, instructorFilter, search, sortField, sortDir, getInsName]);

  // 6) Add / Edit / Delete handlers
  const openModal  = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setNewCourse({
      courseName: '',
      courseDescription: '',
      courseDuration: '',
      courseInstructor: '',
      coursePrice: '',
      courseStartDate: '',
      courseEndDate: ''
    });
  };

  const handleAdd = async e => {
    e.preventDefault();
    await api.post('/courses/newCourse', newCourse);
    const { data } = await api.get('/courses');
    setCourses(data._embedded?.courses || data._embedded?.courseDTOList || []);
    closeModal();
  };

  const startEdit = c => {
    setEditingId(c.courseId);
    setDraft({
      courseName:        c.courseName,
      courseDescription: c.courseDescription,
      courseDuration:    c.courseDuration,
      courseInstructor:  c.courseInstructor,
      coursePrice:       c.coursePrice,
      courseStartDate:   c.courseStartDate.slice(0,10),
      courseEndDate:     c.courseEndDate.slice(0,10)
    });
  };
  const cancelEdit = () => setEditingId(null);

  const saveEdit = async id => {
    await api.put(`/courses/${id}`, draft);
    setCourses(cs => cs.map(c => c.courseId === id ? { ...c, ...draft } : c));
    setEditingId(null);
  };

  const handleDelete = async id => {
    if (!window.confirm('Really delete?')) return;
    await api.delete(`/courses/${id}`);
    setCourses(cs => cs.filter(c => c.courseId !== id));
  };

  return (
    <div className="courses-page">
      <div className="toolbar">
        <div className="search-box">
          <FiSearch className="icon" />
          <input
            type="text"
            placeholder="Search courses…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={instructorFilter}
          onChange={e => setInstructorFilter(e.target.value)}
        >
          <option value="ALL">All Instructors</option>
          {instructors.map(ins => (
            <option key={ins.id} value={ins.id}>
              {ins.username}
            </option>
          ))}
        </select>
        <button className="btn primary" onClick={openModal}>
          <FiPlus /> Add Course
        </button>
      </div>

      <div className="table-container">
        <table className="courses-table ">
          <thead>
            <tr>
              <th onClick={() => changeSort('courseName')}>
                Name{sortField==='courseName'?(sortDir==='asc'?' ▲':' ▼'):''}
              </th>
              <th>Description</th>
              <th>Duration</th>
              <th onClick={() => changeSort('instructor')}>
                Instructor{sortField==='instructor'?(sortDir==='asc'?' ▲':' ▼'):''}
              </th>
              <th onClick={() => changeSort('price')}>
                Price{sortField==='price'?(sortDir==='asc'?' ▲':' ▼'):''}
              </th>
              <th onClick={() => changeSort('start')}>
                Start{sortField==='start'?(sortDir==='asc'?' ▲':' ▼'):''}
              </th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty">
                <td colSpan="8">Loading…</td>
              </tr>
            ) : displayed.length === 0 ? (
              <tr className="empty">
                <td colSpan="8">No courses found.</td>
              </tr>
            ) : displayed.map(c => (
              <tr key={c.courseId} className="fade-in">
                {editingId === c.courseId ? (
                  <>
                    <td><input className="inline-edit" value={draft.courseName}        onChange={e=>setDraft(d=>({...d,courseName:e.target.value}))}        /></td>
                    <td><input className="inline-edit" value={draft.courseDescription} onChange={e=>setDraft(d=>({...d,courseDescription:e.target.value}))} /></td>
                    <td><input className="inline-edit" value={draft.courseDuration}    onChange={e=>setDraft(d=>({...d,courseDuration:e.target.value}))}    /></td>
                    <td>
                      <select className="inline-edit" value={draft.courseInstructor} onChange={e=>setDraft(d=>({...d,courseInstructor:e.target.value}))}>
                        <option value="">-- select instructor --</option>
                        {instructors.map(ins=>(
                          <option key={ins.id} value={ins.id}>{ins.username}</option>
                        ))}
                      </select>
                    </td>
                    <td><input className="inline-edit" type="number" value={draft.coursePrice} onChange={e=>setDraft(d=>({...d,coursePrice:e.target.value}))} /></td>
                    <td><input className="inline-edit" type="date"   value={draft.courseStartDate} onChange={e=>setDraft(d=>({...d,courseStartDate:e.target.value}))} /></td>
                    <td><input className="inline-edit" type="date"   value={draft.courseEndDate}   onChange={e=>setDraft(d=>({...d,courseEndDate:e.target.value}))}   /></td>
                    <td>
                      <button className="icon-btn" onClick={()=>saveEdit(c.courseId)}><FiCheck/></button>
                      <button className="icon-btn" onClick={cancelEdit}><FiXCircle/></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{c.courseName}</td>
                    <td>{c.courseDescription}</td>
                    <td>{c.courseDuration}</td>
                    <td>{getInsName(c.courseInstructor)}</td>
                    <td>${c.coursePrice}</td>
                    <td>{new Date(c.courseStartDate).toLocaleDateString()}</td>
                    <td>{new Date(c.courseEndDate).toLocaleDateString()}</td>
                    <td>
                      <button className="icon-btn" onClick={()=>startEdit(c)}><FiEdit2/></button>
                      <button className="icon-btn trash" onClick={()=>handleDelete(c.courseId)}><FiTrash2/></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD COURSE MODAL */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <h3>New Course</h3>
            <form onSubmit={handleAdd}>
              <div className="grid2">
                <input required placeholder="Name"
                  value={newCourse.courseName}
                  onChange={e=>setNewCourse(n=>({...n,courseName:e.target.value}))}
                />
                <select required
                  value={newCourse.courseInstructor}
                  onChange={e=>setNewCourse(n=>({...n,courseInstructor:e.target.value}))}
                >
                  <option value="">-- select instructor --</option>
                  {instructors.map(ins=>(
                    <option key={ins.id} value={ins.id}>{ins.username}</option>
                  ))}
                </select>
                <input required placeholder="Duration"
                  value={newCourse.courseDuration}
                  onChange={e=>setNewCourse(n=>({...n,courseDuration:e.target.value}))}
                />
                <input required type="number" placeholder="Price"
                  value={newCourse.coursePrice}
                  onChange={e=>setNewCourse(n=>({...n,coursePrice:e.target.value}))}
                />
                <input required type="date" placeholder="Start Date"
                  value={newCourse.courseStartDate}
                  onChange={e=>setNewCourse(n=>({...n,courseStartDate:e.target.value}))}
                />
                <input required type="date" placeholder="End Date"
                  value={newCourse.courseEndDate}
                  onChange={e=>setNewCourse(n=>({...n,courseEndDate:e.target.value}))}
                />
              </div>
              <textarea required placeholder="Description"
                value={newCourse.courseDescription}
                onChange={e=>setNewCourse(n=>({...n,courseDescription:e.target.value}))}
              />
              <div className="modal-actions">
                <button type="button" className="btn" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
