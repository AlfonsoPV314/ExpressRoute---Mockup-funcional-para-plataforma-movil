import { useState } from 'react'
import LoginView from './views/LoginView'
import MainMapView from './views/MainMapView'
import FullRouteView from './views/FullRouteView'
import PackageListView from './views/PackageListView'
import AccountView from './views/AccountView'
import OffScreen from './views/OffScreen'
import AlertButton from './components/AlertButton'
import type { View } from './components/AppHeader'
import { PACKAGES, DRIVER_POSITION, type PackageStatus } from './data/mockData'

// PKG-001 is the stop that starts already delivered at shift start
const INITIAL_DELIVERED_ID = 'PKG-001'

export default function App() {
  const [view, setView] = useState<View>('login')
  const [deliveredIds, setDeliveredIds] = useState<Set<string>>(new Set([INITIAL_DELIVERED_ID]))
  const [driverPos, setDriverPos] = useState<[number, number]>(DRIVER_POSITION)

  const handleLogin = () => setView('main')
  const handleLogout = () => {
    setDeliveredIds(new Set([INITIAL_DELIVERED_ID]))
    setDriverPos(DRIVER_POSITION)
    setView('login')
  }
  const handleNavigate = (v: View) => setView(v)
  const handleEmergency = () => setView('off')
  const handleWake = () => setView('main')

  // Live package list — statuses derived from deliveredIds
  const packages = PACKAGES.map((p) => ({
    ...p,
    status: (deliveredIds.has(p.id) ? 'delivered' : 'pending') as PackageStatus,
  }))

  const nextPackage = packages.find((p) => p.status === 'pending') ?? null

  const handleDeliveryConfirmed = (pkgId: string, pkgCoords: [number, number]) => {
    const newDelivered = new Set([...deliveredIds, pkgId])
    setDeliveredIds(newDelivered)
    setDriverPos(pkgCoords) // driver is now at the delivery location

    // All stops done → reset to initial state after 4 s
    if (newDelivered.size === PACKAGES.length) {
      setTimeout(() => {
        setDeliveredIds(new Set([INITIAL_DELIVERED_ID]))
        setDriverPos(DRIVER_POSITION)
      }, 4000)
    }
  }

  const loggedIn = view !== 'login' && view !== 'off'

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: '#060d1a', fontFamily: "'Inter', sans-serif" }}
    >
      {view === 'login' && <LoginView onLogin={handleLogin} />}

      {view === 'main' && (
        <MainMapView
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          packages={packages}
          driverPos={driverPos}
          nextPackage={nextPackage}
          onDeliveryConfirmed={handleDeliveryConfirmed}
        />
      )}

      {view === 'fullRoute' && (
        <FullRouteView
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          packages={packages}
          driverPos={driverPos}
        />
      )}

      {view === 'packages' && (
        <PackageListView
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          packages={packages}
        />
      )}

      {view === 'account' && (
        <AccountView onNavigate={handleNavigate} onLogout={handleLogout} />
      )}

      {view === 'off' && <OffScreen onWake={handleWake} />}

      {loggedIn && <AlertButton key={view} onEmergencyConfirmed={handleEmergency} />}
    </div>
  )
}
