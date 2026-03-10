import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { guestTotal, formatDate, today } from '../lib/utils'

export default function Dashboard() {
  const [rooms, setRooms] = useState([])
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: r }, { data: g }] = await Promise.all([
        supabase.from('rooms').select('*').order('num'),
        supabase.from('guests').select('*').order('created_at', { ascending: false }),
      ])
      setRooms(r || [])
      setGuests(g || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="loading"><div className="spinner" /> Loading dashboard…</div>

  const occupied  = rooms.filter(r => r.status === 'occupied').length
  const available = rooms.filter(r => r.status === 'available').length
  const inHouse   = guests.filter(g => g.status === 'in').length
  const totalRev  = guests.filter(g => g.paid).reduce((s, g) => s + guestTotal(g, rooms), 0)
  const todayStr  = today()
  const arrivals  = guests.filter(g => g.date_in === todayStr && g.status === 'in')
  const departures = guests.filter(g => g.date_out === todayStr && g.status === 'in')

  return (
    <>
      {/* STATS */}
      <div className="stats">
        <div className="stat">
          <div className="stat-icon" style={{ background: '#EAF2FB' }}>🏨</div>
          <div>
            <div className="stat-val" style={{ color: 'var(--primary)' }}>{occupied}</div>
            <div className="stat-label">Occupied Rooms</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon" style={{ background: 'var(--green-light)' }}>✅</div>
          <div>
            <div className="stat-val" style={{ color: 'var(--green)' }}>{available}</div>
            <div className="stat-label">Available Rooms</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon" style={{ background: 'var(--amber-light)' }}>👥</div>
          <div>
            <div className="stat-val" style={{ color: 'var(--amber)' }}>{inHouse}</div>
            <div className="stat-label">Guests In-House</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-icon" style={{ background: 'var(--green-light)' }}>💰</div>
          <div>
            <div className="stat-val" style={{ color: 'var(--green)', fontSize: 18 }}>
              ₱{totalRev.toLocaleString()}
            </div>
            <div className="stat-label">Total Collected</div>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div>
          {/* ARRIVALS */}
          <div className="card">
            <div className="card-header"><div className="card-title">📋 Today's Arrivals</div></div>
            {arrivals.length === 0
              ? <div className="empty"><div className="e-icon">📭</div><div className="e-text">No arrivals today</div></div>
              : <div className="table-wrap">
                  <table>
                    <thead><tr><th>Guest</th><th>Room</th><th>Pax</th></tr></thead>
                    <tbody>
                      {arrivals.map(g => (
                        <tr key={g.id}>
                          <td><span className="guest-name">{g.name}</span></td>
                          <td>{g.room_num}</td>
                          <td>{g.pax}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            }
          </div>

          {/* DEPARTURES */}
          <div className="card">
            <div className="card-header"><div className="card-title">🚪 Today's Departures</div></div>
            {departures.length === 0
              ? <div className="empty"><div className="e-icon">📭</div><div className="e-text">No departures today</div></div>
              : <div className="table-wrap">
                  <table>
                    <thead><tr><th>Guest</th><th>Room</th><th>Total</th></tr></thead>
                    <tbody>
                      {departures.map(g => (
                        <tr key={g.id}>
                          <td><span className="guest-name">{g.name}</span></td>
                          <td>{g.room_num}</td>
                          <td>₱{guestTotal(g, rooms).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            }
          </div>
        </div>

        {/* ROOM MAP */}
        <div className="card">
          <div className="card-header"><div className="card-title">🛏 Quick Room Status</div></div>
          <div className="room-grid">
            {rooms.map(r => (
              <div key={r.id} className={`room-tile ${r.status}`} title={`${r.type} · ₱${r.rate?.toLocaleString()}/night`}>
                <div className="rt-num">{r.num}</div>
                <div className="rt-label">{r.type}</div>
                <div className="rt-guest">{r.guest_name || (r.status === 'available' ? 'Free' : r.status)}</div>
              </div>
            ))}
          </div>
          <div className="legend">
            {['available','occupied','cleaning','maintenance'].map(s => (
              <div key={s} className="legend-item">
                <div className={`legend-dot ${s}`} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
