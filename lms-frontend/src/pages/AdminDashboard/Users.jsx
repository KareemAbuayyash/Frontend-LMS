import React, { useEffect, useState, useMemo } from 'react';
import api from '../../api/axios';
import {
  FiTrash2,
  FiPlus,
  FiSearch,
  FiEdit2,
  FiCheck,
  FiXCircle
} from 'react-icons/fi';
import './Users.css';

export default function Users() {
  const [users, setUsers]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [sortField, setSortField]   = useState('username');
  const [sortDir, setSortDir]       = useState('asc');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editingId, setEditingId]   = useState(null);

  const [draft, setDraft] = useState({
    username: '',
    email: '',
    role: 'STUDENT',
    password: '',
    profile: ''
  });

  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    name: '',
    password: '',
    role: 'STUDENT',
    profile: ''
  });

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      const embedded = res.data._embedded || {};
      const rawList  = Object.values(embedded).find(Array.isArray) || [];
      const list     = rawList.map(item => item.content ?? item);
      setUsers(list);
    } catch (err) {
      console.error('Failed to load users', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const changeSort = field => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const displayed = useMemo(() => {
    let list = [...users];
    if (roleFilter !== 'ALL') {
      list = list.filter(u => u.role === roleFilter);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(u =>
        u.username.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        (u.profile || '').toLowerCase().includes(s)
      );
    }
    list.sort((a, b) => {
      const va = (a[sortField] || '').toString().toLowerCase();
      const vb = (b[sortField] || '').toString().toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [users, roleFilter, search, sortField, sortDir]);

  const startEdit = u => {
    setEditingId(u.userId);
    setDraft({
      username: u.username,
      email:    u.email,
      role:     u.role,
      password: '',
      profile:  u.profile || ''
    });
  };
  const cancelEdit = () => setEditingId(null);

  const saveEdit = async id => {
    try {
      await api.put(`/users/${id}`, {
        username: draft.username,
        email:    draft.email,
        role:     draft.role,
        password: draft.password || 'TempPass123!',
        profile:  draft.profile
      });
      setUsers(us =>
        us.map(u =>
          u.userId === id
            ? {
                ...u,
                username: draft.username,
                email:    draft.email,
                role:     draft.role,
                profile:  draft.profile
              }
            : u
        )
      );
      setEditingId(null);
    } catch (err) {
      console.error('Failed to save user edits', err);
      alert(err.response?.data?.details || err.message);
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Really delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(us => us.filter(u => u.userId !== id));
    } catch (err) {
      if (err.response?.status === 409) {
        const msg = err.response.data?.details || err.response.data?.message;
        alert('Delete failed: ' + msg);
      } else {
        console.error('Failed to delete user', err);
      }
    }
  };

  const openModal  = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setNewUser({
      username: '',
      email: '',
      name: '',
      password: '',
      role: 'STUDENT',
      profile: ''
    });
  };

  const handleAdd = async e => {
    e.preventDefault();
    try {
      await api.post('/api/auth/register', {
        username: newUser.username,
        email:    newUser.email,
        name:     newUser.name,
        password: newUser.password,
        role:     newUser.role,
        profile:  newUser.profile
      });
      await load();
      closeModal();
    } catch (err) {
      console.error('Failed to add user', err);
      alert(err.response?.data?.details || err.message);
    }
  };

  return (
    <div className="users-page">
      {/* toolbar */}
      <div className="toolbar">
        <div className="search-box">
          <FiSearch className="icon" />
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="ALL">All Roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="INSTRUCTOR">INSTRUCTOR</option>
          <option value="STUDENT">STUDENT</option>
        </select>
        <button className="btn primary" onClick={openModal}>
          <FiPlus /> Add User
        </button>
      </div>

      {/* table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th onClick={() => changeSort('username')}>
                Username{sortField==='username' ? (sortDir==='asc'?' ▲':' ▼') : ''}
              </th>
              <th onClick={() => changeSort('email')}>
                Email{sortField==='email' ? (sortDir==='asc'?' ▲':' ▼') : ''}
              </th>
              <th onClick={() => changeSort('role')}>
                Role{sortField==='role' ? (sortDir==='asc'?' ▲':' ▼') : ''}
              </th>
              <th onClick={() => changeSort('profile')}>
                Name{sortField==='profile' ? (sortDir==='asc'?' ▲':' ▼') : ''}
              </th>
              <th>Password</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty"><td colSpan={6}>Loading…</td></tr>
            ) : displayed.length === 0 ? (
              <tr className="empty"><td colSpan={6}>No users found.</td></tr>
            ) : (
              displayed.map(u => (
                <tr key={u.userId}>
                  {editingId === u.userId ? (
                    <>
                      <td>
                        <input
                          className="inline-edit"
                          value={draft.username}
                          onChange={e => setDraft(d => ({ ...d, username: e.target.value }))}
                        />
                      </td>
                      <td>
                        <input
                          className="inline-edit"
                          value={draft.email}
                          onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
                        />
                      </td>
                      <td>
                        <select
                          className="inline-edit"
                          value={draft.role}
                          onChange={e => setDraft(d => ({ ...d, role: e.target.value }))}
                        >
                          <option value="ADMIN">ADMIN</option>
                          <option value="INSTRUCTOR">INSTRUCTOR</option>
                          <option value="STUDENT">STUDENT</option>
                        </select>
                      </td>
                      <td>
                        <input
                          className="inline-edit"
                          value={draft.profile}
                          onChange={e => setDraft(d => ({ ...d, profile: e.target.value }))}
                        />
                      </td>
                      <td>
                        <input
                          className="inline-edit"
                          type="password"
                          placeholder="(leave blank to keep)"
                          value={draft.password}
                          onChange={e => setDraft(d => ({ ...d, password: e.target.value }))}
                        />
                      </td>
                      <td className="actions-col">
                        <button className="icon-btn" onClick={() => saveEdit(u.userId)}>
                          <FiCheck />
                        </button>
                        <button className="icon-btn" onClick={cancelEdit}>
                          <FiXCircle />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>{u.profile || '-'}</td>
                      <td><code style={{ fontSize: '0.8em' }}>{u.password}</code></td>
                      <td className="actions-col">
                        <button className="icon-btn" onClick={() => startEdit(u)}>
                          <FiEdit2 />
                        </button>
                        <button className="icon-btn trash" onClick={() => handleDelete(u.userId)}>
                          <FiTrash2 />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* add-user modal */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>New User</h3>
            <form onSubmit={handleAdd}>
              <div className="grid2">
                <input
                  required
                  placeholder="Username"
                  value={newUser.username}
                  onChange={e => setNewUser(n => ({ ...n, username: e.target.value }))}
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={e => setNewUser(n => ({ ...n, email: e.target.value }))}
                />
              </div>
              <div className="grid2">
                <input
                  required
                  placeholder="Name"
                  value={newUser.name}
                  onChange={e => setNewUser(n => ({ ...n, name: e.target.value }))}
                />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={e => setNewUser(n => ({ ...n, password: e.target.value }))}
                />
              </div>
              <div className="grid2">
                <select
                  required
                  value={newUser.role}
                  onChange={e => setNewUser(n => ({ ...n, role: e.target.value }))}
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="INSTRUCTOR">INSTRUCTOR</option>
                  <option value="STUDENT">STUDENT</option>
                </select>
                <input
                  placeholder="Profile URL"
                  value={newUser.profile}
                  onChange={e => setNewUser(n => ({ ...n, profile: e.target.value }))}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
);
}
