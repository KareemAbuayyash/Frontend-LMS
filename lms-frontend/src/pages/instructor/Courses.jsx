// src/pages/instructor/InstructorCourses.jsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import './Courses.css';

export default function InstructorCourses() {
  const { t } = useTranslation();
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
      console.error(t('Error fetching courses'), error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('Course Name'),
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: t('Course ID'),
      dataIndex: 'courseId',
      key: 'courseId',
    },
    {
      title: t('Enrolled Students'),
      dataIndex: 'enrollmentCount',
      key: 'enrollmentCount',
    },
    {
      title: t('Actions'),
      key: 'actions',
      render: (_, course) => (
        <Link to={`/instructor/courses/${course.courseId}/content`}>
          <Button type="link">{t('Manage Content')}</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="instructor-courses">
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h1>{t('My Courses')}</h1>
        </Col>
      </Row>
      <Card>
        <Table
          columns={columns}
          dataSource={courses}
          loading={loading}
          rowKey="courseId"
          locale={{ emptyText: t('No courses found') }}
        />
      </Card>
    </div>
  );
}
