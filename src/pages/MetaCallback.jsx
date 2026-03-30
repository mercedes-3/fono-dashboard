import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function MetaCallback() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('Connecting your Facebook page...')
  const [error, setError] = useState(null)

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get('code')
      const tenantId = searchParams.get('state')

      if (!code || !tenantId) {
        setError('Missing authorization code or tenant ID. Please try connecting again from Setup.')
        return
      }

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setError('You must be logged in. Redirecting...')
          setTimeout(() => navigate('/'), 2000)
          return
        }

        const res = await fetch('https://nosnibbbggmlzavfylcd.supabase.co/functions/v1/meta-oauth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`
          },
         body: JSON.stringify({ code, tenant_id: tenantId, redirect_uri: window.location.origin + '/meta-callback' })
        })

        const data = await res.json()

        if (data.success) {
          setStatus('Facebook connected successfully! Redirecting...')
          setTimeout(() => navigate('/dashboard'), 2000)
        } else {
          setError(data.error || 'Failed to connect Facebook. Please try again.')
        }
      } catch (e) {
        setError(e.message)
      }
    }

    handleCallback()
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--black)' }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        {error ? (
          <>
            <div style={{ fontSize: 32, marginBottom: 16 }}>✕</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 300, color: 'var(--text)', marginBottom: 8 }}>Connection Failed</div>
            <div style={{ fontSize: 12, color: 'var(--red)', lineHeight: 1.6, marginBottom: 24 }}>{error}</div>
            <a href="/dashboard" style={{ fontSize: 11, color: 'var(--platinum)', textDecoration: 'none', letterSpacing: '0.04em' }}>Back to Dashboard</a>
          </>
        ) : (
          <>
            <div className="spinner" style={{ width: 24, height: 24, margin: '0 auto 16px', borderTopColor: 'var(--platinum)' }} />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 300, color: 'var(--text)', marginBottom: 8 }}>{status}</div>
            <div style={{ fontSize: 11, color: 'var(--text-4)' }}>Please wait...</div>
          </>
        )}
      </div>
    </div>
  )
}
