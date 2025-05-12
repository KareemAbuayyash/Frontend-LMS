import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Statistic, Progress, List } from 'antd';
import api from '../../api/axios';
import './Analytics.css';

const { Option } = Select;

const InstructorAnalytics = () => {
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    averageGrade: 0,
    completionRate: 0,
    activeStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
    fetchAnalytics();
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      const response = await api.get('/instructor/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const url = selectedCourse === 'all' 
        ? '/instructor/analytics'
        : `/instructor/analytics?courseId=${selectedCourse}`;
      const response = await api.get(url);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for grade distribution
  const gradeDistribution = [
    { grade: 'A', count: 15 },
    { grade: 'B', count: 25 },
    { grade: 'C', count: 20 },
    { grade: 'D', count: 10 },
    { grade: 'F', count: 5 },
  ];

  // Sample data for weekly progress
  const weeklyProgress = [
    { week: 'Week 1', progress: 65 },
    { week: 'Week 2', progress: 70 },
    { week: 'Week 3', progress: 75 },
    { week: 'Week 4', progress: 80 },
    { week: 'Week 5', progress: 85 },
  ];

  return (
    <div className="instructor-analytics">
      <div className="analytics-header">
        <h1>Analytics</h1>
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

      <Row gutter={[16, 16]} className="analytics-stats">
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={analytics.totalStudents}
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Grade"
              value={analytics.averageGrade}
              suffix="%"
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={analytics.completionRate}
              suffix="%"
              loading={loading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Students"
              value={analytics.activeStudents}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="analytics-charts">
        <Col xs={24} lg={12}>
          <Card title="Grade Distribution">
            <List
              dataSource={gradeDistribution}
              renderItem={item => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>Grade {item.grade}</span>
                      <span>{item.count} students</span>
                    </div>
                    <Progress 
                      percent={Math.round((item.count / gradeDistribution.reduce((acc, curr) => acc + curr.count, 0)) * 100)} 
                      showInfo={false}
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Weekly Progress">
            <List
              dataSource={weeklyProgress}
              renderItem={item => (
                <List.Item>
                  <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span>{item.week}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress percent={item.progress} showInfo={false} />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default InstructorAnalytics; 