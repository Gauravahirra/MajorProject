import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';
import ProfilePage from './pages/ProfilePage';
import Navbar from './components/Navbar';
import { AuthContext } from './contexts/AuthContext';
import ChatBot from './components/ChatBot';
import ExamListPage from './pages/ExamListPage';
import TakeExamPage from './pages/TakeExamPage';
import TeacherExamCreatePage from './pages/TeacherExamCreatePage';
import TeacherExamSubmissionsPage from './pages/TeacherExamSubmissionsPage';
import HomePage from './pages/HomePage';
import Footer from './components/Footer';
import NotificationsPage from './pages/NotificationsPage';


/**
 * Top‑level component controlling routing.  Displays the navbar
 * when the user is logged in and restricts dashboard routes
 * based on role.
 */
function App() {
  const { token, role } = useContext(AuthContext);

  return (
    <>
      {/* Show navbar only if logged in */}
      <Navbar role={role} />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin/*"   element={role === 'Admin'   ? <AdminDashboard />   : <Navigate to="/" />} />
          <Route path="/teacher/*" element={role === 'Teacher' ? <TeacherDashboard /> : <Navigate to="/" />} />
          <Route path="/student/*" element={role === 'Student' ? <StudentDashboard /> : <Navigate to="/" />} />
          <Route path="/parent/*"  element={role === 'Parent'  ? <ParentDashboard />  : <Navigate to="/" />} />
          <Route path="/student/exams" element={role === 'Student' ? <ExamListPage /> : <Navigate to="/" />} />
          <Route path="/student/exam/:id" element={role === 'Student' ? <TakeExamPage /> : <Navigate to="/" />} />
          <Route path="/teacher/exams/create" element={role === 'Teacher' ? <TeacherExamCreatePage /> : <Navigate to="/" />} />
          <Route path="/teacher/exams" element={role === 'Teacher' ? <TeacherExamSubmissionsPage /> : <Navigate to="/" />} />
          <Route path="/notifications" element={token ? <NotificationsPage /> : <Navigate to="/login" />} />
          {/* Catch-all redirects unknown routes back to login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
         {/* all your routes and navbar */}
        <ChatBot />
      </div>
      <Footer />
    </>
  );
}



export default App;
