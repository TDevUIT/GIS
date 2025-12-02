/**
 * Routing Service - Chỉ đường giữa 2 điểm
 * Sử dụng OpenRouteService API hoặc OSRM
 */

export type TransportMode = 'driving' | 'walking' | 'cycling' | 'motorcycle'

export interface RoutePoint {
  lat: number
  lon: number
  name?: string
}

export interface RouteResult {
  coordinates: [number, number][] // [lon, lat] format
  distance: number // meters
  duration: number // seconds
  instructions: RouteInstruction[]
  bbox: [number, number, number, number] // [minLon, minLat, maxLon, maxLat]
}

export interface RouteInstruction {
  text: string
  distance: number
  time: number
  type: string
  index: number
}

const OSRM_BASE_URL = 'https://router.project-osrm.org'

class RoutingService {
  /**
   * Tính toán route giữa 2 điểm
   * @param start - Điểm bắt đầu
   * @param end - Điểm kết thúc
   * @param mode - Phương tiện di chuyển
   */
  async getRoute(
    start: RoutePoint,
    end: RoutePoint,
    mode: TransportMode = 'driving'
  ): Promise<RouteResult> {
    try {
      // Convert transport mode to OSRM profile
      const profile = this.getModeProfile(mode)
      
      const coords = `${start.lon},${start.lat};${end.lon},${end.lat}`
      const url = `${OSRM_BASE_URL}/route/v1/${profile}/${coords}?overview=full&steps=true&geometries=geojson`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Routing API error: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found')
      }

      const route = data.routes[0]
      
      return {
        coordinates: route.geometry.coordinates.map((coord: [number, number]) => coord),
        distance: route.distance,
        duration: route.duration,
        instructions: this.extractInstructions(route.legs),
        bbox: this.calculateBounds(route.geometry.coordinates),
      }
    } catch (error) {
      console.error('Error getting route:', error)
      throw error
    }
  }

  /**
   * Tính toán route đi qua nhiều điểm
   */
  async getMultiPointRoute(
    points: RoutePoint[],
    mode: TransportMode = 'driving'
  ): Promise<RouteResult> {
    try {
      if (points.length < 2) {
        throw new Error('At least 2 points required')
      }

      const profile = this.getModeProfile(mode)
      const coords = points
        .map(p => `${p.lon},${p.lat}`)
        .join(';')
      
      const url = `${OSRM_BASE_URL}/route/v1/${profile}/${coords}?overview=full&steps=true&geometries=geojson`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Routing API error: ${response.statusText}`)
      }

      const data = await response.json()

      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found')
      }

      const route = data.routes[0]
      
      return {
        coordinates: route.geometry.coordinates,
        distance: route.distance,
        duration: route.duration,
        instructions: this.extractInstructions(route.legs),
        bbox: this.calculateBounds(route.geometry.coordinates),
      }
    } catch (error) {
      console.error('Error getting multi-point route:', error)
      throw error
    }
  }

  /**
   * Tính khoảng cách và thời gian giữa 2 điểm (không có route)
   */
  async getDistanceMatrix(
    origins: RoutePoint[],
    destinations: RoutePoint[],
    mode: TransportMode = 'driving'
  ): Promise<{
    distances: number[][]
    durations: number[][]
  }> {
    try {
      const profile = this.getModeProfile(mode)
      
      // Build coordinates string
      const allPoints = [...origins, ...destinations]
      const coords = allPoints
        .map(p => `${p.lon},${p.lat}`)
        .join(';')

      const sources = origins.map((_, i) => i).join(';')
      const destinations_idx = destinations.map((_, i) => i + origins.length).join(';')
      
      const url = `${OSRM_BASE_URL}/table/v1/${profile}/${coords}?sources=${sources}&destinations=${destinations_idx}`

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Distance matrix API error: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        distances: data.distances || [],
        durations: data.durations || [],
      }
    } catch (error) {
      console.error('Error getting distance matrix:', error)
      throw error
    }
  }

  /**
   * Format khoảng cách
   */
  formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${Math.round(meters)} m`
    }
    return `${(meters / 1000).toFixed(1)} km`
  }

  /**
   * Format thời gian
   */
  formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${Math.round(seconds)} giây`
    }
    if (seconds < 3600) {
      return `${Math.round(seconds / 60)} phút`
    }
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.round((seconds % 3600) / 60)
    return `${hours} giờ ${minutes} phút`
  }

  /**
   * Lấy profile tương ứng với mode
   */
  private getModeProfile(mode: TransportMode): string {
    switch (mode) {
      case 'driving':
      case 'motorcycle':
        return 'car' // OSRM uses 'car' for both
      case 'walking':
        return 'foot'
      case 'cycling':
        return 'bike'
      default:
        return 'car'
    }
  }

  /**
   * Trích xuất hướng dẫn từ route legs
   */
  private extractInstructions(legs: any[]): RouteInstruction[] {
    const instructions: RouteInstruction[] = []
    let index = 0

    legs.forEach(leg => {
      if (leg.steps) {
        leg.steps.forEach((step: any) => {
          instructions.push({
            text: step.maneuver?.instruction || this.getDefaultInstruction(step),
            distance: step.distance,
            time: step.duration,
            type: step.maneuver?.type || 'continue',
            index: index++,
          })
        })
      }
    })

    return instructions
  }

  /**
   * Tạo instruction mặc định
   */
  private getDefaultInstruction(step: any): string {
    const mode = step.mode || 'driving'
    const distance = this.formatDistance(step.distance)
    return `Đi ${distance} theo ${step.name || 'đường hiện tại'}`
  }

  /**
   * Tính bounds từ coordinates
   */
  private calculateBounds(coordinates: [number, number][]): [number, number, number, number] {
    if (coordinates.length === 0) {
      return [0, 0, 0, 0]
    }

    let minLon = coordinates[0][0]
    let minLat = coordinates[0][1]
    let maxLon = coordinates[0][0]
    let maxLat = coordinates[0][1]

    coordinates.forEach(coord => {
      minLon = Math.min(minLon, coord[0])
      minLat = Math.min(minLat, coord[1])
      maxLon = Math.max(maxLon, coord[0])
      maxLat = Math.max(maxLat, coord[1])
    })

    return [minLon, minLat, maxLon, maxLat]
  }

  /**
   * Tính khoảng cách Haversine giữa 2 điểm
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3 // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180
    const φ2 = (lat2 * Math.PI) / 180
    const Δφ = ((lat2 - lat1) * Math.PI) / 180
    const Δλ = ((lon2 - lon1) * Math.PI) / 180

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }
}

export const routingService = new RoutingService()
