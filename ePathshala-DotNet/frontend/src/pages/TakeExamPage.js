import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const TakeExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const timerRef = useRef();

  // Fetch exam details
  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      try {
        const res = await api.post(`/exam/${id}/start`);
        setExam(res.data);
        setTimer(res.data.durationMinutes * 60); // seconds
      } catch (err) {
        setError(err.response?.data || 'Failed to load exam');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
    // eslint-disable-next-line
  }, [id]);

  // Countdown timer
  useEffect(() => {
    if (!exam || result) return;
    if (timer <= 0) {
      handleSubmit(true);
      return;
    }
    timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line
  }, [timer, exam, result]);

  const handleChange = (qid, value) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = async (isAuto = false) => {
    if (submitting || result) return;
    setSubmitting(true);
    try {
      const payload = {
        examId: exam.id,
        answers: exam.questions.map((q) => ({
          questionId: q.id,
          selectedAnswer: answers[q.id] || ''
        }))
      };
      const res = await api.post('/exam/submit', payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to submit exam');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div>Loading exam...</div>;
  if (error) return <div className="alert alert-danger">{typeof error === 'string' ? error : JSON.stringify(error)}</div>;
  if (!exam) return null;

  if (result) {
    return (
      <div className="container mt-4">
        <h2>Exam Submitted!</h2>
        <div className="alert alert-success">
          You scored <b>{result.score}</b> out of <b>{result.maxScore}</b> ({result.percentage.toFixed(2)}%)
        </div>
        <h4>Review Answers</h4>
        <ul className="list-group">
          {result.answers.map((a) => (
            <li key={a.questionId} className="list-group-item">
              <div><b>Q:</b> {a.questionText}</div>
              <div>
                <b>Your Answer:</b> {a.selectedAnswer || <span className="text-danger">Not answered</span>}<br/>
                <b>Correct Answer:</b> {a.correctAnswer}
                {a.isCorrect ? <span className="badge bg-success ms-2">Correct</span> : <span className="badge bg-danger ms-2">Wrong</span>}
              </div>
              {a.explanation && <div className="text-muted small">Explanation: {a.explanation}</div>}
            </li>
          ))}
        </ul>
        <button className="btn btn-primary mt-3" onClick={() => navigate('/student/exams')}>Back to Exams</button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>{exam.title}</h2>
      <div><b>Subject:</b> {exam.subject}</div>
      <div><b>Start Time (IST):</b> {exam.startTimeIST || exam.startTime}</div>
      <div><b>Duration:</b> {exam.durationMinutes} min</div>
      <div className="alert alert-info mt-2">
        <b>Time Left:</b> {formatTime(timer)}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit(false); }}>
        {exam.questions.map((q, idx) => (
          <div key={q.id} className="mb-4">
            <div><b>Q{idx + 1}:</b> {q.questionText}</div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name={`q${q.id}`} value="A" checked={answers[q.id] === 'A'} onChange={() => handleChange(q.id, 'A')} id={`q${q.id}A`} />
              <label className="form-check-label" htmlFor={`q${q.id}A`}>{q.optionA}</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name={`q${q.id}`} value="B" checked={answers[q.id] === 'B'} onChange={() => handleChange(q.id, 'B')} id={`q${q.id}B`} />
              <label className="form-check-label" htmlFor={`q${q.id}B`}>{q.optionB}</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name={`q${q.id}`} value="C" checked={answers[q.id] === 'C'} onChange={() => handleChange(q.id, 'C')} id={`q${q.id}C`} />
              <label className="form-check-label" htmlFor={`q${q.id}C`}>{q.optionC}</label>
            </div>
            <div className="form-check">
              <input className="form-check-input" type="radio" name={`q${q.id}`} value="D" checked={answers[q.id] === 'D'} onChange={() => handleChange(q.id, 'D')} id={`q${q.id}D`} />
              <label className="form-check-label" htmlFor={`q${q.id}D`}>{q.optionD}</label>
            </div>
          </div>
        ))}
        <button className="btn btn-success" type="submit" disabled={submitting}>Submit Exam</button>
      </form>
    </div>
  );
};

export default TakeExamPage;