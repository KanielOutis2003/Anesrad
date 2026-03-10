import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { guestTotal, formatDate, nightsBetween } from '../lib/utils'
import Modal from '../components/Modal'

export default function CheckOut() {
  const [guests, setGuests] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [billGuest, setBillGuest] = useState(null)
  const [working, setWorking] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    const [{ data: g }, { data: r }] = await Promise.all([
      supabase.from('guests').select('*').eq('status', 'in').order('date_out'),
      supabase.from('rooms').select('*'),
    ])
    setGuests(g || [])
    setRooms(r || [])
    setLoading(false)
  }

  async function doCheckout(g) {
    setWorking(g.id)
    await supabase.from('guests').update({ status: 'out', paid: true }).eq('id', g.id)
    await supabase.from('rooms').update({ status: 'cleaning', guest_name: '' }).eq('num', g.room_num)
    toast.success(`${g.name} checked out from Room ${g.room_num}`)
    setBillGuest(null)
    setWorking(null)
    load()
  }

  if (loading) return <div className="loading"><div className="spinner" /> Loading…</div>

  return (
    <>
      <div className="card">
        <div className="card-header"><div className="card-title">🚪 Process Check-out</div></div>
        {guests.length === 0
          ? <div className="empty"><div className="e-icon">✅</div><div className="e-text">No guests currently checked in</div></div>
          : <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Guest</th><th>Room</th><th>Check-in</th><th>Check-out</th>
                    <th>Nights</th><th>Rate/Night</th><th>Total</th><th>Status</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map(g => {
                    const room = rooms.find(r => r.num === g.room_num)
                    const nights = nightsBetween(g.date_in, g.date_out)
                    const total = guestTotal(g, rooms)
                    return (
                      <tr key={g.id}>
                        <td><span className="guest-name">{g.name}</span></td>
                        <td>{g.room_num}</td>
                        <td>{formatDate(g.date_in)}</td>
                        <td>{formatDate(g.date_out)}</td>
                        <td>{nights}</td>
                        <td>₱{(room?.rate || 0).toLocaleString()}</td>
                        <td><strong>₱{total.toLocaleString()}</strong></td>
                        <td><span className="badge badge-in">In-House</span></td>
                        <td>
                          <div className="actions-row">
                            <button className="btn btn-outline btn-sm" onClick={() => setBillGuest(g)}>View Bill</button>
                            <button className="btn btn-danger btn-sm" disabled={working === g.id}
                              onClick={() => doCheckout(g)}>
                              {working === g.id ? '…' : 'Check Out'}
                            </button>
                          </div>
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
        <Modal title={`🧾 Bill — ${billGuest.name}`} onClose={() => setBillGuest(null)}>
          <BillReceipt guest={billGuest} rooms={rooms} />
          <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setBillGuest(null)}>Close</button>
            <button className="btn btn-success" style={{ flex: 2 }} disabled={working === billGuest.id}
              onClick={() => doCheckout(billGuest)}>
              {working === billGuest.id ? 'Processing…' : '✓ Confirm Check-out & Mark Paid'}
            </button>
          </div>
        </Modal>
      )}
    </>
  )
}

function BillReceipt({ guest: g, rooms }) {
  const room = rooms.find(r => r.num === g.room_num)
  const nights = nightsBetween(g.date_in, g.date_out)
  const rate = room?.rate || 0
  const roomTotal = nights * rate
  const extra = g.extra || 0
  const total = roomTotal + extra

  return (
    <div className="receipt">
      {[
        ['Guest', g.name],
        ['Room', `${g.room_num} (${room?.type || ''})`],
        ['Check-in', new Date(g.date_in).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })],
        ['Check-out', new Date(g.date_out).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })],
        ['Nights', nights],
        ['Rate/Night', `₱${rate.toLocaleString()}`],
        ['Room Total', `₱${roomTotal.toLocaleString()}`],
        ['Extra Charges', `₱${extra.toLocaleString()}`],
      ].map(([label, val]) => (
        <div key={label} className="receipt-row"><span>{label}</span><span>{val}</span></div>
      ))}
      <div className="receipt-row total"><span>TOTAL DUE</span><span>₱{total.toLocaleString()}</span></div>
    </div>
  )
}
