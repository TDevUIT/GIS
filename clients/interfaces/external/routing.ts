/**
 * Routing Interfaces
 * Interfaces for routing service (route calculation, navigation)
 */

export type TransportMode = 'driving' | 'walking' | 'cycling' | 'motorcycle';

export interface RoutePoint {
  lat: number;
  lon: number;
  name?: string;
}

export interface RouteResult {
  coordinates: [number, number][]; // [lon, lat] format
  distance: number; // meters
  duration: number; // seconds
  instructions: RouteInstruction[];
  bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
}

export interface RouteInstruction {
  text: string;
  distance: number;
  time: number;
  type: string;
  index: number;
}
