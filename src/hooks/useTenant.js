import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useTenant() {
  const [tenant, setTenant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        loadTenant(session)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUser(session.user)
        loadTenant(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadTenant(session) {
    setLoading(true)
    try {
      const { data: membership, error: memberErr } = await supabase
        .from('tenant_members')
        .select('tenant_id, role')
        .eq('user_id', session.user.id)
        .single()

      console.log('membership:', membership, 'error:', memberErr)

      if (!membership?.tenant_id) {
        setLoading(false)
        return
      }

      const { data: tenantData, error: tenantErr } = await supabase
        .from('tenants')
        .select('*')
        .eq('id', membership.tenant_id)
        .single()

      console.log('tenant:', tenantData, 'error:', tenantErr)
      setTenant({ ...tenantData, role: membership.role })
    } catch (err) {
      console.error('useTenant error:', err)
    }
    setLoading(false)
  }

  return { tenant, user, loading, reload: () => supabase.auth.getSession().then(({ data: { session } }) => loadTenant(session)) }
}
