import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import DashboardLayout from '../components/layout/DashboardLayout';
import PublicLayout from '../components/layout/PublicLayout';
import ProtectedLayout from '../components/layout/ProtectedLayout';
import AdminDashboardLayout from '../components/layout/AdminDashboardLayout';
import StudentDashboardLayout from '../components/layout/StudentDashboardLayout';
import TeacherDashboardLayout from '../components/layout/TeacherDashboardLayout';
import ParentDashboardLayout from '../components/layout/ParentDashboardLayout';
import LoginPage from '../pages/auth/LoginPage';
import ForgotPassword from '../pages/auth/ForgotPassword';
import HomePage from '../pages/HomePage';
import ContactUs from '../pages/ContactUs';
import AboutUs from '../pages/AboutUs';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import StudentDashboard from '../pages/dashboard/StudentDashboard';
import TeacherDashboard from '../pages/dashboard/TeacherDashboard';
import ParentDashboard from '../pages/dashboard/ParentDashboard';
import ExamDashboard from '../pages/dashboard/ExamDashboard';
import Forum from '../components/forum/Forum';
import Chat from '../components/chat/Chat';
import ThreadedChat from '../components/chat/ThreadedChat';
import Notifications from '../components/notifications/Notifications';
import WebSocketTest from '../components/chat/WebSocketTest';
import SimpleTest from '../components/chat/SimpleTest';
import SimpleWebSocketTest from '../components/chat/SimpleWebSocketTest';
import SimpleChatTest from '../components/chat/SimpleChatTest';
import WebSocketDebug from '../components/chat/WebSocketDebug';
import MessageTest from '../components/chat/MessageTest';
import ChatDebug from '../components/chat/ChatDebug';
import ThreadDetail from '../components/forum/ThreadDetail';
import AdminSummary from '../pages/dashboard/AdminSummary';
import AdminAddStudent from '../pages/dashboard/AdminAddStudent';
import AdminAddTeacher from '../pages/dashboard/AdminAddTeacher';

import AdminAssignTeacher from '../pages/dashboard/AdminAssignTeacher';
import AdminResetPassword from '../pages/dashboard/AdminResetPassword';
import AdminAcademicCalendar from '../pages/dashboard/AdminAcademicCalendar';
import AdminOnlineClasses from '../pages/dashboard/AdminOnlineClasses';
import AdminSessionManagement from '../pages/dashboard/AdminSessionManagement';
import AdminProfile from '../components/profile/AdminProfile';
import TeacherProfile from '../components/profile/TeacherProfile';
import StudentProfile from '../components/profile/StudentProfile';
import ParentProfile from '../components/profile/ParentProfile';

// Teacher Dashboard Pages
import TeacherAttendancePage from '../pages/dashboard/teacher/TeacherAttendancePage';
import TeacherGradesPage from '../pages/dashboard/teacher/TeacherGradesPage';
import TeacherAssignmentsPage from '../pages/dashboard/teacher/TeacherAssignmentsPage';
import TeacherLeaveRequestsPage from '../pages/dashboard/teacher/TeacherLeaveRequestsPage';
import TeacherCalendarPage from '../pages/dashboard/teacher/TeacherCalendarPage';
import TeacherOnlineClassesPage from '../pages/dashboard/teacher/TeacherOnlineClassesPage';
import TeacherExamsPage from '../pages/dashboard/teacher/TeacherExamsPage';
// Exam management and interfaces
import FacultyExamManager from '../components/exam/FacultyExamManager';
import StudentExamInterface from '../components/exam/StudentExamInterface';

// Student Dashboard Pages
import StudentAssignmentsPage from '../pages/dashboard/student/StudentAssignmentsPage';
import StudentExamsPage from '../pages/dashboard/student/StudentExamsPage';
import StudentGradesPage from '../pages/dashboard/student/StudentGradesPage';
import StudentProgressPage from '../pages/dashboard/student/StudentProgressPage';
import StudentAttendancePage from '../pages/dashboard/student/StudentAttendancePage';
import StudentLeaveRequestsPage from '../pages/dashboard/student/StudentLeaveRequestsPage';
import StudentCalendarPage from '../pages/dashboard/student/StudentCalendarPage';
import StudentExamResultPage from '../pages/dashboard/student/StudentExamResultPage';

// Parent Dashboard Pages
import ParentChildProgressPage from '../pages/dashboard/parent/ParentChildProgressPage';
import ParentLeaveApprovalsPage from '../pages/dashboard/parent/ParentLeaveApprovalsPage';
import ParentCalendarPage from '../pages/dashboard/parent/ParentCalendarPage';
import HoverTest from '../pages/test/HoverTest';
import LayoutTest from '../pages/test/LayoutTest';
import ChatbotPage from '../pages/ChatbotPage';
import HelpPage from '../pages/HelpPage';

function AppRoutes() {
  console.log("AppRoutes component rendering...");
  
  try {
    return (
      <Routes>
        {/* Public Routes - Home is the default landing page */}
        <Route path="/" element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        } />
        <Route path="/home" element={
          <PublicLayout>
            <HomePage />
          </PublicLayout>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Main Pages with Public Layout */}
        <Route path="/about" element={
          <PublicLayout>
            <AboutUs />
          </PublicLayout>
        } />
        <Route path="/contact" element={
          <PublicLayout>
            <ContactUs />
          </PublicLayout>
        } />
        <Route path="/chatbot" element={
          <PublicLayout>
            <ChatbotPage />
          </PublicLayout>
        } />
        <Route path="/help" element={
          <PublicLayout>
            <HelpPage />
          </PublicLayout>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <AdminDashboard />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/forum" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <Forum />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/chat" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <ThreadedChat />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/websocket-test" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <WebSocketTest />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/chat-simple" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <Chat />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/simple-test" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <SimpleTest />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/simple-websocket-test" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <SimpleWebSocketTest />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/simple-chat-test" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <SimpleChatTest />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/websocket-debug" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <WebSocketDebug />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/message-test" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <MessageTest />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/chat-debug" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <ChatDebug />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/notifications" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <Notifications />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/hover-test" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <HoverTest />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/test/layout" element={
          <DashboardLayout>
            <LayoutTest />
          </DashboardLayout>
        } />
        {/* Admin Section Routes */}
        <Route path="/admin/summary" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <AdminSummary />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/add-student" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <AdminAddStudent />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/add-teacher" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <AdminAddTeacher />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />

        <Route path="/admin/assign-teacher" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <AdminAssignTeacher />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/reset-password" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <AdminResetPassword />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/calendar" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <AdminAcademicCalendar />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/online-classes" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <AdminOnlineClasses />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/sessions" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <AdminSessionManagement />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/admin/profile" element={
          <ProtectedLayout requiredRole="ADMIN">
            <AdminDashboardLayout>
              <AdminProfile />
            </AdminDashboardLayout>
          </ProtectedLayout>
        } />
        
        {/* Student Routes */}
        <Route path="/student" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <StudentDashboard />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/student/assignments" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <StudentAssignmentsPage />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/student/exams" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <StudentExamsPage />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/student/exams/:examId" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <StudentExamInterface />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/student/exams/:examId/result" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <StudentExamResultPage />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/student/grades" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <StudentGradesPage />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/student/progress" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <StudentProgressPage />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/student/attendance" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <StudentAttendancePage />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/student/leave-requests" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <StudentLeaveRequestsPage />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/student/calendar" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <StudentCalendarPage />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/student/forum" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <Forum />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/student/chat" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <Chat />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/student/notifications" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <Notifications />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/student/profile" element={
          <ProtectedLayout requiredRole="STUDENT">
            <StudentDashboardLayout>
              <StudentProfile />
            </StudentDashboardLayout>
          </ProtectedLayout>
        } />
        
        {/* Teacher Routes */}
        <Route path="/teacher" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <TeacherDashboard />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/attendance" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <TeacherAttendancePage />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/grades" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <TeacherGradesPage />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/assignments" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <TeacherAssignmentsPage />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/leave-requests" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <TeacherLeaveRequestsPage />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/calendar" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <TeacherCalendarPage />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/online-classes" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <TeacherOnlineClassesPage />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/exams" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <TeacherExamsPage />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/exams/create" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <FacultyExamManager />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/exams/:examId/edit" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <FacultyExamManager />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/exams/:examId/results" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <FacultyExamManager />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/forum" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <Forum />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/chat" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <Chat />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/notifications" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <Notifications />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/teacher/profile" element={
          <ProtectedLayout requiredRole="TEACHER">
            <TeacherDashboardLayout>
              <TeacherProfile />
            </TeacherDashboardLayout>
          </ProtectedLayout>
        } />
        
        {/* Parent Routes */}
        <Route path="/parent" element={
          <ProtectedLayout requiredRole="PARENT">
            <ParentDashboardLayout>
              <ParentDashboard />
            </ParentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/parent/child-progress" element={
          <ProtectedLayout requiredRole="PARENT">
            <ParentDashboardLayout>
              <ParentChildProgressPage />
            </ParentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/parent/leave-approvals" element={
          <ProtectedLayout requiredRole="PARENT">
            <ParentDashboardLayout>
              <ParentLeaveApprovalsPage />
            </ParentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/parent/calendar" element={
          <ProtectedLayout requiredRole="PARENT">
            <ParentDashboardLayout>
              <ParentCalendarPage />
            </ParentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/parent/forum" element={
          <ProtectedLayout requiredRole="PARENT">
            <ParentDashboardLayout>
              <Forum />
            </ParentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/parent/chat" element={
          <ProtectedLayout requiredRole="PARENT">
            <ParentDashboardLayout>
              <Chat />
            </ParentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/parent/notifications" element={
          <ProtectedLayout requiredRole="PARENT">
            <ParentDashboardLayout>
              <Notifications />
            </ParentDashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/parent/profile" element={
          <ProtectedLayout requiredRole="PARENT">
            <ParentDashboardLayout>
              <ParentProfile />
            </ParentDashboardLayout>
          </ProtectedLayout>
        } />
        
        {/* Shared Routes */}
        <Route path="/forum/thread/:threadId" element={
          <ProtectedLayout>
            <DashboardLayout>
              <ThreadDetail />
            </DashboardLayout>
          </ProtectedLayout>
        } />
        
        {/* Chat & Communication Routes */}
        <Route path="/chat" element={
          <ProtectedLayout>
            <DashboardLayout>
              <Chat />
            </DashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/threaded-chat" element={
          <ProtectedLayout>
            <DashboardLayout>
              <ThreadedChat />
            </DashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/websocket-test" element={
          <ProtectedLayout>
            <DashboardLayout>
              <WebSocketTest />
            </DashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/chat-debug" element={
          <ProtectedLayout>
            <DashboardLayout>
              <ChatDebug />
            </DashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/message-test" element={
          <ProtectedLayout>
            <DashboardLayout>
              <MessageTest />
            </DashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/simple-test" element={
          <ProtectedLayout>
            <DashboardLayout>
              <SimpleTest />
            </DashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/simple-websocket-test" element={
          <ProtectedLayout>
            <DashboardLayout>
              <SimpleWebSocketTest />
            </DashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/simple-chat-test" element={
          <ProtectedLayout>
            <DashboardLayout>
              <SimpleChatTest />
            </DashboardLayout>
          </ProtectedLayout>
        } />
        
        {/* Feature Routes */}
        <Route path="/forum" element={
          <ProtectedLayout>
            <DashboardLayout>
              <Forum />
            </DashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/notifications" element={
          <ProtectedLayout>
            <DashboardLayout>
              <Notifications />
            </DashboardLayout>
          </ProtectedLayout>
        } />
        <Route path="/exams" element={
          <ProtectedLayout>
            <DashboardLayout>
              <ExamDashboard />
            </DashboardLayout>
          </ProtectedLayout>
        } />
        
        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh',
            p: 3,
            textAlign: 'center'
          }}>
            <Typography variant="h4" color="error" gutterBottom>
              Access Denied
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              You don't have permission to access this page.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.location.href = '/login'}
              sx={{ mr: 2 }}
            >
              Go to Login
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => window.location.href = '/'}
            >
              Go to Home
            </Button>
          </Box>
        } />
        
        {/* Catch-all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  } catch (error) {
    console.error("Error in AppRoutes component:", error);
    return (
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
        <h1 style={{ color: '#1976d2' }}>AppRoutes Error</h1>
        <p>Error: {error.message}</p>
      </div>
    );
  }
}

export default React.memo(AppRoutes); 