import React from 'react';
import InstructorSidebar from '../../Sidebar/InstructorSidebar';
import { Card, Row, Col, Statistic } from 'antd';
import {
  BookOutlined,
  TeamOutlined,
  FileTextOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const InstructorDashboard = () => {
  return (
    <div className="instructor-layout">
      <InstructorSidebar />
      <div className="instructor-content">
        <h1>Instructor Dashboard</h1>
        
        <Row gutter={[16, 16]} className="dashboard-stats">
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Courses"
                value={5}
                prefix={<BookOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Total Students"
                value={120}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Pending Submissions"
                value={15}
                prefix={<FileTextOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Completed Assignments"
                value={85}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} className="dashboard-content">
          <Col xs={24} lg={12}>
            <Card title="Recent Submissions">
              {/* Add recent submissions list here */}
              <p>No recent submissions</p>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Course Overview">
              {/* Add course overview here */}
              <p>No courses available</p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default InstructorDashboard; 