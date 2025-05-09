import React, { useEffect, useState, useRef } from 'react';
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
  FaDownload
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
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [dark, setDark] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const chartRef = useRef();

  const COLORS = ['#4e79a7', '#f28e2c', '#e15759'];

  const fetchData = async () => {
    try {
      const [{ data: s }, { data: u }] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/activity?limit=50')
      ]);
      setStats(s);
      setRecentUsers(u);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!stats) {
    return <div className={styles.loading}>Loading dashboard…</div>;
  }

  const chartData = [
    { name: 'Users', value: stats.totalUsers },
    { name: 'Courses', value: stats.totalCourses },
    { name: 'Enrollments', value: stats.totalEnrollments }
  ];

  // filter client-side
  const filtered = recentUsers.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );
  // only show the last 5
  const displayedUsers = filtered.slice(0, 5);

  const exportUsersCSV = () => {
    const header = ['Username', 'Email'];
    const rows = filtered.map(u => [u.username, u.email]);
    const csv = [header.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\r\n');
    saveAs(new Blob([csv], { type: 'text/csv' }), 'recent-users.csv');
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
          <button
            onClick={() => setDark(d => !d)}
            className={styles.iconButton}
            title="Toggle Dark/Light"
          >
            {dark ? <FaSun /> : <FaMoon />}
          </button>
          <button onClick={fetchData} className={styles.iconButton} title="Refresh">
            <FaSyncAlt />
          </button>
        </div>
      </header>

      {lastUpdated && (
        <div className={styles.subHeader}>
          Last refreshed: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* === YOUR EXISTING “Recent Courses” GOES HERE === */}
      {/* e.g. <RecentCourses /> or your custom table */}

      {/* === STATS CARDS === */}
      <section className={styles.statsGrid}>
        <div className={styles.card}>
          <FaUsers className={styles.iconUser} />
          <div>
            <h2>{stats.totalUsers}</h2>
            <p>Users</p>
          </div>
        </div>
        <div className={styles.card}>
          <FaBook className={styles.iconCourse} />
          <div>
            <h2>{stats.totalCourses}</h2>
            <p>Courses</p>
          </div>
        </div>
        <div className={styles.card}>
          <FaClipboardList className={styles.iconEnroll} />
          <div>
            <h2>{stats.totalEnrollments}</h2>
            <p>Enrollments</p>
          </div>
        </div>
      </section>

      {/* === NEW: wrap Overview + Recent Users side-by-side === */}
      <div className={styles.mainSections}>
        {/* Overview Chart */}
        <section className={styles.chartSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>Overview</h2>
            <button
              onClick={exportChartPNG}
              className={styles.iconButton}
              title="Download Chart PNG"
            >
              <FaChartBar />
            </button>
          </div>
          <div ref={chartRef} style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => v.toLocaleString()} />
                <Legend
                  icon={<FaCircle />}
                  layout="horizontal"
                  verticalAlign="bottom"
                  height={36}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recently Registered Users */}
        <section className={styles.listSection}>
          <div className={styles.listHeader}>
            <h2 className={styles.sectionTitle}>Recent Users</h2>
            <div>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
              />
              <button onClick={exportUsersCSV} className={styles.iconButton} title="Export CSV">
                <FaDownload />
              </button>
            </div>
          </div>

          {displayedUsers.length === 0 ? (
            <div className={styles.noResults}>No matching users found.</div>
          ) : (
            <ul className={styles.userList}>
              {displayedUsers.map(u => (
                <li key={u.userId} className={styles.userItem}>
                  <div className={styles.avatar}>{u.username.charAt(0)}</div>
                  <div className={styles.userInfo}>
                    <div className={styles.nameRow}>
                      <strong className={styles.username}>{u.username}</strong>
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
    </div>
  );
}
