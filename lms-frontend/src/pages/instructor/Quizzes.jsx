// src/pages/instructor/Quizzes.jsx
import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  Space,
  Divider,
  message,
  Radio,
  Checkbox,
  InputNumber,
  Typography
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
      .catch(err => console.error('Error fetching courses:', err))
      .finally(() => setLoadingCourses(false));
  }, []);

  const onFinish = async values => {
    const { courseId, title, questions } = values;

    // Build payload so that TRUE_FALSE questions always include ["True","False"]
    const payloadQuestions = questions.map(q => {
      if (q.questionType === 'TRUE_FALSE') {
        return {
          text: q.text,
          questionType: q.questionType,
          options: ['True', 'False'],
          correctAnswer: q.correctAnswer,
          weight: q.weight
        };
      }

      // for all other types options must come from the form
      const opts = q.options || [];
      return {
        text: q.text,
        questionType: q.questionType,
        options: opts,
        correctAnswer:
          q.questionType === 'MULTIPLE_CHOICE_MULTIPLE'
            ? q.correctAnswers.join(',')
            : q.correctAnswer,
        weight: q.weight
      };
    });

    setSubmitting(true);
    try {
      // baseURL is already "/api", so this goes to POST /api/quizzes/course/:courseId
      await api.post(`/quizzes/course/${courseId}`, {
        title,
        questions: payloadQuestions
      });
      message.success('Quiz created!');
      form.resetFields();
    } catch (err) {
      console.error('Failed to create quiz:', err.response || err);
      message.error(
        err.response?.data?.message ||
        'Failed to create quiz (check console for details)'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="instructor-quizzes">
      <Card title={<Title level={3}>Create New Quiz</Title>} className="quiz-card-wrapper">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ questions: [] }}
        >
          <Form.Item
            name="courseId"
            label="Course"
            rules={[{ required: true, message: 'Select a course' }]}
          >
            <Select loading={loadingCourses} placeholder="Select course">
              {courses.map(c => (
                <Option key={c.courseId} value={c.courseId}>
                  {c.courseName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="Quiz Title"
            rules={[{ required: true, message: 'Enter a title' }]}
          >
            <Input placeholder="e.g. Midterm Review" />
          </Form.Item>

          <Divider>Questions</Divider>

          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, idx) => {
                  const { key, name, fieldKey, ...restField } = field;
                  return (
                    <Card
                      key={key}
                      type="inner"
                      size="small"
                      className="question-card"
                      title={`Question ${idx + 1}`}
                    >
                      <Space align="baseline" wrap className="question-space">
                        {/* Question Text */}
                        <Form.Item
                          {...restField}
                          name={[name, 'text']}
                          fieldKey={[fieldKey, 'text']}
                          rules={[{ required: true, message: 'Question text' }]}
                          style={{ flex: 2 }}
                        >
                          <Input placeholder="Question text" />
                        </Form.Item>

                        {/* Question Type */}
                        <Form.Item
                          {...restField}
                          name={[name, 'questionType']}
                          fieldKey={[fieldKey, 'questionType']}
                          rules={[{ required: true, message: 'Select type' }]}
                        >
                          <Select style={{ width: 180 }}>
                            <Option value="TRUE_FALSE">True / False</Option>
                            <Option value="MULTIPLE_CHOICE_SINGLE">Single Choice</Option>
                            <Option value="MULTIPLE_CHOICE_MULTIPLE">Multiple Choice</Option>
                            <Option value="ESSAY">Essay</Option>
                          </Select>
                        </Form.Item>

                        {/* Points (weight) */}
                        <Form.Item
                          {...restField}
                          name={[name, 'weight']}
                          fieldKey={[fieldKey, 'weight']}
                          rules={[{ required: true, message: 'Set points' }]}
                          initialValue={1}
                        >
                          <InputNumber min={1} />
                        </Form.Item>

                        {/* Remove Question */}
                        <Button
                          type="text"
                          danger
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(name)}
                        />

                        {/* Dynamic Correct-Answer / Options */}
                        <Form.Item noStyle shouldUpdate>
                          {() => {
                            const type = form.getFieldValue(['questions', name, 'questionType']);
                            if (!type) return null;

                            // TRUE_FALSE
                            if (type === 'TRUE_FALSE') {
                              return (
                                <Form.Item
                                  {...restField}
                                  name={[name, 'correctAnswer']}
                                  fieldKey={[fieldKey, 'correctAnswer']}
                                  rules={[{ required: true, message: 'Select answer' }]}
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
                              const opts = form.getFieldValue(['questions', name, 'options']) || [];
                              const cbOptions = opts.filter(o => o).map(o => ({ label: o, value: o }));

                              return (
                                <>
                                  <Form.List name={[name, 'options']}>
                                    {(optFields, { add: addOpt, remove: removeOpt }) => (
                                      <div className="options-list">
                                        {optFields.map(opt => {
                                          const { key: k, name: n, fieldKey: fkey, ...rf } = opt;
                                          return (
                                            <Space key={k} align="baseline">
                                              <Form.Item
                                                {...rf}
                                                name={[n]}
                                                fieldKey={[fkey]}
                                                rules={[{ required: true, message: 'Option text' }]}
                                              >
                                                <Input placeholder="Option" />
                                              </Form.Item>
                                              <MinusCircleOutlined onClick={() => removeOpt(n)} />
                                            </Space>
                                          );
                                        })}
                                        <Button
                                          type="dashed"
                                          onClick={() => addOpt()}
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
                                    {...restField}
                                    name={[name, 'correctAnswers']}
                                    fieldKey={[fieldKey, 'correctAnswers']}
                                    rules={[
                                      {
                                        validator: (_, vals) =>
                                          vals && vals.length > 0
                                            ? Promise.resolve()
                                            : Promise.reject(new Error('Select at least one correct answer'))
                                      }
                                    ]}
                                  >
                                    <Checkbox.Group options={cbOptions} />
                                  </Form.Item>
                                </>
                              );
                            }

                            // MULTIPLE_CHOICE_SINGLE
                            if (type === 'MULTIPLE_CHOICE_SINGLE') {
                              const opts = form.getFieldValue(['questions', name, 'options']) || [];
                              const selOpts = opts.filter(o => o).map(o => ({ label: o, value: o }));

                              return (
                                <>
                                  <Form.List name={[name, 'options']}>
                                    {(optFields, { add: addOpt, remove: removeOpt }) => (
                                      <div className="options-list">
                                        {optFields.map(opt => {
                                          const { key: k, name: n, fieldKey: fkey, ...rf } = opt;
                                          return (
                                            <Space key={k} align="baseline">
                                              <Form.Item
                                                {...rf}
                                                name={[n]}
                                                fieldKey={[fkey]}
                                                rules={[{ required: true, message: 'Option text' }]}
                                              >
                                                <Input placeholder="Option" />
                                              </Form.Item>
                                              <MinusCircleOutlined onClick={() => removeOpt(n)} />
                                            </Space>
                                          );
                                        })}
                                        <Button
                                          type="dashed"
                                          onClick={() => addOpt()}
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
                                    {...restField}
                                    name={[name, 'correctAnswer']}
                                    fieldKey={[fieldKey, 'correctAnswer']}
                                    rules={[{ required: true, message: 'Pick correct answer' }]}
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
                                  {...restField}
                                  name={[name, 'correctAnswer']}
                                  fieldKey={[fieldKey, 'correctAnswer']}
                                  rules={[{ required: true, message: 'Enter model answer' }]}
                                >
                                  <Input.TextArea placeholder="Model answer / rubric" autoSize />
                                </Form.Item>
                              );
                            }

                            return null;
                          }}
                        </Form.Item>
                      </Space>
                    </Card>
                  );
                })}

                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Question
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

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
