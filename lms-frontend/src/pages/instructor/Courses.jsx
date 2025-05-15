// src/pages/instructor/Courses.jsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import './Courses.css';

const InstructorCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/instructors/me/courses'); 
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Course ID',
      dataIndex: 'courseId',
      key: 'courseId',
    },
    {
      title: 'Enrolled Students',
      dataIndex: 'enrollmentCount',
      key: 'enrollmentCount',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} type="primary" ghost>
            Edit
          </Button>
          <Button icon={<DeleteOutlined />} danger>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="instructor-courses">
      <div className="courses-header">
        <h1>My Courses</h1>
        <Button type="primary" icon={<PlusOutlined />}>
          Create New Course
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={courses}
          loading={loading}
          rowKey="courseId"
        />
      </Card>
    </div>
  );
};

export default InstructorCourses;
