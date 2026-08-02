import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Marker } from 'react-leaflet'
import L from 'leaflet'
import AppHeader, { type View } from '../components/AppHeader'
import { PACKAGES, DRIVER_POSITION, FULL_ROUTE_COORDS, QUILICURA_CENTER } from '../data/mockData'

interface FullRouteViewProps {
  onNavigate: (view: View) => void
  onLogout: () => void
}

// Navigation arrow SVG as a DivIcon — distinct from stop markers
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

export default function FullRouteView({ onNavigate, onLogout }: FullRouteViewProps) {
  const driverIcon = useMemo(() => makeDriverIcon(), [])

  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl
  }, [])

  const pendingCount = PACKAGES.filter((p) => p.status === 'pending').length
  const deliveredCount = PACKAGES.filter((p) => p.status === 'delivered').length

  return (
    <div className="relative w-full h-full flex flex-col" style={{ background: '#060d1a' }}>
      <AppHeader onNavigate={onNavigate} onLogout={onLogout} />

      {/* Body: list left | map right */}
      <div className="flex flex-1 overflow-hidden pt-20">

        {/* Left panel — stop list */}
        <div
          className="flex flex-col flex-shrink-0 overflow-hidden"
          style={{ width: '38%', borderRight: '1px solid #1a3352', background: '#0c1a2e' }}
        >
          {/* Panel header */}
          <div
            className="px-4 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid #1a3352' }}
          >
            <h2 className="font-bold text-white text-xl mb-2">Ruta Completa</h2>
            <div className="flex gap-2 flex-wrap">
              <Badge label={`${deliveredCount} entregados`} color="#16a34a" />
              <Badge label={`${pendingCount} pendientes`} color="#2563eb" />
            </div>
          </div>

          {/* Scrollable stops */}
          <div className="scrollable flex-1 overflow-y-auto">
            {PACKAGES.map((pkg, i) => (
              <div
                key={pkg.id}
                className="px-4 py-3 flex items-start gap-3"
                style={{ borderBottom: i < PACKAGES.length - 1 ? '1px solid #1a3352' : 'none' }}
              >
                {/* Stop badge */}
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

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className="font-semibold text-white text-lg leading-tight">{pkg.product}</span>
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
          </div>
        </div>

        {/* Right panel — map */}
        <div className="relative flex-1">
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
            />

            <Polyline
              positions={FULL_ROUTE_COORDS}
              pathOptions={{ color: '#3b82f6', weight: 4, dashArray: '10, 9', opacity: 0.85 }}
            />

            {/* Driver — navigation arrow */}
            <Marker position={DRIVER_POSITION} icon={driverIcon} />

            {/* Delivery stops */}
            {PACKAGES.map((pkg) => (
              <CircleMarker
                key={pkg.id}
                center={pkg.coords}
                radius={10}
                pathOptions={{
                  color: pkg.status === 'delivered' ? '#22c55e' : '#3b82f6',
                  fillColor: pkg.status === 'delivered' ? '#16a34a' : '#1d4ed8',
                  fillOpacity: 1,
                  weight: 2.5,
                }}
              />
            ))}
          </MapContainer>
        </div>
      </div>
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
