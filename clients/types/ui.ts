/**
 * UI-related shared types and interfaces
 * Types used across multiple UI components
 */

/**
 * Point of Interest (POI) category configuration
 * Used in: NearestPointSearch and map-related components
 */
export interface POICategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  query: string;
  color: string;
}

/**
 * Quick access button configuration
 * Used in: QuickAccessToolbar
 */
export interface QuickAccessButton {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  service: string;
}
