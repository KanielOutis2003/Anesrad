import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { guestTotal, formatDate } from '../lib/utils'

export default function Guests() {
  const [guests, setGuests] = useState([])
  const [rooms, setRooms] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: g }, { data: r }] = await Promise.all([
        supabase.from('guests').select('*').order('created_at', { ascending: false }),
        supabase.from('rooms').select('*'),
      ])
      setGuests(g || [])
      setRooms(r || [])
      setLoading(false)
    }
    load()
  }, [])

  const filtered = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.room_num || '').includes(search)
  )

  if (loading) return <div className="loading"><div className="spinner" /> Loading…</div>

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">👥 Guest Records</div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Search guests…"
          style={{ width: 220, padding: '6px 12px', fontSize: 13 }}
        />
      </div>
      {filtered.length === 0
        ? <div className="empty"><div className="e-icon">🔍</div><div className="e-text">No guests found</div></div>
        : <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th><th>Guest Name</th><th>Contact</th><th>Room</th>
                  <th>Check-in</th><th>Check-out</th><th>Pax</th><th>Status</th><th>Total</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, i) => (
                  <tr key={g.id}>
                    <td>{i + 1}</td>
                    <td>
                      <span className="guest-name">{g.name}</span>
                      <br /><small style={{ color: 'var(--text3)' }}>{g.id_type}</small>
                    </td>
                    <td>{g.phone}</td>
                    <td>{g.room_num}</td>
                    <td>{formatDate(g.date_in)}</td>
                    <td>{formatDate(g.date_out)}</td>
                    <td>{g.pax}</td>
                    <td>
                      <span className={`badge ${g.status === 'in' ? 'badge-in' : 'badge-out'}`}>
                        {g.status === 'in' ? 'In-House' : 'Checked Out'}
                      </span>
                    </td>
                    <td>₱{guestTotal(g, rooms).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      }
    </div>
  )
}
