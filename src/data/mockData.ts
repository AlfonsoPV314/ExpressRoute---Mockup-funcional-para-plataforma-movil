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

// Quilicura, Chile center
export const DRIVER_POSITION: [number, number] = [-33.3500, -70.7320]

export const QUILICURA_CENTER: [number, number] = [-33.355, -70.724]

export const PACKAGES: Package[] = [
  {
    // Stop #1 — already delivered earlier in the shift
    id: 'PKG-000',
    product: 'Hervidor Eléctrico',
    fragile: false,
    destination: 'Calle El Nogal 234, Quilicura',
    recipient: 'Sofía Vargas',
    deliveryTime: '17:45',
    status: 'delivered',
    coords: [-33.346, -70.737],
    stopNumber: 1,
  },
  {
    id: 'PKG-001',
    product: 'Set de Vasos de Cristal × 4 un.',
    fragile: true,
    destination: 'Av. Manuel Antonio Matta 1520, Quilicura',
    recipient: 'John Doe',
    deliveryTime: '18:30',
    status: 'pending',
    coords: [-33.352, -70.728],
    stopNumber: 2,
  },
  {
    id: 'PKG-002',
    product: 'Caja de Herramientas',
    fragile: false,
    destination: 'Calle Los Pinos 342, Quilicura',
    recipient: 'María González',
    deliveryTime: '18:50',
    status: 'pending',
    coords: [-33.356, -70.721],
    stopNumber: 3,
  },
  {
    id: 'PKG-003',
    product: 'Lámpara de Escritorio',
    fragile: true,
    destination: 'Pasaje Los Cipreses 18, Quilicura',
    recipient: 'Diego Rojas',
    deliveryTime: '19:05',
    status: 'pending',
    coords: [-33.361, -70.716],
    stopNumber: 4,
  },
  {
    id: 'PKG-004',
    product: 'Monitor 27"',
    fragile: true,
    destination: 'Calle El Roble 789, Quilicura',
    recipient: 'Ana Torres',
    deliveryTime: '19:20',
    status: 'pending',
    coords: [-33.365, -70.724],
    stopNumber: 5,
  },
  {
    id: 'PKG-005',
    product: 'Ropa Deportiva (x3)',
    fragile: false,
    destination: 'Av. Américo Vespucio 4230, Quilicura',
    recipient: 'Pedro Saavedra',
    deliveryTime: '19:40',
    status: 'pending',
    coords: [-33.358, -70.733],
    stopNumber: 6,
  },
]

// First pending package in route order
export const NEXT_PACKAGE = PACKAGES.find((p) => p.status === 'pending')!

// Full route polyline: driver → all stops in order
export const FULL_ROUTE_COORDS: [number, number][] = [
  DRIVER_POSITION,
  ...PACKAGES.map((p) => p.coords),
]

// Route segment to the next pending stop only
export const NEXT_STOP_ROUTE: [number, number][] = [
  DRIVER_POSITION,
  NEXT_PACKAGE.coords,
]
