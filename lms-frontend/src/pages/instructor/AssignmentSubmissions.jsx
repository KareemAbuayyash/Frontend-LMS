// src/pages/instructor/AssignmentSubmissions.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Select,
  Button,
  Table,
  InputNumber,
  message,
  Space,
  Spin,
  Typography,
  Descriptions,
  Row,
  Col
} from 'antd';
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../api/axios';
import './InstructorAssignments.css';

const { Option } = Select;
const { Title, Text } = Typography;

export default function AssignmentSubmissions() {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [subs, setSubs] = useState([]);
  const [meta, setMeta] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [grades, setGrades] = useState({});

  // Load courses
  useEffect(() => {
    api.get('/instructors/me/courses')
      .then(r => setCourses(r.data))
      .catch(() => message.error('Failed to load courses'))
      .finally(() => setLoadingCourses(false));
  }, []);

  // Load assignments when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    setLoadingAssignments(true);
    api.get(`/assignments/course/${selectedCourse}`)
      .then(r => setAssignments(r.data))
      .catch(() => message.error('Failed to load assignments'))
      .finally(() => setLoadingAssignments(false));
  }, [selectedCourse]);

  // Load assignment details + submissions
  useEffect(() => {
    if (!selectedAssignment) {
      setMeta(null);
      setSubs([]);
      return;
    }
    setLoadingSubs(true);
    Promise.all([
      api.get(`/assignments/${selectedAssignment}`),
      api.get(`/assignments/${selectedAssignment}/submissions`)
    ])
      .then(([mRes, sRes]) => {
        setMeta(mRes.data);
        setSubs(sRes.data);
        setGrades(Object.fromEntries(sRes.data.map(s => [s.id, s.score])));
      })
      .catch(() => message.error('Failed to load submissions'))
      .finally(() => setLoadingSubs(false));
  }, [selectedAssignment]);

  // Save grade
  const saveGrade = id => {
    api.put(`/submissions/assignments/${id}/grade`, { score: grades[id] })
      .then(() => {
        message.success('Grade saved');
        setSubs(ss => ss.map(x => x.id === id ? { ...x, score: grades[id] } : x));
        setEditingId(null);
      })
      .catch(() => message.error('Save failed'));
  };

  // Fetch file as blob
  const fetchFileBlob = async fileUrl => {
    const base = api.defaults.baseURL.replace(/\/api\/?$/, '');
    const url = fileUrl.startsWith('http') ? fileUrl : `${base}${fileUrl}`;
    const resp = await api.get(url, { responseType: 'blob', skipToast: true });
    return resp.data;
  };

  // View in new tab
  const onViewFile = async fileUrl => {
    try {
      const blob = await fetchFileBlob(fileUrl);
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch {
      message.error('Unable to load file');
    }
  };

  // Download file
  const onDownloadFile = async fileUrl => {
    try {
      const blob = await fetchFileBlob(fileUrl);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = fileUrl.split('/').pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      message.error('Unable to download file');
    }
  };

  const columns = [
    { title: 'Student', dataIndex: 'studentName', key: 'studentName' },
    {
      title: 'Submitted',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
      render: d => dayjs(d).format('MMM D, YYYY HH:mm')
    },
    { title: 'Answer', dataIndex: 'submissionContent', key: 'submissionContent' },
    {
      title: 'File',
      dataIndex: 'fileUrl',
      key: 'fileUrl',
      render: url =>
        url ? (
          <Space size="small">
            <Button icon={<EyeOutlined />} type="link" onClick={() => onViewFile(url)} />
            <Button icon={<DownloadOutlined />} type="link" onClick={() => onDownloadFile(url)} />
          </Space>
        ) : <Text type="secondary">—</Text>
    },
    {
      title: 'Score',
      key: 'score',
      render: (_, row) => {
        const isEdit = editingId === row.id;
        return (
          <Space>
            <InputNumber
              min={0}
              max={meta?.totalPoints}
              value={grades[row.id]}
              disabled={!isEdit}
              onChange={v => setGrades(g => ({ ...g, [row.id]: v }))}
            />
            {isEdit ? (
              <>
                <CheckOutlined style={{ color: 'green' }} onClick={() => saveGrade(row.id)} />
                <CloseOutlined
                  style={{ color: 'red' }}
                  onClick={() => {
                    setGrades(g => ({ ...g, [row.id]: row.score }));
                    setEditingId(null);
                  }}
                />
              </>
            ) : (
              <EditOutlined onClick={() => setEditingId(row.id)} />
            )}
          </Space>
        );
      }
    }
  ];

  return (
    <div className="instructor-assignments">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Title level={2}>Grade Assignment Submissions</Title>
        </Col>

        <Col xs={24}>
          <Card className="form-card">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="Course">
                    <Select
                      placeholder="Select course"
                      loading={loadingCourses}
                      value={selectedCourse}
                      onChange={setSelectedCourse}
                    >
                      {courses.map(c => (
                        <Option key={c.courseId} value={c.courseId}>
                          {c.courseName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={10} lg={8}>
                  <Form.Item label="Assignment">
                    <Select
                      placeholder="Select assignment"
                      loading={loadingAssignments}
                      value={selectedAssignment}
                      onChange={setSelectedAssignment}
                      disabled={!selectedCourse}
                    >
                      {assignments.map(a => (
                        <Option key={a.id} value={a.id}>
                          {a.title} (due {dayjs(a.dueDate).format('MMM D')})
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>

        {meta && (
          <Col xs={24} md={12}>
            <Card className="table-card" title="Assignment Details">
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Title">{meta.title}</Descriptions.Item>
                <Descriptions.Item label="Description">{meta.description || '—'}</Descriptions.Item>
                <Descriptions.Item label="Due Date">{dayjs(meta.dueDate).format('MMM D, YYYY HH:mm')}</Descriptions.Item>
                <Descriptions.Item label="Total Points">{meta.totalPoints}</Descriptions.Item>
                {meta.attachmentUrl && (
                  <Descriptions.Item label="Attachment">
                    <Space>
                      <Button icon={<EyeOutlined />} onClick={() => onViewFile(meta.attachmentUrl)}>View</Button>
                      <Button icon={<DownloadOutlined />} onClick={() => onDownloadFile(meta.attachmentUrl)}>Download</Button>
                    </Space>
                  </Descriptions.Item>
                )}
              </Descriptions>
            </Card>
          </Col>
        )}

        <Col xs={24}>
          <Card className="table-card">
            {loadingSubs ? (
              <div className="drawer-spin"><Spin /></div>
            ) : (
              <Table
                rowKey="id"
                dataSource={subs}
                columns={columns}
                pagination={false}
                bordered
                size="middle"
                scroll={{ x: '100%' }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

