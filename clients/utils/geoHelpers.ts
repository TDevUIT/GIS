import { DistrictGeoJSON, WardGeoJSON } from '@/types';

export function convertDistrictToGeoJSON(district: any): DistrictGeoJSON {
  // Handle different possible geometry field names
  let geometry = district.geometry || district.geom || district.boundaries;
  
  console.log('🔄 Converting district:', district.name, 'geom type:', typeof geometry, geometry);
  
  // If geometry is already an object with type and coordinates, use it
  if (geometry && typeof geometry === 'object' && geometry.type && geometry.coordinates) {
    console.log('✅ Geometry is valid GeoJSON');
  } else {
    console.error('❌ Invalid geometry for district:', district.name);
    geometry = {
      type: 'Polygon',
      coordinates: [[]],
    };
  }
  
  return {
    type: 'Feature',
    id: district.id || district.districtId,
    properties: {
      id: district.id || district.districtId,
      name: district.name || district.districtName,
      code: district.code || '',
      population: district.population,
      areaKm2: district.areaKm2 || district.area,
      densityPerKm2: district.densityPerKm2,
    },
    geometry: geometry,
  };
}

export function convertWardToGeoJSON(ward: any): WardGeoJSON {
  // Handle different possible geometry field names
  let geometry = ward.geometry || ward.geom || ward.boundaries;
  
  // If no valid geometry, return a placeholder
  if (!geometry || !geometry.type || !geometry.coordinates) {
    geometry = {
      type: 'Polygon',
      coordinates: [[]],
    };
  }
  
  return {
    type: 'Feature',
    id: ward.id || ward.wardId,
    properties: {
      id: ward.id || ward.wardId,
      name: ward.name || ward.wardName,
      code: ward.code || '',
      districtId: ward.districtId || ward.district_id,
      districtName: ward.districtName || ward.district_name,
    },
    geometry: geometry,
  };
}
