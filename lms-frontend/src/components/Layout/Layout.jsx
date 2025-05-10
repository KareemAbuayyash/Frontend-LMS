import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiSearch,
  FiBell,
  FiMenu,
  FiX,
  FiUser,
  FiLogOut,
  FiGrid,
  FiFileText,
  FiSettings
} from 'react-icons/fi';
import api from '../../api/axios';
import './Layout.css';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard',   to: '/admin',             icon: <FiGrid />     },
  { label: 'Courses',     to: '/admin/courses',     icon: <FiFileText /> },
  { label: 'Users',       to: '/admin/users',       icon: <FiUser />     },
  { label: 'Enrollments', to: '/admin/enrollments', icon: <FiFileText /> },
];

export default function Layout({ showSidebar = true, children }) {
  const [collapsed,     setCollapsed]     = useState(false);
  const [showUserMenu,  setShowUserMenu]  = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [connected,     setConnected]     = useState(false);
  const [hasUnread,     setHasUnread]     = useState(false);   // NEW

  const navigate  = useNavigate();
  const location  = useLocation();
  const username  = localStorage.getItem('username') || 'User';

  /* ------------------------------------------------------------------
     HEALTH-CHECK ON MOUNT
  ------------------------------------------------------------------ */
 useEffect(() => {
  const check = () =>
    api.get('/health')
       .then(() => setConnected(true))
       .catch(() => setConnected(false));

  check();                      // ✅ run once immediately
  const id = setInterval(check, 10000);   // 🔄 then keep checking
  return () => clearInterval(id);
}, []);

  /* auto-collapse sidebar on ≤600 px */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)');
    const onChange = e => setCollapsed(e.matches);
    mq.addEventListener('change', onChange);
    setCollapsed(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* ------------------------------------------------------------------
     POLL UNREAD NOTIFICATION COUNT  (every 30 s)
  ------------------------------------------------------------------ */
  useEffect(() => {
    const fetchUnread = () =>
      api.get('/notifications/unread-count')
         .then(res => setHasUnread(Number(res.data) > 0))
         .catch(()  => {});  // silent fail

    fetchUnread();
    const id = setInterval(fetchUnread, 30000);
    return () => clearInterval(id);
  }, []);

  /* ------------------------------------------------------------------
     HANDLERS
  ------------------------------------------------------------------ */
  const logout = async () => {
    try     { await api.post('/auth/logout'); }
    finally { localStorage.clear(); navigate('/login'); }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(u => !u);
    setShowNotifMenu(false);
  };

  const toggleNotifMenu = async () => {
    const opening = !showNotifMenu;
    setShowNotifMenu(opening);
    setShowUserMenu(false);

    if (opening) {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data);
        setHasUnread(false);                           // clear badge
        api.post('/notifications/mark-as-read').catch(() => {});
      } catch (e) {
        console.error('Failed to load notifications', e);
        setNotifications([]);
      }
    }
  };

  /* ------------------------------------------------------------------ */
  /* RENDER                                                             */
  /* ------------------------------------------------------------------ */
  return (
    <div className="layout">
      {/* ---------------------------------------------------------------
         SIDEBAR
      ---------------------------------------------------------------- */}
      {showSidebar && (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            {!collapsed && <h2>LMS Admin</h2>}
            <button onClick={() => setCollapsed(c => !c)}>
              {collapsed ? <FiMenu size={20} /> : <FiX size={20} />}
            </button>
          </div>

          <nav className="sidebar-nav">
            {SIDEBAR_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={location.pathname === item.to ? 'active' : ''}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </aside>
      )}

      {/* ----------------------------------------------------------------
         MAIN
      ---------------------------------------------------------------- */}
      <div className="main-content">
        {/* TOP BAR */}
        <header className="topbar">
          {/* search */}
          <div className="search-container">
            <FiSearch />
            <input type="text" placeholder="Search anything..." />
          </div>

          {/* right-hand icons */}
          <div className="topbar-icons">
            {/* connection dot */}
            <span
              className={`connection-dot ${connected ? 'online' : 'offline'}`}
              title={connected ? 'API: Online' : 'API: Offline'}
            />

            {/* notification bell */}
            <button className="icon-btn" onClick={toggleNotifMenu}>
              <FiBell />
              {hasUnread && <span className="badge-dot" />}
            </button>
            {showNotifMenu && (
              <div className="dropdown-menu notif-menu">
                {notifications.length > 0
                  ? notifications.map((n, i) => (
                      <div key={i} className="dropdown-item notif-item">
                        <span className="subject">{n.subject}</span>
                        <span className="message">{n.message}</span>
                      </div>
                    ))
                  : <div className="dropdown-item">No notifications</div>
                }
              </div>
            )}

            <button className="profile-btn" onClick={toggleUserMenu}>
              <FiUser />
              <span className="user-name">{username}</span>
            </button>
            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <button className="dropdown-item"
                        onClick={() => navigate('/settings')}>
                  <FiSettings /> Settings
                </button>
                <button className="dropdown-item" onClick={logout}>
                  <FiLogOut /> Log out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* routed pages */}
        <div className="page-wrapper">{children}</div>
      </div>
    </div>
  );
}
