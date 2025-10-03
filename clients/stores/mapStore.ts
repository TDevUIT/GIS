import { create } from 'zustand';

interface MapState {
  center: { latitude: number; longitude: number };
  zoom: number;
  basemap: string;
  
  layers: {
    traffic: boolean;
    airQuality: boolean;
    incidents: boolean;
    districts: boolean;
  };
  
  selectedDistrict: string | null;
  selectedIncident: string | null;
  
  isSidebarOpen: boolean;
  isLoading: boolean;

  setCenter: (center: { latitude: number; longitude: number }) => void;
  setZoom: (zoom: number) => void;
  setBasemap: (basemap: string) => void;
  toggleLayer: (layer: keyof MapState['layers']) => void;
  setLayerVisibility: (layer: keyof MapState['layers'], visible: boolean) => void;
  setSelectedDistrict: (districtId: string | null) => void;
  setSelectedIncident: (incidentId: string | null) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
  resetMap: () => void;
}

export const useMapStore = create<MapState>((set, get) => ({
center: { latitude: 10.8231, longitude: 106.6297 },
  zoom: 11,
  basemap: 'streets-vector',
  
  layers: {
    traffic: true,
    airQuality: false,
    incidents: true,
    districts: true,
  },
  
  selectedDistrict: null,
  selectedIncident: null,
  isSidebarOpen: true,
  isLoading: false,

  setCenter: (center) => {
    console.log('🗺️ Map Store: Center changed', center);
    set({ center });
  },

  setZoom: (zoom) => {
    console.log('🔍 Map Store: Zoom changed', zoom);
    set({ zoom });
  },

  setBasemap: (basemap) => {
    console.log('🌍 Map Store: Basemap changed', basemap);
    set({ basemap });
  },

  toggleLayer: (layer) => {
    const currentLayers = get().layers;
    const newVisibility = !currentLayers[layer];
    console.log(`👁️ Map Store: Layer ${layer} toggled to`, newVisibility);
    
    set({
      layers: {
        ...currentLayers,
        [layer]: newVisibility,
      }
    });
  },

  setLayerVisibility: (layer, visible) => {
    const currentLayers = get().layers;
    console.log(`👁️ Map Store: Layer ${layer} set to`, visible);
    
    set({
      layers: {
        ...currentLayers,
        [layer]: visible,
      }
    });
  },

  setSelectedDistrict: (districtId) => {
    console.log('📍 Map Store: District selected', districtId);
    set({ selectedDistrict: districtId });
  },

  setSelectedIncident: (incidentId) => {
    console.log('🚨 Map Store: Incident selected', incidentId);
    set({ selectedIncident: incidentId });
  },

  toggleSidebar: () => {
    const isOpen = get().isSidebarOpen;
    console.log('📋 Map Store: Sidebar toggled to', !isOpen);
    set({ isSidebarOpen: !isOpen });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  resetMap: () => {
    console.log('🔄 Map Store: Map reset to defaults');
    set({
      center: { latitude: 10.8231, longitude: 106.6297 },
      zoom: 11,
      basemap: 'streets-vector',
      selectedDistrict: null,
      selectedIncident: null,
    });
  },
}));
