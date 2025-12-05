/**
 * Geocoding Service - Chuyển đổi địa chỉ ↔ tọa độ
 * Sử dụng OpenStreetMap Nominatim API
 */

import type { GeocodingResult, ReverseGeocodingResult } from '@/interfaces/external/geocoding';


const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'
const GEOCODING_API_BASE_URL = process.env.NEXT_PUBLIC_GEOCODING_API_URL || NOMINATIM_BASE_URL

class GeocodingService {
  /**
   * Tìm kiếm địa điểm theo địa chỉ hoặc tên địa điểm
   * @param query - Địa chỉ hoặc tên địa điểm cần tìm
   * @param limit - Số lượng kết quả tối đa (mặc định: 5)
   * @param countrycodes - Mã quốc gia (vd: 'vn' cho Việt Nam)
   */
  async search(
    query: string,
    limit: number = 5,
    countrycodes: string = 'vn'
  ): Promise<GeocodingResult[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: limit.toString(),
        countrycodes,
        addressdetails: '1',
      })

      const response = await fetch(
        `${GEOCODING_API_BASE_URL}/search?${params.toString()}`,
        {
          headers: {
            'Accept-Language': 'vi',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        display_name: item.display_name,
        address: item.address,
        type: item.type,
        importance: item.importance,
        place_id: item.place_id,
      }))
    } catch (error) {
      console.error('Error searching location:', error)
      throw error
    }
  }

  /**
   * Chuyển đổi tọa độ thành địa chỉ (Reverse Geocoding)
   * @param lat - Vĩ độ
   * @param lon - Kinh độ
   */
  async reverseGeocode(
    lat: number,
    lon: number
  ): Promise<ReverseGeocodingResult> {
    try {
      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        format: 'json',
        addressdetails: '1',
      })

      const response = await fetch(
        `${GEOCODING_API_BASE_URL}/reverse?${params.toString()}`,
        {
          headers: {
            'Accept-Language': 'vi',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Reverse geocoding error: ${response.statusText}`)
      }

      const data = await response.json()
      return {
        lat: data.lat,
        lon: data.lon,
        display_name: data.display_name,
        address: data.address || {},
        place_id: data.place_id,
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error)
      throw error
    }
  }

  /**
   * Tìm kiếm địa điểm theo tọa độ (hộp giới hạn)
   * @param viewbox - [minLon, minLat, maxLon, maxLat]
   * @param query - Từ khóa tìm kiếm
   */
  async searchInBounds(
    viewbox: [number, number, number, number],
    query: string,
    limit: number = 10
  ): Promise<GeocodingResult[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        format: 'json',
        limit: limit.toString(),
        viewbox: viewbox.join(','),
        bounded: '1',
        addressdetails: '1',
      })

      const response = await fetch(
        `${GEOCODING_API_BASE_URL}/search?${params.toString()}`,
        {
          headers: {
            'Accept-Language': 'vi',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        display_name: item.display_name,
        address: item.address,
        type: item.type,
        importance: item.importance,
        place_id: item.place_id,
      }))
    } catch (error) {
      console.error('Error searching in bounds:', error)
      throw error
    }
  }

  /**
   * Format địa chỉ ngắn gọn
   */
  formatAddress(result: GeocodingResult | ReverseGeocodingResult): string {
    const addr = result.address
    if (!addr) return result.display_name

    const parts: string[] = []
    if (addr.road) parts.push(addr.road)
    if (addr.suburb) parts.push(addr.suburb)
    if (addr.quarter) parts.push(addr.quarter)
    if (addr.city) parts.push(addr.city)

    return parts.length > 0 ? parts.join(', ') : result.display_name
  }
}

export const geocodingService = new GeocodingService()
