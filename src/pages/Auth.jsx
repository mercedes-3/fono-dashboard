import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Sign in state
  const [siEmail, setSiEmail] = useState('')
  const [siPassword, setSiPassword] = useState('')

  // Sign up state
  const [suEmail, setSuEmail] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [suBusiness, setSuBusiness] = useState('')
  const [suPhone, setSuPhone] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard')
    })
  }, [navigate])

  const formatPhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) return `+1${cleaned}`
    if (cleaned.length === 11 && cleaned.startsWith('1')) return `+${cleaned}`
    return phone
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: siEmail, password: siPassword })
    if (error) setError(error.message)
    else navigate('/dashboard')
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    if (!suBusiness || !suEmail || !suPassword || !suPhone) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: suEmail,
      password: suPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: { business_name: suBusiness, owner_phone: formatPhone(suPhone) }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // Create tenant
    const token = data?.session?.access_token
    if (token) {
      try {
        const res = await fetch('https://nosnibbbggmlzavfylcd.supabase.co/functions/v1/create-tenant', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: suBusiness,
            dispatch_phone: formatPhone(suPhone),
            pilot_mode: true,
          })
        })
        const tenantData = await res.json()
        console.log('Tenant created:', tenantData?.tenant?.id)
      } catch (err) {
        console.error('Tenant creation failed:', err)
      }
      navigate('/onboarding')
    } else {
      setError('Account created! Please check your email to confirm, then sign in.')
    }

    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }} className="fade-in">
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 8,
          }}>
            <div style={{
              width: 36, height: 36,
              background: 'var(--accent)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em' }}>fono</span>
          </div>
          <p style={{ color: 'var(--text-3)', fontSize: 13 }}>AI Receptionist for Service Businesses</p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-3)',
          borderRadius: 10,
          padding: 4,
          marginBottom: 20,
          border: '1px solid var(--border)',
        }}>
          {['signin', 'signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError('') }} style={{
              flex: 1,
              padding: '8px',
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.15s',
              background: tab === t ? 'var(--bg-2)' : 'transparent',
              color: tab === t ? 'var(--text)' : 'var(--text-3)',
              border: tab === t ? '1px solid var(--border)' : '1px solid transparent',
            }}>
              {t === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="card">
          {error && (
            <div style={{
              background: 'var(--red-dim)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
              padding: '10px 13px',
              fontSize: 13,
              color: 'var(--red)',
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {tab === 'signin' ? (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="you@example.com" value={siEmail} onChange={e => setSiEmail(e.target.value)} required />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="••••••••" value={siPassword} onChange={e => setSiPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
                {loading ? <><span className="spinner" />Signing in...</> : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label">Business Name</label>
                <input className="input" type="text" placeholder="ABC Plumbing" value={suBusiness} onChange={e => setSuBusiness(e.target.value)} required />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="you@example.com" value={suEmail} onChange={e => setSuEmail(e.target.value)} required />
              </div>
              <div>
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="Min. 8 characters" value={suPassword} onChange={e => setSuPassword(e.target.value)} required />
              </div>
              <div>
                <label className="label">Your Mobile Number</label>
                <input className="input" type="tel" placeholder="(555) 123-4567" value={suPhone} onChange={e => setSuPhone(e.target.value)} required />
                <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 5 }}>We'll text you instantly when a lead comes in</p>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 4 }} disabled={loading}>
                {loading ? <><span className="spinner" />Creating account...</> : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
