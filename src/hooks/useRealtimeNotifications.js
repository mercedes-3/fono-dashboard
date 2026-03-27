// src/hooks/useRealtimeNotifications.js
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useRealtimeNotifications(tenantId) {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((notification) => {
    const id = crypto.randomUUID()
    setNotifications(prev => [{ ...notification, id }, ...prev].slice(0, 10))
    // Auto-remove after 6 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 6000)
  }, [])

  const dismiss = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  useEffect(() => {
    if (!tenantId) return

    // Subscribe to new leads
    const leadsChannel = supabase
      .channel(`leads-${tenantId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leads',
          filter: `tenant_id=eq.${tenantId}`,
        },
        (payload) => {
          const lead = payload.new
          addNotification({
            type: 'lead',
            title: '🔔 New Lead',
            message: lead.phone?.startsWith('web_')
              ? 'New web chat inquiry received'
              : `Call from ${lead.phone}`,
            time: new Date(),
          })
        }
      )
      .subscribe()

    // Subscribe to new appointment requests
    const apptsChannel = supabase
      .channel(`appts-${tenantId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'appointment_requests',
          filter: `tenant_id=eq.${tenantId}`,
        },
        (payload) => {
          const appt = payload.new
          addNotification({
            type: 'appointment',
            title: '📅 Appointment Request',
            message: `${appt.customer_name || 'Someone'} wants ${appt.service_type || 'service'} — ${appt.preferred_time_text || 'time TBD'}`,
            time: new Date(),
          })
        }
      )
      .subscribe()

    // Subscribe to appointment status changes (confirmed/declined)
    const statusChannel = supabase
      .channel(`appt-status-${tenantId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'appointment_requests',
          filter: `tenant_id=eq.${tenantId}`,
        },
        (payload) => {
          const appt = payload.new
          if (appt.status === 'confirmed') {
            addNotification({
              type: 'confirmed',
              title: '✅ Appointment Confirmed',
              message: `${appt.customer_name || 'Customer'} confirmed for ${appt.preferred_time_text}`,
              time: new Date(),
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(leadsChannel)
      supabase.removeChannel(apptsChannel)
      supabase.removeChannel(statusChannel)
    }
  }, [tenantId, addNotification])

  return { notifications, dismiss }
}
