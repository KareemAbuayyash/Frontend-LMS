import React from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

export default function InstructorTable({
  instructors,
  filter,
  onFilterChange,
  onEdit,
  onDelete
}) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search instructors..."
        value={filter}
        onChange={e => onFilterChange(e.target.value)}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Username</th>
            <th style={{ textAlign: 'left', padding: '0.5rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {instructors.map(i => (
            <tr key={i.id}>
              <td style={{ padding: '0.5rem', borderTop: '1px solid #eee' }}>
                {i.username}
              </td>
              <td style={{ padding: '0.5rem', borderTop: '1px solid #eee' }}>
                <button onClick={() => onEdit(i)} aria-label="Edit">
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => onDelete(i.id)}
                  style={{ marginLeft: '0.5rem' }}
                  aria-label="Delete"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
          {instructors.length === 0 && (
            <tr>
              <td colSpan="2" style={{ padding: '1rem', textAlign: 'center' }}>
                No instructors found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
