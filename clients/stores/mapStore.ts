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
    set({ center });
  },

  setZoom: (zoom) => {
    set({ zoom });
  },

  setBasemap: (basemap) => {
    set({ basemap });
  },

  toggleLayer: (layer) => {
    const currentLayers = get().layers;
    const newVisibility = !currentLayers[layer];

    set({
      layers: {
        ...currentLayers,
        [layer]: newVisibility,
      }
    });
  },

  setLayerVisibility: (layer, visible) => {
    const currentLayers = get().layers;

    set({
      layers: {
        ...currentLayers,
        [layer]: visible,
      }
    });
  },

  setSelectedDistrict: (districtId) => {
    set({ selectedDistrict: districtId });
  },

  setSelectedIncident: (incidentId) => {
    set({ selectedIncident: incidentId });
  },

  toggleSidebar: () => {
    const isOpen = get().isSidebarOpen;
    set({ isSidebarOpen: !isOpen });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  resetMap: () => {
    set({
      center: { latitude: 10.8231, longitude: 106.6297 },
      zoom: 11,
      basemap: 'streets-vector',
      selectedDistrict: null,
      selectedIncident: null,
    });
  },
}));
