import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import { Toaster } from 'react-hot-toast';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import VideoRecorder from './components/VideoRecorder';
import ReviewDashboard from './pages/ReviewDashboard';
import DashboardLayout from './layouts/DashboardLayout';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import UploadVideo from './pages/UploadVideo';
import Profile from './pages/Profile';

// Admin-only guard
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  let user = null;
  
  if (!token) return <Navigate to="/login" />;

  try {
      user = userStr ? JSON.parse(userStr) : null;
  } catch(e) {
      console.error("Auth parsing failed", e);
  }

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  return isAdmin ? children : <Navigate to="/dashboard" />;
};

// Any logged-in user guard
const PrivateUserRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const AppContent = () => {
    const location = useLocation();
    const isDashboard = location.pathname.startsWith('/dashboard');

    return (
        <div className="app">
            {!isDashboard && <Navbar />}
            <main className="main-content" style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/survey/:id" element={<VideoRecorder />} />
                    
                    <Route path="/dashboard" element={
                        <PrivateUserRoute>
                            <DashboardLayout />
                        </PrivateUserRoute>
                    }>
                        <Route index element={<ReviewDashboard />} />
                        <Route path="upload" element={<UploadVideo />} />
                        <Route path="analytics" element={<AnalyticsDashboard />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="admin" element={
                            <PrivateRoute>
                                <AdminDashboard />
                            </PrivateRoute>
                        } />
                    </Route>

                    <Route path="/admin/*" element={<Navigate to="/dashboard/admin" />} />
                    <Route path="/review-dashboard" element={<Navigate to="/dashboard" />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            {!isDashboard && <Footer />}
        </div>
    );
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
