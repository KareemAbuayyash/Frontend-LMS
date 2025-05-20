import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ProfilePicture from '../../components/ProfileSettings/ProfilePicture';
import styles from '../../components/ProfileSettings/ProfileSettings.module.css';
import { toast } from '../../utils/toast'; // ← import toast helper

export default function InstructorProfileSettings() {
  const [user, setUser]       = useState(null);
  const [instr, setInstr]     = useState(null);
  const [form, setForm]       = useState({
    username: '',
    email: '',
    password: '',
    photo: null,
    name: '',
    graduateDegree: '',
    expertise: '',
    assignedCourseIds: [],
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    // load user
    api.get('/users/profile')
      .then(res => {
        setUser(res.data);
        setForm(f => ({
          ...f,
          username: res.data.username || '',
          email:    res.data.email    || '',
        }));
        setPreview(res.data.profile || null);
      })
      .catch(err => {
        console.error(err);
        toast('Failed to load user info', 'error');
      });

    // load instructor
    api.get('/instructors/me')
      .then(res => {
        setInstr(res.data);
        setForm(f => ({
          ...f,
          name:             res.data.name             || '',
          graduateDegree:   res.data.graduateDegree   || '',
          expertise:        res.data.expertise        || '',
          assignedCourseIds: res.data.assignedCourseIds || [],
        }));
      })
      .catch(err => {
        if (err.response?.status !== 404) {
          console.error(err);
          toast('Failed to load instructor info', 'error');
        }
      });
  }, []);

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
      // 1) update the User portion
      const userData = new FormData();
      userData.append('username', form.username);
      userData.append('email',    form.email);
      if (form.password) userData.append('password', form.password);
      if (form.photo)    userData.append('photo',    form.photo);

      await api.put('/users/profile/photo', userData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 2) update the Instructor portion
      await api.put(`/instructors/${instr.id}`, {
        name:             form.name,
        graduateDegree:   form.graduateDegree,
        expertise:        form.expertise,
        assignedCourseIds: form.assignedCourseIds
      });

      toast('Profile updated!', 'success');
    } catch (err) {
      console.error(err);
      toast(err.response?.data?.message || err.message, 'error');
    }
  };

  if (!user || !instr) {
    return <div className={styles.loading}>Loading…</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Instructor Profile Settings</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.avatarWrapper}>
          <ProfilePicture src={preview} alt="Profile" className={styles.avatar} />
          <label className={styles.photoLabel}>
            Change Photo
            <input type="file" name="photo" accept="image/*" onChange={handleChange} />
          </label>
        </div>

        {/* Common user fields */}
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

        {/* Instructor-specific fields */}
        <label>
          Name
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Graduate Degree
          <input
            type="text"
            name="graduateDegree"
            value={form.graduateDegree}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Expertise
          <input
            type="text"
            name="expertise"
            value={form.expertise}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" className={styles.saveBtn}>
          Save Changes
        </button>
      </form>
    </div>
  );
}
