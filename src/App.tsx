import React from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/ui/navbar';
import GenerateAI from './pages/GenerateAI';
import Timetables from './pages/Timetables';
import Generated from './pages/Generated'

function App() {
  return (
    <AuthProvider>

      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />
          {/* <Route path="/generate" element={<ProtectedRoute><GenerateAI /></ProtectedRoute>} /> */}
          <Route path="/generate" element={<GenerateAI />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/timetables" element={<ProtectedRoute><Timetables /></ProtectedRoute>} />
          <Route path="/generated/:id" element={<Generated />} />
     
      </Routes>

    </AuthProvider>
  );
}

export default App;
