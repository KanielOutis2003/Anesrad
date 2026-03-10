export function nightsBetween(a, b) {
  const d = (new Date(b) - new Date(a)) / 86400000
  return isNaN(d) || d < 0 ? 0 : d
}

export function guestTotal(guest, rooms) {
  const room = rooms.find(r => r.num === guest.room_num)
  const rate = room ? room.rate : 0
  const nights = nightsBetween(guest.date_in, guest.date_out)
  return nights * rate + (guest.extra || 0)
}

export function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-PH', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export function today() {
  return new Date().toISOString().split('T')[0]
}

export function todayLong() {
  return new Date().toLocaleDateString('en-PH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}
