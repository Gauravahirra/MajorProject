import { getToken } from '../utils/auth';

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function addStudent(data) {
  const res = await fetch('/api/admin/add-student', {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function addTeacher(data) {
  const res = await fetch('/api/admin/add-teacher', {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function addParent(data) {
  const res = await fetch('/api/admin/add-parent', {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function assignTeacher(data) {
  const res = await fetch('/api/admin/assign-teacher', {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getStudents() {
  const res = await fetch('/api/admin/students', { headers: authHeader() });
  return res.json();
}

export async function getTeachers() {
  const res = await fetch('/api/admin/teachers', { headers: authHeader() });
  return res.json();
}

export async function getParents() {
  const res = await fetch('/api/admin/parents', { headers: authHeader() });
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetch(`/api/admin/user/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  return res.ok;
}

export async function addEvent(data) {
  const res = await fetch('/api/admin/calendar', {
    method: 'POST',
    headers: { ...authHeader(), 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getEvents() {
  const res = await fetch('/api/admin/calendar', { headers: authHeader() });
  return res.json();
}

export async function deleteEvent(eventId) {
  const res = await fetch(`/api/admin/calendar/${eventId}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  return res.ok;
}

export async function getDashboardSummary() {
  const res = await fetch('/api/admin/dashboard-summary', { headers: authHeader() });
  return res.json();
}