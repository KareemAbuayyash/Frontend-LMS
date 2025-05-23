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
import { useTranslation } from 'react-i18next';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const { t } = useTranslation();
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
    { name: t('Users'),       value: stats.totalUsers },
    { name: t('Courses'),     value: stats.totalCourses },
    { name: t('Enrollments'), value: stats.totalEnrollments },
    { name: t('Instructors'), value: stats.totalInstructors },
    { name: t('Students'),    value: stats.totalStudents },
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
      (c.instructorName || '').toLowerCase().includes(courseSearch)
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
        <h1 className={styles.title}>{t('Admin Dashboard')}</h1>
        <div className={styles.headerControls}>
          <button
            className={styles.iconButton}
            onClick={() => setDark(d => !d)}
            title={t('Toggle Dark/Light')}
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
            title={t('Refresh')}
          >
            <FaSyncAlt/>
          </button>
        </div>
      </header>
      {lastUpdated && (
        <div className={styles.subHeader}>
          {t('Last refreshed')}: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* Stats Cards */}
      <section className={styles.statsGrid}>
        <div className={styles.card}>
          <FaUsers className={styles.iconUser}/>
          <div><h2>{stats.totalUsers}</h2><p>{t('Users')}</p></div>
        </div>
        <div className={styles.card}>
          <FaBook className={styles.iconCourse}/>
          <div><h2>{stats.totalCourses}</h2><p>{t('Courses')}</p></div>
        </div>
        <div className={styles.card}>
          <FaClipboardList className={styles.iconEnroll}/>
          <div><h2>{stats.totalEnrollments}</h2><p>{t('Enrollments')}</p></div>
        </div>
        <div className={styles.card}>
          <FaChalkboardTeacher className={styles.iconInstructor}/>
          <div><h2>{stats.totalInstructors}</h2><p>{t('Instructors')}</p></div>
        </div>
        <div className={styles.card}>
          <FaUserGraduate className={styles.iconStudent}/>
          <div><h2>{stats.totalStudents}</h2><p>{t('Students')}</p></div>
        </div>
      </section>

      {/* Overview + Recent Users */}
      <div className={styles.mainSections}>
        {/* Overview */}
        <section className={styles.chartSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>{t('Overview')}</h2>
            <button
              className={styles.iconButton}
              onClick={exportChartPNG}
              title={t('Download Chart')}
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
                <Legend
                  icon={<FaCircle/>}
                  verticalAlign="bottom"
                  height={36}
                  formatter={value => t(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Users */}
        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>{t('Recent Users')}</h2>
            <div className={styles.listHeaderControls}>
              <input
                className={styles.searchInput}
                placeholder={t('Search users…')}
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
              />
              <button
                className={styles.iconButton}
                onClick={exportUsersCSV}
                title={t('Export CSV')}
              >
                <FaDownload/>
              </button>
              <button
                className={styles.viewAllBtn}
                onClick={() => navigate('/admin/users')}
              >
                {t('View All')}
              </button>
            </div>
          </div>
          {!filteredUsers.length
            ? <div className={styles.noResults}>{t('No matching users.')}</div>
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
              <FaCalendarAlt style={{ marginRight: 8 }}/> {t('Recent Courses')}
            </h2>
            <div className={styles.listHeaderControls}>
              <input
                className={styles.searchInput}
                placeholder={t('Search courses…')}
                value={courseSearch}
                onChange={e => setCourseSearch(e.target.value)}
              />
              <button
                className={styles.iconButton}
                onClick={exportCoursesCSV}
                title={t('Export CSV')}
              >
                <FaDownload/>
              </button>
              <button
                className={styles.viewAllBtn}
                onClick={() => navigate('/admin/courses')}
              >
                {t('View All')}
              </button>
            </div>
          </div>
          {!filteredCourses.length
            ? <div className={styles.noResults}>{t('No matching courses.')}</div>
            : (
              <table className={styles.simpleTable}>
                <thead>
                  <tr>
                    <th>{t('Name')}</th>
                    <th>{t('Instructor')}</th>
                    <th style={{ textAlign: 'center' }}>{t('Enrolled')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourses.map(c => (
                    <tr key={c.courseId}>
                      <td>{c.courseName}</td>
                      <td>{c.instructorName}</td>
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
            <FaHistory style={{ marginRight: 8 }}/> {t('System Activity')}
          </h2>
          <div className={styles.listHeaderControls}>
            <input
              className={styles.searchInput}
              placeholder={t('Search activity…')}
              value={sysSearch}
              onChange={e => setSysSearch(e.target.value)}
            />
          </div>
        </div>
        {!filteredSystem.length
          ? <div className={styles.noResults}>{t('No recent activity.')}</div>
          : (
            <table className={styles.activityTable}>
              <thead>
                <tr>
                  <th>{t('Timestamp')}</th>
                  <th>{t('Type')}</th>
                  <th>{t('Message')}</th>
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
