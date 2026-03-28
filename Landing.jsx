import { useEffect, useState } from 'react'

function Toast({ n, onDismiss }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => { setTimeout(() => setVisible(true), 10) }, [])

  const styles = {
    lead:        { border: 'rgba(232,232,232,0.12)', dot: 'var(--platinum-2)' },
    appointment: { border: 'rgba(251,191,36,0.2)',   dot: 'var(--amber)' },
    confirmed:   { border: 'rgba(74,222,128,0.2)',   dot: 'var(--green)' },
  }
  const s = styles[n.type] || styles.lead
  const time = n.time?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ''

  return (
    <div onClick={() => onDismiss(n.id)} style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '12px 14px',
      background: 'var(--black-3)',
      border: `1px solid ${s.border}`,
      borderRadius: 10,
      cursor: 'pointer',
      maxWidth: 300, width: '100%',
      boxShadow: 'var(--shadow-lg)',
      transition: 'all 0.25s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(16px)',
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0, marginTop: 5 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text)', marginBottom: 2, letterSpacing: '0.02em' }}>{n.title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)', lineHeight: 1.5 }}>{n.message}</div>
        <div style={{ fontSize: 9, color: 'var(--text-4)', marginTop: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{time} · tap to dismiss</div>
      </div>
    </div>
  )
}

export default function NotificationToast({ notifications, onDismiss }) {
  if (!notifications.length) return null
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
      {notifications.map(n => <Toast key={n.id} n={n} onDismiss={onDismiss} />)}
    </div>
  )
}
