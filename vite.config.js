import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useRealtimeNotifications(tenantId) {
  const [notifications, setNotifications] = useState([])

  const add = useCallback((n) => {
    const id = crypto.randomUUID()
    setNotifications(prev => [{ ...n, id }, ...prev].slice(0, 8))
    setTimeout(() => setNotifications(prev => prev.filter(x => x.id !== id)), 6000)
  }, [])

  const dismiss = useCallback((id) => setNotifications(prev => prev.filter(n => n.id !== id)), [])

  useEffect(() => {
    if (!tenantId) return
    const ch1 = supabase.channel(`leads-${tenantId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads', filter: `tenant_id=eq.${tenantId}` }, (p) => {
        add({ type: 'lead', title: 'New Lead', message: p.new.phone?.startsWith('web_') ? 'Web chat inquiry' : `Call from ${p.new.phone}`, time: new Date() })
      }).subscribe()
    const ch2 = supabase.channel(`appts-${tenantId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'appointment_requests', filter: `tenant_id=eq.${tenantId}` }, (p) => {
        add({ type: 'appointment', title: 'Appointment Request', message: `${p.new.customer_name || 'Someone'} — ${p.new.preferred_time_text || 'time TBD'}`, time: new Date() })
      }).subscribe()
    return () => { supabase.removeChannel(ch1); supabase.removeChannel(ch2) }
  }, [tenantId, add])

  return { notifications, dismiss }
}
