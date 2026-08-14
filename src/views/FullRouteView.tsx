import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import AppHeader, { type View } from '../components/AppHeader'
import {
  PACKAGES,
  DRIVER_POSITION,
  QUILICURA_CENTER,
  HUB_POSITION,
  COMPLETED_ROUTE_WAYPOINTS,
  ACTIVE_ROUTE_WAYPOINTS,
  formatDeliveryId,
} from '../data/mockData'
import { useOSRMRoute } from '../hooks/useOSRMRoute'

interface FullRouteViewProps {
  onNavigate: (view: View) => void
  onLogout: () => void
}

function makeHubIcon() {
  return L.divIcon({
    className: '',
    iconSize: [44, 50],
    iconAnchor: [22, 50],
    html: `<svg width="44" height="50" viewBox="0 0 44 50" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="21" width="36" height="26" rx="3" fill="#0f2847" stroke="#60a5fa" stroke-width="2.5"/>
      <polygon points="22,4 40,21 4,21" fill="#1d4ed8" stroke="#60a5fa" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="16" y="32" width="12" height="15" rx="2" fill="#060d1a"/>
      <text x="22" y="30" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" font-weight="800" fill="white" letter-spacing="0.5">HUB</text>
    </svg>`,
  })
}

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

function makeStopIcon(stopNumber: number, delivered: boolean) {
  const fill = delivered ? '#16a34a' : '#1d4ed8'
  const stroke = delivered ? '#22c55e' : '#3b82f6'
  return L.divIcon({
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    html: `<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="${fill}" stroke="${stroke}" stroke-width="2.5"/>
      <text x="16" y="21" text-anchor="middle" font-family="Inter,sans-serif" font-size="13" font-weight="800" fill="white">${stopNumber}</text>
    </svg>`,
  })
}

// Captures map instance to allow fixed-position recenter button
function MapCapture({ onReady }: { onReady: (m: L.Map) => void }) {
  const m = useMap()
  useEffect(() => { onReady(m) }, [m, onReady])
  return null
}

export default function FullRouteView({ onNavigate, onLogout }: FullRouteViewProps) {
  const hubIcon = useMemo(() => makeHubIcon(), [])
  const driverIcon = useMemo(() => makeDriverIcon(), [])
  const stopIcons = useMemo(
    () => PACKAGES.map((pkg) => makeStopIcon(pkg.stopNumber, pkg.status === 'delivered')),
    [],
  )
  const [leafletMap, setLeafletMap] = useState<L.Map | null>(null)
  const [showCompleted, setShowCompleted] = useState(true)

  const { route: completedRoute } = useOSRMRoute(COMPLETED_ROUTE_WAYPOINTS)
  const { route: activeRoute } = useOSRMRoute(ACTIVE_ROUTE_WAYPOINTS)

  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl
  }, [])

  const pendingCount = PACKAGES.filter((p) => p.status === 'pending').length
  const deliveredCount = PACKAGES.filter((p) => p.status === 'delivered').length

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: '#060d1a' }}>
      <AppHeader onNavigate={onNavigate} onLogout={onLogout} />

      <div className="flex flex-1 overflow-hidden pt-20">

        {/* Left panel */}
        <div
          className="flex flex-col flex-shrink-0 overflow-hidden"
          style={{ width: '38%', borderRight: '1px solid #1a3352', background: '#0c1a2e' }}
        >
          <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #1a3352' }}>
            <h2 className="font-bold text-white text-xl mb-2">Ruta Completa</h2>
            <div className="flex gap-2 flex-wrap">
              <Badge label={`${deliveredCount} entregados`} color="#16a34a" />
              <Badge label={`${pendingCount} pendientes`} color="#2563eb" />
            </div>
          </div>

          <div className="scrollable flex-1 overflow-y-auto">
            {/* Hub row */}
            <div
              className="px-4 py-3 flex items-start gap-3"
              style={{ borderBottom: '1px solid #1a3352', background: 'rgba(37,99,235,0.05)' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(37,99,235,0.25)', color: '#60a5fa', border: '1.5px solid #2563eb' }}
              >
                🏭
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-white text-lg">Hub Quilicura</span>
                <p className="text-base" style={{ color: '#94a3b8' }}>Punto de partida</p>
              </div>
            </div>

            {/* Package stops */}
            {PACKAGES.map((pkg, i) => (
              <div
                key={pkg.id}
                className="px-4 py-3 flex items-start gap-3"
                style={{ borderBottom: i < PACKAGES.length - 1 ? '1px solid #1a3352' : 'none' }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
                  style={{
                    background: pkg.status === 'delivered' ? 'rgba(22,163,74,0.2)' : 'rgba(37,99,235,0.2)',
                    color: pkg.status === 'delivered' ? '#22c55e' : '#60a5fa',
                    border: `1.5px solid ${pkg.status === 'delivered' ? '#16a34a' : '#2563eb'}`,
                  }}
                >
                  {pkg.stopNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className="font-bold text-white text-lg leading-tight">{formatDeliveryId(pkg.id)}</span>
                    {pkg.fragile && (
                      <span className="text-sm px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                        Frágil
                      </span>
                    )}
                  </div>
                  <p className="text-base truncate" style={{ color: '#94a3b8' }}>{pkg.recipient}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-bold" style={{ color: '#22c55e' }}>{pkg.deliveryTime}</span>
                    <span
                      className="text-sm font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: pkg.status === 'delivered' ? 'rgba(22,163,74,0.2)' : 'rgba(148,163,184,0.1)',
                        color: pkg.status === 'delivered' ? '#22c55e' : '#94a3b8',
                      }}
                    >
                      {pkg.status === 'delivered' ? '✓ Entregado' : 'Pendiente'}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Hub return row */}
            <div
              className="px-4 py-3 flex items-start gap-3"
              style={{ background: 'rgba(37,99,235,0.05)' }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(37,99,235,0.25)', color: '#60a5fa', border: '1.5px solid #2563eb' }}
              >
                🏭
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-white text-lg">Hub Quilicura</span>
                <p className="text-base" style={{ color: '#94a3b8' }}>Retorno al hub</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map panel */}
        <div className="relative flex-1">
          {/* Toggle: show/hide completed route */}
          <div
            style={{
              position: 'absolute',
              top: '0.75rem',
              left: '0.75rem',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              background: 'rgba(12,26,46,0.9)',
              border: '1px solid #1a3352',
              borderRadius: '0.75rem',
              padding: '0.5rem 0.875rem',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
              cursor: 'pointer',
              userSelect: 'none',
            }}
            onClick={() => setShowCompleted((v) => !v)}
          >
            {/* Switch track */}
            <div
              style={{
                width: '2.75rem',
                height: '1.5rem',
                borderRadius: '999px',
                background: showCompleted ? '#16a34a' : '#1a3352',
                transition: 'background 0.2s',
                position: 'relative',
                flexShrink: 0,
              }}
            >
              {/* Switch thumb */}
              <div
                style={{
                  position: 'absolute',
                  top: '0.2rem',
                  left: showCompleted ? 'calc(100% - 1.15rem - 0.2rem)' : '0.2rem',
                  width: '1.1rem',
                  height: '1.1rem',
                  borderRadius: '50%',
                  background: 'white',
                  transition: 'left 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: showCompleted ? '#22c55e' : '#94a3b8',
                whiteSpace: 'nowrap',
                transition: 'color 0.2s',
              }}
            >
              Ver ruta recorrida
            </span>
          </div>
          <MapContainer
            center={QUILICURA_CENTER}
            zoom={13}
            zoomControl={false}
            attributionControl={false}
            style={{ position: 'absolute', inset: 0 }}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={19}
              tileSize={512}
              zoomOffset={-1}
            />

            {/* Completed segment — only when toggle is on */}
            {showCompleted && (
              <Polyline
                positions={completedRoute}
                pathOptions={{ color: '#22c55e', weight: 4, opacity: 0.55, dashArray: '8, 8' }}
              />
            )}

            {/* Active segment: driver → pending stops → hub */}
            <Polyline
              positions={activeRoute}
              pathOptions={{ color: '#3b82f6', weight: 5, dashArray: '12, 10', opacity: 0.9 }}
            />

            <Marker position={HUB_POSITION} icon={hubIcon} />
            <Marker position={DRIVER_POSITION} icon={driverIcon} />

            {PACKAGES.map((pkg, i) => {
              // Hide delivered stops when "ver ruta recorrida" is off
              if (pkg.status === 'delivered' && !showCompleted) return null
              return <Marker key={pkg.id} position={pkg.coords} icon={stopIcons[i]} />
            })}

            <MapCapture onReady={setLeafletMap} />
          </MapContainer>
        </div>
      </div>

      {/* Recenter button — fixed, right side, vertically centered (above alert) */}
      {leafletMap && (
        <button
          onClick={() => leafletMap.flyTo(DRIVER_POSITION, 13)}
          title="Centrar en mi posición"
          style={{
            position: 'fixed',
            right: '1.25rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 9985,
            width: '3rem',
            height: '3rem',
            borderRadius: '0.75rem',
            background: 'rgba(12,26,46,0.92)',
            border: '1.5px solid #1a3352',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            fontSize: '1.3rem',
            color: '#60a5fa',
          }}
        >
          ◎
        </button>
      )}
    </div>
  )
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="text-sm font-medium px-2.5 py-1 rounded-full"
      style={{ background: `${color}22`, color }}
    >
      {label}
    </span>
  )
}
