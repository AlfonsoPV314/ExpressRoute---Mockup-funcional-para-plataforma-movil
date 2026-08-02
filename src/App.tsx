import { useState } from 'react'
import LoginView from './views/LoginView'
import MainMapView from './views/MainMapView'
import FullRouteView from './views/FullRouteView'
import PackageListView from './views/PackageListView'
import AccountView from './views/AccountView'
import OffScreen from './views/OffScreen'
import AlertButton from './components/AlertButton'
import type { View } from './components/AppHeader'

export default function App() {
  const [view, setView] = useState<View>('login')

  const handleLogin = () => setView('main')
  const handleLogout = () => setView('login')
  const handleNavigate = (v: View) => setView(v)
  const handleEmergency = () => setView('off')
  const handleWake = () => setView('main')

  const loggedIn = view !== 'login' && view !== 'off'

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: '#060d1a', fontFamily: "'Inter', sans-serif" }}
    >
      {view === 'login' && <LoginView onLogin={handleLogin} />}

      {view === 'main' && (
        <MainMapView onNavigate={handleNavigate} onLogout={handleLogout} />
      )}

      {view === 'fullRoute' && (
        <FullRouteView onNavigate={handleNavigate} onLogout={handleLogout} />
      )}

      {view === 'packages' && (
        <PackageListView onNavigate={handleNavigate} onLogout={handleLogout} />
      )}

      {view === 'account' && (
        <AccountView onNavigate={handleNavigate} onLogout={handleLogout} />
      )}

      {view === 'off' && <OffScreen onWake={handleWake} />}

      {/* Global alert button — visible on all logged-in views */}
      {loggedIn && <AlertButton key={view} onEmergencyConfirmed={handleEmergency} />}
    </div>
  )
}
