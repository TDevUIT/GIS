/**
 * Z-Index Constants for Map Components
 * Centralized z-index management to prevent layering conflicts
 */

export const Z_INDEX = {
  // Base map layer
  MAP_BASE: 0,
  
  // Map controls (leaflet default controls)
  MAP_CONTROLS: 400,
  ZOOM_CONTROL: 450,
  
  // UI Elements on map
  BACK_BUTTON: 900,
  MAP_TOOLBAR: 900,
  
  // Top toolbar
  QUICK_ACCESS_TOOLBAR: 950,
  
  // Side buttons
  LAYER_BUTTON: 960,
  FEATURE_BUTTON: 970,
  
  // Drawing and draggable icons
  DRAWING_TOOLBAR: 980,
  DRAGGABLE_ICONS: 985,
  
  // Backdrop overlay
  BACKDROP: 999,
  
  // Sidebars and panels
  LAYER_PANEL: 1000,
  FEATURE_SIDEBAR: 1000,
  
  // Top notifications
  NOTIFICATION: 1050,
  
  // Modals and alerts (future use)
  MODAL: 1100,
  ALERT: 1200,
} as const

/**
 * Helper function to get z-index value
 */
export const getZIndex = (key: keyof typeof Z_INDEX): number => {
  return Z_INDEX[key]
}
