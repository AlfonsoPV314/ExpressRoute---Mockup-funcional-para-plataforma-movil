import { useState } from 'react'

export type View = 'login' | 'main' | 'fullRoute' | 'packages' | 'account' | 'off'

interface AppHeaderProps {
  onNavigate: (view: View) => void
  onLogout: () => void
}

// Header height = logo (2.5rem) + vertical padding (2 × 0.875rem) ≈ 4.25rem ≈ 85px at 20px base
// Views use pt-20 (5rem = 100px) to clear this safely.
export const HEADER_TOP = '4.5rem' // dropdown appears just below header

export default function AppHeader({ onNavigate, onLogout }: AppHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggle = () => setMenuOpen((v) => !v)
  const go = (view: View) => {
    setMenuOpen(false)
    onNavigate(view)
  }

  return (
    <>
      {/* Fixed header bar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9997,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.875rem 1.5rem',
          background:
            'linear-gradient(to bottom, rgba(6,13,26,0.98) 0%, rgba(6,13,26,0.90) 70%, transparent 100%)',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.625rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 800,
              fontSize: '1rem',
              background: 'linear-gradient(135deg, #2563eb, #16a34a)',
              flexShrink: 0,
            }}
          >
            ER
          </div>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.01em' }}>
            ExpressRoute
          </span>
        </div>

        {/* Hamburger / close button */}
        <button
          onClick={toggle}
          style={{
            width: '3.25rem',
            height: '3.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0.75rem',
            background: menuOpen ? 'rgba(37,99,235,0.28)' : 'rgba(255,255,255,0.09)',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Menú"
        >
          {menuOpen ? (
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <line x1="4" y1="4" x2="22" y2="22" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="22" y1="4" x2="4" y2="22" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <line x1="3" y1="7"  x2="23" y2="7"  stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="3" y1="13" x2="23" y2="13" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="3" y1="19" x2="23" y2="19" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Dropdown — fixed so it's always above map stacking contexts */}
      {menuOpen && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
            onClick={() => setMenuOpen(false)}
          />
          <div
            style={{
              position: 'fixed',
              top: HEADER_TOP,
              right: '1.25rem',
              zIndex: 9999,
              background: '#0c1a2e',
              border: '1px solid #1a3352',
              borderRadius: '1.125rem',
              minWidth: '18rem',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.65)',
            }}
          >
            <MenuItem icon="🏠" label="Vista Principal"        onClick={() => go('main')} />
            <div style={{ borderTop: '1px solid #1a3352' }} />
            <MenuItem icon="🗺️" label="Ver Ruta Completa"     onClick={() => go('fullRoute')} />
            <MenuItem icon="📦" label="Listado de Entregas"   onClick={() => go('packages')} />
            <MenuItem icon="⚙️" label="Datos de la Cuenta"       onClick={() => go('account')} />
            <div style={{ borderTop: '1px solid #1a3352' }} />
            <MenuItem
              icon="🔓"
              label="Cerrar Sesión"
              onClick={() => { setMenuOpen(false); onLogout() }}
              danger
            />
          </div>
        </>
      )}
    </>
  )
}

function MenuItem({
  icon, label, onClick, danger,
}: {
  icon: string; label: string; onClick: () => void; danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.125rem 1.375rem',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: danger ? '#ef4444' : '#e2e8f0',
        fontSize: '1.1rem',
        fontWeight: 500,
        fontFamily: "'Inter', sans-serif",
        textAlign: 'left',
        transition: 'background 0.15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.1)' : 'rgba(37,99,235,0.12)'
      }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
    >
      <span style={{ fontSize: '1.3rem', width: '2rem', textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
    </button>
  )
}
