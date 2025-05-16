import React, { useState, useEffect } from 'react';
import {
  Card, Form, Input, Button, Select, Space,
  Divider, message, Radio, Checkbox, InputNumber, Typography
} from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import './Quizzes.css';

const { Option } = Select;
const { Title } = Typography;

export default function InstructorQuizzes() {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    api.get('/instructors/courses')
      .then(res => setCourses(res.data))
      .catch(() => message.error('Failed to load courses'))
      .finally(() => setLoadingCourses(false));
  }, []);

  const onFinish = async values => {
    const { courseId, title, pageSize, navigationMode, questions } = values;
    const payloadQuestions = questions.map(q => ({
      text: q.text,
      questionType: q.questionType,
      options: q.questionType === 'TRUE_FALSE'
        ? ['True','False']
        : q.options,
      correctAnswer:
        q.questionType === 'MULTIPLE_CHOICE_MULTIPLE'
          ? q.correctAnswers.join(',')
          : q.correctAnswer,
      weight: q.weight
    }));

    setSubmitting(true);
    try {
      await api.post(`/quizzes/course/${courseId}`, {
        title, pageSize, navigationMode, questions: payloadQuestions
      });
      message.success('Quiz created!');
      form.resetFields();
    } catch (err) {
      message.error(err.response?.data?.message || 'Create failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="instructor-quizzes">
      <Card title={<Title level={3}>Create New Quiz</Title>}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ questions: [], pageSize: 1, navigationMode: 'FREE' }}
        >
          {/* Course select */}
          <Form.Item name="courseId" label="Course" rules={[{ required: true }]}>
            <Select loading={loadingCourses} placeholder="Select course">
              {courses.map(c =>
                <Option key={c.courseId} value={c.courseId}>
                  {c.courseName}
                </Option>
              )}
            </Select>
          </Form.Item>

          {/* Title */}
          <Form.Item name="title" label="Quiz Title" rules={[{ required: true }]}>
            <Input placeholder="e.g. Midterm Review" />
          </Form.Item>

          {/* pageSize + navMode */}
          <Form.Item
            name="pageSize"
            label="Questions per Page"
            rules={[{ required: true, type:'number', min:1 }]}
          >
            <InputNumber min={1} style={{ width: 120 }} />
          </Form.Item>
          <Form.Item
            name="navigationMode"
            label="Navigation Mode"
            rules={[{ required: true }]}
          >
            <Select style={{ width: 200 }}>
              <Option value="FREE">Free (back & forth)</Option>
              <Option value="LINEAR">Linear (no back)</Option>
            </Select>
          </Form.Item>

          <Divider>Questions</Divider>
          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }, idx) => (
                  <Card
                    key={key}
                    type="inner"
                    size="small"
                    title={`Question ${idx+1}`}
                    className="question-card"
                  >
                    <Space align="baseline" wrap className="question-space">
                      {/* Text */}
                      <Form.Item
                        name={[name,'text']}
                        fieldKey={[fieldKey,'text']}
                        {...restField}
                        rules={[{ required: true, message:'Enter text' }]}
                        style={{ flex: 2 }}
                      >
                        <Input placeholder="Question text" />
                      </Form.Item>

                      {/* Type */}
                      <Form.Item
                        name={[name,'questionType']}
                        fieldKey={[fieldKey,'questionType']}
                        {...restField}
                        rules={[{ required: true }]}
                      >
                        <Select style={{ width:180 }}>
                          <Option value="TRUE_FALSE">True / False</Option>
                          <Option value="MULTIPLE_CHOICE_SINGLE">Single Choice</Option>
                          <Option value="MULTIPLE_CHOICE_MULTIPLE">Multiple Choice</Option>
                          <Option value="ESSAY">Essay</Option>
                        </Select>
                      </Form.Item>

                      {/* Weight */}
                      <Form.Item
                        name={[name,'weight']}
                        fieldKey={[fieldKey,'weight']}
                        {...restField}
                        rules={[{ required: true, type:'number', min:1 }]}
                        initialValue={1}
                      >
                        <InputNumber min={1} />
                      </Form.Item>

                      {/* Remove */}
                      <MinusCircleOutlined
                        onClick={() => remove(name)}
                        style={{ color:'red', fontSize:'1.2rem' }}
                      />

                      {/* Dynamic answer inputs */}
                      <Form.Item noStyle shouldUpdate>
                        {() => {
                          const type = form.getFieldValue(['questions',name,'questionType']);
                          if (!type) return null;

                          // TRUE_FALSE
                          if (type === 'TRUE_FALSE') {
                            return (
                              <Form.Item
                                name={[name,'correctAnswer']}
                                fieldKey={[fieldKey,'correctAnswer']}
                                {...restField}
                                rules={[{ required:true }]}
                              >
                                <Radio.Group>
                                  <Radio value="True">True</Radio>
                                  <Radio value="False">False</Radio>
                                </Radio.Group>
                              </Form.Item>
                            );
                          }

                          // MULTIPLE_CHOICE_MULTIPLE
                          if (type === 'MULTIPLE_CHOICE_MULTIPLE') {
                            const opts = form.getFieldValue(['questions',name,'options']) || [];
                            const cbOpts = opts.filter(o => o).map(o => ({ label: o, value: o }));
                            return (
                              <>
                                <Form.List name={[name,'options']}>
                                  {(optFields, { add: ao, remove: ro }) => (
                                    <div className="options-list">
                                      {optFields.map(opt => (
                                        <Space key={opt.key} align="baseline">
                                          <Form.Item
                                            {...opt}
                                            rules={[{ required:true }]}
                                          >
                                            <Input placeholder="Option" />
                                          </Form.Item>
                                          <MinusCircleOutlined onClick={() => ro(opt.name)} />
                                        </Space>
                                      ))}
                                      <Button
                                        type="dashed"
                                        onClick={() => ao()}
                                        block
                                        icon={<PlusOutlined />}
                                        size="small"
                                      >
                                        Add Option
                                      </Button>
                                    </div>
                                  )}
                                </Form.List>
                                <Form.Item
                                  name={[name,'correctAnswers']}
                                  fieldKey={[fieldKey,'correctAnswers']}
                                  {...restField}
                                  rules={[{ required:true, type:'array', min:1 }]}
                                >
                                  <Checkbox.Group options={cbOpts} />
                                </Form.Item>
                              </>
                            );
                          }

                          // MULTIPLE_CHOICE_SINGLE
                          if (type === 'MULTIPLE_CHOICE_SINGLE') {
                            const opts = form.getFieldValue(['questions',name,'options']) || [];
                            const selOpts = opts.filter(o => o).map(o => ({ label: o, value: o }));
                            return (
                              <>
                                <Form.List name={[name,'options']}>
                                  {(optFields, { add: ao, remove: ro }) => (
                                    <div className="options-list">
                                      {optFields.map(opt => (
                                        <Space key={opt.key} align="baseline">
                                          <Form.Item
                                            {...opt}
                                            rules={[{ required:true }]}
                                          >
                                            <Input placeholder="Option" />
                                          </Form.Item>
                                          <MinusCircleOutlined onClick={() => ro(opt.name)} />
                                        </Space>
                                      ))}
                                      <Button
                                        type="dashed"
                                        onClick={() => ao()}
                                        block
                                        icon={<PlusOutlined />}
                                        size="small"
                                      >
                                        Add Option
                                      </Button>
                                    </div>
                                  )}
                                </Form.List>
                                <Form.Item
                                  name={[name,'correctAnswer']}
                                  fieldKey={[fieldKey,'correctAnswer']}
                                  {...restField}
                                  rules={[{ required:true }]}
                                >
                                  <Select placeholder="Pick correct answer" options={selOpts} />
                                </Form.Item>
                              </>
                            );
                          }

                          // ESSAY
                          if (type === 'ESSAY') {
                            return (
                              <Form.Item
                                name={[name,'correctAnswer']}
                                fieldKey={[fieldKey,'correctAnswer']}
                                {...restField}
                                rules={[{ required:true }]}
                              >
                                <Input.TextArea placeholder="Model answer" autoSize />
                              </Form.Item>
                            );
                          }

                          return null;
                        }}
                      </Form.Item>
                    </Space>
                  </Card>
                ))}

                {/* “Add Question” */}
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

          {/* Submit */}
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              Create Quiz
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
