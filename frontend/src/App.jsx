import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import Candidates from './pages/Candidates';
import Screening from './pages/Screening';
import Shortlist from './pages/Shortlist';
import Interviews from './pages/Interviews';
import Login from './pages/Login';
import './App.css';

const ProtectedLayout = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-dark-bg text-zinc-100">
      <Sidebar />
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Component that renders the correct dashboard based on user role
const RoleDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  if (user.role === 'candidate') {
    return <CandidateDashboard />;
  }
  return <Dashboard />;
};

// Guard that blocks candidate users from HR-only pages
const HROnlyRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  if (user.role === 'candidate') {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<RoleDashboard />} />
          <Route path="/candidates" element={<HROnlyRoute><Candidates /></HROnlyRoute>} />
          <Route path="/screening" element={<HROnlyRoute><Screening /></HROnlyRoute>} />
          <Route path="/shortlisted" element={<HROnlyRoute><Shortlist /></HROnlyRoute>} />
          <Route path="/interviews" element={<HROnlyRoute><Interviews /></HROnlyRoute>} />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
