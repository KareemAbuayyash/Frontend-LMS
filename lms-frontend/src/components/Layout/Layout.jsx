import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiBell, FiMenu, FiX, FiUser, FiLogOut,
  FiGrid, FiFileText, FiSettings
} from 'react-icons/fi';
import { clearTokens } from '../../utils/auth';
import api  from '../../api/axios';
import logo from '../../assets/log.png';
import './Layout.css';

const NAV = [
  { label:'Dashboard',   to:'/admin',             icon:<FiGrid/>     },
  { label:'Courses',     to:'/admin/courses',     icon:<FiFileText/> },
  { label:'Users',       to:'/admin/users',       icon:<FiUser/>     },
  { label:'Enrollments', to:'/admin/enrollments', icon:<FiFileText/> },
];

export default function Layout({ showSidebar = true, children }) {
  const [collapsed, setCollapsed]       = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotif,    setShowNotif]    = useState(false);
  const [notifs,       setNotifs]       = useState([]);
  const [online,       setOnline]       = useState(false);
  const [unread,       setUnread]       = useState(0);

  const nav      = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username') || 'User';

  /* ——— Ping API /health every 10 s ——— */
  useEffect(() => {
    const ping = () =>
      api.get('/health')
         .then(() => setOnline(true))
         .catch(() => setOnline(false));

    ping();
    const id = setInterval(ping, 10000);
    return () => clearInterval(id);
  }, []);

  /* ——— Auto-collapse sidebar on narrow screens ——— */
  useEffect(() => {
    const mq = window.matchMedia('(max-width:600px)');
    const fn = e => setCollapsed(e.matches);
    mq.addEventListener('change', fn);
    setCollapsed(mq.matches);
    return () => mq.removeEventListener('change', fn);
  }, []);

  /* ——— Unread notifications count ——— */
  useEffect(() => {
    const load = () =>
      api.get('/notifications/unread-count')
         .then(r => setUnread(Number(r.data)))
         .catch(() => {});

    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  /* ——— Log out ——— */
  const logout = async () => {
    try   { await api.post('/auth/logout'); }
    finally {
      clearTokens();                         // JWTs
      localStorage.removeItem('username');   // display name
      /* DO NOT touch 'savedCreds' so login can auto-fill */
      nav('/login');
    }
  };

  /* ——— User & notif dropdown helpers ——— */
  const toggleUser  = () => {
    setShowUserMenu(p => !p);
    setShowNotif(false);
  };

  const toggleNotif = async () => {
    const open = !showNotif;
    setShowNotif(open);
    setShowUserMenu(false);

    if (open) {
      try {
        const { data } = await api.get('/notifications');
        setNotifs(data);
        setUnread(0);
        await api.post('/notifications/mark-as-read');
      } catch {
        setNotifs([]);
      }
    }
  };

  /* ——— Render ——— */
  return (
    <div className="layout">
      {showSidebar && (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <div className="brand">
              <img src={logo} alt="logo" className="sidebar-logo" />
              {!collapsed && <span className="sidebar-title">Fluento</span>}
            </div>

            <button
              className="toggle-btn"
              onClick={() => setCollapsed(c => !c)}
            >
              {collapsed ? <FiMenu size={20}/> : <FiX size={20}/>}
            </button>
          </div>

          <nav className="sidebar-nav">
            {NAV.map(({label,to,icon}) => (
              <Link
                key={to}
                to={to}
                className={location.pathname === to ? 'active' : ''}
              >
                {icon}
                {!collapsed && <span>{label}</span>}
              </Link>
            ))}
          </nav>
        </aside>
      )}

      {/* ——— Main area ——— */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-icons">
            <span
              className={`connection-dot ${online ? 'online' : 'offline'}`}
              title={online ? 'API: Online' : 'API: Offline'}
            />
            <button className="icon-btn" onClick={toggleNotif}>
              <FiBell />
              {unread > 0 && <span className="badge-count">{unread}</span>}
            </button>

            {showNotif && (
              <div className="dropdown-menu notif-menu">
                {notifs.length ? (
                  notifs.map((n,i) => (
                    <div
                      key={i}
                      className={`dropdown-item notif-item ${!n.read ? 'new-email' : ''}`}
                    >
                      <span className="subject">{n.subject}</span>
                      <span className="message">{n.message}</span>
                    </div>
                  ))
                ) : (
                  <div className="dropdown-item">No notifications</div>
                )}
              </div>
            )}

            <button className="profile-btn" onClick={toggleUser}>
              <FiUser />
              <span className="user-name">{username}</span>
            </button>

            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <button className="dropdown-item" onClick={() => nav('settings')}>
                  <FiSettings /> Settings
                </button>
                <button className="dropdown-item" onClick={logout}>
                  <FiLogOut /> Log out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="page-wrapper">{children}</div>
      </div>
    </div>
  );
}
