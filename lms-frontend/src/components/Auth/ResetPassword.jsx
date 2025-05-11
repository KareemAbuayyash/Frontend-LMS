// src/components/Auth/ResetPassword.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './ResetPassword.module.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus('Invalid reset link.');
    }
  }, [token]);

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    try {
      const form = new FormData();
      form.append('token', token);
      form.append('newPassword', password);
      await api.post('/auth/reset-password', form);
      setStatus('Password reset! You can now sign in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setStatus('Reset failed. Link may be expired.');
    }
  };

  return (
    <main className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Reset Password</h1>
        <label className={styles.label}>
          New Password
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" className={styles.primaryBtn} disabled={!token}>
          Reset Password
        </button>
        {status && <p className={styles.message}>{status}</p>}
      </form>
    </main>
  );
}
