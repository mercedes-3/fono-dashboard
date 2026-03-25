import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTenant() {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    loadTenant()
  }, [])

  async function loadTenant() {
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }
      setUser(session.user)

      const { data: membership } = await supabase
        .from('tenant_members')
        .select('tenant_id, role')
        .eq('user_id', session.user.id)
        .single()

      if (!membership?.tenant_id) { setLoading(false); return }

      const { data: tenantData } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', membership.tenant_id)
        .single()

      setTenant({ ...tenantData, role: membership.role })
    } catch (err) {
      console.error('useTenant error:', err)
    }
    setLoading(false)
  }

  return { tenant, user, loading, reload: loadTenant }
}
