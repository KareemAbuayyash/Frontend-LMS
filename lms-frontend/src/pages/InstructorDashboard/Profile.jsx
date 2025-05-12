import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    api.get('/instructor/me')
      .then(res => setProfile(res.data))
      .catch(console.error);
  }, []);

  if (!profile) return <p>Loading profile…</p>;

  return (
    <div className="profile-page">
      <h2>My Profile</h2>
      <div className="profile-card">
        <div><strong>Name:</strong> {profile.name}</div>
        <div><strong>Email:</strong> {profile.email}</div>
        <div><strong>Bio:</strong> {profile.bio}</div>
      </div>
    </div>
  );
}
