import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const ExamListPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const res = await api.get('/exam/student');
        setExams(res.data);
      } catch (err) {
        setError('Failed to load exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  return (
    <div>
      <h2>Available Exams</h2>
      {loading ? (
        <div>Loading exams...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : exams.length === 0 ? (
        <div className="alert alert-info">No exams available.</div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Title</th>
              <th>Subject</th>
              <th>Start Time (IST)</th>
              <th>Duration (min)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <tr key={exam.id}>
                <td>{exam.title}</td>
                <td>{exam.subject}</td>
                <td>{exam.startTimeIST || exam.startTime}</td>
                <td>{exam.durationMinutes}</td>
                <td>
                  {exam.hasSubmitted ? (
                    <span className="badge bg-success">Submitted</span>
                  ) : exam.hasEnded ? (
                    <span className="badge bg-secondary">Ended</span>
                  ) : exam.isLive ? (
                    <span className="badge bg-primary">Live</span>
                  ) : (
                    <span className="badge bg-warning text-dark">Upcoming</span>
                  )}
                </td>
                <td>
                  {exam.isLive && !exam.hasSubmitted ? (
                    <button className="btn btn-sm btn-success" onClick={() => navigate(`/student/exam/${exam.id}`)}>
                      Start Exam
                    </button>
                  ) : exam.hasSubmitted ? (
                    <span className="text-success">Done</span>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ExamListPage;