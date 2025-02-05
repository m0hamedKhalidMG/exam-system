import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './redux/adminSlice';
import studentReducer from './redux/studentSlice';

import Navbar from './components/Navbar'; // Add the Navbar
import AdminDashboard from './pages/AdminDashboard';
import StudentRegistration from './pages/StudentRegistration';
import ExamInstructions from './pages/ExamInstructions';
import ExamResult from './pages/ExamResult';
import StudentHistory from './pages/StudentHistory';
import Leaderboard from './pages/Leaderboard';
import StudentProfile from './pages/StudentProfile';
import WhatsAppGroup from './pages/WhatsAppGroup';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import ExamPage from './pages/ExamPage';
import LevelSelection from './pages/LevelSelection';
import StudentLogin from './pages/StudentLogin'; // Add Login Page
import AdminViewStudents from './pages/AdminViewStudents';
import AdminBestStudents from './pages/AdminBestStudents';
import ExamHistory from './pages/ExamHistory';

import AdminHub from './pages/AdminHub';
import ImageUpload from './pages/uploadimage';

const store = configureStore({
  reducer: {
    admin: adminReducer,
    student: studentReducer,
  },
});

function App() {
  return (
    <Provider store={store}>
      <Router>
        {/* Include Navbar across all routes */}
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="upload-image" element={<ImageUpload />} />
          
          <Route path="/getdegree" element={<ExamHistory />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-hub" element={<AdminHub />} />
          <Route path="/best-students" element={<AdminBestStudents />} />
          <Route path="/view-students" element={<AdminViewStudents />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/register" element={<StudentRegistration />} />
          <Route path="/login" element={<StudentLogin />} /> {/* Login Page */}
          <Route path="/instructions" element={<ExamInstructions />} />
          <Route path="/level-selection" element={<LevelSelection />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/result" element={<ExamResult />} />
          <Route path="/history" element={<StudentHistory />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/whatsapp-group" element={<WhatsAppGroup />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
