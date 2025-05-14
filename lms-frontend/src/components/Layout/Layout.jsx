// src/components/Layout/Layout.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBell, FiUser, FiSettings, FiLogOut
} from 'react-icons/fi';
import { clearTokens } from '../../utils/auth';
import api from '../../api/axios';
import './Layout.css';

export default function Layout({
  showSidebar = true,
  SidebarComponent = null,
  children
}) {
  const [collapsed,    setCollapsed]    = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotif,    setShowNotif]    = useState(false);
  const [notifs,       setNotifs]       = useState([]);
  const [online,       setOnline]       = useState(false);
  const [unread,       setUnread]       = useState(0);

  const nav      = useNavigate();
  const username = localStorage.getItem('username') || 'User';

  /* ——— Ping API /health every 10s ——— */
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
    const onChange = e => setCollapsed(e.matches);
    mq.addEventListener('change', onChange);
    onChange(mq);
    return () => mq.removeEventListener('change', onChange);
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
      clearTokens();
      localStorage.removeItem('username');
      nav('/login');
    }
  };

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

  return (
    <div className="layout">
      {showSidebar && SidebarComponent && (
        <SidebarComponent
          collapsed={collapsed}
          onToggle={() => setCollapsed(c => !c)}
        />
      )}

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
                {notifs.length
                  ? notifs.map((n, i) => (
                      <div
                        key={i}
                        className={`dropdown-item notif-item ${!n.read ? 'new-email' : ''}`}
                      >
                        <span className="subject">{n.subject}</span>
                        <span className="message">{n.message}</span>
                      </div>
                    ))
                  : <div className="dropdown-item">No notifications</div>
                }
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

        <div className="page-wrapper">
          {children}
        </div>
      </div>
    </div>
  );
}
