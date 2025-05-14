import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Select } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import './Submissions.css';

const { Option } = Select;

const InstructorSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchCourses();
    fetchSubmissions();
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/instructor/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const url = selectedCourse === 'all' 
        ? '/instructor/submissions'
        : `/instructor/submissions?courseId=${selectedCourse}`;
      const response = await api.get(url);
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
    },
    {
      title: 'Course',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Assignment',
      dataIndex: 'assignmentName',
      key: 'assignmentName',
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'graded' ? 'green' :
          status === 'pending' ? 'orange' :
          'red'
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} type="primary" ghost>
            View
          </Button>
          {record.status === 'pending' && (
            <>
              <Button icon={<CheckOutlined />} type="primary">
                Grade
              </Button>
              <Button icon={<CloseOutlined />} danger>
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="instructor-submissions">
      <div className="submissions-header">
        <h1>Submissions</h1>
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          onChange={setSelectedCourse}
        >
          <Option value="all">All Courses</Option>
          {courses.map(course => (
            <Option key={course.id} value={course.id}>
              {course.name}
            </Option>
          ))}
        </Select>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={submissions}
          loading={loading}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default InstructorSubmissions; 