/**
 * Geocoding Interfaces
 * Interfaces for geocoding service (address ↔ coordinates)
 */

export interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
  address?: {
    road?: string;
    suburb?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    quarter?: string;
  };
  type?: string;
  importance?: number;
  place_id?: string;
}

export interface ReverseGeocodingResult {
  lat: string;
  lon: string;
  display_name: string;
  address: {
    road?: string;
    suburb?: string;
    quarter?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
  place_id: string;
}
