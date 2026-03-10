import { useLocation, useNavigate } from 'react-router-dom'
import { todayLong } from '../lib/utils'

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

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-name">🏨 Anesrad Inn</div>
          <div className="logo-sub">Hotel System</div>
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
        </nav>

        <div className="sidebar-user">
          <div className="su-ava">JC</div>
          <div>
            <div className="su-name">Jecu Cutanda</div>
            <div className="su-role">Administrator</div>
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
