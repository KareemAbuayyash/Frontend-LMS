// src/components/AdminDashboard/AdminDashboard.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FaUserGraduate,
  FaHistory,
  FaCalendarAlt,
  FaClock
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
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const chartRef = useRef();

  // ─── Live Clock ─────────────────────────────────
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // ─── Instructor Lookup ─────────────────────────
  const [instructors, setInstructors] = useState([]);
  useEffect(() => {
    // nested async so we don't return a Promise
    async function loadInstructors() {
      try {
        const res = await api.get('/instructors');
        setInstructors(res.data);
      } catch (err) {
        if (err.response?.status !== 403) {
          console.error(err);
        }
        setInstructors([]);
      }
    }
    loadInstructors();
  }, []);
  const getInsName = useCallback(
    id => {
      if (id == null) return '';
      const ins = instructors.find(i => String(i.id) === String(id));
      return ins?.username ?? '';
    },
    [instructors]
  );

  // ─── Core Stats & Lists ───────────────────────
  const [stats, setStats]                   = useState(null);
  const [recentUsers, setRecentUsers]       = useState([]);
  const [recentCourses, setRecentCourses]   = useState([]);
  const [systemActivity, setSystemActivity] = useState([]);

  // ─── UI / Search State ────────────────────────
  const [userSearch, setUserSearch]     = useState('');
  const [courseSearch, setCourseSearch] = useState('');
  const [sysSearch, setSysSearch]       = useState('');
  const [dark, setDark]                 = useState(false);
  const [lastUpdated, setLastUpdated]   = useState(null);

  // ─── Fetch All Data ───────────────────────────
  useEffect(() => {
    async function fetchData() {
      try {
        const [sRes, uRes, cRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/activity?limit=50'),
          api.get('/dashboard/recent-courses?limit=50'),
        ]);
        setStats(sRes.data);
        setRecentUsers(uRes.data);
        setRecentCourses(cRes.data);
        setLastUpdated(new Date());
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  // ─── Fetch System Activity ─────────────────────
  useEffect(() => {
    async function loadActivity() {
      try {
        const { data } = await api.get('/dashboard/system-activity?limit=50');
        setSystemActivity(data);
      } catch (err) {
        console.error(err);
      }
    }
    loadActivity();
  }, []);

  if (!stats) {
    return <div className={styles.loading}>Loading dashboard…</div>;
  }

  // ─── Chart Data ───────────────────────────────
  const chartData = [
    { name: 'Users',       value: stats.totalUsers },
    { name: 'Courses',     value: stats.totalCourses },
    { name: 'Enrollments', value: stats.totalEnrollments },
    { name: 'Instructors', value: stats.totalInstructors },
    { name: 'Students',    value: stats.totalStudents },
  ];
  const COLORS = ['#4e79a7','#f28e2c','#e15759','#76b7b2','#59a14f'];

  // ─── Filters ──────────────────────────────────
    // ─── Filters ──────────────────────────────────
  const filteredUsers = recentUsers
    .filter(u =>
      (u.username || '').toLowerCase().includes(userSearch.toLowerCase()) ||
      (u.email    || '').toLowerCase().includes(userSearch.toLowerCase())
    )
    .slice(0, 5);

  const filteredCourses = recentCourses
    .filter(c =>
      (c.courseName         || '').toLowerCase().includes(courseSearch.toLowerCase()) ||
      getInsName(c.instructorName).toLowerCase().includes(courseSearch.toLowerCase())
    )
    .slice(0, 5);

  const filteredSystem = systemActivity
    .filter(e =>
      (e.message || '').toLowerCase().includes(sysSearch.toLowerCase()) ||
      (e.type    || '').toLowerCase().includes(sysSearch.toLowerCase())
    )
    .slice(0, 5);

  // ─── Export Helpers ───────────────────────────
  const exportCSV = (header, rows, filename) => {
    const csv = [
      header.join(','),
      ...rows.map(r => r.map(c => `"${c}"`).join(','))
    ].join('\r\n');
    saveAs(new Blob([csv], { type: 'text/csv' }), filename);
  };
  const exportUsersCSV   = () => exportCSV(
    ['Username','Email','Role'],
    filteredUsers.map(u => [u.username, u.email, u.role]),
    'recent-users.csv'
  );
  const exportCoursesCSV = () => exportCSV(
    ['Name','Instructor','Enrolled'],
    filteredCourses.map(c => [
      c.courseName,
      getInsName(c.instructorName),
      c.enrollmentCount
    ]),
    'recent-courses.csv'
  );
  const exportChartPNG = async () => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    canvas.toBlob(b => saveAs(b, 'overview-chart.png'));
  };

  return (
    <div className={`${styles.container} ${dark ? styles.dark : ''}`}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Admin Dashboard</h1>
        <div className={styles.headerControls}>
          <button
            className={styles.iconButton}
            onClick={() => setDark(d => !d)}
            title="Toggle Dark/Light"
          >
            {dark ? <FaSun/> : <FaMoon/>}
          </button>
          <button
            className={styles.iconButton}
            onClick={() => {
              /* re-run the top-level fetch */
              (async () => {
                try {
                  const [sRes, uRes, cRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/dashboard/activity?limit=50'),
                    api.get('/dashboard/recent-courses?limit=50'),
                  ]);
                  setStats(sRes.data);
                  setRecentUsers(uRes.data);
                  setRecentCourses(cRes.data);
                  setLastUpdated(new Date());
                } catch (err) {
                  console.error(err);
                }
              })();
            }}
            title="Refresh"
          >
            <FaSyncAlt/>
          </button>
        </div>
      </header>
      {lastUpdated && (
        <div className={styles.subHeader}>
          Last refreshed: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Stats Cards */}
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
        {/* Overview */}
        <section className={styles.chartSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>Overview</h2>
            <button
              className={styles.iconButton}
              onClick={exportChartPNG}
              title="Download Chart"
            >
              <FaChartBar/>
            </button>
          </div>
          <div ref={chartRef} className={styles.chartWrapper}>
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
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]}/>
                  ))}
                </Pie>
                <Tooltip formatter={v => v.toLocaleString()}/>
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
                className={styles.searchInput}
                placeholder="Search users…"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
              />
              <button
                className={styles.iconButton}
                onClick={exportUsersCSV}
                title="Export CSV"
              >
                <FaDownload/>
              </button>
              <button
                className={styles.viewAllBtn}
                onClick={() => navigate('/admin/users')}
              >
                View All
              </button>
            </div>
          </div>
          {!filteredUsers.length
            ? <div className={styles.noResults}>No matching users.</div>
            : (
              <ul className={styles.userList}>
                {filteredUsers.map(u => (
                  <li key={u.userId} className={styles.userItem}>
                    <div className={styles.avatar}>{u.username[0]}</div>
                    <div className={styles.userInfo}>
                      <div className={styles.nameRow}>
                        <strong>{u.username}</strong>
                        <span className={`${styles.roleBadge} ${styles[(u.role || '').toLowerCase()]}`}>
                          {u.role || ''}
                        </span>
                      </div>
                      <span className={styles.email}>{u.email}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )
          }
        </section>
      </div>

      {/* Recent Courses & Calendar */}
      <section className={styles.recentCoursesContainer}>
        {/* Courses Table */}
        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>
              <FaCalendarAlt style={{ marginRight: 8 }}/> Recent Courses
            </h2>
            <div className={styles.listHeaderControls}>
              <input
                className={styles.searchInput}
                placeholder="Search courses…"
                value={courseSearch}
                onChange={e => setCourseSearch(e.target.value)}
              />
              <button
                className={styles.iconButton}
                onClick={exportCoursesCSV}
                title="Export CSV"
              >
                <FaDownload/>
              </button>
              <button
                className={styles.viewAllBtn}
                onClick={() => navigate('/admin/courses')}
              >
                View All
              </button>
            </div>
          </div>
          {!filteredCourses.length
            ? <div className={styles.noResults}>No matching courses.</div>
            : (
              <table className={styles.simpleTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Instructor</th>
                    <th style={{ textAlign: 'center' }}>Enrolled</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map(c => (
                    <tr key={c.courseId}>
                      <td>{c.courseName}</td>
                      <td>{getInsName(c.instructorName)}</td>
                      <td style={{ textAlign: 'center' }}>{c.enrollmentCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          }
        </section>

        {/* Clock + Calendar */}
        <section className={styles.calendarSection}>
          <div className={styles.clock}>
            <FaClock style={{ marginRight: 6 }}/> {now.toLocaleTimeString()}
          </div>
          <iframe
            title="Admin Calendar"
            src="https://calendar.google.com/calendar/embed?src=YOUR_CALENDAR_ID@group.calendar.google.com&ctz=YOUR_TIMEZONE"
            frameBorder="0"
            scrolling="no"
          />
        </section>
      </section>

      {/* System Activity */}
      <section className={styles.listSection}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>
            <FaHistory style={{ marginRight: 8 }}/> System Activity
          </h2>
          <div className={styles.listHeaderControls}>
            <input
              className={styles.searchInput}
              placeholder="Search activity…"
              value={sysSearch}
              onChange={e => setSysSearch(e.target.value)}
            />
          </div>
        </div>
        {!filteredSystem.length
          ? <div className={styles.noResults}>No recent activity.</div>
          : (
            <table className={styles.activityTable}>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Type</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {filteredSystem.map((evt, i) => (
                  <tr key={i}>
                    <td>{new Date(evt.timestamp).toLocaleString()}</td>
                    <td>{evt.type}</td>
                    <td>{evt.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </section>
    </div>
  );
}
