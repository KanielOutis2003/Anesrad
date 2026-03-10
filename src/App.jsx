import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CheckIn from './pages/CheckIn'
import CheckOut from './pages/CheckOut'
import Rooms from './pages/Rooms'
import Guests from './pages/Guests'
import Billing from './pages/Billing'
import Housekeeping from './pages/Housekeeping'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"             element={<Dashboard />} />
        <Route path="/checkin"      element={<CheckIn />} />
        <Route path="/checkout"     element={<CheckOut />} />
        <Route path="/rooms"        element={<Rooms />} />
        <Route path="/guests"       element={<Guests />} />
        <Route path="/billing"      element={<Billing />} />
        <Route path="/housekeeping" element={<Housekeeping />} />
      </Routes>
    </Layout>
  )
}
