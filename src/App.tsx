import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/Toaster';
import { AppProvider } from './contexts/AppContext';
import PaymentPage from './pages/PaymentPage';
import DashboardPage from './pages/DashboardPage';
import MobileLayout from './components/layout/MobileLayout';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800">
        <Router>
          <Routes>
            <Route path="/" element={
              <MobileLayout>
                <PaymentPage />
              </MobileLayout>
            } />
            <Route path="/dashboard/*" element={
              <MobileLayout>
                <DashboardPage />
              </MobileLayout>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster />
      </div>
    </AppProvider>
  );
}

export default App;


