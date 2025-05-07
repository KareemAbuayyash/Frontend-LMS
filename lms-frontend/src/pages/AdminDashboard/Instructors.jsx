// src/pages/AdminDashboard/Instructors.jsx

import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import InstructorTable from '../../components/Instructors/InstructorTable';
import InstructorModal from '../../components/Instructors/InstructorModal';

export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [filter, setFilter]           = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [editing, setEditing]         = useState(null);

  // fetch function kept separate
  const load = async () => {
    try {
      const res = await api.get('/instructors');
      setInstructors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // call fetch inside effect—don’t return the promise
  useEffect(() => {
    load();
  }, []);

  const handleDelete = async id => {
    try {
      await api.delete(`/instructors/${id}`);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async dto => {
    try {
      if (dto.id) {
        await api.put(`/instructors/${dto.id}`, dto);
      } else {
        await api.post('/instructors', dto);
      }
      setModalOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = instructors.filter(i =>
    i.username.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ padding: '1.5rem' }}>
      <button
        onClick={() => setModalOpen(true)}
        style={{ marginBottom: '1rem' }}
      >
        + Add Instructor
      </button>

      <InstructorTable
        instructors={filtered}
        filter={filter}
        onFilterChange={setFilter}
        onEdit={inst => {
          setEditing(inst);
          setModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <InstructorModal
        isOpen={modalOpen}
        initial={editing}
        onSave={handleSave}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
