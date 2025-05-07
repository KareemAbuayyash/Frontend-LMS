import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './Login.module.css';
import lmsLogo from '../../assets/react.svg';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';

// New imports for auth helpers
import { saveTokens, getUserRole } from '../../utils/auth';


export default function Login() {
  // Load saved credentials
  const savedUsername = localStorage.getItem('savedUsername') || '';
  const savedPassword = localStorage.getItem('savedPassword') || '';
  const [username, setUsername] = useState(savedUsername);
  const [password, setPassword] = useState(savedPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(savedUsername && savedPassword));
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      const { data } = await api.post('/api/auth/login', {
        username,
        password,
      });

      // store tokens using helper
      saveTokens(data.accessToken, data.refreshToken);

      // still keep the username for display
      localStorage.setItem('username', username);

      // redirect based on role
      const role = getUserRole();
      if (role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className={styles.app}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.header}>
          <img src={lmsLogo} alt="LMS logo" width={28} height={28} />
          <span className={styles.brand}>LMS</span>
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

        {error && (
          <p style={{ color: 'tomato', textAlign: 'center' }}>{error}</p>
        )}

        <label className={styles.rememberRow}>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(r => !r)}
          />
          Remember me
        </label>

        <button type="submit" className={styles.primaryBtn}>
          Sign in
        </button>

        <Link to="/forgot-password" className={styles.forgot}>
          Forgot your password?
        </Link>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <button type="button" className={styles.socialBtn}>
          <FcGoogle size={18} /> Sign in with Google
        </button>
        <button type="button" className={styles.socialBtn}>
          <FaFacebook size={18} color="#1877f2" /> Sign in with Facebook
        </button>

        <p className={styles.signup}>
          Don’t have an account? <Link to="/register">Sign up</Link>
        </p>
      </form>
    </main>
  );
}
