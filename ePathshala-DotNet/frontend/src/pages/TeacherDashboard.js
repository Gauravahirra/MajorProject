import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { isTokenValid } from '../utils/auth';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Dashboard for teachers.  Supports attendance, marks, assignments,
 * averages and leave approvals.  Leave statuses use colored badges.
 */
const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({ studentId: '', date: '', status: 'Present' });
  const [mark, setMark] = useState({ studentId: '', subject: '', marks: '' });
  const [markUpdate, setMarkUpdate] = useState({ id: '', marks: '' });
  const [assignment, setAssignment] = useState({ title: '', dueDate: '', subject: '', klass: '', file: null });
  const [averageSubject, setAverageSubject] = useState('');
  const [averageResult, setAverageResult] = useState(null);
  const [message, setMessage] = useState('');
  const [marksList, setMarksList] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const statusText = (status) => {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Approved';
      case 2: return 'Rejected';
      default: return status;
    }
  };

  const statusBadgeClass = (status) => {
    switch (status) {
      case 0: return 'badge-status-pending';
      case 1: return 'badge-status-approved';
      case 2: return 'badge-status-rejected';
      default: return '';
    }
  };

  const loadStudents = async () => {
    try {
      const res = await api.get('/teacher/students');
      setStudents(res.data);
      const marksRes = await api.get('/teacher/marks');
      setMarksList(marksRes.data);
      const assignRes = await api.get('/teacher/assignments');
      setAssignments(assignRes.data);
      const leaveRes = await api.get('/teacher/leaves');
      setLeaveRequests(leaveRes.data);
    } catch {
      // ignore errors in load
    }
  };

  // Fetch notifications and count
  const loadNotifications = useCallback(async () => {
    setLoadingNotifications(true);
    try {
      const [listRes, countRes] = await Promise.all([
        api.get('/notification'),
        api.get('/notification/count')
      ]);
      setNotifications(listRes.data);
      setNotificationCount(countRes.data);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  useEffect(() => {
    if (!isTokenValid()) {
      logout();
      navigate('/');
      return;
    }
    loadStudents();
    loadNotifications();
  }, []);

  // Mark notification as read
  const markNotificationAsRead = async (id) => {
    try {
      await api.put(`/notification/${id}/read`);
      loadNotifications();
    } catch {}
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/teacher/attendance?studentId=${attendance.studentId}&date=${attendance.date}&status=${encodeURIComponent(attendance.status)}`);
      setMessage('Attendance marked');
      setAttendance({ studentId: '', date: '', status: 'Present' });
    } catch {
      setMessage('Error marking attendance');
    }
  };

  const handleTeacherApproval = async (id, approve) => {
    try {
      await api.put(`/teacher/leave/${id}/teacher-approval?approve=${approve}`);
      setMessage('Leave request updated');
      const res = await api.get('/teacher/leaves');
      setLeaveRequests(res.data);
    } catch {
      setMessage('Error updating leave');
    }
  };

  const handleAddMark = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/teacher/marks?studentId=${mark.studentId}&subject=${encodeURIComponent(mark.subject)}&marks=${mark.marks}`);
      setMessage('Marks added');
      setMark({ studentId: '', subject: '', marks: '' });
      const marksRes = await api.get('/teacher/marks');
      setMarksList(marksRes.data);
    } catch {
      setMessage('Error adding marks');
    }
  };

  const handleUpdateMark = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/teacher/marks/${markUpdate.id}?marks=${markUpdate.marks}`);
      setMessage('Marks updated');
      setMarkUpdate({ id: '', marks: '' });
      const marksRes = await api.get('/teacher/marks');
      setMarksList(marksRes.data);
    } catch {
      setMessage('Error updating marks');
    }
  };

  const handleUploadAssignment = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', assignment.title);
      formData.append('dueDate', assignment.dueDate);
      formData.append('subject', assignment.subject);
      formData.append('class', assignment.klass);
      if (assignment.file) {
        formData.append('file', assignment.file);
      }
      await api.post('/teacher/assignments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Assignment uploaded');
      setAssignment({ title: '', dueDate: '', subject: '', klass: '', file: null });
    } catch {
      setMessage('Error uploading assignment');
    }
  };

  const handleComputeAverage = async (e) => {
    e.preventDefault();
    try {
      const res = await api.get(`/teacher/average?subject=${encodeURIComponent(averageSubject)}`);
      setAverageResult(res.data);
    } catch {
      setAverageResult(null);
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      const res = await api.get(`/teacher/assignments/${assignmentId}/submissions`);
      setSubmissions((prev) => ({ ...prev, [assignmentId]: res.data }));
    } catch {
      // ignore errors
    }
  };

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <div className="mb-3 d-flex justify-content-end gap-2">
        <button className="btn btn-primary" onClick={() => navigate('/teacher/exams/create')}>
          Create New Exam
        </button>
        <button className="btn btn-outline-secondary" onClick={() => navigate('/teacher/exams')}>
          View Exam Submissions
        </button>
      </div>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row g-4">
        {/* Student list */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Students</h5>
              <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {students.map((s) => (
                  <li className="list-group-item" key={s.id}>{s.id}. {s.name} ({s.class})</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Attendance form */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Mark Attendance</h5>
              <form onSubmit={handleMarkAttendance}>
                <div className="mb-2">
                  <label className="form-label">Student</label>
                  <select
                    className="form-select"
                    value={attendance.studentId}
                    onChange={(e) => setAttendance({ ...attendance, studentId: e.target.value })}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{`${s.id} - ${s.name} (${s.class})`}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={attendance.date}
                    onChange={(e) => setAttendance({ ...attendance, date: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={attendance.status}
                    onChange={(e) => setAttendance({ ...attendance, status: e.target.value })}
                    required
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                </div>
                <button className="btn btn-primary">Save</button>
              </form>
            </div>
          </div>
        </div>
        {/* Marks form */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Add Marks</h5>
              <form onSubmit={handleAddMark}>
                <div className="mb-2">
                  <label className="form-label">Student</label>
                  <select
                    className="form-select"
                    value={mark.studentId}
                    onChange={(e) => setMark({ ...mark, studentId: e.target.value })}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>{`${s.name} (${s.class})`}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">Subject</label>
                  <input className="form-control" value={mark.subject} onChange={(e) => setMark({ ...mark, subject: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Marks</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={mark.marks}
                    onChange={(e) => setMark({ ...mark, marks: e.target.value })}
                    required
                  />
                </div>
                <button className="btn btn-primary">Save</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Assignments list */}
      <div className="row g-4 mt-4">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Assignments</h5>
              {assignments.length === 0 ? (
                <p>No assignments uploaded.</p>
              ) : (
                <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {assignments.map((a) => (
                    <li key={a.id} className="list-group-item">
                      <div className="d-flex flex-column">
                        <div>
                          <strong>{a.title}</strong> (Due: {new Date(a.dueDate).toLocaleDateString()}) — {a.subject} / {a.ClassName} —{' '}
                          <a href={`${api.defaults.baseURL.replace('/api', '')}/${a.filePath}`} download>Download</a>
                          <button
                            type="button"
                            className="btn btn-sm btn-danger ms-2"
                            onClick={async () => {
                              try {
                                await api.delete(`/teacher/assignments/${a.id}`);
                                setMessage('Assignment deleted');
                                const res = await api.get('/teacher/assignments');
                                setAssignments(res.data);
                                setSubmissions((prev) => {
                                  const copy = { ...prev };
                                  delete copy[a.id];
                                  return copy;
                                });
                              } catch {
                                setMessage('Error deleting assignment');
                              }
                            }}
                          >
                            Delete
                          </button>
                        </div>
                        <div className="mt-2">
                          <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={() => fetchSubmissions(a.id)}
                          >
                            View Submissions
                          </button>
                          {submissions[a.id] && submissions[a.id].length > 0 && (
                            <ul className="list-group list-group-flush mt-2">
                              {submissions[a.id].map((sub) => {
                                const student = students.find((s) => s.id === sub.studentId);
                                const studentName = student ? student.name : sub.studentId;
                                return (
                                  <li key={sub.id} className="list-group-item">
                                    {studentName}:{' '}
                                    <a href={`${api.defaults.baseURL.replace('/api', '')}/${sub.filePath}`} download>Submission</a>{' '}
                                    (Submitted {new Date(sub.submittedAt).toLocaleDateString()})
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                          {submissions[a.id] && submissions[a.id].length === 0 && <p className="mt-2">No submissions yet.</p>}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4 mt-4">
        {/* Update marks */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Update Marks</h5>
              <form onSubmit={handleUpdateMark}>
                <div className="mb-2">
                  <label className="form-label">Select Entry</label>
                  <select
                    className="form-select"
                    value={markUpdate.id}
                    onChange={(e) => setMarkUpdate({ ...markUpdate, id: e.target.value })}
                    required
                  >
                    <option value="">Select Mark</option>
                    {marksList.map((m) => {
                      const name = m.studentName || m.StudentName || m.name || (m.Student && m.Student.name) || 'Unknown';
                      return (
                        <option key={m.id} value={m.id}>{name}</option>
                      );
                    })}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="form-label">New Marks</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={markUpdate.marks}
                    onChange={(e) => setMarkUpdate({ ...markUpdate, marks: e.target.value })}
                    required
                  />
                </div>
                <button className="btn btn-primary">Update</button>
              </form>
            </div>
          </div>
        </div>
        {/* Leave requests */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Leave Requests</h5>
              <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {leaveRequests.map((lv) => (
                  <li key={lv.id} className="list-group-item d-flex justify-content-between align-items-start">
                    <div className="ms-2 me-auto">
                      <div><strong>{lv.studentName}</strong> — {lv.reason}</div>
                      <div>{new Date(lv.startDate).toLocaleDateString()} – {new Date(lv.endDate).toLocaleDateString()}</div>
                      <div>
                        Status:
                        Teacher
                        <span className={`badge ms-1 ${statusBadgeClass(lv.teacherApproval)}`}>
                          {statusText(lv.teacherApproval)}
                        </span>
                        , Parent
                        <span className={`badge ms-1 ${statusBadgeClass(lv.parentApproval)}`}>
                          {statusText(lv.parentApproval)}
                        </span>
                        , Final
                        <span className={`badge ms-1 ${statusBadgeClass(lv.finalStatus)}`}>
                          {statusText(lv.finalStatus)}
                        </span>
                      </div>
                    </div>
                    {lv.teacherApproval === 0 && (
                      <div>
                        <button className="btn btn-sm btn-success me-2" onClick={() => handleTeacherApproval(lv.id, true)}>Approve</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleTeacherApproval(lv.id, false)}>Reject</button>
                      </div>
                    )}
                  </li>
                ))}
                {leaveRequests.length === 0 && <li className="list-group-item">No leave requests.</li>}
              </ul>
            </div>
          </div>
        </div>
        {/* Upload assignment */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Upload Assignment</h5>
              <form onSubmit={handleUploadAssignment}>
                <div className="mb-2">
                  <label className="form-label">Title</label>
                  <input className="form-control" value={assignment.title} onChange={(e) => setAssignment({ ...assignment, title: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Due Date</label>
                  <input type="date" className="form-control" value={assignment.dueDate} onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Subject</label>
                  <input className="form-control" value={assignment.subject} onChange={(e) => setAssignment({ ...assignment, subject: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Class</label>
                  <input className="form-control" value={assignment.klass} onChange={(e) => setAssignment({ ...assignment, klass: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">File</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => setAssignment({ ...assignment, file: e.target.files[0] })}
                    required
                  />
                </div>
                <button className="btn btn-primary">Upload</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4 mt-4">
        {/* Compute average */}
        <div className="col-md-4">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Compute Average Marks</h5>
              <form onSubmit={handleComputeAverage}>
                <div className="mb-2">
                  <label className="form-label">Subject</label>
                  <input className="form-control" value={averageSubject} onChange={(e) => setAverageSubject(e.target.value)} required />
                </div>
                <button className="btn btn-primary">Compute</button>
              </form>
              {averageResult && (
                <div className="mt-3">
                  <strong>Average:</strong> {averageResult.average}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default TeacherDashboard;


