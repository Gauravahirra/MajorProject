import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { isTokenValid } from '../utils/auth';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Dashboard for students.  Shows attendance, marks, assignments,
 * leave requests and academic events.  Uses colored badges for
 * leave statuses.
 */
const StudentDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissionFiles, setSubmissionFiles] = useState({});
  const [leaves, setLeaves] = useState([]);
  const [events, setEvents] = useState([]);
  const [leave, setLeave] = useState({ reason: '', startDate: '', endDate: '' });
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  // Convert numeric status codes into text
  const statusText = (status) => {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Approved';
      case 2: return 'Rejected';
      default: return status;
    }
  };

  // Map statuses to CSS classes for colored badges
  const statusBadgeClass = (status) => {
    switch (status) {
      case 0: return 'badge-status-pending';
      case 1: return 'badge-status-approved';
      case 2: return 'badge-status-rejected';
      default: return '';
    }
  };

  const loadData = async () => {
    try {
      const [attRes, marksRes, assignRes, leavesRes, eventRes] = await Promise.all([
        api.get('/student/attendance'),
        api.get('/student/marks'),
        api.get('/student/assignments'),
        api.get('/student/leaves'),
        api.get('/admin/events')
      ]);
      setAttendance(attRes.data);
      setMarks(marksRes.data);
      setAssignments(assignRes.data);
      setLeaves(leavesRes.data);
      setEvents(eventRes.data);
    } catch (err) {
      console.error(err);
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
    loadData();
    loadNotifications();
  }, []);

  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/student/leave', {
        reason: leave.reason,
        startDate: leave.startDate,
        endDate: leave.endDate
      });
      setLeave({ reason: '', startDate: '', endDate: '' });
      setMessage('Leave request submitted.');
    } catch {
      setMessage('Error submitting leave');
    }
  };

  const handleSubmissionFileChange = (assignmentId, file) => {
    setSubmissionFiles((prev) => ({ ...prev, [assignmentId]: file }));
  };

  const handleSubmitAssignment = async (assignmentId) => {
    const file = submissionFiles[assignmentId];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await api.post(`/student/assignments/${assignmentId}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Assignment submitted.');
      setSubmissionFiles((prev) => {
        const updated = { ...prev };
        delete updated[assignmentId];
        return updated;
      });
    } catch {
      setMessage('Error submitting assignment');
    }
  };

  const printMarks = () => {
    const printWindow = window.open('', '_blank');
    const tableRows = marks.map((m) => `<tr><td>${m.subject}</td><td>${m.marks}</td></tr>`).join('');
    printWindow.document.write(
      `<html><head><title>Marks</title></head><body><h3>Marks</h3><table border="1"><tr><th>Subject</th><th>Marks</th></tr>${tableRows}</table></body></html>`
    );
    printWindow.document.close();
    printWindow.print();
  };

  // Mark notification as read
  const markNotificationAsRead = async (id) => {
    try {
      await api.put(`/notification/${id}/read`);
      loadNotifications();
    } catch {}
  };

  return (
    <div>
      <h2>Student Dashboard</h2>
      <div className="mb-3 d-flex justify-content-end">
        <button className="btn btn-primary" onClick={() => navigate('/student/exams')}>
          View/Take Exams
        </button>
      </div>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row g-4">
        {/* Attendance */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Attendance</h5>
              <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {attendance.map((a, idx) => (
                  <li key={idx} className="list-group-item">
                    {new Date(a.date).toLocaleDateString()} — {a.status}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Marks */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Marks</h5>
              <button onClick={printMarks} className="btn btn-sm btn-secondary mb-2">Export to PDF</button>
              <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {marks.map((m, idx) => (
                  <li key={idx} className="list-group-item">
                    {m.subject}: {m.marks}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4 mt-4">
        {/* Assignments */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Assignments</h5>
              <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {assignments.map((a) => (
                  <li key={a.id} className="list-group-item">
                    <div className="d-flex flex-column">
                      <div>
                        <strong>{a.title}</strong> (Due: {new Date(a.dueDate).toLocaleDateString()}) —{' '}
                        <a href={`${api.defaults.baseURL.replace('/api', '')}/${a.filePath}`} download>Download</a>
                      </div>
                      <div className="mt-2 d-flex align-items-center">
                        <input
                          type="file"
                          className="form-control form-control-sm me-2"
                          onChange={(e) => handleSubmissionFileChange(a.id, e.target.files[0])}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={() => handleSubmitAssignment(a.id)}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Submit leave */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Submit Leave Request</h5>
              <form onSubmit={handleLeaveSubmit}>
                <div className="mb-2">
                  <label className="form-label">Reason</label>
                  <textarea className="form-control" value={leave.reason} onChange={(e) => setLeave({ ...leave, reason: e.target.value })} rows="2" required></textarea>
                </div>
                <div className="mb-2">
                  <label className="form-label">Start Date</label>
                  <input type="date" className="form-control" value={leave.startDate} onChange={(e) => setLeave({ ...leave, startDate: e.target.value })} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">End Date</label>
                  <input type="date" className="form-control" value={leave.endDate} onChange={(e) => setLeave({ ...leave, endDate: e.target.value })} required />
                </div>
                <button className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
        </div>
        {/* Leave history */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Leave Requests</h5>
              <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {leaves.map((lv) => (
                  <li key={lv.id} className="list-group-item">
                    <div><strong>{lv.reason}</strong></div>
                    <div>{new Date(lv.startDate).toLocaleDateString()} – {new Date(lv.endDate).toLocaleDateString()}</div>
                    <div>
                      Status:
                      <span className={`badge ms-1 ${statusBadgeClass(lv.finalStatus)}`}>
                        {statusText(lv.finalStatus)}
                      </span>
                    </div>
                    <div>
                      (Teacher:
                      <span className={`badge ms-1 ${statusBadgeClass(lv.teacherApproval)}`}>
                        {statusText(lv.teacherApproval)}
                      </span>
                      , Parent:
                      <span className={`badge ms-1 ${statusBadgeClass(lv.parentApproval)}`}>
                        {statusText(lv.parentApproval)}
                      </span>
                      )
                    </div>
                  </li>
                ))}
                {leaves.length === 0 && <li className="list-group-item">No leave requests submitted.</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* Academic events */}
      <div className="row g-4 mt-4">
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Academic Calendar</h5>
              <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {events.map((ev) => (
                  <li key={ev.id} className="list-group-item">
                    {new Date(ev.date).toLocaleDateString()} — <strong>{ev.title}</strong>: {ev.description || 'No description'}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;


