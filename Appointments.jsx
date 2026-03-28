import { useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useTenant } from '../hooks/useTenant'
import { useRealtimeNotifications } from '../hooks/useRealtimeNotifications'
import NotificationToast from '../components/NotificationToast'
import Overview from './tabs/Overview'
import Leads from './tabs/Leads'
import Calls from './tabs/Calls'
import Appointments from './tabs/Appointments'
import Setup from './tabs/Setup'
import Settings from './tabs/Settings'

const NAV = [
  { path: '', label: 'Overview', icon: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z' },
  { path: 'leads', label: 'Leads', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75' },
  { path: 'calls', label: 'Calls', icon: 'M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72 19.003 19.003 0 00.7 2.81 2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45 19.003 19.003 0 002.81.7A2 2 0 0122 16.92z' },
  { path: 'appointments', label: 'Appointments', icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z' },
  { path: 'setup', label: 'Setup', icon: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' },
  { path: 'settings', label: 'Settings', icon: 'M12.22 2h-.44a2 2 0 00-2 2v.18a2 2 0 01-1 1.73l-.43.25a2 2 0 01-2 0l-.15-.08a2 2 0 00-2.73.73l-.22.38a2 2 0 00.73 2.73l.15.1a2 2 0 011 1.72v.51a2 2 0 01-1 1.74l-.15.09a2 2 0 00-.73 2.73l.22.38a2 2 0 002.73.73l.15-.08a2 2 0 012 0l.43.25a2 2 0 011 1.73V20a2 2 0 002 2h.44a2 2 0 002-2v-.18a2 2 0 011-1.73l.43-.25a2 2 0 012 0l.15.08a2 2 0 002.73-.73l.22-.39a2 2 0 00-.73-2.73l-.15-.08a2 2 0 01-1-1.74v-.5a2 2 0 011-1.74l.15-.09a2 2 0 00.73-2.73l-.22-.38a2 2 0 00-2.73-.73l-.15.08a2 2 0 01-2 0l-.43-.25a2 2 0 01-1-1.73V4a2 2 0 00-2-2z M12 8a4 4 0 100 8 4 4 0 000-8z' },
]

function NavIcon({ d }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { tenant, user, loading, reload } = useTenant()
  const { notifications, dismiss } = useRealtimeNotifications(tenant?.id)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/auth')
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--black)' }}>
      <div className="spinner" style={{ width: 20, height: 20 }} />
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--black)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 216,
        flexShrink: 0,
        background: 'var(--black-2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28, height: 28,
              background: 'var(--platinum)',
              borderRadius: 7,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.91a16 16 0 006.09 6.09l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 500, color: 'var(--platinum)', letterSpacing: '0.04em' }}>fono</span>
          </div>
        </div>

        {/* Tenant status */}
        {tenant && (
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 4 }}>
              {tenant.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: tenant.twilio_number ? 'var(--green)' : 'var(--platinum-6)',
              }} className={tenant.twilio_number ? 'dot-live' : ''} />
              <span style={{ fontSize: 10, color: 'var(--text-4)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                {tenant.twilio_number ? 'Active' : 'Setup required'}
              </span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'auto' }}>
          {NAV.map(({ path, label, icon }) => (
            <NavLink
              key={path}
              to={`/dashboard${path ? `/${path}` : ''}`}
              end={path === ''}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '7px 10px',
                borderRadius: 7,
                fontSize: 12,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? 'var(--text)' : 'var(--text-4)',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                border: isActive ? '1px solid var(--border-2)' : '1px solid transparent',
                transition: 'all 0.12s',
                textDecoration: 'none',
              })}
            >
              <NavIcon d={icon} />
              {label}
              {path === 'appointments' && notifications.filter(n => n.type === 'appointment').length > 0 && (
                <div style={{
                  marginLeft: 'auto', minWidth: 16, height: 16,
                  background: 'var(--platinum)', borderRadius: 99,
                  fontSize: 9, fontWeight: 700, color: 'var(--black)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px',
                }}>
                  {notifications.filter(n => n.type === 'appointment').length}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div style={{
          padding: '12px 12px',
          borderTop: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: 'var(--black-5)',
            border: '1px solid var(--border-2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 600, color: 'var(--platinum-3)',
            flexShrink: 0,
          }}>
            {user?.email?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 10, color: 'var(--text-4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </div>
          </div>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button style={{ color: 'var(--text-4)', padding: 3, display: 'flex' }} title="Notifications">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
            </button>
            {notifications.length > 0 && (
              <div style={{
                position: 'absolute', top: 0, right: 0,
                width: 14, height: 14,
                background: 'var(--red)', borderRadius: '50%',
                fontSize: 8, fontWeight: 700, color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {notifications.length}
              </div>
            )}
          </div>
          <button onClick={handleSignOut} style={{ color: 'var(--text-4)', padding: 3, display: 'flex', flexShrink: 0 }} title="Sign out">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
        <Routes>
          <Route index element={<Overview tenant={tenant} user={user} reload={reload} />} />
          <Route path="leads" element={<Leads tenant={tenant} />} />
          <Route path="calls" element={<Calls tenant={tenant} />} />
          <Route path="appointments" element={<Appointments tenant={tenant} />} />
          <Route path="setup" element={<Setup tenant={tenant} reload={reload} />} />
          <Route path="settings" element={<Settings tenant={tenant} user={user} reload={reload} />} />
        </Routes>
      </main>

      <NotificationToast notifications={notifications} onDismiss={dismiss} />
    </div>
  )
}
