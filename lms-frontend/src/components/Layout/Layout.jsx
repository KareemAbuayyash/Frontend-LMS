import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiBell, FiUser, FiSettings, FiLogOut, FiGlobe } from 'react-icons/fi';
import { clearTokens } from '../../utils/auth';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import './Layout.css';
import ProfilePicture from '../ProfileSettings/ProfilePicture'; // adjust path if needed

export default function Layout({ showSidebar = true, SidebarComponent = null, children }) {
  const [collapsed,    setCollapsed]    = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotif,    setShowNotif]    = useState(false);
  const [notifs,       setNotifs]       = useState([]);
  const [online,       setOnline]       = useState(false);
  const [unread,       setUnread]       = useState(0);

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();
  const username = localStorage.getItem('username') || 'User';
  const profilePic = localStorage.getItem('profile') || null; // Save profile URL in localStorage after login/profile update

  // derive base role path: 'admin' or 'instructor' or 'student'
  const base = pathname.split('/')[1];

  // update text direction on language change
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  }, [i18n.language]);

  // ping health
  useEffect(() => {
    const ping = () => api.get('/health').then(() => setOnline(true)).catch(() => setOnline(false));
    ping();
    const id = setInterval(ping, 10000);
    return () => clearInterval(id);
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

  // Language toggle handler
  const toggleLang = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en');
  };

  return (
    <div className="layout">
      {showSidebar && SidebarComponent && (
        <SidebarComponent collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      )}
      <div className="main-content">
        <header className="topbar">
          <div className="navbar-brand">
            <span className="navbar-logo">
              <img
                src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f393.png"
                alt="LMS"
                className="navbar-logo-img"
              />
            </span>
            <span className="navbar-title">LMS</span>
          </div>
          <div className="topbar-icons">
            <span className={`connection-dot ${online ? 'online' : 'offline'}`} />
            <button className="icon-btn" onClick={toggleNotif}>
              <FiBell />
              {unread > 0 && <span className="badge-count">{unread}</span>}
            </button>
            {showNotif && (
              <div className="dropdown-menu notif-menu">
                {notifs.length
                  ? notifs.map((n,i) => (
                      <div key={i} className={`dropdown-item notif-item ${!n.read ? 'new-email' : ''}`}>
                        <span className="subject">{n.subject}</span>
                        <span className="message">{n.message}</span>
                      </div>
                    ))
                  : <div className="dropdown-item">{t('No notifications')}</div>
                }
              </div>
            )}

            {/* Language switcher as icon */}
            <button className="icon-btn" onClick={toggleLang} title={t('Switch language')}>
              <FiGlobe />
            </button>

            {/* User info: avatar + name */}
            <button className="profile-btn" onClick={toggleUser}>
              <span className="profile-info">
                {profilePic ? (
                  <ProfilePicture
                    src={profilePic}
                    alt={username}
                    className="avatar"
                    username={username}
                  />
                ) : (
                  <span className="avatar">
                    {username[0]?.toUpperCase()}
                  </span>
                )}
                <span className="user-name">{username}</span>
              </span>
            </button>
            {showUserMenu && (
              <div className="dropdown-menu user-menu">
                <button
                  className="dropdown-item"
                  onClick={() => { navigate(`/${base}/settings`); setShowUserMenu(false); }}
                >
                  <FiSettings /> {t('Settings')}
                </button>
                <button className="dropdown-item" onClick={logout}>
                  <FiLogOut /> {t('Log out')}
                </button>
              </div>
            )}
          </div>
        </header>
        <div className="page-wrapper">{children}</div>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-copy">
              LMS &copy; {new Date().getFullYear()}<br />
              Owner app: Kareem Abuayyash, Marah Demes, Christine Ateeq
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
