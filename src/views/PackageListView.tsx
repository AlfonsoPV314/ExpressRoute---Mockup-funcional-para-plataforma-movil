import { useState } from 'react'
import AppHeader, { type View } from '../components/AppHeader'
import { PACKAGES, type Package } from '../data/mockData'

interface PackageListViewProps {
  onNavigate: (view: View) => void
  onLogout: () => void
}

export default function PackageListView({ onNavigate, onLogout }: PackageListViewProps) {
  const [selected, setSelected] = useState<Package | null>(null)

  if (selected) {
    return <PackageDetail pkg={selected} onBack={() => setSelected(null)} />
  }

  const pendingCount = PACKAGES.filter((p) => p.status === 'pending').length
  const deliveredCount = PACKAGES.filter((p) => p.status === 'delivered').length

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: '#060d1a' }}>
      <AppHeader onNavigate={onNavigate} onLogout={onLogout} />

      <div className="flex flex-col flex-1 overflow-hidden pt-20">
        {/* Section title */}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #1a3352' }}>
          <h1 className="text-3xl font-bold text-white">Paquetes de la Ruta</h1>
          <div className="flex gap-3 mt-2">
            <StatPill label="Total" value={PACKAGES.length} color="#60a5fa" />
            <StatPill label="Entregados" value={deliveredCount} color="#22c55e" />
            <StatPill label="Pendientes" value={pendingCount} color="#f59e0b" />
          </div>
        </div>

        {/* Package list */}
        <div className="scrollable flex-1 overflow-y-auto">
          {PACKAGES.map((pkg, i) => (
            <button
              key={pkg.id}
              onClick={() => setSelected(pkg)}
              className="w-full text-left px-5 py-5 flex items-center gap-4 transition-colors"
              style={{
                borderBottom: i < PACKAGES.length - 1 ? '1px solid #1a3352' : 'none',
                background: 'transparent',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37,99,235,0.07)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              {/* Stop number */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
                style={{
                  background: pkg.status === 'delivered' ? 'rgba(22,163,74,0.2)' : 'rgba(37,99,235,0.2)',
                  color: pkg.status === 'delivered' ? '#22c55e' : '#60a5fa',
                  border: `2px solid ${pkg.status === 'delivered' ? '#16a34a' : '#2563eb'}`,
                }}
              >
                #{pkg.stopNumber}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-white text-xl truncate">{pkg.product}</span>
                  {pkg.fragile && (
                    <span
                      className="text-sm font-semibold px-2 py-0.5 rounded flex-shrink-0"
                      style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}
                    >
                      ⚠ Frágil
                    </span>
                  )}
                </div>
                <p className="text-lg truncate" style={{ color: '#94a3b8' }}>
                  {pkg.recipient}
                </p>
                <p className="text-base truncate" style={{ color: '#4a6080' }}>
                  {pkg.destination}
                </p>
              </div>

              {/* Status & time */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="text-xl font-bold" style={{ color: '#22c55e' }}>
                  {pkg.deliveryTime}
                </span>
                <span
                  className="text-base font-semibold px-3 py-1 rounded-full"
                  style={{
                    background: pkg.status === 'delivered' ? 'rgba(22,163,74,0.2)' : 'rgba(245,158,11,0.15)',
                    color: pkg.status === 'delivered' ? '#22c55e' : '#f59e0b',
                  }}
                >
                  {pkg.status === 'delivered' ? '✓ Entregado' : '⏳ Pendiente'}
                </span>
              </div>

              <span style={{ color: '#4a6080', fontSize: '1.4rem', marginLeft: '4px' }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function PackageDetail({ pkg, onBack }: { pkg: Package; onBack: () => void }) {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#060d1a' }}>
      {/* Back header */}
      <div
        className="flex items-center gap-4 px-4 py-4"
        style={{ borderBottom: '1px solid #1a3352', background: '#0c1a2e' }}
      >
        <button
          onClick={onBack}
          className="w-13 h-13 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.06)', color: '#e2e8f0', fontSize: '1.5rem', width: '3rem', height: '3rem' }}
        >
          ‹
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-white leading-tight">Detalle del Paquete</h2>
          <p className="text-base" style={{ color: '#94a3b8' }}>{pkg.id}</p>
        </div>
        <span
          className="text-base font-semibold px-3 py-1.5 rounded-full"
          style={{
            background: pkg.status === 'delivered' ? 'rgba(22,163,74,0.2)' : 'rgba(245,158,11,0.15)',
            color: pkg.status === 'delivered' ? '#22c55e' : '#f59e0b',
          }}
        >
          {pkg.status === 'delivered' ? '✓ Entregado' : '⏳ Pendiente'}
        </span>
      </div>

      {/* Detail content */}
      <div className="flex-1 scrollable overflow-y-auto px-5 py-5 flex flex-col gap-5">
        {/* Product */}
        <DetailCard title="Producto">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-3xl font-bold text-white">{pkg.product}</span>
            {pkg.fragile && (
              <span
                className="text-base font-bold px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}
              >
                ⚠ FRÁGIL
              </span>
            )}
          </div>
        </DetailCard>

        {/* Delivery info — 2-column grid */}
        <DetailCard title="Información de Entrega">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <DetailRow icon="👤" label="Destinatario" value={pkg.recipient} />
            <DetailRow icon="🔢" label="Parada" value={`#${pkg.stopNumber} de 5`} />
            <DetailRow icon="🕐" label="Hora de entrega" value={pkg.deliveryTime} accent />
          </div>
          <div style={{ marginTop: '1.25rem' }}>
            <DetailRow icon="📍" label="Dirección completa" value={pkg.destination} />
          </div>
        </DetailCard>

        {/* Fragile warning */}
        {pkg.fragile && (
          <div
            className="rounded-2xl p-5 flex items-start gap-4"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            <span style={{ fontSize: '2rem' }}>⚠️</span>
            <div>
              <p className="font-bold text-xl" style={{ color: '#f87171' }}>Paquete Frágil</p>
              <p className="text-lg mt-1" style={{ color: '#94a3b8' }}>
                Maneja con cuidado. No apile objetos encima. Entrega en mano.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: '#0c1a2e', border: '1px solid #1a3352' }}>
      <p className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: '#4a6080' }}>
        {title}
      </p>
      {children}
    </div>
  )
}

function DetailRow({ icon, label, value, accent }: { icon: string; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start gap-4">
      <span style={{ fontSize: '1.4rem', lineHeight: 1.3, flexShrink: 0 }}>{icon}</span>
      <div>
        <p className="text-sm font-medium" style={{ color: '#4a6080' }}>{label}</p>
        <p className="text-xl font-semibold mt-0.5" style={{ color: accent ? '#22c55e' : '#e2e8f0' }}>
          {value}
        </p>
      </div>
    </div>
  )
}

function StatPill({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-base font-medium"
      style={{ background: `${color}18`, color }}
    >
      <span className="font-bold text-lg">{value}</span>
      <span>{label}</span>
    </div>
  )
}
