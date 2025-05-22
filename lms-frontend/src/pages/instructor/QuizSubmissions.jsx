// src/components/QuizSubmissions.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Select,
  Button,
  InputNumber,
  Drawer,
  Row,
  Col,
  message
} from 'antd';
import api from '../../api/axios';
import './QuizSubmissions.css';

const { Option } = Select;

export default function QuizSubmissions() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState();
  const [subs, setSubs] = useState([]);
  const [quizDetails, setQuizDetails] = useState();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState();
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [savingId, setSavingId] = useState();

  useEffect(() => {
    api.get('/instructors/courses')
      .then(r => setCourses(r.data))
      .catch(() => message.error('Failed to load courses'))
      .finally(() => setLoadingCourses(false));
  }, []);

  useEffect(() => {
    setQuizzes([]);
    setSelectedQuiz(undefined);
    if (!selectedCourse) return;
    setLoadingQuizzes(true);
    api.get(`/quizzes/course/${selectedCourse}`)
      .then(r => setQuizzes(r.data))
      .catch(() => message.error('Failed to load quizzes'))
      .finally(() => setLoadingQuizzes(false));
  }, [selectedCourse]);

  useEffect(() => {
    if (!selectedQuiz) return;
    setLoadingSubs(true);
    api.get(`/submissions/quizzes/${selectedQuiz}`)
      .then(r => setSubs(r.data))
      .catch(() => message.error('Failed to load submissions'))
      .finally(() => setLoadingSubs(false));

    api.get(`/quizzes/${selectedQuiz}`)
      .then(r => setQuizDetails(r.data))
      .catch(() => message.error('Failed to load quiz details'));
  }, [selectedQuiz]);

  const handleScoreChange = (id, score) => {
    setSavingId(id);
    api.put(`/submissions/quizzes/${selectedQuiz}/submissions/${id}/grade`, { score })
      .then(() => {
        message.success('Score updated');
        setSubs(s => s.map(x => x.id === id ? { ...x, score, graded: true } : x));
      })
      .catch(() => message.error('Failed to update score'))
      .finally(() => setSavingId(null));
  };

  const maxTotal = quizDetails
    ? quizDetails.questions.reduce((sum, q) => sum + (q.weight || 1), 0)
    : 0;

  const subColumns = [
    // show the student’s display name
    { title: 'Student', dataIndex: 'studentName', key: 'studentName' },
    {
      title: 'Submitted At',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
      render: d => new Date(d).toLocaleString()
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score, rec) => (
        <InputNumber
          min={0}
          max={maxTotal}
          defaultValue={score}
          onBlur={e => handleScoreChange(rec.id, e.target.value)}
          disabled={savingId === rec.id}
        />
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, rec) => (
        <Button onClick={() => {
          setCurrentRecord(rec);
          setDrawerVisible(true);
        }}>
          View Answers
        </Button>
      )
    }
  ];

  return (
    <div className="quiz-submissions-page">
      <Card title="Select Quiz" className="quiz-table-card">
        <Row
          gutter={16}
          className="top-controls"
          style={{
            flexDirection: window.innerWidth < 500 ? 'column' : undefined,
            gap: window.innerWidth < 500 ? 8 : undefined,
          }}
        >
          <Col xs={24} sm={12} style={window.innerWidth < 500 ? { marginBottom: 8 } : {}}>
            <Select
              placeholder="Select a course"
              loading={loadingCourses}
              onChange={setSelectedCourse}
              value={selectedCourse}
              allowClear
              style={{ width: '100%' }}
              dropdownStyle={window.innerWidth < 500 ? { minWidth: 200 } : {}}
            >
              {courses.map(c => (
                <Option key={c.courseId} value={c.courseId}>
                  {c.courseName}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12}>
            <Select
              placeholder="Select a quiz"
              loading={loadingQuizzes}
              onChange={setSelectedQuiz}
              value={selectedQuiz}
              disabled={!selectedCourse}
              allowClear
              style={{ width: '100%' }}
              dropdownStyle={window.innerWidth < 500 ? { minWidth: 200 } : {}}
            >
              {quizzes.map(q => (
                <Option key={q.id} value={q.id}>
                  {q.title}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {selectedQuiz && (
        <Card
          className="submissions-table-card"
          title={`Submissions: ${quizDetails?.title || ''}`}
          bodyStyle={window.innerWidth < 500 ? { padding: 8 } : {}}
        >
          <div style={{ overflowX: window.innerWidth < 500 ? 'auto' : 'visible' }}>
            <Table
              dataSource={subs}
              columns={subColumns}
              rowKey="id"
              loading={loadingSubs}
              pagination={{ pageSize: 8 }}
              scroll={window.innerWidth < 500 ? { x: 600 } : {}}
              size={window.innerWidth < 500 ? 'small' : 'middle'}
            />
          </div>
        </Card>
      )}

      <Drawer
        title={`Answers: ${currentRecord?.studentName}`}
        visible={drawerVisible}
        width={window.innerWidth < 500 ? '100vw' : 600}
        onClose={() => setDrawerVisible(false)}
        bodyStyle={window.innerWidth < 500 ? { padding: 8 } : {}}
      >
        <div className="drawer-content" style={window.innerWidth < 500 ? { padding: 4 } : {}}>
          <h3 style={window.innerWidth < 500 ? { fontSize: 16 } : {}}>{quizDetails?.title}</h3>
          <ol>
            {quizDetails?.questions.map((q, i) => {
              const raw = currentRecord?.answers[i] ?? '';
              const weight = q.weight || 1;
              const studentArr = raw.split(',').map(a => a.trim()).filter(Boolean);
              const correctArr = q.correctAnswer.split(',').map(a => a.trim());

              let earned = 0;
              if (
                q.questionType === 'TRUE_FALSE' ||
                q.questionType === 'MULTIPLE_CHOICE_SINGLE'
              ) {
                if (
                  (studentArr[0] || '').toLowerCase() ===
                  (correctArr[0] || '').toLowerCase()
                ) {
                  earned = weight;
                }
              } else {
                const gotSet = new Set(studentArr.map(a => a.toLowerCase()));
                const wantSet = new Set(correctArr.map(a => a.toLowerCase()));
                const exactlyMatches =
                  gotSet.size === wantSet.size &&
                  [...wantSet].every(ans => gotSet.has(ans));
                earned = exactlyMatches ? weight : 0;
              }

              return (
                <li key={q.id} className={earned === weight ? 'correct' : 'wrong'}>
                  <p>
                    <strong>Q{i + 1} ({weight} pts):</strong> {q.text}
                  </p>
                  <p>
                    <strong>Their answer:</strong> {studentArr.join(', ')}
                  </p>
                  <p>
                    <strong>Correct answer:</strong> {correctArr.join(', ')}
                  </p>
                  <p style={{ fontStyle: 'italic' }}>
                    Earned: {earned} / {weight}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </Drawer>
    </div>
  );
}
