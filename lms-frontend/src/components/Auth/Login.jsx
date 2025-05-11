// src/components/Auth/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './Login.module.css';
import logo from '../../assets/logo.png';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { saveTokens, getUserRole } from '../../utils/auth';

export default function Login() {
  const savedUsername = localStorage.getItem('savedUsername') || '';
  const savedPassword = localStorage.getItem('savedPassword') || '';
  const [username, setUsername]     = useState(savedUsername);
  const [password, setPassword]     = useState(savedPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(!!savedUsername && !!savedPassword);
  const [error, setError]           = useState('');
  const navigate                   = useNavigate();

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem('savedUsername', username);
      localStorage.setItem('savedPassword', password);
    } else {
      localStorage.removeItem('savedUsername');
      localStorage.removeItem('savedPassword');
    }
  }, [rememberMe, username, password]);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      // ← no leading "/api"
      const { data } = await api.post('/auth/login', { username, password });
      saveTokens(data.accessToken, data.refreshToken);
      localStorage.setItem('username', username);

      const role = getUserRole();
      navigate(role === 'ROLE_ADMIN' ? '/admin' : '/student/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className={styles.app}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <img src={logo} alt="Logo" className={styles.logo} />
        </div>

        <h1 className={styles.title}>Sign in</h1>

        <label className={styles.label}>
          Username
          <input
            type="text"
            className={styles.input}
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
        </label>

        <label className={styles.label}>
          Password
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? 'text' : 'password'}
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </label>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.row}>
          <label className={styles.rememberRow}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(r => !r)}
            />
            Remember me
          </label>
          <Link to="/forgot-password" className={styles.forgot}>
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className={styles.primaryBtn}>
          Sign in
        </button>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button type="button" className={styles.socialBtn}>
          <FcGoogle size={18} /> Sign in with Google
        </button>
      </form>
    </main>
  );
}
