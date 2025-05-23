// src/pages/instructor/InstructorCourseContent.jsx
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
import { useTranslation } from 'react-i18next';
import './InstructorCourseContent.css';

export default function InstructorCourseContent() {
  const { t } = useTranslation();
  const { courseId } = useParams();

  const [contents, setContents]             = useState([]);
  const [loadingContents, setLoadingContents] = useState(true);
  const [uploading, setUploading]           = useState(false);
  const [instructorId, setInstructorId]     = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Edit modal state
  const [editVisible, setEditVisible]       = useState(false);
  const [editingItem, setEditingItem]       = useState(null);
  const [editForm] = Form.useForm();
  const [form]     = Form.useForm();

  // 1️⃣ Fetch instructor profile
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/instructors/me');
        setInstructorId(data.id);
      } catch {
        message.error(t('Failed to load your profile'));
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [t]);

  // 2️⃣ Load existing content
  useEffect(() => {
    fetchContents();
  }, [courseId, t]);

  const fetchContents = async () => {
    setLoadingContents(true);
    try {
      const { data } = await api.get(`/content/course/${courseId}`);
      setContents(data);
    } catch {
      message.error(t('Could not load course content'));
    } finally {
      setLoadingContents(false);
    }
  };

  // 3️⃣ Upload new content
  const onFinish = async values => {
    if (loadingProfile) {
      return message.warning(t('Still loading your profile…'));
    }
    if (!instructorId) {
      return message.error(t('Cannot identify you — please log in again'));
    }

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
      message.success(t('Content uploaded!'));
      form.resetFields();
      fetchContents();
    } catch (err) {
      message.error(err.response?.data || t('Upload failed'));
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
      message.error(t('Download failed'));
    }
  };

  // 5️⃣ Delete
  const handleDelete = async id => {
    try {
      await api.delete(`/content/${id}`);
      message.success(t('Content deleted'));
      fetchContents();
    } catch {
      message.error(t('Delete failed'));
    }
  };

  // ✏️ Open Edit modal
  const openEdit = item => {
    setEditingItem(item);
    editForm.setFieldsValue({
      title: item.title,
      description: item.description,
      files: []
    });
    setEditVisible(true);
  };

  // ✏️ Submit Edit
  const handleEdit = async values => {
    const fd = new FormData();
    fd.append('title', values.title);
    if (values.description) fd.append('description', values.description);
    if (values.files?.[0]) {
      fd.append('files', values.files[0].originFileObj);
    }

    setUploading(true);
    try {
      await api.put(`/content/${editingItem.id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.success(t('Content updated'));
      setEditVisible(false);
      fetchContents();
    } catch {
      message.error(t('Update failed'));
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
        <Col><h1>{t('Upload Course Content')}</h1></Col>
      </Row>

      {/* Upload form */}
      <Card title={t('New Content')}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="title"
            label={t('Title')}
            rules={[{ required: true, message: t('Please enter a title') }]}
          >
            <Input placeholder={t('e.g. Week 3 Slides')} />
          </Form.Item>

          <Form.Item name="description" label={t('Description')}>
            <Input.TextArea rows={3} placeholder={t('Optional description…')} />
          </Form.Item>

          <Form.Item
            name="files"
            label={t('File')}
            valuePropName="fileList"
            getValueFromEvent={({ fileList }) => fileList}
            rules={[{ required: true, message: t('Please select a file') }]}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>{t('Select File')}</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={uploading} block>
              {t('Upload')}
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Existing list */}
      <Card
        title={t('Existing Content')}
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
                  {t('Download')}
                </Button>,
                <Button
                  key="edit"
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => openEdit(item)}
                >
                  {t('Edit')}
                </Button>,
                <Popconfirm
                  key="delete"
                  title={t('Delete this content?')}
                  onConfirm={() => handleDelete(item.id)}
                  okText={t('Yes')}
                  cancelText={t('No')}
                >
                  <Button type="link" danger icon={<DeleteOutlined />}>
                    {t('Delete')}
                  </Button>
                </Popconfirm>,
                <Link key="view" to={`/instructor/courses/${courseId}`}>
                  {t('View in Course')}
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
        title={t('Edit Content')}
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        okText={t('Save')}
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
            label={t('Title')}
            rules={[{ required: true, message: t('Please enter a title') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label={t('Description')}>
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="files"
            label={t('Replace File')}
            valuePropName="fileList"
            getValueFromEvent={({ fileList }) => fileList}
          >
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>{t('Choose New File')}</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
