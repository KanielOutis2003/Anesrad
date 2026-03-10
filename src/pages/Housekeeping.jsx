import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'
import Modal from '../components/Modal'

const PRIORITIES = ['Normal', 'High', 'Urgent']
const STATUS_MAP = {
  done:          ['badge-in',  'Done ✓'],
  'in-progress': ['badge-due', 'In Progress'],
  pending:       ['badge-res', 'Pending'],
}

function PriorityLabel({ p }) {
  const color = p === 'Urgent' ? 'var(--red)' : p === 'High' ? 'var(--amber)' : 'var(--text2)'
  return <span style={{ color, fontWeight: p !== 'Normal' ? 800 : 600 }}>{p}</span>
}

export default function Housekeeping() {
  const [tasks, setTasks] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const [{ data: t }, { data: r }] = await Promise.all([
      supabase.from('housekeeping').select('*').order('created_at', { ascending: false }),
      supabase.from('rooms').select('num').order('num'),
    ])
    setTasks(t || [])
    setRooms(r || [])
    setLoading(false)
  }

  async function markDone(task) {
    await supabase.from('housekeeping').update({ status: 'done' }).eq('id', task.id)
    // If room was cleaning, mark available
    const { data: room } = await supabase.from('rooms').select('status').eq('num', task.room_num).single()
    if (room?.status === 'cleaning') {
      await supabase.from('rooms').update({ status: 'available' }).eq('num', task.room_num)
    }
    toast.success(`Task done — Room ${task.room_num}`)
    load()
  }

  async function removeTask(id) {
    await supabase.from('housekeeping').delete().eq('id', id)
    toast('🗑 Task removed')
    setTasks(ts => ts.filter(t => t.id !== id))
  }

  async function addTask(room_num, task, staff, priority) {
    if (!task) { toast.error('Please enter a task.'); return false }
    const { error } = await supabase.from('housekeeping').insert({
      room_num, task, staff: staff || 'Unassigned', priority, status: 'pending',
    })
    if (error) { toast.error(error.message); return false }
    toast.success(`Task added for Room ${room_num}`)
    load()
    return true
  }

  if (loading) return <div className="loading"><div className="spinner" /> Loading…</div>

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="card-title">🧹 Housekeeping Tasks</div>
          <button className="btn btn-primary btn-sm" onClick={() => setAddOpen(true)}>+ Add Task</button>
        </div>
        {tasks.length === 0
          ? <div className="empty"><div className="e-icon">🧹</div><div className="e-text">No housekeeping tasks</div></div>
          : <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Room</th><th>Task</th><th>Assigned To</th><th>Priority</th><th>Status</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {tasks.map(t => {
                    const [cls, label] = STATUS_MAP[t.status] || ['badge-res', t.status]
                    return (
                      <tr key={t.id}>
                        <td><strong>{t.room_num}</strong></td>
                        <td>{t.task}</td>
                        <td>{t.staff}</td>
                        <td><PriorityLabel p={t.priority} /></td>
                        <td><span className={`badge ${cls}`}>{label}</span></td>
                        <td>
                          <div className="actions-row">
                            {t.status !== 'done' && (
                              <button className="btn btn-success btn-sm" onClick={() => markDone(t)}>Mark Done</button>
                            )}
                            <button className="btn btn-outline btn-sm" onClick={() => removeTask(t.id)}>Remove</button>
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

      {addOpen && (
        <AddTaskModal
          rooms={rooms}
          onClose={() => setAddOpen(false)}
          onAdd={addTask}
        />
      )}
    </>
  )
}

function AddTaskModal({ rooms, onClose, onAdd }) {
  const [room_num, setRoomNum] = useState(rooms[0]?.num || '')
  const [task, setTask] = useState('')
  const [staff, setStaff] = useState('')
  const [priority, setPriority] = useState('Normal')
  const [saving, setSaving] = useState(false)

  async function handle() {
    setSaving(true)
    const ok = await onAdd(room_num, task, staff, priority)
    setSaving(false)
    if (ok) onClose()
  }

  return (
    <Modal title="Add Housekeeping Task" onClose={onClose}>
      <div className="form-grid">
        <div className="form-group">
          <label>Room *</label>
          <select value={room_num} onChange={e => setRoomNum(e.target.value)}>
            {rooms.map(r => <option key={r.num} value={r.num}>{r.num}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </div>
        <div className="form-group form-full">
          <label>Task Description *</label>
          <input value={task} onChange={e => setTask(e.target.value)} placeholder="e.g. Standard Cleaning" />
        </div>
        <div className="form-group form-full">
          <label>Assign To</label>
          <input value={staff} onChange={e => setStaff(e.target.value)} placeholder="Staff name" />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" style={{ flex: 2 }} onClick={handle} disabled={saving}>
          {saving ? 'Adding…' : 'Add Task'}
        </button>
      </div>
    </Modal>
  )
}
