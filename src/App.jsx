import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CheckIn from './pages/CheckIn'
import CheckOut from './pages/CheckOut'
import Rooms from './pages/Rooms'
import Guests from './pages/Guests'
import Billing from './pages/Billing'
import Housekeeping from './pages/Housekeeping'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Notifications from './components/Notifications'
import { supabase } from './lib/supabase'

const ProtectedRoute = ({ children, session }) => {
  if (session === undefined) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Checking authentication...</p>
        <style>{`
          .loading-screen {
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            color: #64748b;
          }
          .loader {
            width: 40px;
            height: 40px;
            border: 4px solid #e2e8f0;
            border-top: 4px solid #2563eb;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Notifications />
      {children}
    </>
  );
};

export default function App() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Routes>
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute session={session}>
            <Layout>
              <Routes>
                <Route path="/"             element={<Dashboard />} />
                <Route path="/checkin"      element={<CheckIn />} />
                <Route path="/checkout"     element={<CheckOut />} />
                <Route path="/rooms"        element={<Rooms />} />
                <Route path="/guests"       element={<Guests />} />
                <Route path="/billing"      element={<Billing />} />
                <Route path="/housekeeping" element={<Housekeeping />} />
                <Route path="*"             element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}
