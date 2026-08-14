import AppHeader, { type View } from '../components/AppHeader'
import { DRIVER } from '../data/mockData'

interface AccountViewProps {
  onNavigate: (view: View) => void
  onLogout: () => void
}

export default function AccountView({ onNavigate, onLogout }: AccountViewProps) {
  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: '#060d1a' }}>
      <AppHeader onNavigate={onNavigate} onLogout={onLogout} />

      <div className="flex-1 scrollable overflow-y-auto pt-20 pb-8">
        {/* Profile header */}
        <div className="px-6 py-4" style={{ borderBottom: '1px solid #1a3352' }}>
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #2563eb, #16a34a)' }}
            >
              {DRIVER.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{DRIVER.name}</h1>
              <p className="text-base mt-0.5" style={{ color: '#94a3b8' }}>
                Conductor · {DRIVER.hub} · {DRIVER.employeeId}
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          {/* Personal data — read-only */}
          <Section title="Datos Personales">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem' }}>
              <ReadOnlyField label="Nombre completo" value={DRIVER.name} />
              <ReadOnlyField label="Correo electrónico" value={DRIVER.email} />
              <ReadOnlyField label="Teléfono" value={DRIVER.phone} />
              <ReadOnlyField label="Patente del vehículo" value={DRIVER.vehiclePlate} />
            </div>
          </Section>

          {/* System info — read-only */}
          <Section title="Información del Sistema">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem 2rem' }}>
              <ReadOnlyField label="ID Empleado" value={DRIVER.employeeId} />
              <ReadOnlyField label="Hub asignado" value={DRIVER.hub} />
              <ReadOnlyField label="Patente" value={DRIVER.vehiclePlate} />
            </div>
          </Section>

          {/* Admin contact notice */}
          <div
            className="rounded-2xl p-5 flex items-start gap-4"
            style={{ background: 'rgba(37,99,235,0.07)', border: '1px solid rgba(37,99,235,0.2)' }}
          >
            <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>ℹ️</span>
            <p className="text-base leading-relaxed" style={{ color: '#94a3b8' }}>
              Para modificar sus datos personales o de acceso, comuníquese con un administrador del sistema.
              Los cambios se gestionan desde el portal web de ExpressRoute.
            </p>
          </div>
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
      <div className="p-5">{children}</div>
    </div>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-base font-medium" style={{ color: '#4a6080' }}>{label}</span>
      <span
        className="text-lg font-semibold px-4 py-3 rounded-xl"
        style={{ background: '#0a1628', color: '#e2e8f0', border: '1.5px solid #1a3352' }}
      >
        {value}
      </span>
    </div>
  )
}
