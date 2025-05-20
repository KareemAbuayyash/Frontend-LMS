import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, Button, Upload, List,
  message, Spin, Popconfirm, Modal, Space, Row, Col
} from 'antd';
import {
  UploadOutlined, DownloadOutlined,
  DeleteOutlined, EditOutlined
} from '@ant-design/icons';
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

  // New: for editing
  const [editVisible, setEditVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editForm] = Form.useForm();

  const [form] = Form.useForm();

  // 1️⃣ Fetch instructor profile
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

  // 2️⃣ Load existing content
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

  // 3️⃣ Upload new content
  const onFinish = async values => {
    if (loadingProfile) return message.warning('Still loading your profile…');
    if (!instructorId) return message.error('Cannot identify you — please log in again');

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

  // 4️⃣ Download
  const handleDownload = async item => {
    try {
      const res = await api.get(`/content/${item.id}/download`, {
        responseType: 'blob', skipToast: true
      });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement('a');
      a.href = url;
      // parse filename
      let filename = item.title;
      const disp = res.headers['content-disposition'];
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

  // 5️⃣ Delete
  const handleDelete = async id => {
    try {
      await api.delete(`/content/${id}`);
      message.success('Content deleted');
      fetchContents();
    } catch {
      message.error('Delete failed');
    }
  };

  // ——————————————————————————
  // ✏️ Open Edit modal
  const openEdit = item => {
    setEditingItem(item);
    editForm.setFieldsValue({
      title: item.title,
      description: item.description,
      files: []   // reset file list
    });
    setEditVisible(true);
  };
  // ✏️ Submit Edit
  const handleEdit = async values => {
    const fd = new FormData();
    fd.append('title', values.title);
    if (values.description) fd.append('description', values.description);
    if (values.files && values.files[0]) {
      fd.append('files', values.files[0].originFileObj);
    }

    setUploading(true);
    try {
      await api.put(`/content/${editingItem.id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.success('Content updated');
      setEditVisible(false);
      fetchContents();
    } catch {
      message.error('Update failed');
    } finally {
      setUploading(false);
    }
  };

  if (loadingProfile) {
    return <div className="centered"><Spin size="large" /></div>;
  }

  return (
    <div className="instructor-content">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col><h1>Upload Course Content</h1></Col>
      </Row>

      {/* Upload form */}
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

      {/* Existing list */}
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
                <Button
                  key="edit"
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => openEdit(item)}
                >
                  Edit
                </Button>,
                <Popconfirm
                  key="delete"
                  title="Delete this content?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Yes"
                  cancelText="No"
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

      {/* Edit Modal */}
      <Modal
        title="Edit Content"
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        okText="Save"
        onOk={() => editForm.submit()}
        confirmLoading={uploading}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEdit}
        >
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="files"
            label="Replace File"
            valuePropName="fileList"
            getValueFromEvent={({ fileList }) => fileList}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Choose New File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
