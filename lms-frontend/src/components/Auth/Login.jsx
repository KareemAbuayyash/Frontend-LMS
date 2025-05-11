// ─────────────────────────────────────────────────────────────
// Full file: src/components/Auth/Login.jsx
// ─────────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Link, useNavigate }   from 'react-router-dom';
import api                     from '../../api/axios';
import { saveTokens, getUserRole } from '../../utils/auth';

import styles                  from './Login.module.css';
import logo                    from '../../assets/log.png';
import { FiEye, FiEyeOff }     from 'react-icons/fi';
import { FcGoogle }            from 'react-icons/fc';

/* key used to persist credentials */
const LS_KEY = 'savedCreds';   // { username, password }

export default function Login() {
  /* ── 1. Bootstrap from localStorage ─────────────────────── */
  let initCreds = { username: '', password: '' };
  try {
    initCreds = JSON.parse(localStorage.getItem(LS_KEY)) || initCreds;
  } catch {/* ignore bad JSON */}

  /* ── 2. State ───────────────────────────────────────────── */
  const [form, setForm] = useState({
    username: initCreds.username,
    password: initCreds.password,
    remember: !!initCreds.username         // checkbox pre-checked if creds exist
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const navigate = useNavigate();

  /* ── 3. Persist / clear creds whenever form changes ─────── */
  useEffect(() => {
    if (form.remember) {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ username: form.username, password: form.password })
      );
    } else {
      localStorage.removeItem(LS_KEY);
    }
  }, [form.remember, form.username, form.password]);

  /* ── 4. Input handler (checkbox + text inputs) ──────────── */
  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  /* ── 5. Submit handler ──────────────────────────────────── */
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', {
        username: form.username,
        password: form.password
      });

      /* JWT storage: localStorage↔sessionStorage based on remember flag */
      saveTokens(data.accessToken, data.refreshToken, form.remember);

      /* name for top-bar */
      localStorage.setItem('username', form.username);

      /* route by role */
      const role = getUserRole();
      navigate(role === 'ROLE_ADMIN' ? '/admin' : '/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  /* ── 6. UI ──────────────────────────────────────────────── */
  return (
    <main className={styles.app}>
      <form className={styles.card} onSubmit={handleSubmit}>
        {/* ——— Logo ——— */}
        <div className={styles.header}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>

        <h1 className={styles.title}>Sign in</h1>

        {/* ——— Username ——— */}
        <label className={styles.label}>
          Username
          <input
            className={styles.input}
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </label>

        {/* ——— Password ——— */}
        <label className={styles.label}>
          Password
          <div className={styles.passwordWrapper}>
            <input
              className={styles.input}
              type={showPwd ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowPwd(p => !p)}
              aria-label={showPwd ? 'Hide password' : 'Show password'}
            >
              {showPwd ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        {/* ——— Remember / Forgot row ——— */}
        <div className={styles.row}>
          <label className={styles.rememberRow}>
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            />
            Remember me
          </label>

          <Link to="/forgot-password" className={styles.forgot}>
            Forgot Password?
          </Link>
        </div>

        {/* ——— Sign-in button ——— */}
        <button
          type="submit"
          className={styles.primaryBtn}
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        {/* ——— Divider & Google placeholder ——— */}
        <div className={styles.divider}><span>or</span></div>
        <button
          type="button"
          className={styles.socialBtn}
          onClick={() => alert('Google OAuth coming soon!')}
        >
          <FcGoogle size={18} /> Sign in with Google
        </button>
      </form>
    </main>
  );
}
