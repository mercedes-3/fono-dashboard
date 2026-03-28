export default function PageHeader({ title, sub, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 300, color: 'var(--text)', letterSpacing: '-0.01em', lineHeight: 1 }}>{title}</h1>
        {sub && <p style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 6, letterSpacing: '0.02em' }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}
