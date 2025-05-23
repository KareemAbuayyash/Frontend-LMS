import { useState, useEffect } from 'react';
import { Link, useNavigate }    from 'react-router-dom';
import api                       from '../../api/axios';
import { saveTokens }            from '../../utils/auth';
import { toast }                 from '../../utils/toast';
import styles                    from './Login.module.css';
import logo                      from '../../assets/log.png';
import { FiEye, FiEyeOff }       from 'react-icons/fi';
import { FcGoogle }              from 'react-icons/fc';

export default function Login() {
  const LS_KEY = 'savedCreds';
  const stored = JSON.parse(localStorage.getItem(LS_KEY) || 'null');

  const [form, setForm] = useState({
    username: stored?.username || '',
    password: stored?.password || '',
    remember: !!stored?.username,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const navigate = useNavigate();

  // persist “remember me”
  useEffect(() => {
    if (form.remember) {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({ username: form.username, password: form.password })
      );
    } else {
      localStorage.removeItem(LS_KEY);
    }
  }, [form]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); 
    setLoading(true);

    try {
      const response = await api.post(
        '/auth/login',
        { username: form.username, password: form.password },
        { skipToast: true }
      );

      const { data } = response;
      saveTokens(data.accessToken, data.refreshToken);

      const { data: user } = await api.get('/users/profile');
      localStorage.setItem('username', user.username);
      localStorage.setItem('profile', user.profile); // user.profile should be the image URL

      toast('Login successful', 'success');

      const role = localStorage.getItem('userRole');
      if (role === 'ROLE_ADMIN')         navigate('/admin');
      else if (role === 'ROLE_INSTRUCTOR') navigate('/instructor/dashboard');
      else                               navigate('/student/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.errorMessage ||
        'Login failed'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // go through Vite proxy to /api/oauth2/authorization/google
    window.location.href = '/api/oauth2/authorization/google';
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
            className={styles.input}
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
        </label>

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

        <div className={styles.row}>
          <label className={styles.rememberRow}>
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
            /> Remember me
          </label>
          <Link to="/forgot-password" className={styles.forgot}>
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className={styles.primaryBtn}
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <div className={styles.divider}><span>or</span></div>

        <button
          type="button"
          className={styles.socialBtn}
          onClick={handleGoogleLogin}
        >
          <FcGoogle size={18} /> Sign in with Google
        </button>
      </form>
    </main>
  );
}
