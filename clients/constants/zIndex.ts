/**
 * Z-Index Constants for Map Components
 * Centralized z-index management to prevent layering conflicts
 */

export const Z_INDEX = {
  // Base map layer (Leaflet defaults)
  MAP_BASE: 0,
  MAP_PANE: 400,           // Leaflet overlayPane
  MAP_SHADOW: 500,         // Leaflet shadowPane
  MAP_MARKER: 600,         // Leaflet markerPane
  MAP_TOOLTIP: 650,        // Leaflet tooltipPane
  MAP_POPUP: 700,          // Leaflet popupPane
  
  // Map controls (Leaflet default controls)
  MAP_CONTROLS: 800,
  ZOOM_CONTROL: 850,
  
  // UI Elements on map (low priority)
  BACK_BUTTON: 900,
  MAP_TOOLBAR: 900,
  INFO_PANELS: 1000,       // District/Ward/Accident info panels
  TRAFFIC_LEGEND: 1000,    // Traffic legend card
  
  // Top toolbar
  QUICK_ACCESS_TOOLBAR: 1050,
  
  // Top-right layer buttons
  LAYER_BUTTONS: 1100,     // Layer toggle buttons (Layers, Accident, Traffic)
  ACCIDENT_CONTROLS: 1000, // Accident clustering/heatmap controls
  
  // Drawing and draggable icons
  DRAWING_TOOLBAR: 1080,
  DRAGGABLE_ICONS: 1085,
  
  // Panels (medium priority)
  LAYER_PANEL: 1150,       // Map layers panel
  
  // Backdrop overlay (behind sidebars)
  BACKDROP: 9998,
  
  // Feature sidebar (high priority)
  FEATURE_BUTTON: 9999,    // Feature toggle button
  FEATURE_SIDEBAR: 10000,  // Feature sidebar panel
  
  // Top notifications
  NOTIFICATION: 10050,
  
  // Modals and alerts (highest priority)
  MODAL: 10100,
  ALERT: 10200,
} as const

/**
 * Helper function to get z-index value
 */
export const getZIndex = (key: keyof typeof Z_INDEX): number => {
  return Z_INDEX[key]
}
