import { useState } from 'react'
import AppHeader, { type View } from '../components/AppHeader'
import { DRIVER } from '../data/mockData'

interface AccountViewProps {
  onNavigate: (view: View) => void
  onLogout: () => void
}

export default function AccountView({ onNavigate, onLogout }: AccountViewProps) {
  const [name, setName] = useState(DRIVER.name)
  const [email, setEmail] = useState(DRIVER.email)
  const [phone, setPhone] = useState(DRIVER.phone)
  const [vehicle, setVehicle] = useState(DRIVER.vehiclePlate)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [saved, setSaved] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handlePwSave = () => {
    setPwSaved(true)
    setCurrentPw('')
    setNewPw('')
    setTimeout(() => setPwSaved(false), 2500)
  }

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: '#060d1a' }}>
      <AppHeader onNavigate={onNavigate} onLogout={onLogout} />

      <div className="flex-1 scrollable overflow-y-auto pt-20 pb-8">
        {/* Page header */}
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #1a3352' }}>
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2563eb, #16a34a)' }}
            >
              {name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{name}</h1>
              <p className="text-base mt-0.5" style={{ color: '#94a3b8' }}>
                Conductor · {DRIVER.hub} · {DRIVER.employeeId}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Personal info — 2-column grid */}
          <Section title="Datos Personales">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Nombre completo" value={name} onChange={setName} placeholder="Nombre y apellido" />
              <Field label="Correo electrónico" value={email} onChange={setEmail} placeholder="correo@ejemplo.cl" type="email" />
              <Field label="Teléfono" value={phone} onChange={setPhone} placeholder="+56 9 xxxx xxxx" type="tel" />
              <Field label="Patente del vehículo" value={vehicle} onChange={setVehicle} placeholder="XXXX-00" />
            </div>
            <SaveButton
              saved={saved}
              onClick={handleSave}
              label="Guardar cambios"
              savedLabel="✓ Datos guardados"
            />
          </Section>

          {/* Password — 2-column grid */}
          <Section title="Cambiar Contraseña">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field
                label="Contraseña actual"
                value={currentPw}
                onChange={setCurrentPw}
                placeholder="••••••••"
                type="password"
              />
              <Field
                label="Nueva contraseña"
                value={newPw}
                onChange={setNewPw}
                placeholder="Mínimo 8 caracteres"
                type="password"
              />
            </div>
            <SaveButton
              saved={pwSaved}
              onClick={handlePwSave}
              disabled={!currentPw || !newPw}
              label="Actualizar contraseña"
              savedLabel="✓ Contraseña actualizada"
            />
          </Section>

          {/* System info — 2-column grid */}
          <Section title="Información del Sistema">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem 2rem' }}>
              <ReadOnlyRow label="ID Empleado" value={DRIVER.employeeId} />
              <ReadOnlyRow label="Hub asignado" value={DRIVER.hub} />
              <ReadOnlyRow label="Patente" value={DRIVER.vehiclePlate} />
            </div>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#0c1a2e', border: '1px solid #1a3352' }}>
      <div className="px-5 pt-4 pb-3" style={{ borderBottom: '1px solid #1a3352' }}>
        <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: '#4a6080' }}>
          {title}
        </p>
      </div>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </div>
  )
}

function Field({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-base font-medium" style={{ color: '#94a3b8' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-4 text-lg outline-none transition-all"
        style={{ background: '#112038', border: '1.5px solid #1a3352', color: '#e2e8f0' }}
        onFocus={(e) => { e.currentTarget.style.borderColor = '#2563eb' }}
        onBlur={(e) => { e.currentTarget.style.borderColor = '#1a3352' }}
      />
    </div>
  )
}

function SaveButton({
  saved, onClick, disabled, label, savedLabel,
}: {
  saved: boolean; onClick: () => void; disabled?: boolean; label: string; savedLabel: string
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all active:scale-95"
      style={{
        background: disabled
          ? '#1a3352'
          : saved
          ? 'linear-gradient(135deg, #16a34a, #15803d)'
          : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
        boxShadow: disabled ? 'none' : saved ? '0 4px 20px rgba(22,163,74,0.3)' : '0 4px 20px rgba(37,99,235,0.25)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {saved ? savedLabel : label}
    </button>
  )
}

function ReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm" style={{ color: '#4a6080' }}>{label}</span>
      <span className="text-lg font-semibold" style={{ color: '#94a3b8' }}>{value}</span>
    </div>
  )
}
