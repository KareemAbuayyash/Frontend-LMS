// src/components/StudentAssignmentDetail/StudentAssignmentDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams }                    from 'react-router-dom';
import { FaFilePdf, FaEye, FaDownload } from 'react-icons/fa';
import { useTranslation }               from 'react-i18next';
import api                              from '../../api/axios';
import './StudentAssignmentDetail.css';

export default function StudentAssignmentDetail() {
  const { t } = useTranslation();
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [content,    setContent]    = useState('');
  const [file,       setFile]       = useState(null);
  const [grade,      setGrade]      = useState(null);

  // strip "/api" from baseURL to get e.g. http://localhost:8080
  const apiBase = api.defaults.baseURL.replace(/\/api\/?$/, '');

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const { data: a } = await api.get(`/assignments/${assignmentId}`);
        setAssignment(a);

        const sRes = await api.get(
          `/submissions/assignments/${assignmentId}/students/me`,
          { validateStatus: s => s < 500 }
        );
        if (sRes.status === 200) {
          setSubmission(sRes.data);
          setContent(sRes.data.submissionContent || '');
          setGrade(sRes.data.score ?? '–');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [assignmentId]);

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append('submissionContent', content);
      if (file) fd.append('file', file);

      await api.post(
        `/submissions/assignments/${assignmentId}`,
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const fresh = await api.get(
        `/submissions/assignments/${assignmentId}/students/me`,
        { validateStatus: s => s < 500 }
      );
      if (fresh.status === 200) {
        setSubmission(fresh.data);
        setGrade(fresh.data.score ?? '–');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loading">{t('Loading…')}</div>;

  // Instructor attachment
  const instrUrl = assignment.attachmentUrl;
  const instrRaw = instrUrl?.split('/').pop() || '';
  const instrName = decodeURIComponent(instrRaw)
    .replace(/^[^_]+_/, '')
    .replace(/\s*\(\d+\)(?=\.\w+$)/, '');

  const viewInstr = () => window.open(`${apiBase}${instrUrl}`, '_blank');
  const dlInstr = async () => {
    try {
      const resp = await fetch(`${apiBase}${instrUrl}`);
      const blob = await resp.blob();
      const u    = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = u; a.download = instrName;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(u);
    } catch (e) { console.error(e); }
  };

  // Student submission attachment
  const subUrl = submission?.fileUrl;
  const subRaw = subUrl?.split('/').pop() || '';
  const subName = decodeURIComponent(subRaw)
    .replace(/^[^_]+_/, '')
    .replace(/\s*\(\d+\)(?=\.\w+$)/, '');

  const viewSub = () => window.open(`${apiBase}${subUrl}`, '_blank');
  const dlSub = async () => {
    try {
      const resp = await fetch(`${apiBase}${subUrl}`);
      const blob = await resp.blob();
      const u    = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = u; a.download = subName;
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(u);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="assignment-card">
      <header className="assignment-header">
        <h1 className="assignment-title">{assignment.title}</h1>
        <span className={`badge ${submission ? 'submitted' : 'pending'}`}>
          {submission ? t('Submitted') : t('Pending')}
        </span>
      </header>

      {assignment.description && (
        <p className="assignment-desc">{assignment.description}</p>
      )}

      <div className="assignment-meta">
        <div><strong>{t('Due')}:</strong> {new Date(assignment.dueDate).toLocaleString()}</div>
        <div><strong>{t('Points')}:</strong> {assignment.totalPoints}</div>
      </div>

      {instrUrl && (
        <section className="instructor-attachment">
          <h2>{t('Instructor Attachment')}</h2>
          <div className="attachment-row">
            <FaFilePdf className="file-icon" />
            <span className="file-name">{instrName}</span>
            <button onClick={viewInstr} className="btn-icon btn-view">
              <FaEye />
            </button>
            <button onClick={dlInstr} className="btn-icon btn-download">
              <FaDownload />
            </button>
          </div>
        </section>
      )}

      {submission ? (
        <section className="submission-result">
          <h2>{t('Your Submission')}</h2>
          <p className="result-text">
            {submission.submissionContent || <em>({t('no text')})</em>}
          </p>
          {subUrl && (
            <div className="attachment-row submission-attachment">
              <FaFilePdf className="file-icon" />
              <span className="file-name">{subName}</span>
              <button onClick={viewSub} className="btn-icon btn-view">
                <FaEye />
              </button>
              <button onClick={dlSub} className="btn-icon btn-download">
                <FaDownload />
              </button>
            </div>
          )}
          <div className="grade">{t('Score')}: {grade}</div>
        </section>
      ) : (
        <section className="submission-form">
          <h2>{t('Submit Your Work')}</h2>
          <textarea
            className="input-text"
            placeholder={t("Enter your answer…")}
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <input
            className="input-file"
            type="file"
            onChange={e => setFile(e.target.files[0])}
          />
          <button className="btn-submit" onClick={handleSubmit}>{t('Submit')}</button>
        </section>
      )}
    </div>
  );
}
