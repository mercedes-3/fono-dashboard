// src/components/NotificationToast.jsx
import { useEffect, useState } from 'react'

function Toast({ notification, onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Animate in
    setTimeout(() => setVisible(true), 10)
  }, [])

  const colors = {
    lead: { bg: 'var(--accent-dim)', border: 'rgba(59,130,246,0.25)', dot: 'var(--accent)' },
    appointment: { bg: 'var(--yellow-dim)', border: 'rgba(245,158,11,0.25)', dot: 'var(--yellow)' },
    confirmed: { bg: 'var(--green-dim)', border: 'rgba(16,185,129,0.25)', dot: 'var(--green)' },
  }

  const style = colors[notification.type] || colors.lead

  const timeStr = notification.time
    ? notification.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div
      onClick={() => onDismiss(notification.id)}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '12px 14px',
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 10,
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(20px)',
        maxWidth: 320,
        width: '100%',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{
        width: 8, height: 8,
        borderRadius: '50%',
        background: style.dot,
        flexShrink: 0,
        marginTop: 4,
      }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
          {notification.title}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4 }}>
          {notification.message}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>{timeStr} · click to dismiss</div>
      </div>
    </div>
  )
}

export default function NotificationToast({ notifications, onDismiss }) {
  if (!notifications.length) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      alignItems: 'flex-end',
    }}>
      {notifications.map(n => (
        <Toast key={n.id} notification={n} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
