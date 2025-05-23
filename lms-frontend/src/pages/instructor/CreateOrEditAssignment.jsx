// src/pages/instructor/CreateOrEditAssignment.jsx
import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, Button, Table, Select,
  DatePicker, InputNumber, message, Upload,
  Space, Popconfirm, Row, Col, Typography,
  Divider, Drawer, Spin
} from 'antd';
import {
  FileAddOutlined, EditOutlined,
  ReloadOutlined, DeleteOutlined,
  EyeOutlined, DownloadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import './InstructorAssignments.css';

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

export default function CreateOrEditAssignment() {
  const { t } = useTranslation();
  const [courses, setCourses]               = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignments, setAssignments]       = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [editing, setEditing]               = useState(null);
  const [form] = Form.useForm();

  // Drawer state
  const [drawerVisible, setDrawerVisible]   = useState(false);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [loadingDetail, setLoadingDetail]   = useState(false);

  // Load courses
  useEffect(() => {
    api.get('/instructors/me/courses')
      .then(r => setCourses(r.data))
      .catch(() => message.error(t('Failed to load courses')))
      .finally(() => setLoadingCourses(false));
  }, [t]);

  // Reload assignments when course changes
  useEffect(() => {
    if (selectedCourse) reloadAssignments();
  }, [selectedCourse, t]);

  const reloadAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const { data } = await api.get(`/assignments/course/${selectedCourse}`);
      setAssignments(data.map(a => ({
        ...a,
        dueDate: dayjs(a.dueDate).format('MMM D, YYYY HH:mm')
      })));
    } catch {
      message.error(t('Failed to load assignments'));
    } finally {
      setLoadingAssignments(false);
    }
  };

  // Create or update
  const onFinish = async values => {
    if (!selectedCourse) {
      return message.warning(t('Please select a course first'));
    }
    setSubmitting(true);

    const dto = {
      title: values.title,
      description: values.description,
      dueDate: values.dueDate.toISOString(),
      totalPoints: values.totalPoints
    };

    try {
      const fd = new FormData();
      fd.append('assignment', new Blob([JSON.stringify(dto)], { type: 'application/json' }));
      if (values.file) fd.append('file', values.file.file);

      if (editing) {
        await api.put(
          `/assignments/${editing.id}`,
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        message.success(t('Assignment updated'));
      } else {
        await api.post(
          `/assignments/course/${selectedCourse}`,
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        message.success(t('Assignment created'));
      }

      form.resetFields();
      setEditing(null);
      await reloadAssignments();
    } catch (e) {
      message.error(e.response?.data?.message || t('Save failed'));
    } finally {
      setSubmitting(false);
    }
  };

  // Edit
  const onEdit = rec => {
    setEditing(rec);
    form.setFieldsValue({
      title: rec.title,
      description: rec.description,
      dueDate: dayjs(rec.dueDate, 'MMM D, YYYY HH:mm'),
      totalPoints: rec.totalPoints,
      file: null
    });
  };

  // Delete
  const onDelete = async id => {
    try {
      await api.delete(`/assignments/${id}`);
      message.success(t('Assignment deleted'));
      await reloadAssignments();
    } catch {
      message.error(t('Delete failed'));
    }
  };

  // Cancel edit
  const onCancelEdit = () => {
    setEditing(null);
    form.resetFields();
  };

  // View details drawer
  const onView = async id => {
    setDrawerVisible(true);
    setLoadingDetail(true);
    try {
      const { data } = await api.get(`/assignments/${id}`);
      setActiveAssignment(data);
    } catch {
      message.error(t('Failed to load details'));
    } finally {
      setLoadingDetail(false);
    }
  };

  // File helpers
  const fetchFileBlob = async fileUrl => {
    const base = api.defaults.baseURL.replace(/\/api\/?$/, '');
    const url = fileUrl.startsWith('http') ? fileUrl : `${base}${fileUrl}`;
    const resp = await api.get(url, { responseType: 'blob', skipToast: true });
    return resp.data;
  };
  const onViewFile = async url => {
    try {
      const blob = await fetchFileBlob(url);
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    } catch {
      message.error(t('Unable to load file'));
    }
  };
  const onDownloadFile = async url => {
    try {
      const blob = await fetchFileBlob(url);
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = url.split('/').pop();
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      message.error(t('Unable to download file'));
    }
  };

  // Table columns
  const columns = [
    { title: t('Title'), dataIndex: 'title', key: 'title' },
    { title: t('Due'),   dataIndex: 'dueDate', key: 'dueDate' },
    { title: t('Points'),dataIndex: 'totalPoints', key: 'totalPoints' },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_, rec) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} type="link" onClick={() => onView(rec.id)} />
          <Button icon={<EditOutlined />} type="link" onClick={() => onEdit(rec)} />
          <Popconfirm
            title={t('Delete this assignment?')}
            onConfirm={() => onDelete(rec.id)}
            okText={t('Yes')}
            cancelText={t('No')}
          >
            <Button icon={<DeleteOutlined />} type="link" danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <>
      {/* Heading */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2}>
            {editing ? t('Edit Assignment') : t('Create Assignment')}
          </Title>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Form */}
        <Col xs={24} lg={10}>
          <Card bordered className="form-card">
            <Form layout="inline" style={{ marginBottom: 16 }}>
              <Form.Item label={t('Course')}>
                <Select
                  style={{ width: 240 }}
                  placeholder={t('Select course')}
                  loading={loadingCourses}
                  value={selectedCourse}
                  onChange={cid => {
                    setSelectedCourse(cid);
                    setEditing(null);
                    form.resetFields();
                  }}
                >
                  {courses.map(c => (
                    <Option key={c.courseId} value={c.courseId}>
                      {c.courseName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {editing && (
                <Form.Item>
                  <Button icon={<ReloadOutlined />} onClick={onCancelEdit}>
                    {t('Cancel')}
                  </Button>
                </Form.Item>
              )}
            </Form>

            {selectedCourse && (
              <>
                <Divider />
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  encType="multipart/form-data"
                >
                  <Form.Item
                    name="title"
                    label={t('Title')}
                    rules={[{ required: true }]}
                  >
                    <Input
                      prefix={<FileAddOutlined />}
                      placeholder={t('Assignment title')}
                    />
                  </Form.Item>

                  <Form.Item name="description" label={t('Description')}>
                    <Input.TextArea
                      rows={3}
                      placeholder={t('Optional description')}
                    />
                  </Form.Item>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="dueDate"
                        label={t('Due Date')}
                        rules={[{ required: true }]}
                      >
                        <DatePicker
                          showTime
                          style={{ width: '100%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="totalPoints"
                        label={t('Total Points')}
                        rules={[{ required: true, type: 'number', min: 1 }]}
                      >
                        <InputNumber
                          style={{ width: '100%' }}
                          min={1}
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item
                    name="file"
                    label={editing ? t('Replace Attachment') : t('Attachment')}
                    valuePropName="file"
                  >
                    <Upload maxCount={1} beforeUpload={() => false}>
                      <Button>
                        <FileAddOutlined />{' '}
                        {editing ? t('Replace file') : t('Select file')}
                      </Button>
                    </Upload>
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={submitting}
                      block
                    >
                      {editing
                        ? t('Save Changes')
                        : t('Create Assignment')}
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
          </Card>
        </Col>

        {/* Table */}
        <Col xs={24} lg={14}>
          <Card
            bordered
            className="table-card"
            title={t('Existing Assignments')}
          >
            <Table
              rowKey="id"
              dataSource={assignments}
              columns={columns}
              loading={loadingAssignments}
              size="middle"
              bordered
            />
          </Card>
        </Col>
      </Row>

      {/* Detail Drawer */}
      <Drawer
        title={activeAssignment?.title || t('Loading…')}
        width={360}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        {loadingDetail ? (
          <Spin />
        ) : activeAssignment ? (
          <>
            <Paragraph>
              <Text strong>{t('Description:')}</Text><br/>
              {activeAssignment.description || '—'}
            </Paragraph>
            <Paragraph>
              <Text strong>{t('Due Date:')}</Text><br/>
              {dayjs(activeAssignment.dueDate).format('MMM D, YYYY HH:mm')}
            </Paragraph>
            <Paragraph>
              <Text strong>{t('Total Points:')}</Text><br/>
              {activeAssignment.totalPoints}
            </Paragraph>
            {activeAssignment.attachmentUrl && (
              <Space style={{ marginTop: 16 }}>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => onViewFile(activeAssignment.attachmentUrl)}
                >
                  {t('View File')}
                </Button>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={() => onDownloadFile(activeAssignment.attachmentUrl)}
                >
                  {t('Download File')}
                </Button>
              </Space>
            )}
          </>
        ) : (
          <Text>{t('No details available')}</Text>
        )}
      </Drawer>
    </>
  );
}
