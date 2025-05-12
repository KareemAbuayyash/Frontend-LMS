import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';

export default function StudentCourseDetails() {
  const { courseId } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [assignmentsRes, quizzesRes] = await Promise.all([
          api.get(`/assignments/course/${courseId}`),
          api.get(`/quizzes/course/${courseId}`)
        ]);
        setAssignments(assignmentsRes.data);
        setQuizzes(quizzesRes.data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId]);

  return (
    <div>
      <h1>Course Details</h1>
      {loading ? <p>Loading...</p> : (
        <>
          <h2>Assignments</h2>
          <ul>
            {assignments.map(a => (
              <li key={a.id}>{a.title} (Due: {new Date(a.dueDate).toLocaleDateString()})</li>
            ))}
          </ul>
          <h2>Quizzes</h2>
          <ul>
            {quizzes.map(q => (
              <li key={q.id}>{q.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
