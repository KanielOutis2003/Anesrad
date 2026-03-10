import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { guestTotal, nightsBetween } from '../lib/utils'
import Modal from '../components/Modal'

export default function Billing() {
  const [guests, setGuests] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [billGuest, setBillGuest] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    const [{ data: g }, { data: r }] = await Promise.all([
      supabase.from('guests').select('*').order('created_at', { ascending: false }),
      supabase.from('rooms').select('*'),
    ])
    setGuests(g || [])
    setRooms(r || [])
    setLoading(false)
  }

  async function updateExtra(gid, val) {
    await supabase.from('guests').update({ extra: parseFloat(val) || 0 }).eq('id', gid)
    setGuests(gs => gs.map(g => g.id === gid ? { ...g, extra: parseFloat(val) || 0 } : g))
  }

  async function markPaid(gid) {
    await supabase.from('guests').update({ paid: true }).eq('id', gid)
    const g = guests.find(g => g.id === gid)
    toast.success(`Payment recorded for ${g?.name}`)
    setGuests(gs => gs.map(g => g.id === gid ? { ...g, paid: true } : g))
  }

  if (loading) return <div className="loading"><div className="spinner" /> Loading…</div>

  return (
    <>
      <div className="card">
        <div className="card-header"><div className="card-title">🧾 Billing & Payments</div></div>
        {guests.length === 0
          ? <div className="empty"><div className="e-icon">🧾</div><div className="e-text">No billing records yet</div></div>
          : <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Guest</th><th>Room</th><th>Nights</th><th>Room Total</th>
                    <th>Extra (₱)</th><th>Grand Total</th><th>Paid?</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map(g => {
                    const room = rooms.find(r => r.num === g.room_num)
                    const nights = nightsBetween(g.date_in, g.date_out)
                    const rate = room?.rate || 0
                    const roomTotal = nights * rate
                    const extra = g.extra || 0
                    const total = roomTotal + extra
                    return (
                      <tr key={g.id}>
                        <td><span className="guest-name">{g.name}</span></td>
                        <td>{g.room_num}</td>
                        <td>{nights}</td>
                        <td>₱{roomTotal.toLocaleString()}</td>
                        <td>
                          <input
                            type="number"
                            defaultValue={extra}
                            min="0"
                            className="extra-input"
                            onBlur={e => updateExtra(g.id, e.target.value)}
                          />
                        </td>
                        <td><strong>₱{total.toLocaleString()}</strong></td>
                        <td>
                          {g.paid
                            ? <span className="badge badge-in">✓ Paid</span>
                            : <button className="btn btn-success btn-sm" onClick={() => markPaid(g.id)}>Mark Paid</button>
                          }
                        </td>
                        <td>
                          <button className="btn btn-outline btn-sm" onClick={() => setBillGuest(g)}>View</button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
        }
      </div>

      {billGuest && (
        <Modal title={`🧾 Receipt — ${billGuest.name}`} onClose={() => setBillGuest(null)}>
          {(() => {
            const room = rooms.find(r => r.num === billGuest.room_num)
            const nights = nightsBetween(billGuest.date_in, billGuest.date_out)
            const rate = room?.rate || 0
            const roomTotal = nights * rate
            const extra = billGuest.extra || 0
            const total = roomTotal + extra
            return (
              <div className="receipt">
                {[
                  ['Guest', billGuest.name],
                  ['Room', `${billGuest.room_num} (${room?.type || ''})`],
                  ['Nights', nights],
                  ['Rate/Night', `₱${rate.toLocaleString()}`],
                  ['Room Total', `₱${roomTotal.toLocaleString()}`],
                  ['Extra Charges', `₱${extra.toLocaleString()}`],
                ].map(([l, v]) => (
                  <div key={l} className="receipt-row"><span>{l}</span><span>{v}</span></div>
                ))}
                <div className="receipt-row total"><span>TOTAL DUE</span><span>₱{total.toLocaleString()}</span></div>
              </div>
            )
          })()}
          <div style={{ marginTop: 14 }}>
            <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => setBillGuest(null)}>Close</button>
          </div>
        </Modal>
      )}
    </>
  )
}
