import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiBell, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { clearTokens } from '../../utils/auth';
import api from '../../api/axios';
import './Layout.css';

export default function Layout({ showSidebar = true, SidebarComponent = null, children }) {
  const [collapsed,    setCollapsed]    = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotif,    setShowNotif]    = useState(false);
  const [notifs,       setNotifs]       = useState([]);
  const [online,       setOnline]       = useState(false);
  const [unread,       setUnread]       = useState(0);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const username = localStorage.getItem('username') || 'User';

  // derive base role path: 'admin' or 'instructor' or 'student'
  const base = pathname.split('/')[1];

  // ping health
  useEffect(() => {
    const ping = () => api.get('/health').then(() => setOnline(true)).catch(() => setOnline(false));
    ping();
    const id = setInterval(ping, 10000);
    return () => clearInterval(id);
  }, []);

  // collapse on mobile
  useEffect(() => {
    const mq = window.matchMedia('(max-width:900px)');
    const onChange = e => setCollapsed(e.matches);
    mq.addEventListener('change', onChange);
    onChange(mq);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // unread count
  useEffect(() => {
    const load = () =>
      api.get('/notifications/unread-count')
        .then(r => setUnread(Number(r.data)))
        .catch(() => {});
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  const logout = async () => {
    try { await api.post('/auth/logout'); }
    finally {
      clearTokens();
      localStorage.removeItem('username');
      navigate('/login');
    }
  };

  const toggleUser  = () => { setShowUserMenu(p => !p); setShowNotif(false); };
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

  return (
    <div className="layout">
      {showSidebar && SidebarComponent && (
        <SidebarComponent collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      )}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-icons">
            <span className={`connection-dot ${online ? 'online' : 'offline'}`} />
            <button className="icon-btn" onClick={toggleNotif}>
              <FiBell />{unread > 0 && <span className="badge-count">{unread}</span>}
            </button>
            {showNotif && (
              <div className="dropdown-menu notif-menu">
                {notifs.length
                  ? notifs.map((n,i) => (
                      <div key={i} className={`dropdown-item notif-item ${!n.read?'new-email':''}`}>
                        <span className="subject">{n.subject}</span>
                        <span className="message">{n.message}</span>
                      </div>
                    ))
                  : <div className="dropdown-item">No notifications</div>
                }
              </div>
            )}

            <button className="profile-btn" onClick={toggleUser}>
              <FiUser /><span className="user-name">{username}</span>
            </button>
            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <button className="dropdown-item" onClick={() => { navigate(`/${base}/settings`); setShowUserMenu(false); }}>
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
