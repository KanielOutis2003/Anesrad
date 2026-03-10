import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

/**
 * useRealtime(table, options)
 * Fetches data from a Supabase table and subscribes to live changes.
 * Automatically re-fetches on INSERT, UPDATE, DELETE.
 *
 * @param {string} table - Supabase table name
 * @param {object} options
 *   @param {string}   options.orderBy    - column to order by (default: 'created_at')
 *   @param {boolean}  options.ascending  - sort direction (default: false)
 *   @param {object[]} options.filters    - [{ column, value }] eq filters
 */
export function useRealtime(table, { orderBy = 'created_at', ascending = false, filters = [] } = {}) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = useCallback(async () => {
    let query = supabase.from(table).select('*').order(orderBy, { ascending })
    filters.forEach(f => { query = query.eq(f.column, f.value) })
    const { data: rows, error: err } = await query
    if (err) { setError(err.message); setLoading(false); return }
    setData(rows || [])
    setLoading(false)
  }, [table, orderBy, ascending, JSON.stringify(filters)])

  useEffect(() => {
    fetch()

    // Subscribe to all changes on this table
    const channel = supabase
      .channel(`realtime:${table}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        fetch() // re-fetch on any change
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}
