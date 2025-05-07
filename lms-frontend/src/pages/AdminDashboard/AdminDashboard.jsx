import React, { useEffect, useState } from 'react'
import api from '../../api/axios'
import { FiSearch } from 'react-icons/fi'
import './AdminDashboard.css'

export default function AdminDashboard() {
  const [permissions, setPermissions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [filter, setFilter]           = useState('')

  useEffect(() => {
    api.get('/api/auth/permissions')
       .then(res => setPermissions(res.data))
       .finally(() => setLoading(false))
  }, [])

  const togglePermission = id => {
    api.post(`/api/auth/permissions/${id}/toggle`)
       .then(res =>
         setPermissions(perms =>
           perms.map(p => p.id === id ? res.data : p)
         )
       )
  }

  const filtered = permissions.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <>
      {/* header + search */}
      <div className="page-header">
        <h2>Manage Permissions</h2>
        <div className="search-container">
          <FiSearch />
          <input
            type="text"
            placeholder="Search permissions..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      {/* permissions table */}
      <div className="card">
        <table className="permissions-table">
          <thead>
            <tr>
              <th>Permission</th>
              <th>Status</th>
              <th /> {/* action */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty-row">
                <td colSpan="3">Loading…</td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map(perm => (
                <tr key={perm.id}>
                  <td>{perm.name}</td>
                  <td className="text-center">
                    <span className={`badge ${perm.enabled ? 'enabled' : 'disabled'}`}>
                      {perm.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={()=>togglePermission(perm.id)}
                      className={`btn-toggle ${perm.enabled ? 'disable' : 'enable'}`}
                    >
                      {perm.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan="3">No permissions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
