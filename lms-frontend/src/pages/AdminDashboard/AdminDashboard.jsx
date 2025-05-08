import React, { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';
import api from '../../api/axios';
import { FiUsers, FiBook, FiClock, FiAlertCircle } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeStudents: 0,
    activeCourses: 0,
    pendingApprovals: 0,
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [activityFeed, setActivityFeed] = useState([]);

  useEffect(() => {
    api.get('/api/dashboard/stats').then(res => setStats(res.data));

    api.get('/api/users?sort=createdAt,desc&size=5')
       .then(res => setRecentUsers(res.data.content));
    api.get('/api/courses?sort=createdAt,desc&size=5')
       .then(res => setRecentCourses(res.data.content));

    api.get('/api/dashboard/activity?limit=5')
       .then(res => setActivityFeed(res.data));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Admin Dashboard</h1>

      <div className={styles.cardRow}>
        <div className={styles.card}>
          <FiUsers className={styles.icon} />
          <div>
            <h3>{stats.totalUsers}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className={styles.card}>
          <FiUsers className={styles.icon} />
          <div>
            <h3>{stats.activeStudents}</h3>
            <p>Active Students</p>
          </div>
        </div>
        <div className={styles.card}>
          <FiBook className={styles.icon} />
          <div>
            <h3>{stats.activeCourses}</h3>
            <p>Active Courses</p>
          </div>
        </div>
        <div className={styles.card}>
          <FiClock className={styles.icon} />
          <div>
            <h3>{stats.pendingApprovals}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>
      </div>

      <div className={styles.main}>
        <section className={styles.overview}>
          <h2>System Overview</h2>
          <div className={styles.chartPlaceholder}>
            <p>Chart goes here</p>
          </div>
          <div className={styles.usage}>
            <div><strong>CPU:</strong> 24%</div>
            <div><strong>Memory:</strong> 3.2 GB</div>
            <div><strong>Storage:</strong> 42%</div>
          </div>
        </section>

        <aside className={styles.sidebar}>
          <div className={styles.pending}>
            <h3>Pending Actions</h3>
            <ul>
              <li>
                <strong>15</strong> User Approvals
                <button>View →</button>
              </li>
              <li>
                <strong>3</strong> Course Approvals
                <button>Review →</button>
              </li>
              <li className={styles.alert}>
                <FiAlertCircle /> Database at 80%
                <button>Settings →</button>
              </li>
            </ul>
          </div>

          <div className={styles.widget}>
            <h3>Recent Users</h3>
            <ul>
              {recentUsers.map(u => (
                <li key={u.id}>
                  <span className={styles.avatar}>{u.username[0]}</span>
                  <div>
                    <strong>{u.username}</strong>
                    <small>{u.email}</small>
                  </div>
                  <small className={styles.role}>{u.role}</small>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <section className={styles.activity}>
        <h2>System Activity</h2>
        <ul>
          {activityFeed.map(a => (
            <li key={a.id}>
              <strong>{a.title}</strong>
              <p>{a.description}</p>
              <small>{new Date(a.date).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.recentCourses}>
        <h2>Recent Courses</h2>
        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Instructor</th>
              <th>Enrolled</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {recentCourses.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.instructorName}</td>
                <td>{c.studentCount}</td>
                <td>{c.status}</td>
                <td>{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
