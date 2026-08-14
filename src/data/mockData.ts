export type PackageStatus = 'pending' | 'delivered'

export interface Package {
  id: string
  product: string
  fragile: boolean
  destination: string
  recipient: string
  deliveryTime: string
  status: PackageStatus
  coords: [number, number]
  stopNumber: number
  packageSerials: string[]
}

export interface Driver {
  name: string
  email: string
  phone: string
  vehiclePlate: string
  hub: string
  employeeId: string
}

export const DRIVER: Driver = {
  name: 'Carlos Mendoza',
  email: 'c.mendoza@expressroute.cl',
  phone: '+56 9 8765 4321',
  vehiclePlate: 'BCDF-42',
  hub: 'Quilicura',
  employeeId: 'EMP-0042',
}

export const DRIVER_POSITION: [number, number] = [-33.3500, -70.7320]
export const QUILICURA_CENTER: [number, number] = [-33.355, -70.724]

// Distribution hub — industrial zone north of Quilicura
export const HUB_POSITION: [number, number] = [-33.337, -70.741]

export const PACKAGES: Package[] = [
  {
    // Stop 1 — already delivered. Placed at the intersection of
    // Av. Lo Echevers and Calle Los Almendros, SOUTHWEST of the
    // driver's current position, so the completed route segment
    // (Hub → stop 1 → driver) traces a natural southbound arc
    id: 'PKG-001',
    product: 'Hervidor Eléctrico',
    fragile: false,
    destination: 'Av. Lo Echevers esq. Los Almendros 225, Quilicura',
    recipient: 'Sofía Vargas',
    deliveryTime: '17:45',
    status: 'delivered',
    coords: [-33.356, -70.739],
    stopNumber: 1,
    packageSerials: ['PKG-001'],
  },
  {
    id: 'PKG-002',
    product: 'Set de Vasos de Cristal × 4 un.',
    fragile: true,
    destination: 'Av. Manuel Antonio Matta 1520, Quilicura',
    recipient: 'John Doe',
    deliveryTime: '18:30',
    status: 'pending',
    coords: [-33.352, -70.728],
    stopNumber: 2,
    packageSerials: ['PKG-002'],
  },
  {
    id: 'PKG-003',
    product: 'Caja de Herramientas',
    fragile: false,
    destination: 'Calle Los Pinos 342, Quilicura',
    recipient: 'María González',
    deliveryTime: '18:50',
    status: 'pending',
    coords: [-33.356, -70.721],
    stopNumber: 3,
    packageSerials: ['PKG-003'],
  },
  {
    id: 'PKG-004',
    product: 'Lámpara de Escritorio',
    fragile: true,
    destination: 'Pasaje Los Cipreses 18, Quilicura',
    recipient: 'Diego Rojas',
    deliveryTime: '19:05',
    status: 'pending',
    coords: [-33.361, -70.716],
    stopNumber: 4,
    packageSerials: ['PKG-004'],
  },
  {
    id: 'PKG-005',
    product: 'Monitor 27"',
    fragile: true,
    destination: 'Calle El Roble 789, Quilicura',
    recipient: 'Ana Torres',
    deliveryTime: '19:20',
    status: 'pending',
    coords: [-33.365, -70.724],
    stopNumber: 5,
    packageSerials: ['PKG-005'],
  },
  {
    id: 'PKG-006',
    product: 'Ropa Deportiva (x3)',
    fragile: false,
    destination: 'Av. Américo Vespucio 4230, Quilicura',
    recipient: 'Pedro Saavedra',
    deliveryTime: '19:40',
    status: 'pending',
    coords: [-33.358, -70.733],
    stopNumber: 6,
    packageSerials: ['PKG-006'],
  },
]

// First pending package in route order
export const NEXT_PACKAGE = PACKAGES.find((p) => p.status === 'pending')!

// Completed portion: hub → delivered stop (SW of driver) → driver position
export const COMPLETED_ROUTE_WAYPOINTS: [number, number][] = [
  HUB_POSITION,
  ...PACKAGES.filter((p) => p.status === 'delivered').map((p) => p.coords),
  DRIVER_POSITION,
]

// Active portion: driver → remaining pending stops → back to hub
export const ACTIVE_ROUTE_WAYPOINTS: [number, number][] = [
  DRIVER_POSITION,
  ...PACKAGES.filter((p) => p.status === 'pending').map((p) => p.coords),
  HUB_POSITION,
]

// Route to next pending stop only (main map)
export const NEXT_STOP_ROUTE: [number, number][] = [
  DRIVER_POSITION,
  NEXT_PACKAGE.coords,
]

// Converts internal ID (PKG-001) to driver-facing label (Entrega 001)
export function formatDeliveryId(id: string): string {
  return id.replace('PKG-', 'Entrega ')
}
