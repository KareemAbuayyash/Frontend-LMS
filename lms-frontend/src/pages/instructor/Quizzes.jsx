// src/pages/instructor/InstructorQuizzes.jsx
import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, Button, Table, Select, Space, Tabs,
  Divider, message, Radio, Checkbox, InputNumber,
  Drawer, Spin, Popconfirm, Row, Col, Typography
} from 'antd';
import {
  PlusOutlined, EditOutlined,
  DeleteOutlined, EyeOutlined,
  ReloadOutlined, MinusCircleOutlined
} from '@ant-design/icons';
import api from '../../api/axios';
import './Quizzes.css';

const { Option } = Select;
const { Title, Paragraph, Text } = Typography;

export default function InstructorQuizzes() {
  const [courses, setCourses]               = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [quizzes, setQuizzes]               = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  const [form]            = Form.useForm();
  const [submitting, setSubmitting]         = useState(false);
  const [editingQuiz, setEditingQuiz]       = useState(null);

  const [drawerVisible, setDrawerVisible]   = useState(false);
  const [detailQuiz, setDetailQuiz]         = useState(null);
  const [loadingDetail, setLoadingDetail]   = useState(false);

  const [activeTab, setActiveTab]           = useState('create');

  // 1️⃣ Load instructor's courses
  useEffect(() => {
    api.get('/instructors/me/courses')
      .then(r => setCourses(r.data))
      .catch(() => message.error('Failed to load courses'))
      .finally(() => setLoadingCourses(false));
  }, []);

  // 2️⃣ Fetch quizzes whenever course changes
  useEffect(() => {
    if (selectedCourse) fetchQuizzes();
  }, [selectedCourse]);

  async function fetchQuizzes() {
    setLoadingQuizzes(true);
    try {
      const { data } = await api.get(`/quizzes/course/${selectedCourse}`);
      setQuizzes(data);
    } catch {
      message.error('Failed to load quizzes');
    } finally {
      setLoadingQuizzes(false);
    }
  }

  // 3️⃣ Create or update quiz - FIXED VERSION
  const onFinish = async values => {
    setSubmitting(true);
    
    // Clean and validate the form data
    const cleanedQuestions = values.questions.map(q => {
      let cleanedOptions = [];
      let cleanedCorrectAnswer = '';

      if (q.questionType === 'TRUE_FALSE') {
        cleanedOptions = ['True', 'False'];
        cleanedCorrectAnswer = q.correctAnswer || '';
      } else if (q.questionType === 'ESSAY') {
        cleanedOptions = [];
        // FIXED: Provide a placeholder value for essay questions instead of empty string
        cleanedCorrectAnswer = 'N/A - Essay Question';
      } else {
        // For multiple choice questions, filter out empty options
        cleanedOptions = (q.options || []).filter(opt => opt && opt.trim() !== '');
        
        if (q.questionType === 'MULTIPLE_CHOICE_MULTIPLE') {
          // Handle multiple correct answers
          const correctAnswers = q.correctAnswers || [];
          cleanedCorrectAnswer = correctAnswers.length > 0 ? correctAnswers.join(',') : '';
        } else {
          // Handle single correct answer
          cleanedCorrectAnswer = q.correctAnswer || '';
        }
      }

      return {
        text: q.text?.trim() || '',
        questionType: q.questionType,
        options: cleanedOptions,
        correctAnswer: cleanedCorrectAnswer,
        weight: Number(q.weight) || 1
      };
    });

    // Validate that all non-essay questions have correct answers
    const invalidQuestions = cleanedQuestions.filter((q, index) => {
      if (q.questionType === 'ESSAY') return false; // Essay questions don't need validation
      if (!q.correctAnswer || q.correctAnswer.trim() === '') {
        console.error(`Question ${index + 1} is missing correct answer:`, q);
        return true;
      }
      return false;
    });

    if (invalidQuestions.length > 0) {
      message.error('Some questions are missing correct answers. Please check all questions.');
      setSubmitting(false);
      return;
    }

    const payload = {
      title: values.title?.trim() || '',
      pageSize: Number(values.pageSize) || 1,
      navigationMode: values.navigationMode || 'FREE',
      questions: cleanedQuestions
    };

    // Debug logging
    console.log('Submitting payload:', JSON.stringify(payload, null, 2));

    try {
      if (editingQuiz) {
        await api.put(`/quizzes/${editingQuiz.id}`, payload);
        message.success('Quiz updated');
      } else {
        await api.post(`/quizzes/course/${selectedCourse}`, payload);
        message.success('Quiz created');
      }
      form.resetFields();
      setEditingQuiz(null);
      fetchQuizzes();
      // Switch to existing quizzes tab after successful creation/edit
      setActiveTab('existing');
    } catch (e) {
      console.error('Quiz submission error:', e.response?.data || e.message);
      message.error(e.response?.data?.message || e.response?.data?.error || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  // ◀️ Start editing
  const startEdit = quiz => {
    setEditingQuiz(quiz);
    setActiveTab('create'); // Switch to create tab when editing
    form.setFieldsValue({
      title: quiz.title,
      pageSize: quiz.pageSize,
      navigationMode: quiz.navigationMode,
      questions: quiz.questions.map(q => ({
        text: q.text,
        questionType: q.questionType,
        options: q.options,
        correctAnswer:
          q.questionType !== 'MULTIPLE_CHOICE_MULTIPLE'
            ? q.correctAnswer
            : undefined,
        correctAnswers:
          q.questionType === 'MULTIPLE_CHOICE_MULTIPLE'
            ? q.correctAnswer.split(',')
            : undefined,
        weight: q.weight
      }))
    });
  };

  // 🗑 Delete
  const deleteQuiz = async id => {
    try {
      await api.delete(`/quizzes/${id}`);
      message.success('Quiz deleted');
      fetchQuizzes();
    } catch {
      message.error('Delete failed');
    }
  };

  // 👁 Show details in drawer
  const showDetail = async id => {
    setDrawerVisible(true);
    setLoadingDetail(true);
    try {
      const { data } = await api.get(`/quizzes/${id}`);
      setDetailQuiz(data);
    } catch {
      message.error('Failed to load details');
    } finally {
      setLoadingDetail(false);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingQuiz(null);
    form.resetFields();
  };

  // Table columns
  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Questions',
      dataIndex: 'questions',
      key: 'count',
      render: qs => qs?.length || 0
    },
    {
      title: 'Total Weight',
      dataIndex: 'questions',
      key: 'weight',
      render: qs => qs?.reduce((sum, q) => sum + (q.weight || 0), 0) || 0
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, q) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            type="link"
            onClick={() => showDetail(q.id)}
            title="View Details"
          />
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => startEdit(q)}
            title="Edit Quiz"
          />
          <Popconfirm
            title="Delete this quiz?"
            onConfirm={() => deleteQuiz(q.id)}
            okText="Yes" cancelText="No"
          >
            <Button
              icon={<DeleteOutlined />}
              type="link"
              danger
              title="Delete Quiz"
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  // Course selection component (shared between tabs)
  const CourseSelector = () => (
    <Form.Item label="Course" required>
      <Select
        loading={loadingCourses}
        placeholder="Select course"
        value={selectedCourse}
        onChange={cid => {
          setSelectedCourse(cid);
          setEditingQuiz(null);
          form.resetFields();
        }}
      >
        {courses.map(c => (
          <Option key={c.courseId} value={c.courseId}>
            {c.courseName}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );

  // Create Quiz Tab Content
  const CreateQuizTab = () => (
    <Row gutter={16}>
      <Col span={24}>
        <Card bordered className="form-card">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              questions: [],
              pageSize: 1,
              navigationMode: 'FREE'
            }}
          >
            <CourseSelector />
            
            {editingQuiz && (
              <Form.Item>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={cancelEdit}
                >
                  Cancel Edit
                </Button>
              </Form.Item>
            )}

            {selectedCourse && (
              <>
                <Form.Item
                  name="title"
                  label="Quiz Title"
                  rules={[{ required: true, message: 'Please enter quiz title' }]}
                >
                  <Input placeholder="e.g. Midterm Review" />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="pageSize"
                      label="Questions per Page"
                      rules={[{ required: true, type:'number', min:1, message: 'Enter valid page size' }]}
                    >
                      <InputNumber min={1} style={{ width:'100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="navigationMode"
                      label="Navigation Mode"
                      rules={[{ required: true, message: 'Select navigation mode' }]}
                    >
                      <Select>
                        <Option value="FREE">Free Navigation</Option>
                        <Option value="LINEAR">Linear Navigation</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Divider>Questions</Divider>
                <Form.List name="questions">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(field => {
                        // FIXED: Extract key and pass it separately to avoid the key prop spreading warning
                        const { key, name, fieldKey, ...restFieldProps } = field;
                        return (
                          <Card
                            key={key}
                            size="small"
                            title={`Question ${name + 1}`}
                            className="question-block"
                            extra={
                              <Button
                                icon={<DeleteOutlined />}
                                type="text"
                                danger
                                size="small"
                                onClick={() => remove(name)}
                              />
                            }
                          >
                            <Form.Item
                              {...restFieldProps}
                              name={[name, 'text']}
                              fieldKey={[fieldKey, 'text']}
                              rules={[{ required: true, message: 'Enter question text' }]}
                            >
                              <Input.TextArea 
                                placeholder="Question text" 
                                rows={2}
                              />
                            </Form.Item>

                            <Row gutter={16}>
                              <Col span={16}>
                                <Form.Item
                                  {...restFieldProps}
                                  name={[name, 'questionType']}
                                  fieldKey={[fieldKey, 'questionType']}
                                  rules={[{ required: true, message: 'Select question type' }]}
                                >
                                  <Select placeholder="Question Type">
                                    <Option value="TRUE_FALSE">True/False</Option>
                                    <Option value="MULTIPLE_CHOICE_SINGLE">Single Choice</Option>
                                    <Option value="MULTIPLE_CHOICE_MULTIPLE">Multiple Choice</Option>
                                    <Option value="ESSAY">Essay</Option>
                                  </Select>
                                </Form.Item>
                              </Col>
                              <Col span={8}>
                                <Form.Item
                                  {...restFieldProps}
                                  name={[name, 'weight']}
                                  fieldKey={[fieldKey, 'weight']}
                                  initialValue={1}
                                  rules={[{ required: true, type:'number', min:1, message: 'Enter weight' }]}
                                >
                                  <InputNumber 
                                    placeholder="Weight" 
                                    style={{ width: '100%' }}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>

                            <Form.Item shouldUpdate noStyle>
                              {() => {
                                const type = form.getFieldValue(['questions', name, 'questionType']);
                                if (!type) return null;

                                if (type === 'TRUE_FALSE') {
                                  return (
                                    <Form.Item
                                      name={[name,'correctAnswer']}
                                      rules={[{ required:true, message: 'Select correct answer' }]}
                                    >
                                      <Radio.Group>
                                        <Radio value="True">True</Radio>
                                        <Radio value="False">False</Radio>
                                      </Radio.Group>
                                    </Form.Item>
                                  );
                                }

                                if (type === 'ESSAY') {
                                  return (
                                    <Typography.Text type="secondary">
                                      Essay questions will be graded manually
                                    </Typography.Text>
                                  );
                                }

                                return (
                                  <>
                                    <Form.List name={[name, 'options']}>
                                      {(optFields, { add: ao, remove: ro }) => (
                                        <>
                                          {optFields.map(f => (
                                            <Space key={f.key} align="baseline" style={{ width: '100%' }}>
                                              <Form.Item 
                                                {...f} 
                                                rules={[{ required:true, message: 'Enter option text' }]}
                                                style={{ flex: 1, marginBottom: 8 }}
                                              >
                                                <Input placeholder={`Option ${f.name + 1}`} />
                                              </Form.Item>
                                              <MinusCircleOutlined 
                                                onClick={() => ro(f.name)}
                                                style={{ color: '#ff4d4f' }}
                                              />
                                            </Space>
                                          ))}
                                          <Button
                                            type="dashed"
                                            onClick={() => ao('')}
                                            block
                                            icon={<PlusOutlined />}
                                            style={{ marginBottom: 16 }}
                                          >
                                            Add Option
                                          </Button>
                                        </>
                                      )}
                                    </Form.List>

                                    <Form.Item shouldUpdate noStyle>
                                      {() => {
                                        const currentOptions = form.getFieldValue(['questions', name, 'options']) || [];
                                        const validOptions = currentOptions.filter(opt => opt && opt.trim() !== '');
                                        
                                        if (validOptions.length === 0) return null;
                                        
                                        return (
                                          <>
                                            {type === 'MULTIPLE_CHOICE_MULTIPLE' ? (
                                              <Form.Item
                                                name={[name,'correctAnswers']}
                                                rules={[{ required:true, type:'array', min:1, message: 'Select correct answers' }]}
                                              >
                                                <Checkbox.Group
                                                  options={validOptions.map(o=>({ label:o, value:o }))}
                                                />
                                              </Form.Item>
                                            ) : (
                                              <Form.Item
                                                name={[name,'correctAnswer']}
                                                rules={[{ required:true, message: 'Select correct answer' }]}
                                              >
                                                <Select
                                                  placeholder="Select correct answer"
                                                  options={validOptions.map(o=>({ label:o, value:o }))}
                                                />
                                              </Form.Item>
                                            )}
                                          </>
                                        );
                                      }}
                                    </Form.Item>
                                  </>
                                );
                              }}
                            </Form.Item>
                          </Card>
                        );
                      })}

                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Question
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    size="large"
                    block
                    onClick={() => {
                      // Validate that we have at least one question
                      const questions = form.getFieldValue('questions') || [];
                      if (questions.length === 0) {
                        message.warning('Please add at least one question');
                        return;
                      }
                      
                      // Check if all questions have valid data
                      const hasInvalidQuestion = questions.some(q => {
                        if (!q || !q.text || !q.questionType) return true;
                        if (q.questionType === 'MULTIPLE_CHOICE_SINGLE' || q.questionType === 'MULTIPLE_CHOICE_MULTIPLE') {
                          const validOptions = (q.options || []).filter(opt => opt && opt.trim() !== '');
                          if (validOptions.length < 2) return true;
                        }
                        return false;
                      });
                      
                      if (hasInvalidQuestion) {
                        message.warning('Please complete all question fields and ensure multiple choice questions have at least 2 options');
                        return;
                      }
                    }}
                  >
                    {editingQuiz ? 'Update Quiz' : 'Create Quiz'}
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
        </Card>
      </Col>
    </Row>
  );

  // Existing Quizzes Tab Content
  const ExistingQuizzesTab = () => (
    <Row gutter={16}>
      <Col span={24}>
        {/* Course Selector for existing quizzes */}
        <Card bordered className="form-card" style={{ marginBottom: 16 }}>
          <Form layout="vertical">
            <CourseSelector />
          </Form>
        </Card>

        <Card
          title={
            <Space>
              <span>Existing Quizzes</span>
              {selectedCourse && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setActiveTab('create')}
                >
                  Create New Quiz
                </Button>
              )}
            </Space>
          }
          className="table-card"
          loading={loadingQuizzes}
        >
          {selectedCourse ? (
            <Table
              rowKey="id"
              dataSource={quizzes}
              columns={columns}
              bordered
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} quizzes`
              }}
              scroll={{ x: 'max-content' }} // 👈 Add this line for responsiveness
            />
          ) : (
            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
              Please select a course to view quizzes
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );

  const tabItems = [
    {
      key: 'create',
      label: editingQuiz ? 'Edit Quiz' : 'Create Quiz',
      children: <CreateQuizTab />
    },
    {
      key: 'existing',
      label: 'Existing Quizzes',
      children: <ExistingQuizzesTab />
    }
  ];

  return (
    <div className="instructor-quizzes">
      <Row style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2}>Quizzes</Title>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />

      {/* Detail Drawer */}
      <Drawer
        width={420}
        className="quiz-detail-drawer"
        title={<Typography.Title level={4}>{detailQuiz?.title}</Typography.Title>}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
      >
        {loadingDetail ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : detailQuiz ? (
          <>
            {/* Header Row */}
            <div className="detail-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Typography.Text>
                <strong>Per Page:</strong> {detailQuiz.pageSize}
              </Typography.Text>
              <Typography.Text>
                <strong>Mode:</strong> {detailQuiz.navigationMode}
              </Typography.Text>
              <Typography.Text>
                <strong>Total Weight:</strong>{' '}
                {detailQuiz.questions.reduce((sum, q) => sum + (q.weight || 0), 0)}
              </Typography.Text>
            </div>

            {/* Questions Section */}
            <Divider>Questions ({detailQuiz.questions.length})</Divider>
            {detailQuiz.questions.map((q, idx) => (
              <Card
                key={idx}
                size="small"
                style={{ marginBottom: 16 }}
                bodyStyle={{ padding: '12px 16px', backgroundColor: '#fafafa' }}
              >
                <Typography.Title level={5}>
                  Q{idx + 1}. {q.text}
                </Typography.Title>

                {/* meta: type, #options, weight */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: 8 }}>
                  <Typography.Text type="secondary">
                    Type: {q.questionType.replace(/_/g, ' ')}
                  </Typography.Text>
                  {q.options?.length > 0 && (
                    <Typography.Text type="secondary">
                      {q.options.length} option{q.options.length > 1 ? 's' : ''}
                    </Typography.Text>
                  )}
                  <Typography.Text type="secondary">
                    Weight: {q.weight}
                  </Typography.Text>
                </div>

                {/* options list */}
                {q.options?.length > 0 && (
                  <>
                    <Typography.Text strong>Options:</Typography.Text>
                    <ul style={{ margin: '4px 0 8px 16px' }}>
                      {q.options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))}
                    </ul>
                  </>
                )}

                {/* answer */}
                {q.questionType !== 'ESSAY' && (
                  <>
                    <Typography.Text strong>
                      Answer{q.questionType === 'MULTIPLE_CHOICE_MULTIPLE' ? 's' : ''}:
                    </Typography.Text>{' '}
                    <Typography.Text>{q.correctAnswer}</Typography.Text>
                  </>
                )}
              </Card>
            ))}
          </>
        ) : (
          <Typography.Text>No details available</Typography.Text>
        )}
      </Drawer>
    </div>
  );
}