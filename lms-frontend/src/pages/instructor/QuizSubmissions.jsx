// src/pages/instructor/QuizSubmissions.jsx
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

  // 1) load courses
  useEffect(() => {
    api.get('/instructors/courses')
      .then(r => setCourses(r.data))
      .catch(() => message.error('Failed to load courses'))
      .finally(() => setLoadingCourses(false));
  }, []);

  // 2) load quizzes when course selected
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

  // 3) load submissions + quiz details
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

  // 4) grade update
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

  const subColumns = [
    { title: 'Student ID', dataIndex: 'studentId', key: 'studentId' },
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
          max={quizDetails?.questions.length}
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
      <Card className="quiz-table-card" title="Select Quiz">
        <Row gutter={16} className="top-controls">
          <Col xs={24} sm={12}>
            <Select
              placeholder="Select a course"
              loading={loadingCourses}
              onChange={setSelectedCourse}
              value={selectedCourse}
              allowClear
              style={{ width: '100%' }}
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
        <Card className="submissions-table-card" title={`Submissions: ${quizDetails?.title || ''}`}>
          <Table
            dataSource={subs}
            columns={subColumns}
            rowKey="id"
            loading={loadingSubs}
            pagination={{ pageSize: 8 }}
          />
        </Card>
      )}

      <Drawer
        title={`Answers: Student ${currentRecord?.studentId}`}
        visible={drawerVisible}
        width={480}
        onClose={() => setDrawerVisible(false)}
      >
        <div className="drawer-content">
          <h3>{quizDetails?.title}</h3>
          <ol>
            {quizDetails?.questions.map((q, i) => {
              const raw = currentRecord?.answers[i] ?? '';

              // --- Handle TRUE_FALSE and SINGLE-CHOICE as simple strings ---
              if (q.questionType === 'TRUE_FALSE' ||
                  q.questionType.includes('MULTIPLE_CHOICE_SINGLE')) {
                const studentAns = raw.trim().toLowerCase();
                const correctAns = q.correctAnswer.trim().toLowerCase();
                const isCorrect = studentAns === correctAns;
                return (
                  <li key={q.id} className={isCorrect ? 'correct' : 'wrong'}>
                    <p><strong>Q{i + 1}:</strong> {q.text}</p>
                    <p><strong>Their answer:</strong> {studentAns}</p>
                    <p><strong>Correct answer:</strong> {correctAns}</p>
                  </li>
                );
              }

              // --- MULTIPLE_CHOICE_MULTIPLE or other multi-answer types ---
              const studentArr = raw
                .split(',')
                .map(a => a.trim())
                .filter(a => a !== '');
              const correctArr = q.correctAnswer
                .split(',')
                .map(a => a.trim());
              const isCorrect =
                studentArr.length === correctArr.length &&
                correctArr.every(ans => studentArr.includes(ans));

              return (
                <li key={q.id} className={isCorrect ? 'correct' : 'wrong'}>
                  <p><strong>Q{i + 1}:</strong> {q.text}</p>
                  <p><strong>Their answer:</strong> {studentArr.join(', ')}</p>
                  <p><strong>Correct answer:</strong> {correctArr.join(', ')}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </Drawer>
    </div>
  );
}
