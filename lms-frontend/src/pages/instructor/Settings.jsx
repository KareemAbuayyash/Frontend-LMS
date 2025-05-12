import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Switch, Select, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import './Settings.css';

const { Option } = Select;

const InstructorSettings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: true,
      submissions: true,
      messages: true
    },
    preferences: {
      language: 'en',
      timezone: 'UTC',
      theme: 'light'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/instructor/settings');
      setSettings(response.data);
      form.setFieldsValue(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await api.put('/instructor/settings', values);
      message.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="instructor-settings">
      <h1>Settings</h1>

      <div className="settings-container">
        <Card title="Profile Information" className="settings-card">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={settings}
          >
            <Form.Item
              name={['profile', 'name']}
              label="Full Name"
              rules={[{ required: true }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
            </Form.Item>

            <Form.Item
              name={['profile', 'email']}
              label="Email"
              rules={[
                { required: true },
                { type: 'email' }
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              name={['profile', 'password']}
              label="Password"
              rules={[{ min: 6 }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter new password"
              />
            </Form.Item>

            <Form.Item
              name={['profile', 'confirmPassword']}
              label="Confirm Password"
              dependencies={['profile', 'password']}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue(['profile', 'password']) === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Confirm new password"
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card title="Notification Settings" className="settings-card">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={settings}
          >
            <Form.Item
              name={['notifications', 'email']}
              label="Email Notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name={['notifications', 'browser']}
              label="Browser Notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name={['notifications', 'submissions']}
              label="New Submission Alerts"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name={['notifications', 'messages']}
              label="Message Notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Card>

        <Card title="Preferences" className="settings-card">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={settings}
          >
            <Form.Item
              name={['preferences', 'language']}
              label="Language"
            >
              <Select>
                <Option value="en">English</Option>
                <Option value="es">Spanish</Option>
                <Option value="fr">French</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name={['preferences', 'timezone']}
              label="Timezone"
            >
              <Select>
                <Option value="UTC">UTC</Option>
                <Option value="EST">EST</Option>
                <Option value="PST">PST</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name={['preferences', 'theme']}
              label="Theme"
            >
              <Select>
                <Option value="light">Light</Option>
                <Option value="dark">Dark</Option>
                <Option value="system">System</Option>
              </Select>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default InstructorSettings; 