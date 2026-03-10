import { useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { useRealtime } from '../hooks/useRealtime'
import Modal from '../components/Modal'

const STATUSES = ['available','occupied','cleaning','maintenance']
const TYPES = ['Standard','Deluxe','Suite']

export default function Rooms() {
  const { data: rooms, loading } = useRealtime('rooms', { orderBy: 'num', ascending: true })
  const [editRoom, setEditRoom] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  async function saveEdit() {
    setSaving(true)
    const { error } = await supabase.from('rooms').update({
      type: editRoom.type,
      rate: Number(editRoom.rate),
      status: editRoom.status,
      guest_name: editRoom.status !== 'occupied' ? '' : editRoom.guest_name,
    }).eq('id', editRoom.id)
    if (error) { toast.error(error.message); setSaving(false); return }
    toast.success(`Room ${editRoom.num} updated`)
    setEditRoom(null)
    setSaving(false)
    // useRealtime auto-updates
  }

  async function addRoom(num, type, rate) {
    if (!num || !rate) { toast.error('Please fill in all fields.'); return }
    setSaving(true)
    const { error } = await supabase.from('rooms').insert({ num, type, rate: Number(rate), status: 'available', guest_name: '' })
    if (error) { toast.error(error.message); setSaving(false); return }
    toast.success(`Room ${num} added`)
    setAddOpen(false)
    setSaving(false)
    // useRealtime auto-updates
  }

  if (loading) return <div className="loading"><div className="spinner" /> Loading…</div>

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">🛏 All Rooms</div>
          <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>+ Add Room</button>
        </div>
        <div className="room-grid">
          {rooms.map(r => (
            <div key={r.id} className={`room-tile ${r.status}`} onClick={() => setEditRoom({ ...r })}>
              <div className="rt-num">{r.num}</div>
              <div className="rt-label">{r.type}</div>
              <div className="rt-guest">
                {r.guest_name || (r.status === 'available' ? `₱${r.rate?.toLocaleString()}` : r.status)}
              </div>
            </div>
          ))}
        </div>
        <div className="legend">
          {STATUSES.map(s => (
            <div key={s} className="legend-item">
              <div className={`legend-dot ${s}`} />
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editRoom && (
        <Modal title={`Room ${editRoom.num} — ${editRoom.type}`} onClose={() => setEditRoom(null)}>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Room Number</label>
            <input value={editRoom.num} disabled style={{ background: 'var(--bg)' }} />
          </div>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Room Type</label>
            <select value={editRoom.type} onChange={e => setEditRoom(r => ({ ...r, type: e.target.value }))}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Rate per Night (₱)</label>
            <input type="number" value={editRoom.rate} min="0"
              onChange={e => setEditRoom(r => ({ ...r, rate: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label>Status</label>
            <select value={editRoom.status} onChange={e => setEditRoom(r => ({ ...r, status: e.target.value }))}>
              {STATUSES.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setEditRoom(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 2 }} onClick={saveEdit} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </Modal>
      )}

      {/* ADD MODAL */}
      {addOpen && <AddRoomModal onClose={() => setAddOpen(false)} onAdd={addRoom} saving={saving} />}
    </>
  )
}

function AddRoomModal({ onClose, onAdd, saving }) {
  const [num, setNum] = useState('')
  const [type, setType] = useState('Standard')
  const [rate, setRate] = useState('')
  return (
    <Modal title="Add New Room" onClose={onClose}>
      <div className="form-grid">
        <div className="form-group">
          <label>Room Number *</label>
          <input value={num} onChange={e => setNum(e.target.value)} placeholder="e.g. 301" />
        </div>
        <div className="form-group">
          <label>Room Type *</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            {['Standard','Deluxe','Suite'].map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div className="form-group form-full">
          <label>Rate per Night (₱) *</label>
          <input type="number" value={rate} onChange={e => setRate(e.target.value)} placeholder="1500" min="0" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 2 }} disabled={saving}
          onClick={() => onAdd(num, type, rate)}>
          {saving ? 'Adding…' : 'Add Room'}
        </button>
      </div>
    </Modal>
  )
}
