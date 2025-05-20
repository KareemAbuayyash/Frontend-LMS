// src/pages/instructor/InstructorQuizzes.jsx
import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, Button, Table, Select, Space,
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

  // 1️⃣ Load instructor’s courses
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

  // 3️⃣ Create or update quiz
  const onFinish = async values => {
    setSubmitting(true);
    const payload = {
      title: values.title,
      pageSize: values.pageSize,
      navigationMode: values.navigationMode,
      questions: values.questions.map(q => ({
        text: q.text,
        questionType: q.questionType,
        options: q.questionType === 'TRUE_FALSE'
          ? ['True','False']
          : q.options || [],
        correctAnswer:
          q.questionType === 'MULTIPLE_CHOICE_MULTIPLE'
            ? q.correctAnswers.join(',')
            : q.correctAnswer,
        weight: q.weight
      }))
    };

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
    } catch (e) {
      message.error(e.response?.data?.message || 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  // ◀️ Start editing
  const startEdit = quiz => {
    setEditingQuiz(quiz);
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

  // Table columns
  const columns = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Questions',
      dataIndex: 'questions',
      key: 'count',
      render: qs => qs.length
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
          />
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => startEdit(q)}
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
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="instructor-quizzes">
      {/* Heading */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Title level={2}>
            {editingQuiz ? 'Edit Quiz' : 'Create Quiz'}
          </Title>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* ▶️ Form */}
        <Col xs={24} lg={10}>
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
              <Form.Item
                label="Course"
                required
              >
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
              {editingQuiz && (
                <Form.Item>
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={() => {
                      setEditingQuiz(null);
                      form.resetFields();
                    }}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              )}

              {selectedCourse && (
                <>
                  <Form.Item
                    name="title"
                    label="Quiz Title"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="e.g. Midterm Review" />
                  </Form.Item>

                  <Form.Item
                    name="pageSize"
                    label="Questions per Page"
                    rules={[{ required: true, type:'number', min:1 }]}
                  >
                    <InputNumber min={1} style={{ width:'100%' }} />
                  </Form.Item>

                  <Form.Item
                    name="navigationMode"
                    label="Navigation Mode"
                    rules={[{ required: true }]}
                  >
                    <Select>
                      <Option value="FREE">Free</Option>
                      <Option value="LINEAR">Linear</Option>
                    </Select>
                  </Form.Item>

                  <Divider>Questions</Divider>
                  <Form.List name="questions">
                    {(fields, { add, remove }) => (
                      <>
                        {fields.map(({ key, name, fieldKey, ...rest }) => (
                          <Card
                            key={key}
                            size="small"
                            title={`Question ${name + 1}`}
                            className="question-block"
                          >
                            <Form.Item
                              {...rest}
                              name={[name, 'text']}
                              fieldKey={[fieldKey, 'text']}
                              rules={[{ required: true, message: 'Enter question text' }]}
                            >
                              <Input placeholder="Question text" />
                            </Form.Item>

                            <Form.Item
                              {...rest}
                              name={[name, 'questionType']}
                              fieldKey={[fieldKey, 'questionType']}
                              rules={[{ required: true }]}
                            >
                              <Select placeholder="Type">
                                <Option value="TRUE_FALSE">True/False</Option>
                                <Option value="MULTIPLE_CHOICE_SINGLE">Single Choice</Option>
                                <Option value="MULTIPLE_CHOICE_MULTIPLE">Multiple Choice</Option>
                                <Option value="ESSAY">Essay</Option>
                              </Select>
                            </Form.Item>

                            <Form.Item
                              {...rest}
                              name={[name, 'weight']}
                              fieldKey={[fieldKey, 'weight']}
                              initialValue={1}
                              rules={[{ required: true, type:'number', min:1 }]}
                            >
                              <InputNumber placeholder="Weight" />
                            </Form.Item>

                            <Form.Item shouldUpdate noStyle>
                              {() => {
                                const type = form.getFieldValue(['questions', name, 'questionType']);
                                if (!type) return null;

                                if (type === 'TRUE_FALSE') {
                                  return (
                                    <Form.Item
                                      name={[name,'correctAnswer']}
                                      rules={[{ required:true }]}
                                    >
                                      <Radio.Group>
                                        <Radio value="True">True</Radio>
                                        <Radio value="False">False</Radio>
                                      </Radio.Group>
                                    </Form.Item>
                                  );
                                }

                                const opts = form.getFieldValue(['questions', name, 'options']) || [];
                                return (
                                  <>
                                    <Form.List name={[name, 'options']}>
                                      {(optFields, { add: ao, remove: ro }) => (
                                        <>
                                          {optFields.map(f => (
                                            <Space key={f.key} align="baseline">
                                              <Form.Item {...f} rules={[{ required:true }]}>
                                                <Input placeholder="Option" />
                                              </Form.Item>
                                              <MinusCircleOutlined onClick={() => ro(f.name)} />
                                            </Space>
                                          ))}
                                          <Button
                                            type="dashed"
                                            onClick={() => ao()}
                                            block
                                            icon={<PlusOutlined />}
                                          >
                                            Add Option
                                          </Button>
                                        </>
                                      )}
                                    </Form.List>

                                    {type === 'MULTIPLE_CHOICE_MULTIPLE' ? (
                                      <Form.Item
                                        name={[name,'correctAnswers']}
                                        rules={[{ required:true, type:'array', min:1 }]}
                                      >
                                        <Checkbox.Group
                                          options={opts.map(o=>({ label:o, value:o }))}
                                        />
                                      </Form.Item>
                                    ) : (
                                      <Form.Item
                                        name={[name,'correctAnswer']}
                                        rules={[{ required:true }]}
                                      >
                                        <Select
                                          placeholder="Correct Answer"
                                          options={opts.map(o=>({ label:o, value:o }))}
                                        />
                                      </Form.Item>
                                    )}
                                  </>
                                );
                              }}
                            </Form.Item>

                            <Button
                              icon={<DeleteOutlined />}
                              danger
                              onClick={() => remove(name)}
                            />
                          </Card>
                        ))}

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
                      block
                    >
                      {editingQuiz ? 'Save Changes' : 'Create Quiz'}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form>
          </Card>
        </Col>

        {/* ▶️ Table */}
        <Col xs={24} lg={14}>
          <Card
            title="Existing Quizzes"
            className="table-card"
            loading={loadingQuizzes}
          >
            <Table
              rowKey="id"
              dataSource={quizzes}
              columns={columns}
              bordered
            />
          </Card>
        </Col>
      </Row>

      {/* ▶️ Detail Drawer */}


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
      {/* ——— Header Row: add Total Weight here ——— */}
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

      {/* ——— Questions Section ——— */}
      
      <Divider>Questions</Divider>
      {detailQuiz.questions.map((q, idx) => (
        <Card
          key={idx}
          size="small"
          style={{ marginBottom: 16 }}
          bodyStyle={{ padding: '12px 16px', backgroundColor: 'ghostwhite' }}
        >
          <Typography.Title level={5}>
            Q{idx + 1}. {q.text}
          </Typography.Title>

          {/* meta: type, #options, weight */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: 8 }}>
            <Typography.Text type="secondary">
              Type: {q.questionType}
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
          <Typography.Text strong>
            Answer{q.questionType === 'MULTIPLE_CHOICE_MULTIPLE' ? 's' : ''}:
          </Typography.Text>{' '}
          <Typography.Text>{q.correctAnswer}</Typography.Text>
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
