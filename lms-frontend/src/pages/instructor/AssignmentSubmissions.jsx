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
import { useTranslation } from 'react-i18next';
import './InstructorAssignments.css';

const { Option } = Select;
const { Title, Text } = Typography;

export default function AssignmentSubmissions() {
  const { t } = useTranslation();

  const [courses, setCourses]               = useState([]);
  const [assignments, setAssignments]      = useState([]);
  const [subs, setSubs]                     = useState([]);
  const [meta, setMeta]                     = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loadingCourses, setLoadingCourses]           = useState(true);
  const [loadingAssignments, setLoadingAssignments]   = useState(false);
  const [loadingSubs, setLoadingSubs]                 = useState(false);
  const [editingId, setEditingId]                     = useState(null);
  const [grades, setGrades]                           = useState({});

  // Load courses
  useEffect(() => {
    api.get('/instructors/me/courses')
      .then(r => setCourses(r.data))
      .catch(() => message.error(t('Failed to load courses')))
      .finally(() => setLoadingCourses(false));
  }, [t]);

  // Load assignments when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    setLoadingAssignments(true);
    api.get(`/assignments/course/${selectedCourse}`)
      .then(r => setAssignments(r.data))
      .catch(() => message.error(t('Failed to load assignments')))
      .finally(() => setLoadingAssignments(false));
  }, [selectedCourse, t]);

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
      .catch(() => message.error(t('Failed to load submissions')))
      .finally(() => setLoadingSubs(false));
  }, [selectedAssignment, t]);

  // Save grade
  const saveGrade = id => {
    api.put(`/submissions/assignments/${id}/grade`, { score: grades[id] })
      .then(() => {
        message.success(t('Grade saved'));
        setSubs(ss => ss.map(x => x.id === id ? { ...x, score: grades[id] } : x));
        setEditingId(null);
      })
      .catch(() => message.error(t('Save failed')));
  };

  // Helpers for viewing/downloading blobs
  const fetchFileBlob = async fileUrl => {
    const base = api.defaults.baseURL.replace(/\/api\/?$/, '');
    const url = fileUrl.startsWith('http') ? fileUrl : `${base}${fileUrl}`;
    const resp = await api.get(url, { responseType: 'blob', skipToast: true });
    return resp.data;
  };
  const onViewFile = async fileUrl => {
    try {
      const blob = await fetchFileBlob(fileUrl);
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch {
      message.error(t('Unable to load file'));
    }
  };
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
      message.error(t('Unable to download file'));
    }
  };

  const columns = [
    { title: t('Student'), dataIndex: 'studentName', key: 'studentName' },
    {
      title: t('Submitted'),
      dataIndex: 'submissionDate',
      key: 'submissionDate',
      render: d => dayjs(d).format('MMM D, YYYY HH:mm')
    },
    { title: t('Answer'), dataIndex: 'submissionContent', key: 'submissionContent' },
    {
      title: t('File'),
      dataIndex: 'fileUrl',
      key: 'fileUrl',
      render: url =>
        url ? (
          <Space size="small">
            <Button icon={<EyeOutlined />} type="link" onClick={() => onViewFile(url)}>
              {t('View')}
            </Button>
            <Button icon={<DownloadOutlined />} type="link" onClick={() => onDownloadFile(url)}>
              {t('Download')}
            </Button>
          </Space>
        ) : (
          <Text type="secondary">—</Text>
        )
    },
    {
      title: t('Score'),
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
          <Title level={2}>{t('Grade Assignment Submissions')}</Title>
        </Col>

        <Col xs={24}>
          <Card className="form-card">
            <Form layout="vertical">
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label={t('Course')}>
                    <Select
                      placeholder={t('Select course')}
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
                  <Form.Item label={t('Assignment')}>
                    <Select
                      placeholder={t('Select assignment')}
                      loading={loadingAssignments}
                      value={selectedAssignment}
                      onChange={setSelectedAssignment}
                      disabled={!selectedCourse}
                    >
                      {assignments.map(a => (
                        <Option key={a.id} value={a.id}>
                          {a.title} ({dayjs(a.dueDate).format('MMM D')})
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
            <Card className="table-card" title={t('Assignment Details')}>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label={t('Title')}>{meta.title}</Descriptions.Item>
                <Descriptions.Item label={t('Description')}>
                  {meta.description || '—'}
                </Descriptions.Item>
                <Descriptions.Item label={t('Due Date')}>
                  {dayjs(meta.dueDate).format('MMM D, YYYY HH:mm')}
                </Descriptions.Item>
                <Descriptions.Item label={t('Total Points')}>
                  {meta.totalPoints}
                </Descriptions.Item>
                {meta.attachmentUrl && (
                  <Descriptions.Item label={t('Attachment')}>
                    <Space>
                      <Button onClick={() => onViewFile(meta.attachmentUrl)}>
                        {t('View')}
                      </Button>
                      <Button onClick={() => onDownloadFile(meta.attachmentUrl)}>
                        {t('Download')}
                      </Button>
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
