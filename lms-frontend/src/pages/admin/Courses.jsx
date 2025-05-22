import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../../api/axios';
import { saveAs } from 'file-saver';
import {
  FiTrash2,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiCheck,
  FiXCircle,
  FiDownload
} from 'react-icons/fi';
import styles from './Courses.module.css';

export default function Courses() {
  const [courses, setCourses]               = useState([]);
  const [instructors, setInstructors]       = useState([]);
  const [enrollmentCounts, setEnrollmentCounts] = useState({});
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState('');
  const [instructorFilter, setInstructorFilter] = useState('ALL');
  const [sortField, setSortField]           = useState('courseName');
  const [sortDir, setSortDir]               = useState('asc');
  const [modalOpen, setModalOpen]           = useState(false);

  // NEW COURSE
  const [newCourse, setNewCourse] = useState({
    courseName: '',
    courseDescription: '',
    courseDuration: '',
    courseInstructor: '',
    coursePrice: '',
    courseStartDate: '',
    courseEndDate: ''
  });

  // EDIT COURSE
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({
    courseName: '',
    courseDescription: '',
    courseDuration: '',
    courseInstructor: '',
    coursePrice: '',
    courseStartDate: '',
    courseEndDate: ''
  });

  // 1) Load all courses
  useEffect(() => {
    api.get('/courses')
      .then(res => {
        const list = res.data._embedded?.courses || res.data._embedded?.courseDTOList || [];
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

  // 3) Load enrollment counts
  useEffect(() => {
    api.get('/dashboard/recent-courses?limit=1000')
      .then(res => {
        const cts = {};
        res.data.forEach(c => cts[c.courseId] = c.enrollmentCount);
        setEnrollmentCounts(cts);
      })
      .catch(console.error);
  }, []);

  // Sort toggler
  const changeSort = field => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  // Map instructor ID → username
  const getInsName = useCallback(
    id => (instructors.find(i => i.id === Number(id)) || {}).username || '',
    [instructors]
  );

  // Filter / search / sort
  const displayed = useMemo(() => {
    let arr = [...courses];

    if (instructorFilter !== 'ALL') {
  arr = arr.filter(c =>
    c.courseInstructor != null &&
    c.courseInstructor.toString() === instructorFilter
  );
}

    if (search) {
      const q = search.toLowerCase();
      arr = arr.filter(c =>
        c.courseName.toLowerCase().includes(q) ||
        c.courseDescription.toLowerCase().includes(q) ||
        c.courseDuration.toLowerCase().includes(q) ||
        getInsName(c.courseInstructor).toLowerCase().includes(q)
      );
    }

    arr.sort((a, b) => {
      let va, vb;
      switch (sortField) {
        case 'instructor':
          va = getInsName(a.courseInstructor).toLowerCase();
          vb = getInsName(b.courseInstructor).toLowerCase();
          break;
        case 'price':
          va = Number(a.coursePrice);
          vb = Number(b.coursePrice);
          break;
        case 'start':
          va = new Date(a.courseStartDate);
          vb = new Date(b.courseStartDate);
          break;
        case 'enrollmentCount':
          va = enrollmentCounts[a.courseId] || 0;
          vb = enrollmentCounts[b.courseId] || 0;
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
  }, [
    courses,
    instructorFilter,
    search,
    sortField,
    sortDir,
    getInsName,
    enrollmentCounts
  ]);

  // Export CSV
  const exportCoursesCSV = () => {
    const header = ['Name','Description','Duration','Instructor','Price','Enrolled','Start','End'];
    const rows = displayed.map(c => [
      c.courseName,
      c.courseDescription,
      c.courseDuration,
      getInsName(c.courseInstructor),
      c.coursePrice,
      enrollmentCounts[c.courseId] || 0,
      new Date(c.courseStartDate).toLocaleDateString(),
      new Date(c.courseEndDate).toLocaleDateString()
    ]);
    const csv = [
      header.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\r\n');
    saveAs(new Blob([csv], { type: 'text/csv' }), 'courses.csv');
  };

  // Modal open/close
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

  // CREATE
  const handleAdd = async e => {
    e.preventDefault();
    await api.post('/courses/newCourse', {
      courseName:        newCourse.courseName,
      courseDescription: newCourse.courseDescription,
      courseDuration:    newCourse.courseDuration,
      courseInstructor:  Number(newCourse.courseInstructor), // ← must match @JsonProperty
      coursePrice:       Number(newCourse.coursePrice),
      courseStartDate:   newCourse.courseStartDate,
      courseEndDate:     newCourse.courseEndDate
    });
    const { data } = await api.get('/courses');
    setCourses(data._embedded?.courses || data._embedded?.courseDTOList || []);
    closeModal();
  };

  // BEGIN EDIT
  const startEdit = c => {
    setEditingId(c.courseId);
    setDraft({
       courseName:        c.courseName        || '',
      courseDescription: c.courseDescription || '',
      courseDuration:    c.courseDuration    || '',
       courseInstructor:  (c.courseInstructor != null)
       ? c.courseInstructor.toString()
        : '',
      coursePrice:       (c.coursePrice != null)
        ? c.coursePrice.toString()
        : '',
      courseStartDate:   c.courseStartDate
        ? c.courseStartDate.slice(0,10)
        : '',
      courseEndDate:     c.courseEndDate
        ? c.courseEndDate.slice(0,10)
        : ''  
    });
  };
  const cancelEdit = () => setEditingId(null);

  // SAVE EDIT
  const saveEdit = async id => {
    const payload = {
      courseName:        draft.courseName,
      courseDescription: draft.courseDescription,
      courseDuration:    draft.courseDuration,
      courseInstructor:  Number(draft.courseInstructor), // ← must match @JsonProperty
      coursePrice:       Number(draft.coursePrice),
      courseStartDate:   draft.courseStartDate,
      courseEndDate:     draft.courseEndDate
    };
    await api.put(`/courses/${id}`, payload);
    // re-fetch to pick up server changes
    const { data } = await api.get('/courses');
    setCourses(data._embedded?.courses || data._embedded?.courseDTOList || []);
    setEditingId(null);
  };

  // DELETE
  const handleDelete = async id => {
  if (!window.confirm('Really delete?')) return;
  try {
    await api.delete(`/courses/${id}`);
    setCourses(cs => cs.filter(c => c.courseId !== id));
  } catch (err) {
    console.error('Delete failed:', err.response?.data || err);
    alert(err.response?.data?.message || 'Delete failed');
  }
};


  return (
    <div className={styles.coursesPage}>
      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FiSearch className={styles.icon}/>
          <input
            type="text"
            placeholder="Search courses…"
            value={search}
            onChange={e=>setSearch(e.target.value)}
          />
        </div>
        <select
          value={instructorFilter}
          onChange={e=>setInstructorFilter(e.target.value)}
        >
          <option value="ALL">All Instructors</option>
          {instructors.map(ins=>(
            <option key={ins.id} value={ins.id.toString()}>
              {ins.username}
            </option>
          ))}
        </select>
        <button className={`${styles.btn} ${styles.primary}`} onClick={openModal}>
          <FiPlus/> Add Course
        </button>
        <button className={styles.iconBtn} onClick={exportCoursesCSV} title="Export CSV">
          <FiDownload/>
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.coursesTable}>
          <thead>
            <tr>
              <th onClick={()=>changeSort('courseName')}>
                Name {sortField==='courseName' ? (sortDir==='asc' ? '▲' : '▼') : ''}
              </th>
              <th>Description</th>
              <th>Duration</th>
              <th onClick={()=>changeSort('instructor')}>
                Instructor {sortField==='instructor' ? (sortDir==='asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={()=>changeSort('price')}>
                Price {sortField==='price' ? (sortDir==='asc' ? '▲' : '▼') : ''}
              </th>
              <th style={{textAlign:'center'}} onClick={()=>changeSort('enrollmentCount')}>
                Enrolled {sortField==='enrollmentCount' ? (sortDir==='asc' ? '▲' : '▼') : ''}
              </th>
              <th onClick={()=>changeSort('start')}>
                Start {sortField==='start' ? (sortDir==='asc' ? '▲' : '▼') : ''}
              </th>
              <th>End</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className={styles.empty}><td colSpan={9}>Loading…</td></tr>
            ) : displayed.length === 0 ? (
              <tr className={styles.empty}><td colSpan={9}>No courses found.</td></tr>
            ) : displayed.map(c => (
              <tr key={c.courseId}>
                {editingId === c.courseId ? (
                  <>
                    <td><input className={styles.inlineEdit} value={draft.courseName}        onChange={e=>setDraft(d=>({...d,courseName:e.target.value}))}/></td>
                    <td><input className={styles.inlineEdit} value={draft.courseDescription} onChange={e=>setDraft(d=>({...d,courseDescription:e.target.value}))}/></td>
                    <td><input className={styles.inlineEdit} value={draft.courseDuration}    onChange={e=>setDraft(d=>({...d,courseDuration:e.target.value}))}/></td>
                    <td>
                      <select className={styles.inlineEdit} value={draft.courseInstructor}
                        onChange={e=>setDraft(d=>({...d,courseInstructor:e.target.value}))}>
                        <option value="">-- select instructor --</option>
                        {instructors.map(ins=>(
                          <option key={ins.id} value={ins.id.toString()}>{ins.username}</option>
                        ))}
                      </select>
                    </td>
                    <td><input className={styles.inlineEdit} type="number" value={draft.coursePrice} onChange={e=>setDraft(d=>({...d,coursePrice:e.target.value}))}/></td>
                    <td style={{textAlign:'center'}}>{enrollmentCounts[c.courseId]||0}</td>
                    <td><input className={styles.inlineEdit} type="date" value={draft.courseStartDate} onChange={e=>setDraft(d=>({...d,courseStartDate:e.target.value}))}/></td>
                    <td><input className={styles.inlineEdit} type="date" value={draft.courseEndDate}   onChange={e=>setDraft(d=>({...d,courseEndDate:e.target.value}))}/></td>
                    <td>
                      <button className={styles.iconBtn} onClick={()=>saveEdit(c.courseId)}><FiCheck/></button>
                      <button className={styles.iconBtn} onClick={cancelEdit}><FiXCircle/></button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{c.courseName}</td>
                    <td>{c.courseDescription}</td>
                    <td>{c.courseDuration}</td>
                    <td>{getInsName(c.courseInstructor)}</td>
                    <td>${c.coursePrice}</td>
                    <td style={{textAlign:'center'}}>{enrollmentCounts[c.courseId]||0}</td>
                    <td>{new Date(c.courseStartDate).toLocaleDateString()}</td>
                    <td>{new Date(c.courseEndDate).toLocaleDateString()}</td>
                    <td>
                      <button className={styles.iconBtn} onClick={()=>startEdit(c)}><FiEdit2/></button>
                      <button className={`${styles.iconBtn} ${styles.trash}`} onClick={()=>handleDelete(c.courseId)}><FiTrash2/></button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className={styles.modalBackdrop} onClick={closeModal}>
          <div className={styles.modal} onClick={e=>e.stopPropagation()}>
            <h3>New Course</h3>
            <form onSubmit={handleAdd}>
              <div className={styles.grid2}>
                <input required placeholder="Name" value={newCourse.courseName} onChange={e=>setNewCourse(n=>({...n,courseName:e.target.value}))}/>
                <select required value={newCourse.courseInstructor} onChange={e=>setNewCourse(n=>({...n,courseInstructor:e.target.value}))}>
                  <option value="">-- select instructor --</option>
                  {instructors.map(ins=>(
                    <option key={ins.id} value={ins.id.toString()}>{ins.username}</option>
                  ))}
                </select>
                <input required placeholder="Duration"      value={newCourse.courseDuration} onChange={e=>setNewCourse(n=>({...n,courseDuration:e.target.value}))}/>
                <input required type="number" placeholder="Price" value={newCourse.coursePrice}      onChange={e=>setNewCourse(n=>({...n,coursePrice:e.target.value}))}/>
                <input required type="date"   placeholder="Start Date" value={newCourse.courseStartDate} onChange={e=>setNewCourse(n=>({...n,courseStartDate:e.target.value}))}/>
                <input required type="date"   placeholder="End Date"   value={newCourse.courseEndDate}   onChange={e=>setNewCourse(n=>({...n,courseEndDate:e.target.value}))}/>
              </div>
              <textarea required placeholder="Description" value={newCourse.courseDescription} onChange={e=>setNewCourse(n=>({...n,courseDescription:e.target.value}))}/>
              <div className={styles.modalActions}>
                <button type="button" className={styles.btn} onClick={closeModal}>Cancel</button>
                <button type="submit" className={`${styles.btn} ${styles.primary}`}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
