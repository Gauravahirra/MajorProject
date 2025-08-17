import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const TeacherExamSubmissionsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExam, setSelectedExam] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const res = await api.get('/exam/teacher');
        setExams(res.data);
      } catch (err) {
        setError('Failed to load exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const fetchSubmissions = async (examId) => {
    setLoadingSubs(true);
    setSelectedExam(examId);
    setSelectedSubmission(null);
    try {
      const res = await api.get(`/exam/${examId}/submissions`);
      setSubmissions(res.data);
    } catch {
      setSubmissions([]);
    } finally {
      setLoadingSubs(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Exam Submissions</h2>
      {loading ? (
        <div>Loading exams...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <div>
          <h4>Your Exams</h4>
          <ul className="list-group mb-4">
            {exams.map((exam) => (
              <li key={exam.id} className={`list-group-item d-flex justify-content-between align-items-center${selectedExam === exam.id ? ' active' : ''}`}>
                <span>
                  <b>{exam.title}</b> ({exam.subject}) — {exam.startTimeIST || exam.startTime}
                </span>
                <button className="btn btn-sm btn-outline-primary" onClick={() => fetchSubmissions(exam.id)}>
                  View Submissions
                </button>
              </li>
            ))}
          </ul>
          {selectedExam && (
            <div>
              <h5>Submissions for Exam ID: {selectedExam}</h5>
              {loadingSubs ? (
                <div>Loading submissions...</div>
              ) : submissions.length === 0 ? (
                <div className="alert alert-info">No submissions yet.</div>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Score</th>
                      <th>Submitted At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((sub) => (
                      <tr key={sub.id}>
                        <td>{sub.studentName}</td>
                        <td>{sub.score} / {sub.maxScore}</td>
                        <td>{new Date(sub.submittedAt).toLocaleString()}</td>
                        <td>
                          <button className="btn btn-sm btn-info" onClick={() => setSelectedSubmission(sub)}>
                            View Answers
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {selectedSubmission && (
                <div className="card mt-3">
                  <div className="card-body">
                    <h6>Answers for {selectedSubmission.studentName}</h6>
                    <ul className="list-group">
                      {selectedSubmission.answers.map((a) => (
                        <li key={a.questionId} className="list-group-item">
                          <div><b>Q:</b> {a.questionText}</div>
                          <div>
                            <b>Student Answer:</b> {a.selectedAnswer || <span className="text-danger">Not answered</span>}<br/>
                            <b>Correct Answer:</b> {a.correctAnswer}
                            {a.isCorrect ? <span className="badge bg-success ms-2">Correct</span> : <span className="badge bg-danger ms-2">Wrong</span>}
                          </div>
                          {a.explanation && <div className="text-muted small">Explanation: {a.explanation}</div>}
                        </li>
                      ))}
                    </ul>
                    <button className="btn btn-secondary mt-2" onClick={() => setSelectedSubmission(null)}>Close</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherExamSubmissionsPage;
