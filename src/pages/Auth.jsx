import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Auth() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [siEmail, setSiEmail] = useState('')
  const [siPassword, setSiPassword] = useState('')

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

  const inputStyle = {
    width: '100%',
    background: 'var(--black-4)',
    border: '1px solid var(--border-2)',
    borderRadius: 8,
    padding: '10px 13px',
    color: 'var(--text)',
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--text-4)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 7,
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--black)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
         
          <p style={{ color: 'var(--text-4)', fontSize: 11, letterSpacing: '0.04em' }}>AI Receptionist for Service Businesses</p>
        </div>
<span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 300, color: 'var(--platinum)', letterSpacing: '0.04em' }}>fono</span>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--black-3)',
          borderRadius: 10,
          padding: 4,
          marginBottom: 20,
          border: '1px solid var(--border)',
        }}>
          {['signin', 'signup'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError('') }} style={{
              flex: 1,
              padding: '9px',
              borderRadius: 7,
              fontSize: 12,
              fontWeight: 500,
              transition: 'all 0.15s',
              background: tab === t ? 'var(--black-4)' : 'transparent',
              color: tab === t ? 'var(--text)' : 'var(--text-4)',
              border: tab === t ? '1px solid var(--border-2)' : '1px solid transparent',
              cursor: 'pointer',
              letterSpacing: '0.02em',
            }}>
              {t === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{
          background: 'var(--black-3)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '24px',
        }}>
          {error && (
            <div style={{
              background: 'var(--red-dim)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8,
              padding: '10px 13px',
              fontSize: 12,
              color: 'var(--red)',
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {tab === 'signin' ? (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="you@example.com" value={siEmail} onChange={e => setSiEmail(e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input style={inputStyle} type="password" placeholder="••••••••" value={siPassword} onChange={e => setSiPassword(e.target.value)} required />
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', marginTop: 4, padding: '11px',
                borderRadius: 8, fontSize: 12, fontWeight: 500,
                background: 'var(--platinum)', color: 'var(--black)',
                border: 'none', cursor: 'pointer',
                letterSpacing: '0.02em',
                opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.15s',
              }}>
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Business Name</label>
                <input style={inputStyle} type="text" placeholder="ABC Plumbing" value={suBusiness} onChange={e => setSuBusiness(e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="you@example.com" value={suEmail} onChange={e => setSuEmail(e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input style={inputStyle} type="password" placeholder="Min. 8 characters" value={suPassword} onChange={e => setSuPassword(e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Your Mobile Number</label>
                <input style={inputStyle} type="tel" placeholder="(555) 123-4567" value={suPhone} onChange={e => setSuPhone(e.target.value)} required />
                <p style={{ fontSize: 10, color: 'var(--text-4)', marginTop: 6, letterSpacing: '0.02em' }}>We will text you instantly when a lead comes in</p>
              </div>
              <button type="submit" disabled={loading} style={{
                width: '100%', marginTop: 4, padding: '11px',
                borderRadius: 8, fontSize: 12, fontWeight: 500,
                background: 'var(--platinum)', color: 'var(--black)',
                border: 'none', cursor: 'pointer',
                letterSpacing: '0.02em',
                opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.15s',
              }}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
