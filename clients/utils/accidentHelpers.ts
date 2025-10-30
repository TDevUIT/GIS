import { AccidentPoint } from '@/types';

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'CRITICAL':
      return '#dc2626'; // red-600
    case 'HIGH':
      return '#ea580c'; // orange-600
    case 'MEDIUM':
      return '#f59e0b'; // amber-500
    case 'LOW':
      return '#10b981'; // green-500
    default:
      return '#6b7280'; // gray-500
  }
}

export function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'CRITICAL':
      return 'Nghiêm trọng';
    case 'HIGH':
      return 'Cao';
    case 'MEDIUM':
      return 'Trung bình';
    case 'LOW':
      return 'Thấp';
    default:
      return 'Không xác định';
  }
}

export function convertAccidentToPoint(accident: any, trafficData?: any[]): AccidentPoint {
  // Try to get coordinates from different possible fields
  let lat = accident.latitude || accident.lat || accident.location?.lat;
  let lng = accident.longitude || accident.lng || accident.location?.lng;
  
  // If no direct coordinates, try to get from traffic data via trafficId
  if ((!lat || !lng) && accident.trafficId && trafficData) {
    const relatedTraffic = trafficData.find((t: any) => t.id === accident.trafficId);
    
    if (relatedTraffic && relatedTraffic.geom) {
      try {
        // Parse geom if it's a string
        const geom = typeof relatedTraffic.geom === 'string' 
          ? JSON.parse(relatedTraffic.geom) 
          : relatedTraffic.geom;
        
        if (geom.type === 'LineString' && Array.isArray(geom.coordinates) && geom.coordinates.length > 0) {
          // Get a random point along the line (or middle point)
          const coords = geom.coordinates;
          const middleIndex = Math.floor(coords.length / 2);
          const [lngVal, latVal] = coords[middleIndex];
          
          // Add slight random offset to avoid exact overlaps
          const randomOffset = 0.0005; // ~50 meters
          lat = latVal + (Math.random() - 0.5) * randomOffset;
          lng = lngVal + (Math.random() - 0.5) * randomOffset;
        }
      } catch (error) {
        console.warn('Failed to extract coordinates from traffic geom:', error);
      }
    }
  }
  
  // Get road name from traffic object if available
  const roadName = accident.roadName 
    || accident.road_name 
    || accident.traffic?.roadName 
    || 'Chưa xác định';
  
  return {
    id: accident.id || accident.accidentId,
    lat: lat,
    lng: lng,
    roadName: roadName,
    severity: accident.severity || 'MEDIUM',
    casualties: accident.casualties || 0,
    accidentDate: accident.accidentDate || accident.accident_date || new Date().toISOString(),
  };
}
