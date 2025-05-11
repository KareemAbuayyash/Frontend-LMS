import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ProfilePicture from './ProfilePicture';
import styles from './ProfileSettings.module.css';

export default function ProfileSettings() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    photo: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    api.get('/users/profile')
      .then(res => {
        setUser(res.data);
        setForm(f => ({
          ...f,
          username: res.data.username,
          email: res.data.email,
        }));
        setPreview(res.data.profile);
      })
      .catch(console.error);
  }, []);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files[0]) {
      setForm(f => ({ ...f, photo: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const data = new FormData();
    data.append('username', form.username);
    data.append('email', form.email);
    if (form.password) data.append('password', form.password);
    if (form.photo)    data.append('photo', form.photo);

    try {
      await api.put('/users/profile/photo', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Profile updated!');
      // re-fetch so that preview URL is the permanent one
      const res = await api.get('/users/profile');
      setUser(res.data);
      setPreview(res.data.profile);
      setForm(f => ({ ...f, password: null, photo: null }));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || err.message);
    }
  };

  if (!user) return <div className={styles.loading}>Loading…</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Profile Settings</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.avatarWrapper}>
          <ProfilePicture
            src={preview}
            alt="Profile"
            className={styles.avatar}
          />
          <label className={styles.photoLabel}>
            Change Photo
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
          </label>
        </div>

        <label>
          Username
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          New Password
          <input
            type="password"
            name="password"
            value={form.password || ''}
            onChange={handleChange}
            placeholder="Leave blank to keep current"
          />
        </label>

        <button type="submit" className={styles.saveBtn}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
