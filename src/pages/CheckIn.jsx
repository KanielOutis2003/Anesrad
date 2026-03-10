import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import { today } from '../lib/utils'

const EMPTY = {
  name: '', phone: '', id_type: '', id_num: '',
  room_num: '', pax: 1, date_in: today(), date_out: '', notes: '',
}

export default function CheckIn() {
  const [rooms, setRooms] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadRooms() }, [])

  async function loadRooms() {
    const { data } = await supabase.from('rooms').select('*').eq('status', 'available').order('num')
    setRooms(data || [])
  }

  function set(field, val) { setForm(f => ({ ...f, [field]: val })) }

  async function handleSubmit() {
    if (!form.name || !form.room_num || !form.date_in || !form.date_out) {
      toast.error('Please fill in all required fields.'); return
    }
    if (form.date_out <= form.date_in) {
      toast.error('Check-out must be after check-in.'); return
    }

    setSaving(true)

    // Insert guest
    const { error: gErr } = await supabase.from('guests').insert({
      name: form.name, phone: form.phone,
      id_type: form.id_type, id_num: form.id_num,
      room_num: form.room_num, pax: Number(form.pax),
      date_in: form.date_in, date_out: form.date_out,
      notes: form.notes, status: 'in', paid: false, extra: 0,
    })

    if (gErr) { toast.error('Error: ' + gErr.message); setSaving(false); return }

    // Update room status
    const shortName = form.name.split(' ').slice(0,2).map((w,i) => i===0 ? w : w[0]+'.').join(' ')
    await supabase.from('rooms').update({ status: 'occupied', guest_name: shortName })
      .eq('num', form.room_num)

    toast.success(`${form.name} checked into Room ${form.room_num}`)
    setForm(EMPTY)
    loadRooms()
    setSaving(false)
  }

  return (
    <div className="card">
      <div className="card-header"><div className="card-title">🔑 New Guest Check-in</div></div>
      <div className="card-body">
        <div className="form-grid">
          <div className="form-group">
            <label>Guest Full Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Maria Santos" />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="09XX-XXX-XXXX" />
          </div>
          <div className="form-group">
            <label>ID Type</label>
            <select value={form.id_type} onChange={e => set('id_type', e.target.value)}>
              <option value="">Select ID type</option>
              {["Driver's License","Passport","PhilSys / National ID","SSS / GSIS ID","Voter's ID"].map(t =>
                <option key={t}>{t}</option>
              )}
            </select>
          </div>
          <div className="form-group">
            <label>ID Number</label>
            <input value={form.id_num} onChange={e => set('id_num', e.target.value)} placeholder="ID number" />
          </div>
          <div className="form-group">
            <label>Room *</label>
            <select value={form.room_num} onChange={e => set('room_num', e.target.value)}>
              <option value="">Select available room</option>
              {rooms.map(r => (
                <option key={r.id} value={r.num}>
                  {r.num} — {r.type} (₱{r.rate?.toLocaleString()}/night)
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Number of Guests</label>
            <input type="number" value={form.pax} onChange={e => set('pax', e.target.value)} min="1" max="10" />
          </div>
          <div className="form-group">
            <label>Check-in Date *</label>
            <input type="date" value={form.date_in} onChange={e => set('date_in', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Check-out Date *</label>
            <input type="date" value={form.date_out} onChange={e => set('date_out', e.target.value)} />
          </div>
          <div className="form-group form-full">
            <label>Special Requests / Notes</label>
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any special requests..." />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-outline" onClick={() => setForm(EMPTY)}>Clear Form</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving…' : '✓ Confirm Check-in'}
          </button>
        </div>
      </div>
    </div>
  )
}
