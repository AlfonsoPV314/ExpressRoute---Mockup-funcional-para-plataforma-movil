import { useState, useEffect } from 'react'

type LatLng = [number, number]

// Fetches a road-following route from the OSRM demo server.
// Falls back to the raw waypoints (straight line) on error or timeout.
export function useOSRMRoute(waypoints: LatLng[]): { route: LatLng[]; loading: boolean } {
  const [route, setRoute] = useState<LatLng[]>(waypoints)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (waypoints.length < 2) {
      setLoading(false)
      return
    }
    setLoading(true)

    const coordStr = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';')
    const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)

    fetch(url, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (data.routes?.[0]?.geometry?.coordinates) {
          const coords: LatLng[] = data.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng],
          )
          setRoute(coords)
        } else {
          setRoute(waypoints)
        }
      })
      .catch(() => setRoute(waypoints))
      .finally(() => {
        clearTimeout(timeout)
        setLoading(false)
      })

    return () => {
      controller.abort()
      clearTimeout(timeout)
    }
    // waypoints are static (from mockData) so stringify is fine as dep key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(waypoints)])

  return { route, loading }
}
