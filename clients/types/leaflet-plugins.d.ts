declare module 'leaflet.markercluster' {
  import * as L from 'leaflet';

  interface MarkerClusterGroupOptions extends L.LayerOptions {
    showCoverageOnHover?: boolean;
    zoomToBoundsOnClick?: boolean;
    spiderfyOnMaxZoom?: boolean;
    removeOutsideVisibleBounds?: boolean;
    animate?: boolean;
    animateAddingMarkers?: boolean;
    disableClusteringAtZoom?: number;
    maxClusterRadius?: number | ((zoom: number) => number);
    polygonOptions?: L.PolylineOptions;
    singleMarkerMode?: boolean;
    spiderLegPolylineOptions?: L.PolylineOptions;
    spiderfyDistanceMultiplier?: number;
    iconCreateFunction?: (cluster: L.MarkerCluster) => L.Icon | L.DivIcon;
    chunkedLoading?: boolean;
    chunkInterval?: number;
    chunkDelay?: number;
    chunkProgress?: (processed: number, total: number, elapsed: number) => void;
  }

  class MarkerClusterGroup extends L.FeatureGroup {
    constructor(options?: MarkerClusterGroupOptions);
    addLayer(layer: L.Layer): this;
    removeLayer(layer: L.Layer): this;
    clearLayers(): this;
    hasLayer(layer: L.Layer): boolean;
    getVisibleParent(marker: L.Marker): L.Marker | L.MarkerCluster;
    refreshClusters(clusters?: L.Layer | L.Layer[]): this;
    getChildCount(): number;
  }

  namespace L {
    interface MarkerCluster extends L.Marker {
      getAllChildMarkers(): L.Marker[];
      getChildCount(): number;
    }
  }

  const markerClusterGroup: typeof MarkerClusterGroup;
  export default markerClusterGroup;
  export { MarkerClusterGroup, MarkerClusterGroupOptions };
}

declare module 'leaflet.heat' {
  import * as L from 'leaflet';

  interface HeatLayerOptions extends L.LayerOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: { [key: number]: string };
  }

  class HeatLayer extends L.Layer {
    constructor(latlngs: Array<[number, number, number?]>, options?: HeatLayerOptions);
    setLatLngs(latlngs: Array<[number, number, number?]>): this;
    addLatLng(latlng: [number, number, number?]): this;
    setOptions(options: HeatLayerOptions): this;
  }

  namespace L {
    function heatLayer(
      latlngs: Array<[number, number, number?]>,
      options?: HeatLayerOptions
    ): HeatLayer;
  }

  const heatLayer: typeof L.heatLayer;
  export default heatLayer;
  export { HeatLayer, HeatLayerOptions };
}
