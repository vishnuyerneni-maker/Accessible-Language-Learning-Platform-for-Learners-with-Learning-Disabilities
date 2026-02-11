import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LessonPlayer from './pages/LessonPlayer';
import SpeechPractice from './pages/SpeechPractice';
import DyslexiaCenter from './pages/DyslexiaCenter';

import Register from './pages/Register';
import Profile from './pages/Profile';
import Quiz from './pages/Quiz';
import AdminDashboard from './pages/AdminDashboard';
import GuardianDashboard from './pages/GuardianDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute requiredRole="student"><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/lesson/:courseId" element={<ProtectedRoute requiredRole="student"><LessonPlayer /></ProtectedRoute>} />
        <Route path="/quiz/:courseId" element={<ProtectedRoute requiredRole="student"><Quiz /></ProtectedRoute>} />
        <Route path="/speech-practice" element={<ProtectedRoute requiredRole="student"><SpeechPractice /></ProtectedRoute>} />
        <Route path="/dyslexia-center" element={<ProtectedRoute requiredRole="student"><DyslexiaCenter /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/guardian-dashboard"
          element={
            <ProtectedRoute requiredRole="parent">
              <GuardianDashboard />
            </ProtectedRoute>
          }
        />

        {/* Add more routes here */}
      </Routes>
    </Router>
  );
}




export default App;
