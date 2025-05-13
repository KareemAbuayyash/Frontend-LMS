import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

export default function StudentCourseDetails() {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [aRes, qRes] = await Promise.all([
          api.get(`/assignments/course/${courseId}`),
          api.get(`/quizzes/course/${courseId}`)
        ]);
        setAssignments(aRes.data);
        setQuizzes(qRes.data);
      } catch (err) {
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId]);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p className="error">{error}</p>;

  return (
    <div className="course-details">
      <h1>Course Details</h1>

      <section>
        <h2>Assignments</h2>
        {assignments.length === 0
          ? <p>No assignments.</p>
          : <ul>
              {assignments.map(a => (
                <li key={a.id}>
                  {a.title} (Due: {new Date(a.dueDate).toLocaleDateString()})
                </li>
              ))}
            </ul>
        }
      </section>

      <section>
        <h2>Quizzes</h2>
        {quizzes.length === 0
          ? <p>No quizzes.</p>
          : <ul>
              {quizzes.map(q => (
                <li key={q.id}>
                  <Link
                    to={`/student/courses/${courseId}/quizzes/${q.id}`}
                    className="quiz-link"
                  >
                    {q.title}
                  </Link>
                </li>
              ))}
            </ul>
        }
      </section>
    </div>
  );
}
