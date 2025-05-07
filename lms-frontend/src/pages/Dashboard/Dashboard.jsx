import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function Dashboard() {
  const navigate = useNavigate();
  const user =
    localStorage.getItem('username') ||
    sessionStorage.getItem('username') ||
    'User';

  const logout = async () => {
    // grab the access token so we can tell the server to invalidate it
    const token = localStorage.getItem('accessToken');
    try {
      // call your Spring logout endpoint
      await api.post(
        '/api/auth/logout',
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.warn('Backend logout failed, proceeding anyway', err);
    } finally {
      // clear all auth data
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('username');
      sessionStorage.removeItem('accessToken');
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('username');

      // send them home
      navigate('/');
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <h1>Dashboard</h1>
        <p>Welcome <strong>{user}</strong> 🎉</p>
        <button
          onClick={logout}
          style={{
            marginTop: '1.5rem',
            padding: '.6rem 1.2rem',
            border: 'none',
            borderRadius: 6,
            background: '#6366f1',
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Log out
        </button>
      </div>
    </main>
  );
}
