import { getToken } from '../utils/auth';

function authHeader() {
  return { Authorization: `Bearer ${getToken()}` };
}

export async function uploadAssignment(data) {
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const teacherId = user.id || 1; // Default to 1 if not found
  
  // Build query parameters
  const params = new URLSearchParams();
  params.append('title', data.title);
  params.append('description', data.description);
  params.append('dueDate', data.dueDate);
  params.append('subject', data.subject);
  params.append('className', data.className || 'Class 10A'); // Default class
  params.append('teacherId', teacherId.toString());
  
  // Build request body for file only
  const formData = new FormData();
  if (data.file) {
    formData.append('file', data.file);
  }
  
  const res = await fetch(`/api/assignments?${params.toString()}`, {
    method: 'POST',
    headers: authHeader(),
    body: formData
  });
  return res.json();
}

export async function getAssignmentsByClass(className) {
  const res = await fetch(`/api/assignments/class/${className}`, { headers: authHeader() });
  return res.json();
}

export async function getStudentAssignments(className) {
  const res = await fetch(`/api/assignments/class/${className}`, { headers: authHeader() });
  return res.json();
}

export async function submitAssignment(assignmentId, studentId, submissionText, file) {
  // Build query parameters
  const params = new URLSearchParams();
  params.append('studentId', studentId);
  if (submissionText) params.append('submissionText', submissionText);

  // Build FormData for file only
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }

  // Prevent sending if both text and file are missing
  if (!submissionText && !file) {
    throw new Error('Please provide either submission text or a file.');
  }

  const token = getToken();
  let res;
  try {
    res = await fetch(`/api/assignments/${assignmentId}/submit?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Do NOT set Content-Type, browser will set it for FormData
      },
      body: formData
    });
  } catch (networkError) {
    throw new Error('Network error. Please check your connection.');
  }
  if (!res.ok) {
    let errorData = {};
    try {
      errorData = await res.json();
    } catch {}
    
    // Handle specific status codes
    if (res.status === 409) {
      throw new Error('Assignment already submitted');
    } else if (res.status === 404) {
      throw new Error('Assignment or student not found');
    } else if (res.status === 400) {
      throw new Error('Invalid submission data');
    }
    
    throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}