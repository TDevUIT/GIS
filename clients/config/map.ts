
export const mapConfig = {
  defaults: {
    center: {
      latitude: 10.8231,
longitude: 106.6297
    },
    zoom: 11,
    basemap: 'streets-vector'
  },

  basemaps: [
    { id: 'streets-vector', name: 'Streets', icon: '🗺️' },
    { id: 'satellite', name: 'Satellite', icon: '🛰️' },
    { id: 'hybrid', name: 'Hybrid', icon: '🌍' },
    { id: 'topo-vector', name: 'Topographic', icon: '⛰️' }
  ],

  layers: {
    traffic: {
      id: 'traffic-layer',
      name: 'Traffic Data',
      visible: true,
      opacity: 0.8
    },
    airQuality: {
      id: 'air-quality-layer',
      name: 'Air Quality',
      visible: false,
      opacity: 0.6
    },
    incidents: {
      id: 'incidents-layer',
      name: 'Incidents',
      visible: true,
      opacity: 1.0
    },
    districts: {
      id: 'districts-layer',
      name: 'District Boundaries',
      visible: true,
      opacity: 0.3
    }
  },

  controls: {
    zoom: true,
    compass: true,
    scale: true,
    fullscreen: true,
    search: true,
    basemapToggle: true
  },

  popupTemplates: {
    traffic: {
      title: 'Traffic Data',
      content: `
        <div>
          <strong>Location:</strong> {location}<br>
          <strong>Vehicle Count:</strong> {vehicleCount}<br>
          <strong>Average Speed:</strong> {averageSpeed} km/h<br>
          <strong>Congestion Level:</strong> {congestionLevel}
        </div>
      `
    },
    airQuality: {
      title: 'Air Quality',
      content: `
        <div>
          <strong>Location:</strong> {location}<br>
          <strong>AQI:</strong> {aqi}<br>
          <strong>PM2.5:</strong> {pm25} μg/m³<br>
          <strong>Status:</strong> {status}
        </div>
      `
    },
    incident: {
      title: 'Incident Report',
      content: `
        <div>
          <strong>Type:</strong> {type}<br>
          <strong>Priority:</strong> {priority}<br>
          <strong>Status:</strong> {status}<br>
          <strong>Time:</strong> {timestamp}
        </div>
      `
    }
  }
};
