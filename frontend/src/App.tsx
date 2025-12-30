import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import ProtectedRoute from './components/auth/ProtectedRoute';
import MenuSidebar from './components/MenuSidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeadProfilePage from './pages/LeadProfilePage';
import LeadsPage from './pages/Lead/LeadPage';
import UsersPage from './pages/UsersPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className='flex w-screen min-h-screen text-foreground bg-background'>
      {!isLoginPage && <MenuSidebar />}
      <div className='flex-1 h-screen overflow-auto'>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path='/leads' element={
              <ProtectedRoute>
                <LeadsPage />
              </ProtectedRoute>
            } />
          <Route path='/leads/:id' element={
              <ProtectedRoute>
                <LeadProfilePage />
              </ProtectedRoute>
            } />
          <Route path='/users' element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
