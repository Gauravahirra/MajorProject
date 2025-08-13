import { apiCall } from '../utils/api';

// Student Exam APIs
export const getAvailableExams = async () => {
  return apiCall('/api/student/exams/available', { method: 'GET' });
};

export const startExam = async (examId) => {
  return apiCall(`/api/student/exams/${examId}/start`, { method: 'POST' });
};

export const submitExam = async (examId, answers) => {
  return apiCall(`/api/student/exams/${examId}/submit`, { method: 'POST', body: JSON.stringify(answers) });
};

export const getExamResult = async (examId) => {
  return apiCall(`/api/student/exams/${examId}/result`, { method: 'GET' });
};

export const getExamHistory = async () => {
  return apiCall('/api/student/exams/history', { method: 'GET' });
};

export const getExamQuestions = async (examId) => {
  return apiCall(`/api/student/exams/${examId}/questions`, { method: 'GET' });
};

export const getExamTimer = async (examId) => {
  return apiCall(`/api/student/exams/${examId}/timer`, { method: 'GET' });
};

// Faculty Exam APIs
export const createExam = async (examData) => {
  return apiCall('/api/faculty/exams', { method: 'POST', body: JSON.stringify(examData) });
};

export const addQuestions = async (examId, questions) => {
  return apiCall(`/api/faculty/exams/${examId}/questions`, { method: 'POST', body: JSON.stringify(questions) });
};

export const getFacultyExams = async () => {
  return apiCall('/api/faculty/exams', { method: 'GET' });
};

export const getExamDetails = async (examId) => {
  return apiCall(`/api/faculty/exams/${examId}`, { method: 'GET' });
};

export const getExamResults = async (examId) => {
  return apiCall(`/api/faculty/exams/${examId}/results`, { method: 'GET' });
};

export const activateExam = async (examId) => {
  return apiCall(`/api/faculty/exams/${examId}/activate`, { method: 'PUT' });
};

export const deactivateExam = async (examId) => {
  return apiCall(`/api/faculty/exams/${examId}/deactivate`, { method: 'PUT' });
};

export const deleteExam = async (examId) => {
  return apiCall(`/api/faculty/exams/${examId}`, { method: 'DELETE' });
}; 