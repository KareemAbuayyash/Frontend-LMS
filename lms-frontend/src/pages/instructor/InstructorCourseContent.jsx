// src/pages/instructor/InstructorCourseContent.jsx
import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, Button, Upload, List, message, Spin, Popconfirm
} from 'antd';
import { UploadOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import './InstructorCourseContent.css';

export default function InstructorCourseContent() {
  const { courseId } = useParams();
  const [contents, setContents] = useState([]);
  const [loadingContents, setLoadingContents] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [instructorId, setInstructorId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [form] = Form.useForm();

  // 1) Fetch instructor profile
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/instructors/me');
        setInstructorId(data.id);
      } catch {
        message.error('Failed to load your profile');
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, []);

  // 2) Load existing content
  useEffect(() => {
    fetchContents();
  }, [courseId]);

  async function fetchContents() {
    setLoadingContents(true);
    try {
      const { data } = await api.get(`/content/course/${courseId}`);
      setContents(data);
    } catch {
      message.error('Could not load course content');
    } finally {
      setLoadingContents(false);
    }
  }

  // 3) Upload new content
  const onFinish = async values => {
    if (loadingProfile) return message.warning('Still loading your profile…');
    if (!instructorId)  return message.error('Cannot identify you — please log in again');

    const fd = new FormData();
    fd.append('title', values.title);
    if (values.description) fd.append('description', values.description);
    fd.append('courseId', courseId);
    fd.append('uploadedBy', instructorId);
    fd.append('files', values.files[0].originFileObj);

    setUploading(true);
    try {
      await api.post('/content/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.success('Content uploaded!');
      form.resetFields();
      fetchContents();
    } catch (err) {
      message.error(err.response?.data || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // 4) Secure download via Axios + blob
  const handleDownload = async item => {
    try {
      const res = await api.get(`/content/${item.id}/download`, {
        responseType: 'blob',
        skipToast: true
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      const disp = res.headers['content-disposition'];
      let filename = item.title;
      if (disp) {
        const m = disp.match(/filename="(.+)"/);
        if (m) filename = m[1];
      }
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      message.error('Download failed');
    }
  };

  // 5) Delete content
  const handleDelete = async id => {
    try {
      await api.delete(`/content/${id}`);
      message.success('Content deleted');
      fetchContents();
    } catch {
      message.error('Delete failed');
    }
  };

  if (loadingProfile) {
    return <div className="centered"><Spin size="large" /></div>;
  }

  return (
    <div className="instructor-content">
      <h1>Upload Course Content</h1>

      <Card title="New Content">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="e.g. Week 3 Slides" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Optional description…" />
          </Form.Item>

          <Form.Item
            name="files"
            label="File"
            valuePropName="fileList"
            getValueFromEvent={({ fileList }) => fileList}
            rules={[{ required: true, message: 'Please select a file' }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={uploading} block>
              Upload
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card
        title="Existing Content"
        style={{ marginTop: 24 }}
        loading={loadingContents}
      >
        <List
          dataSource={contents}
          renderItem={item => (
            <List.Item
              actions={[
                <Button
                  key="download"
                  type="link"
                  icon={<DownloadOutlined />}
                  onClick={() => handleDownload(item)}
                >
                  Download
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Delete this content?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Yes" cancelText="No"
                >
                  <Button type="link" danger icon={<DeleteOutlined />}>
                    Delete
                  </Button>
                </Popconfirm>,
                <Link key="view" to={`/instructor/courses/${courseId}`}>
                  View in Course
                </Link>
              ]}
            >
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
