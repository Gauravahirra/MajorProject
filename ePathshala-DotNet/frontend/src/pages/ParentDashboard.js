import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { isTokenValid } from '../utils/auth';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Dashboard for parents.  Displays attendance and marks for their children,
 * and allows them to approve or reject leave requests.  Statuses are
 * color‑coded using custom badge classes.
 */
const ParentDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [marks, setMarks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState('');

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

  const loadData = async () => {
    try {
      const [attRes, marksRes, leavesRes] = await Promise.all([
        api.get('/parent/attendance'),
        api.get('/parent/marks'),
        api.get('/parent/leaves')
      ]);
      setAttendance(attRes.data);
      setMarks(marksRes.data);
      setLeaves(leavesRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isTokenValid()) {
      logout();
      navigate('/');
      return;
    }
    loadData();
  }, []);

  const handleParentApproval = async (id, approve) => {
    try {
      await api.put(`/parent/leave/${id}/parent-approval?approve=${approve}`);
      setMessage('Leave request updated');
      const res = await api.get('/parent/leaves');
      setLeaves(res.data);
    } catch {
      setMessage('Error updating leave');
    }
  };

  return (
    <div>
      <h2>Parent Dashboard</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <div className="row g-4">
        {/* Attendance */}
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Child’s Attendance</h5>
              <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {attendance.map((a, idx) => (
                  <li key={idx} className="list-group-item">
                    Student {a.studentId}: {new Date(a.date).toLocaleDateString()} — {a.status}
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
              <h5 className="card-title">Child’s Marks</h5>
              <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {marks.map((m, idx) => (
                  <li key={idx} className="list-group-item">
                    Student {m.studentId}: {m.subject} — {m.marks}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4 mt-4">
        {/* Leave Requests */}
        <div className="col-md-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Leave Requests</h5>
              <ul className="list-group list-group-flush" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {leaves.map((lv) => (
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
                    {lv.parentApproval === 0 && (
                      <div>
                        <button className="btn btn-sm btn-success me-2" onClick={() => handleParentApproval(lv.id, true)}>Approve</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleParentApproval(lv.id, false)}>Reject</button>
                      </div>
                    )}
                  </li>
                ))}
                {leaves.length === 0 && <li className="list-group-item">No leave requests.</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;

