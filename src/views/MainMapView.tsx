import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Marker, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import AppHeader, { type View } from '../components/AppHeader'
import { NEXT_PACKAGE, DRIVER_POSITION, NEXT_STOP_ROUTE } from '../data/mockData'

interface MainMapViewProps {
  onNavigate: (view: View) => void
  onLogout: () => void
}

const nextPkg = NEXT_PACKAGE

const MAP_CENTER: [number, number] = [
  (DRIVER_POSITION[0] + nextPkg.coords[0]) / 2,
  (DRIVER_POSITION[1] + nextPkg.coords[1]) / 2,
]

function makeDriverIcon() {
  return L.divIcon({
    className: '',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    html: `<svg width="34" height="34" viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
      <circle cx="17" cy="17" r="16" fill="#1d4ed8" stroke="#60a5fa" stroke-width="2.5"/>
      <polygon points="17,6 24,26 17,21 10,26" fill="white"/>
    </svg>`,
  })
}

export default function MainMapView({ onNavigate, onLogout }: MainMapViewProps) {
  const driverIcon = useMemo(() => makeDriverIcon(), [])
  const [showPkgDetail, setShowPkgDetail] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deliveryDone, setDeliveryDone] = useState(false)

  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl
  }, [])

  const closeModal = () => {
    setShowPkgDetail(false)
    setShowConfirm(false)
    setDeliveryDone(false)
  }

  const handleConfirmDelivery = () => {
    setShowConfirm(false)
    setDeliveryDone(true)
    setTimeout(() => closeModal(), 2200)
  }

  return (
    <div className="relative w-full h-full" style={{ background: '#060d1a' }}>
      {/* Map */}
      <MapContainer
        center={MAP_CENTER}
        zoom={16}
        zoomControl={false}
        attributionControl={false}
        style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        <Polyline
          positions={NEXT_STOP_ROUTE}
          pathOptions={{ color: '#3b82f6', weight: 5, dashArray: '12, 10', opacity: 0.9 }}
        />

        <Marker position={DRIVER_POSITION} icon={driverIcon}>
          <Tooltip permanent direction="top" offset={[0, -20]}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'Inter' }}>Tú</span>
          </Tooltip>
        </Marker>

        <CircleMarker
          center={nextPkg.coords}
          radius={12}
          pathOptions={{ color: '#22c55e', fillColor: '#16a34a', fillOpacity: 1, weight: 3 }}
        >
          <Tooltip permanent direction="top" offset={[0, -16]}>
            <span style={{ fontSize: '0.7rem', fontFamily: 'Inter' }}>Destino</span>
          </Tooltip>
        </CircleMarker>
      </MapContainer>

      <AppHeader onNavigate={onNavigate} onLogout={onLogout} />

      {/* Package card */}
      <button
        onClick={() => setShowPkgDetail(true)}
        className="absolute bottom-6 left-4 z-10 rounded-2xl shadow-2xl text-left transition-all active:scale-95"
        style={{
          background: 'rgba(12, 26, 46, 0.95)',
          border: '1px solid #1a3352',
          backdropFilter: 'blur(12px)',
          maxWidth: '340px',
          minWidth: '280px',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#16a34a' }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1a3352' }}
      >
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="rounded-lg px-2 py-0.5 text-xs font-bold uppercase tracking-wide"
              style={{ background: '#1a3352', color: '#60a5fa' }}
            >
              Siguiente
            </div>
            {nextPkg.fragile && (
              <div
                className="rounded-lg px-2 py-0.5 text-xs font-bold uppercase tracking-wide"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}
              >
                ⚠ Frágil
              </div>
            )}
          </div>
          <p className="font-bold text-white text-lg leading-tight mb-3">{nextPkg.product}</p>
          <div className="flex flex-col gap-1.5">
            <InfoRow icon="📍" label={nextPkg.destination} />
            <InfoRow icon="👤" label={nextPkg.recipient} />
            <InfoRow icon="🕐" label={`Entrega: ${nextPkg.deliveryTime}`} accent />
          </div>
        </div>
        <div
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-b-2xl"
          style={{ background: 'rgba(22,163,74,0.18)', borderTop: '1px solid rgba(22,163,74,0.25)' }}
        >
          <span style={{ fontSize: '1rem' }}>✓</span>
          <span className="text-base font-semibold" style={{ color: '#22c55e' }}>
            Marcar como entregado
          </span>
        </div>
      </button>

      {/* Package detail bottom sheet */}
      {showPkgDetail && (
        <div
          className="absolute inset-0 z-40 flex items-end fade-in-up"
          style={{ background: 'rgba(6,13,26,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
        >
          <div
            className="w-full rounded-t-3xl flex flex-col"
            style={{ background: '#0c1a2e', border: '1px solid #1a3352', borderBottom: 'none' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: '1px solid #1a3352' }}
            >
              <div>
                <h2 className="text-xl font-bold text-white">{nextPkg.product}</h2>
                <p className="text-sm mt-0.5" style={{ color: '#94a3b8' }}>
                  {nextPkg.id} · Parada #{nextPkg.stopNumber}
                  {nextPkg.fragile && (
                    <span className="ml-2 text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                      ⚠ Frágil
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <line x1="3" y1="3" x2="15" y2="15" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  <line x1="15" y1="3" x2="3" y2="15" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Info */}
            <div className="px-5 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #1a3352' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <ModalRow icon="👤" label="Destinatario" value={nextPkg.recipient} />
                <ModalRow icon="🕐" label="Hora de entrega" value={nextPkg.deliveryTime} accent />
              </div>
              <div style={{ marginTop: '0.875rem' }}>
                <ModalRow icon="📍" label="Dirección" value={nextPkg.destination} />
              </div>
              {nextPkg.fragile && (
                <div
                  className="flex items-center gap-3 mt-3 rounded-xl p-3"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>⚠️</span>
                  <p className="text-base font-semibold" style={{ color: '#f87171' }}>
                    Maneja con cuidado. Entrega en mano.
                  </p>
                </div>
              )}
            </div>

            {/* CTA — always visible */}
            <div className="px-5 py-4 flex-shrink-0">
              {deliveryDone ? (
                <div
                  className="rounded-xl p-4 flex items-center gap-4 fade-in-up"
                  style={{ background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.3)' }}
                >
                  <span style={{ fontSize: '1.75rem' }}>✅</span>
                  <div>
                    <p className="font-bold text-lg" style={{ color: '#22c55e' }}>¡Entrega confirmada!</p>
                    <p className="text-sm" style={{ color: '#94a3b8' }}>Registrado como entregado a {nextPkg.recipient}.</p>
                  </div>
                </div>
              ) : showConfirm ? (
                <div className="flex flex-col gap-3">
                  <p className="text-base font-semibold text-white text-center">
                    ¿Confirmar entrega a {nextPkg.recipient}?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 py-4 rounded-xl font-semibold text-base transition-all active:scale-95"
                      style={{ background: '#1a3352', color: '#94a3b8' }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleConfirmDelivery}
                      className="flex-1 py-4 rounded-xl font-bold text-lg text-white transition-all active:scale-95"
                      style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 16px rgba(22,163,74,0.35)' }}
                    >
                      Sí, confirmar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-4 rounded-xl font-bold text-xl text-white transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 4px 20px rgba(22,163,74,0.35)' }}
                >
                  ✓ Confirmar Entrega
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ icon, label, accent }: { icon: string; label: string; accent?: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <span style={{ fontSize: '1rem', lineHeight: '1.4', flexShrink: 0 }}>{icon}</span>
      <span className="text-base leading-snug" style={{ color: accent ? '#22c55e' : '#94a3b8', fontWeight: accent ? 600 : 400 }}>
        {label}
      </span>
    </div>
  )
}

function ModalRow({ icon, label, value, accent }: { icon: string; label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span style={{ fontSize: '1.2rem', lineHeight: 1.3, flexShrink: 0 }}>{icon}</span>
      <div>
        <p className="text-sm font-medium" style={{ color: '#4a6080' }}>{label}</p>
        <p className="text-lg font-semibold mt-0.5" style={{ color: accent ? '#22c55e' : '#e2e8f0' }}>{value}</p>
      </div>
    </div>
  )
}
