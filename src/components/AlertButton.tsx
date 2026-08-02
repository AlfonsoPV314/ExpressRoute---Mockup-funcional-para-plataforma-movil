import { useRef, useState } from 'react'

interface AlertButtonProps {
  onEmergencyConfirmed: () => void
}

export default function AlertButton({ onEmergencyConfirmed }: AlertButtonProps) {
  const [taps, setTaps] = useState(0)
  const [hidden, setHidden] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const tapsRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleTap = () => {
    tapsRef.current += 1
    setTaps(tapsRef.current)
    if (timerRef.current) clearTimeout(timerRef.current)

    if (tapsRef.current >= 3) {
      tapsRef.current = 0
      setTaps(0)
      setHidden(true)
      setConfirmed(true)
      setTimeout(() => onEmergencyConfirmed(), 2000)
      return
    }

    timerRef.current = setTimeout(() => {
      tapsRef.current = 0
      setTaps(0)
    }, 1500)
  }

  return (
    <>
      {!hidden && (
        <button
          onClick={handleTap}
          className="rounded-full flex flex-col items-center justify-center font-bold text-white transition-transform active:scale-90"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.25rem',
            zIndex: 9990,
            /* 7rem × 20px base = 140px — large, easy to hit in an emergency */
            width: '7rem',
            height: '7rem',
            background: taps > 0
              ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
              : 'linear-gradient(135deg, #dc2626, #991b1b)',
            boxShadow: taps > 0
              ? '0 0 0 0.25rem rgba(220,38,38,0.35), 0 0.5rem 2rem rgba(220,38,38,0.5)'
              : '0 0.25rem 1.75rem rgba(220,38,38,0.45)',
            border: taps > 0
              ? '0.15rem solid rgba(255,120,120,0.6)'
              : '0.15rem solid rgba(255,255,255,0.12)',
          }}
          aria-label="Botón de alerta de emergencia — presionar 3 veces"
        >
          <span style={{ fontSize: '2.2rem', lineHeight: 1, marginBottom: '0.25rem' }}>🚨</span>
          <span style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '0.08em' }}>ALERTA</span>
          {taps > 0 && (
            <span style={{ fontSize: '0.65rem', opacity: 0.85, marginTop: '0.15rem' }}>{taps}/3</span>
          )}
        </button>
      )}

      {confirmed && (
        <div
          className="fade-in-up"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9995,
            background: 'rgba(6,13,26,0.93)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#0c1a2e',
              border: '1px solid rgba(220,38,38,0.4)',
              borderRadius: '1.5rem',
              padding: '2.5rem',
              maxWidth: '26rem',
              margin: '0 1.5rem',
              boxShadow: '0 1.5rem 4rem rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.25rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '5.5rem',
                height: '5.5rem',
                borderRadius: '50%',
                background: 'rgba(220,38,38,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.75rem',
              }}
            >
              🚨
            </div>
            <h2 className="font-bold text-white" style={{ fontSize: '1.6rem' }}>¡Alerta enviada!</h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.5, fontSize: '1.1rem' }}>
              Se avisó a la central de Quilicura.
            </p>
            <p style={{ color: '#4a6080', fontSize: '0.9rem' }}>
              Permanece en un lugar seguro. El equipo ha sido notificado.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
