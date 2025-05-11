// src/components/Auth/ForgotPassword.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from './ForgotPassword.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus(null);
    try {
      await api.post('/auth/forgot-password', { email });
      setStatus('A reset link has been sent to your email if it exists in our system.');
    } catch (err) {
      console.error(err);
      setStatus('Something went wrong. Please try again later.');
    }
  };

  return (
    <main className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Forgot Password</h1>
        <label className={styles.label}>
          Email
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit" className={styles.primaryBtn}>
          Send Reset Link
        </button>
        {status && <p className={styles.message}>{status}</p>}
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => navigate('/login')}
        >
          ← Back to Sign In
        </button>
      </form>
    </main>
  );
}
