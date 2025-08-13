import { getToken } from '../utils/auth';

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function testDatabase() {
  const res = await fetch(`/api/student/test-db`, { headers: authHeader() });
  return res.json();
}

export async function testAuth() {
  const res = await fetch(`/api/student/test-auth`, { headers: authHeader() });
  return res.json();
}

export async function debugDatabase() {
  const res = await fetch(`/api/student/debug/database`, { headers: authHeader() });
  return res.json();
}

export async function getStudentDetails(studentId) {
  const res = await fetch(`/api/student/details/${studentId}`, { headers: authHeader() });
  return res.json();
}

export async function getStudentsByClass(className) {
  const res = await fetch(`/api/teacher/students/${className}`, { headers: authHeader() });
  return res.json();
}

export async function markAttendance(data) {
  const res = await fetch('/api/teacher/attendance', {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getAttendanceByClass(className) {
  const res = await fetch(`/api/teacher/attendance/${className}`, { headers: authHeader() });
  return res.json();
}

export async function getStudentAttendance(studentId) {
  const res = await fetch(`/api/student/attendance/${studentId}`, { headers: authHeader() });
  return res.json();
}

export async function getParentChildAttendance(parentId) {
  const res = await fetch(`/api/parent/attendance/${parentId}`, { headers: authHeader() });
  return res.json();
}