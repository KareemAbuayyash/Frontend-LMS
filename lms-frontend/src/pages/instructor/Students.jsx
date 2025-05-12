import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Tag, Select, Input } from 'antd';
import { SearchOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import './Students.css';

const { Option } = Select;
const { Search } = Input;

const InstructorStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchStudents();
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/instructor/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const url = selectedCourse === 'all' 
        ? '/instructor/students'
        : `/instructor/students?courseId=${selectedCourse}`;
      const response = await api.get(url);
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchText.toLowerCase()) ||
    student.email.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <UserOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text) => (
        <Space>
          <MailOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Enrolled Courses',
      dataIndex: 'enrolledCourses',
      key: 'enrolledCourses',
      render: (courses) => (
        <Space>
          {courses.map(course => (
            <Tag key={course.id} color="blue">
              {course.name}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Tag color={progress >= 70 ? 'green' : progress >= 40 ? 'orange' : 'red'}>
          {progress}%
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="primary" ghost>
            View Profile
          </Button>
          <Button type="primary">
            Message
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="instructor-students">
      <div className="students-header">
        <h1>Students</h1>
        <div className="students-filters">
          <Search
            placeholder="Search students..."
            allowClear
            onSearch={handleSearch}
            style={{ width: 250 }}
          />
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
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredStudents}
          loading={loading}
          rowKey="id"
        />
      </Card>
    </div>
  );
};

export default InstructorStudents; 