import { useLocation, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { todayLong } from '../lib/utils'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useEffect, useState } from 'react'

const NAV = [
  { path: '/',            icon: '📊', label: 'Dashboard' },
  { path: '/checkin',     icon: '🔑', label: 'Check-in' },
  { path: '/checkout',    icon: '🚪', label: 'Check-out' },
  { path: '/rooms',       icon: '🛏', label: 'Rooms' },
  { path: '/guests',      icon: '👥', label: 'Guests' },
  { path: '/billing',     icon: '🧾', label: 'Billing' },
  { path: '/housekeeping',icon: '🧹', label: 'Housekeeping' },
]

const PAGE_TITLES = {
  '/':             'Dashboard',
  '/checkin':      'Check-in',
  '/checkout':     'Check-out',
  '/rooms':        'Room Management',
  '/guests':       'Guest Records',
  '/billing':      'Billing & Payments',
  '/housekeeping': 'Housekeeping',
}

export default function Layout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })
  }, [])

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Error logging out: ' + error.message);
      } else {
        localStorage.removeItem('isAuthenticated');
        toast.success('Logged out successfully');
        navigate('/login');
      }
    }
  }

  const getInitials = (email) => {
    if (!email) return '??'
    return email.substring(0, 2).toUpperCase()
  }

  const getName = (email) => {
    if (!email) return 'User'
    return email.split('@')[0]
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <img src="/favicon.jpg" alt="Logo" style={{ width: 32, height: 32 }} />
          <div>
            <div className="logo-name">Anesrad Inn</div>
            <div className="logo-sub">Hotel System</div>
          </div>
        </div>

        <nav className="nav">
          {NAV.map(item => (
            <button
              key={item.path}
              className={`nav-item${location.pathname === item.path ? ' active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="ni">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <button className="nav-item logout-btn" onClick={handleLogout} style={{ marginTop: 'auto', color: '#ff4d4f' }}>
            <span className="ni"><LogOut size={18} /></span>
            Logout
          </button>
        </nav>

        <div className="sidebar-user">
          <div className="su-ava">{user ? getInitials(user.email) : '...'}</div>
          <div>
            <div className="su-name">{user ? getName(user.email) : 'Loading...'}</div>
            <div className="su-role">{user ? 'Administrator' : ''}</div>
          </div>
        </div>
      </aside>

      <div className="main">
        <div className="topbar">
          <div>
            <div className="page-title">
              {PAGE_TITLES[location.pathname] || 'Dashboard'}
            </div>
            <div className="page-date">{todayLong()}</div>
          </div>
        </div>

        <div className="content">
          {children}
        </div>
      </div>
    </div>
  )
}
