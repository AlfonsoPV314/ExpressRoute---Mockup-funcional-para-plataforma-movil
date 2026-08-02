import { useState } from 'react'

interface LoginViewProps {
  onLogin: () => void
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Ingresa tu correo y contraseña.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin()
    }, 900)
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center px-8"
      style={{ background: '#060d1a' }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 mb-12">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #16a34a 100%)' }}
        >
          ER
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">ExpressRoute</h1>
          <p className="text-base mt-1" style={{ color: '#94a3b8' }}>
            Sistema de Rutas — Conductor
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg flex flex-col gap-5"
      >
        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold" style={{ color: '#94a3b8' }}>
            Correo electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="usuario@expressroute.cl"
            className="w-full rounded-xl px-5 py-5 font-medium outline-none transition-all"
            style={{
              background: '#0c1a2e',
              border: '1.5px solid #1a3352',
              color: '#e2e8f0',
              fontSize: '1.1rem',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#2563eb'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#1a3352'
            }}
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-base font-semibold" style={{ color: '#94a3b8' }}>
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-xl px-5 py-5 outline-none transition-all"
            style={{
              background: '#0c1a2e',
              border: '1.5px solid #1a3352',
              color: '#e2e8f0',
              fontSize: '1.1rem',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#2563eb'
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#1a3352'
            }}
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="text-base font-medium" style={{ color: '#ef4444' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl py-5 text-white font-bold text-xl mt-2 transition-all active:scale-95"
          style={{
            background: loading
              ? '#1a3352'
              : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            boxShadow: loading ? 'none' : '0 4px 24px rgba(37,99,235,0.35)',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-10 text-base text-center" style={{ color: '#4a6080' }}>
        Solo para conductores registrados.
        <br />
        Contacta a tu administrador para obtener acceso.
      </p>
    </div>
  )
}
