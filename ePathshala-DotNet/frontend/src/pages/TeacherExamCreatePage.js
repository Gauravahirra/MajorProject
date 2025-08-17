import React, { useState } from 'react';
import api from '../api/axiosConfig';
import { useNavigate } from 'react-router-dom';

const emptyQuestion = {
  questionText: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: '',
  marks: 1,
  questionOrder: 1,
  explanation: ''
};

const TeacherExamCreatePage = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: '',
    class: '',
    startTime: '', // IST
    durationMinutes: 60,
    questions: [ { ...emptyQuestion } ]
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (idx, field, value) => {
    const updated = [...form.questions];
    updated[idx][field] = value;
    setForm({ ...form, questions: updated });
  };

  const addQuestion = () => {
    setForm({ ...form, questions: [...form.questions, { ...emptyQuestion, questionOrder: form.questions.length + 1 }] });
  };

  const removeQuestion = (idx) => {
    if (form.questions.length === 1) return;
    const updated = form.questions.filter((_, i) => i !== idx);
    setForm({ ...form, questions: updated.map((q, i) => ({ ...q, questionOrder: i + 1 })) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setError('');
    try {
      // Send as IST string, backend expects IST
      await api.post('/exam', form);
      setMessage('Exam created successfully!');
      setTimeout(() => navigate('/teacher/exams'), 1200);
    } catch (err) {
      setError(err.response?.data || 'Failed to create exam');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mt-4 mb-2">
      <h2>Create New Exam</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{typeof error === 'string' ? error : JSON.stringify(error)}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="form-label">Title</label>
          <input className="form-control" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" value={form.description} onChange={handleChange} rows="2" />
        </div>
        <div className="mb-2">
          <label className="form-label">Subject</label>
          <input className="form-control" name="subject" value={form.subject} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Class</label>
          <input className="form-control" name="class" value={form.class} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Start Time (IST)</label>
          <input type="datetime-local" className="form-control" name="startTime" value={form.startTime} onChange={handleChange} required />
        </div>
        <div className="mb-2">
          <label className="form-label">Duration (minutes)</label>
          <input type="number" className="form-control" name="durationMinutes" value={form.durationMinutes} onChange={handleChange} min={1} max={300} required />
        </div>
        <hr />
        <h5>Questions</h5>
        {form.questions.map((q, idx) => (
          <div key={idx} className="border rounded p-3 mb-3 bg-light">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <b>Question {idx + 1}</b>
              {form.questions.length > 1 && (
                <button type="button" className="btn btn-sm btn-danger" onClick={() => removeQuestion(idx)}>Remove</button>
              )}
            </div>
            <div className="mb-2">
              <label className="form-label">Question Text</label>
              <input className="form-control" value={q.questionText} onChange={e => handleQuestionChange(idx, 'questionText', e.target.value)} required />
            </div>
            <div className="row">
              <div className="col-md-6 mb-2">
                <label className="form-label">Option A</label>
                <input className="form-control" value={q.optionA} onChange={e => handleQuestionChange(idx, 'optionA', e.target.value)} required />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Option B</label>
                <input className="form-control" value={q.optionB} onChange={e => handleQuestionChange(idx, 'optionB', e.target.value)} required />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Option C</label>
                <input className="form-control" value={q.optionC} onChange={e => handleQuestionChange(idx, 'optionC', e.target.value)} required />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Option D</label>
                <input className="form-control" value={q.optionD} onChange={e => handleQuestionChange(idx, 'optionD', e.target.value)} required />
              </div>
            </div>
            <div className="mb-2">
              <label className="form-label">Correct Answer</label>
              <select className="form-select" value={q.correctAnswer} onChange={e => handleQuestionChange(idx, 'correctAnswer', e.target.value)} required>
                <option value="">Select</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="form-label">Marks</label>
              <input type="number" className="form-control" value={q.marks} min={1} max={10} onChange={e => handleQuestionChange(idx, 'marks', e.target.value)} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Explanation (optional)</label>
              <input className="form-control" value={q.explanation} onChange={e => handleQuestionChange(idx, 'explanation', e.target.value)} />
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary mb-3" onClick={addQuestion}>Add Question</button>
        <br />
        <button className="btn btn-primary" type="submit" disabled={submitting}>Create Exam</button>
      </form>
    </div>
  );
};

export default TeacherExamCreatePage;
