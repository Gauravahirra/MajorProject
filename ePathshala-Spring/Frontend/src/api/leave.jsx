import { getToken } from '../utils/auth';

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function submitLeave(data) {
  const res = await fetch('/api/student/leave', {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getStudentLeaveStatus(studentId) {
  const res = await fetch(`/api/student/leave/${studentId}`, { headers: authHeader() });
  return res.json();
}

export async function getLeavesByClass(className) {
  const res = await fetch(`/api/teacher/leaves/${className}`, { headers: authHeader() });
  return res.json();
}

export async function approveLeaveAsTeacher(data) {
  const res = await fetch('/api/teacher/leave/approve', {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function approveLeaveAsParent(data) {
  const res = await fetch('/api/parent/leave/approve', {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getParentChildLeaveStatus(parentId) {
  const res = await fetch(`/api/parent/leave/${parentId}`, { headers: authHeader() });
  return res.json();
}