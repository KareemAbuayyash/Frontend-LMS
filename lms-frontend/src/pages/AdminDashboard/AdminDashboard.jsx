import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminDashboard.module.css';
import {
  FaUsers,
  FaBook,
  FaClipboardList,
  FaSyncAlt,
  FaCircle,
  FaSun,
  FaMoon,
  FaChartBar,
  FaDownload,
  FaChalkboardTeacher,
  FaUserGraduate
} from 'react-icons/fa';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../../api/axios';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const chartRef = useRef();

  // ─── Instructor lookup ────────────────────────────────────────────────────
  const [instructors, setInstructors] = useState([]);
  useEffect(() => {
    api.get('/instructors')
      .then(res => setInstructors(res.data))
      .catch(console.error);
  }, []);

  const getInsName = useCallback(id => {
    const ins = instructors.find(i => i.id.toString() === id.toString());
    return ins ? ins.username : '';
  }, [instructors]);
  // ────────────────────────────────────────────────────────────────────────

  const [stats, setStats]                 = useState(null);
  const [recentUsers, setRecentUsers]     = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);

  const [userSearch, setUserSearch]       = useState('');
  const [courseSearch, setCourseSearch]   = useState('');
  const [dark, setDark]                   = useState(false);
  const [lastUpdated, setLastUpdated]     = useState(null);

  // now using 5 colors
  const COLORS = ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f'];

  // Fetch stats, users & courses
  const fetchData = async () => {
    try {
      const [{ data: s }, { data: u }, { data: c }] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/activity?limit=50'),
        api.get('/dashboard/recent-courses?limit=50')
      ]);
      setStats(s);
      setRecentUsers(u);
      setRecentCourses(c);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    }
  };

  // CALL fetchData inside a non-async useEffect
  useEffect(() => {
    fetchData();
  }, []);

  if (!stats) {
    return <div className={styles.loading}>Loading dashboard…</div>;
  }

  // now five slices
  const chartData = [
    { name: 'Users',       value: stats.totalUsers },
    { name: 'Courses',     value: stats.totalCourses },
    { name: 'Enrollments', value: stats.totalEnrollments },
    { name: 'Instructors', value: stats.totalInstructors },
    { name: 'Students',    value: stats.totalStudents },
  ];

  // Filter & limit lists to 5
  const filteredUsers = recentUsers
    .filter(u =>
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
    )
    .slice(0, 5);

  const filteredCourses = recentCourses
    .filter(c =>
      c.courseName.toLowerCase().includes(courseSearch.toLowerCase()) ||
      getInsName(c.instructorName).toLowerCase().includes(courseSearch.toLowerCase())
    )
    .slice(0, 5);

  // Export helpers
  const exportUsersCSV = () => {
    const header = ['Username','Email','Role'];
    const rows   = filteredUsers.map(u => [u.username, u.email, u.role]);
    const csv    = [header.join(','), ...rows.map(r=>r.map(c=>`"${c}"`).join(','))].join('\r\n');
    saveAs(new Blob([csv], { type: 'text/csv' }), 'recent-users.csv');
  };
  const exportCoursesCSV = () => {
    const header = ['Name','Instructor','Enrolled'];
    const rows   = filteredCourses.map(c => [
      c.courseName,
      getInsName(c.instructorName),
      c.enrollmentCount
    ]);
    const csv    = [header.join(','), ...rows.map(r=>r.map(c=>`"${c}"`).join(','))].join('\r\n');
    saveAs(new Blob([csv], { type: 'text/csv' }), 'recent-courses.csv');
  };
  const exportChartPNG = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    canvas.toBlob(blob => saveAs(blob, 'overview-chart.png'));
  };

  return (
    <div className={`${styles.container} ${dark ? styles.dark : ''}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <div className={styles.headerControls}>
          <button onClick={()=>setDark(d=>!d)} className={styles.iconButton} title="Toggle Dark/Light">
            {dark ? <FaSun/> : <FaMoon/>}
          </button>
          <button onClick={fetchData} className={styles.iconButton} title="Refresh">
            <FaSyncAlt/>
          </button>
        </div>
      </header>

      {lastUpdated && (
        <div className={styles.subHeader}>
          Last refreshed: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Stats cards */}
      <section className={styles.statsGrid}>
        <div className={styles.card}>
          <FaUsers className={styles.iconUser}/>
          <div><h2>{stats.totalUsers}</h2><p>Users</p></div>
        </div>
        <div className={styles.card}>
          <FaBook className={styles.iconCourse}/>
          <div><h2>{stats.totalCourses}</h2><p>Courses</p></div>
        </div>
        <div className={styles.card}>
          <FaClipboardList className={styles.iconEnroll}/>
          <div><h2>{stats.totalEnrollments}</h2><p>Enrollments</p></div>
        </div>
        <div className={styles.card}>
          <FaChalkboardTeacher className={styles.iconInstructor}/>
          <div><h2>{stats.totalInstructors}</h2><p>Instructors</p></div>
        </div>
        <div className={styles.card}>
          <FaUserGraduate className={styles.iconStudent}/>
          <div><h2>{stats.totalStudents}</h2><p>Students</p></div>
        </div>
      </section>

      {/* Overview + Recent Users */}
      <div className={styles.mainSections}>
        {/* Overview Chart */}
        <section className={styles.chartSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>Overview</h2>
            <button onClick={exportChartPNG} className={styles.iconButton} title="Download Chart">
              <FaChartBar/>
            </button>
          </div>
          <div ref={chartRef} style={{ width:'100%', height:300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {chartData.map((_,i)=>(
                    <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                  ))}
                </Pie>
                <Tooltip formatter={v=>v.toLocaleString()}/>
                <Legend icon={<FaCircle/>} verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Users */}
        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>Recent Users</h2>
            <div className={styles.listHeaderControls}>
              <input
                type="text"
                placeholder="Search users…"
                value={userSearch}
                onChange={e=>setUserSearch(e.target.value)}
                className={styles.searchInput}
              />
              <button onClick={exportUsersCSV} className={styles.iconButton} title="Export CSV">
                <FaDownload/>
              </button>
              <button
                onClick={()=>navigate('/admin/users')}
                className={`${styles.iconButton} ${styles.viewAllBtn}`}
              >
                View All
              </button>
            </div>
          </div>

          {!filteredUsers.length ? (
            <div className={styles.noResults}>No matching users.</div>
          ) : (
            <ul className={styles.userList}>
              {filteredUsers.map(u=>(
                <li key={u.userId} className={styles.userItem}>
                  <div className={styles.avatar}>{u.username.charAt(0)}</div>
                  <div className={styles.userInfo}>
                    <div className={styles.nameRow}>
                      <strong>{u.username}</strong>
                      <span className={`${styles.roleBadge} ${styles[u.role.toLowerCase()]}`}>
                        {u.role}
                      </span>
                    </div>
                    <span className={styles.email}>{u.email}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Recent Courses */}
      <div className={styles.mainSections}>
        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>Recent Courses</h2>
            <div className={styles.listHeaderControls}>
              <input
                type="text"
                placeholder="Search courses…"
                value={courseSearch}
                onChange={e=>setCourseSearch(e.target.value)}
                className={styles.searchInput}
              />
              <button onClick={exportCoursesCSV} className={styles.iconButton} title="Export CSV">
                <FaDownload/>
              </button>
              <button
                onClick={()=>navigate('/admin/courses')}
                className={`${styles.iconButton} ${styles.viewAllBtn}`}
              >
                View All
              </button>
            </div>
          </div>

          {!filteredCourses.length ? (
            <div className={styles.noResults}>No matching courses.</div>
          ) : (
            <table className={styles.simpleTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Instructor</th>
                  <th style={{ textAlign:'center' }}>Enrolled</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map(c=>(
                  <tr key={c.courseId}>
                    <td>{c.courseName}</td>
                    <td>{getInsName(c.instructorName)}</td>
                    <td style={{ textAlign:'center' }}>{c.enrollmentCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
