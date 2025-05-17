// src/pages/instructor/CreateOrEditAssignment.jsx
import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, Button, Table, Select,
  DatePicker, InputNumber, message, Upload,
  Space, Popconfirm
} from 'antd';
import {
  FileAddOutlined, EditOutlined,
  ReloadOutlined, DeleteOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import api from '../../api/axios';
import './InstructorAssignments.css';

const { Option } = Select;

export default function CreateOrEditAssignment() {
  const [courses, setCourses]               = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [assignments, setAssignments]       = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [submitting, setSubmitting]         = useState(false);
  const [editing, setEditing]               = useState(null);

  const [form] = Form.useForm();

  // 1️⃣ Load courses on mount
  useEffect(() => {
    api.get('/instructors/me/courses')
      .then(r => setCourses(r.data))
      .catch(() => message.error('Failed to load courses'))
      .finally(() => setLoadingCourses(false));
  }, []);

  // 2️⃣ Whenever selectedCourse changes, fetch its assignments
  useEffect(() => {
    if (!selectedCourse) return;
    reloadAssignments();
  }, [selectedCourse]);

  // helper: fetch assignments for the current course
  const reloadAssignments = async () => {
    setLoadingAssignments(true);
    try {
      const { data } = await api.get(`/assignments/course/${selectedCourse}`);
      setAssignments(data.map(a => ({
        ...a,
        dueDate: dayjs(a.dueDate).format('MMM D, YYYY HH:mm')
      })));
    } catch {
      message.error('Failed to load assignments');
    } finally {
      setLoadingAssignments(false);
    }
  };

  // 3️⃣ Create or update handler
  const onFinish = async values => {
    if (!selectedCourse) {
      return message.warning('Please select a course first');
    }
    setSubmitting(true);

    const payload = {
      title: values.title,
      description: values.description,
      dueDate: values.dueDate.toISOString(),
      totalPoints: values.totalPoints
    };

    try {
      // build multipart form-data for both create & update
      const fd = new FormData();
      fd.append('assignment', new Blob([JSON.stringify(payload)], {
        type: 'application/json'
      }));
      if (values.file) fd.append('file', values.file.file);

      if (editing) {
        await api.put(
          `/assignments/${editing.id}`,
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        message.success('Assignment updated');
      } else {
        await api.post(
          `/assignments/course/${selectedCourse}`,
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        message.success('Assignment created');
      }

      form.resetFields();
      setEditing(null);
      await reloadAssignments();
    } catch (e) {
      message.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  // 4️⃣ Edit button handler
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

  // 5️⃣ Delete handler: deletes + reloads
  const onDelete = async id => {
    try {
      await api.delete(`/assignments/${id}`);
      message.success('Assignment deleted');
      // refresh table
      await reloadAssignments();
    } catch {
      message.error('Delete failed');
    }
  };

  // 6️⃣ Cancel edit
  const onCancelEdit = () => {
    setEditing(null);
    form.resetFields();
  };

  const columns = [
    { title: 'Title',      dataIndex: 'title',       key: 'title' },
    { title: 'Due',        dataIndex: 'dueDate',     key: 'dueDate' },
    { title: 'Points',     dataIndex: 'totalPoints', key: 'totalPoints' },
    {
      title: 'Actions', key: 'actions', render: (_, rec) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => onEdit(rec)}
          />
          <Popconfirm
            title="Delete this assignment?"
            onConfirm={() => onDelete(rec.id)}
            okText="Yes" cancelText="No"
          >
            <Button icon={<DeleteOutlined />} type="link" danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="instructor-assignments">
      <h1>{editing ? 'Edit Assignment' : 'Create Assignment'}</h1>

      {/* Course picker */}
      <Card className="form-card" style={{ marginBottom: 16 }}>
        <Form layout="inline">
          <Form.Item label="Course">
            <Select
              style={{ width: 240 }}
              placeholder="Select a course"
              loading={loadingCourses}
              value={selectedCourse}
              onChange={cid => {
                setSelectedCourse(cid);
                setEditing(null);
                form.resetFields();
              }}
            >
              {courses.map(c =>
                <Option key={c.courseId} value={c.courseId}>
                  {c.courseName}
                </Option>
              )}
            </Select>
          </Form.Item>
          {editing && (
            <Form.Item>
              <Button
                icon={<ReloadOutlined />}
                onClick={onCancelEdit}
              >
                Cancel
              </Button>
            </Form.Item>
          )}
        </Form>
      </Card>

      {/* Create/Edit form */}
      {selectedCourse && (
        <Card
          className="form-card"
          title={editing ? 'Update Assignment' : 'New Assignment'}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            encType="multipart/form-data"
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter a title' }]}
            >
              <Input prefix={<FileAddOutlined />} />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: 'Please choose a due date' }]}
            >
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              name="totalPoints"
              label="Total Points"
              rules={[{ required: true, type: 'number', min: 1 }]}
            >
              <InputNumber style={{ width: 120 }} />
            </Form.Item>

            {/* always show file so it can be replaced on edit */}
            <Form.Item
              name="file"
              label={editing ? 'Replace Attachment' : 'Attachment'}
              valuePropName="file"
            >
              <Upload maxCount={1} beforeUpload={() => false}>
                <Button>
                  {editing ? 'Select new file' : 'Select file'}
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
              >
                {editing ? 'Save Changes' : 'Create Assignment'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* Assignment list */}
      {selectedCourse && (
        <Card className="table-card" title="Existing Assignments">
          <Table
            rowKey="id"
            dataSource={assignments}
            columns={columns}
            loading={loadingAssignments}
          />
        </Card>
      )}
    </div>
  );
}
