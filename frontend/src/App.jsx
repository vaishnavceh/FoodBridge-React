import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import DonatePage from './pages/DonatePage';
import BrowseDonations from './pages/BrowseDonations';
import MyDonations from './pages/MyDonations';
import MyRequests from './pages/MyRequests';
import MyHistory from './pages/MyHistory';
import ViewRequests from './pages/ViewRequests';
import VolunteerTasks from './pages/VolunteerTasks';
import AdminDashboard from './pages/AdminDashboard';
import LearnMore from './pages/LearnMore';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#000000'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff'
            }
          }
        }}
      />
      <BrowserRouter>
        <Routes>
          {/* Main Layout Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/learn-more" element={<LearnMore />} />

            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Donor Routes */}
            <Route
              path="/donate"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <DonatePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-donations"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <MyDonations />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-requests"
              element={
                <ProtectedRoute allowedRoles={['donor']}>
                  <ViewRequests />
                </ProtectedRoute>
              }
            />

            {/* NGO & Volunteer Shared Browse */}
            <Route
              path="/browse"
              element={
                <ProtectedRoute allowedRoles={['ngo', 'volunteer', 'admin']}>
                  <BrowseDonations />
                </ProtectedRoute>
              }
            />

            {/* NGO Routes */}
            <Route
              path="/my-requests"
              element={
                <ProtectedRoute allowedRoles={['ngo']}>
                  <MyRequests />
                </ProtectedRoute>
              }
            />

            {/* Volunteer Routes */}
            <Route
              path="/volunteer-tasks"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <VolunteerTasks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-history"
              element={
                <ProtectedRoute allowedRoles={['volunteer']}>
                  <MyHistory />
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Auth Layout Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/signup" element={<Navigate to="/register" replace />} />
            <Route path="/admin-login" element={<AdminLogin />} />
          </Route>

          {/* Admin Layout Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
