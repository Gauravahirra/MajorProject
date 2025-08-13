import { getToken } from '../utils/auth';

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function enterGrade(data) {
  const res = await fetch('/api/teacher/grades', {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getGradesByClass(className) {
  const res = await fetch(`/api/teacher/grades/${className}`, { headers: authHeader() });
  return res.json();
}

export async function getStudentsByClass(className) {
  const res = await fetch(`/api/teacher/students/${className}`, { headers: authHeader() });
  return res.json();
}

export async function getStudentGrades(studentId) {
  const res = await fetch(`/api/student/grades/${studentId}`, { headers: authHeader() });
  return res.json();
}

export async function getParentChildGrades(parentId) {
  const res = await fetch(`/api/parent/grades/${parentId}`, { headers: authHeader() });
  return res.json();
}