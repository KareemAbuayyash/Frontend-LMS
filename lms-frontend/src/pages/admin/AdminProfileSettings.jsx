import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ProfilePicture from '../../components/ProfileSettings/ProfilePicture';
import styles from '../../components/ProfileSettings/ProfileSettings.module.css';
import { toast } from '../../utils/toast';
import { useTranslation } from 'react-i18next';

export default function AdminProfileSettings() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    username: '', email: '', password: '', photo: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    api.get('/users/profile')
      .then(res => {
        const u = res.data;
        setUser(u);
        setForm(f => ({ ...f, username: u.username, email: u.email }));
        setPreview(u.profile);
      })
      .catch(err => {
        console.error(err);
        toast(t('Error fetching profile'), 'error');
      });
  }, [t]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'photo' && files?.[0]) {
      setForm(f => ({ ...f, photo: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('username', form.username);
      data.append('email',    form.email);
      if (form.password) data.append('password', form.password);
      if (form.photo)    data.append('photo',    form.photo);

      await api.put('/users/profile/photo', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast(t('Profile updated!'), 'success');
    } catch (err) {
      console.error(err);
      toast(err.response?.data?.message || t('Error updating profile'), 'error');
    }
  };

  if (!user) return <div className={styles.loading}>{t('Loading…')}</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{t('Profile Settings')}</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.avatarWrapper}>
          <ProfilePicture src={preview} alt={t('Profile')} className={styles.avatar} />
          <label className={styles.photoLabel}>
            {t('Change Photo')}
            <input type="file" name="photo" accept="image/*" onChange={handleChange} />
          </label>
        </div>

        <label>
          {t('Username')}
          <input
            type="text" name="username"
            value={form.username} onChange={handleChange}
            required
          />
        </label>

        <label>
          {t('Email')}
          <input
            type="email" name="email"
            value={form.email} onChange={handleChange}
            required
          />
        </label>

        <label>
          {t('New Password')}
          <input
            type="password" name="password"
            value={form.password || ''}
            onChange={handleChange}
            placeholder={t('Leave blank to keep current')}
          />
        </label>

        <button type="submit" className={styles.saveBtn}>
          {t('Save Changes')}
        </button>
      </form>
    </div>
  );
}
