import React, { useState, useEffect } from 'react';

export default function InstructorModal({
  isOpen,
  initial,
  onSave,
  onClose
}) {
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (initial) setUsername(initial.username);
    else setUsername('');
  }, [initial]);

  if (!isOpen) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{initial ? 'Edit Instructor' : 'New Instructor'}</h3>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '1rem',
            boxSizing: 'border-box'
          }}
        />
        <div style={{ textAlign: 'right' }}>
          <button onClick={onClose} style={{ marginRight: '0.5rem' }}>
            Cancel
          </button>
          <button onClick={() => onSave({ ...initial, username })}>
            {initial ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
