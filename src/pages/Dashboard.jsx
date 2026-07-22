import { useRealtime } from '../hooks/useRealtime'
import { guestTotal, today } from '../lib/utils'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Download, TrendingUp, Users, Home, DollarSign } from 'lucide-react'

export default function Dashboard() {
  const { data: rooms, loading: rLoad } = useRealtime('rooms', { orderBy: 'num', ascending: true })
  const { data: guests, loading: gLoad } = useRealtime('guests', { orderBy: 'created_at' })

  if (rLoad || gLoad) return <div className="loading"><div className="spinner" /> Loading dashboard…</div>

  const occupied  = rooms.filter(r => r.status === 'occupied').length
  const available = rooms.filter(r => r.status === 'available').length
  const inHouse   = guests.filter(g => g.status === 'in').length
  const totalRev  = guests.filter(g => g.paid).reduce((s, g) => s + guestTotal(g, rooms), 0)
  const todayStr  = today()
  const arrivals  = guests.filter(g => g.date_in === todayStr && g.status === 'in')
  const departures = guests.filter(g => g.date_out === todayStr && g.status === 'in')

  // Mock data for charts
  const revenueData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 2000 },
    { name: 'Thu', revenue: 2780 },
    { name: 'Fri', revenue: 1890 },
    { name: 'Sat', revenue: 2390 },
    { name: 'Sun', revenue: 3490 },
  ];

  const occupancyData = [
    { name: 'Mon', occupied: 12 },
    { name: 'Tue', occupied: 15 },
    { name: 'Wed', occupied: 10 },
    { name: 'Thu', occupied: 18 },
    { name: 'Fri', occupied: 20 },
    { name: 'Sat', occupied: 22 },
    { name: 'Sun', occupied: 15 },
  ];

  const handleDownloadCSV = () => {
    const headers = ['ID', 'Name', 'Room', 'Check-in', 'Check-out', 'Pax', 'Status', 'Paid'];
    const csvRows = guests.map(g => [
      g.id, g.name, g.room_num, g.date_in, g.date_out, g.pax, g.status, g.paid
    ]);
    
    const csvContent = [headers, ...csvRows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `guests_report_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 10, height: 10, borderRadius: '50%', background: '#10b981',
            display: 'inline-block', animation: 'pulse 2s infinite',
          }} />
          <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 600 }}>System Live</span>
        </div>
        <button className="btn btn-outline" onClick={handleDownloadCSV} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: '#eff6ff', color: '#3b82f6' }}><Home size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Occupied</span>
            <span className="stat-value">{occupied}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: '#f0fdf4', color: '#22c55e' }}><TrendingUp size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Available</span>
            <span className="stat-value">{available}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: '#fffbeb', color: '#f59e0b' }}><Users size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Guests</span>
            <span className="stat-value">{inHouse}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}><DollarSign size={24} /></div>
          <div className="stat-info">
            <span className="stat-label">Revenue</span>
            <span className="stat-value">₱{totalRev.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="charts-row">
        <div className="card chart-card">
          <div className="card-header"><div className="card-title">Revenue Trend (Last 7 Days)</div></div>
          <div className="card-body" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card chart-card">
          <div className="card-header"><div className="card-title">Occupancy Rate</div></div>
          <div className="card-body" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupancyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="occupied" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
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

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  )
}
