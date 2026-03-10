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

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? (
    <>
      <Notifications />
      {children}
    </>
  ) : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
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
