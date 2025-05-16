import React, { useState, useEffect } from 'react';
import { Card, Table, Button } from 'antd';
import { Link } from 'react-router-dom';
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
      render: (_, course) => (
        <Link to={`/instructor/courses/${course.courseId}/content`}>
          <Button type="link">Manage Content</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="instructor-courses">
      <div className="courses-header">
        <h1>My Courses</h1>
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
