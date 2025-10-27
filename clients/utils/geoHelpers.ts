import { DistrictGeoJSON, WardGeoJSON } from '@/types';

export function convertDistrictToGeoJSON(district: any): DistrictGeoJSON {
  // Handle different possible geometry field names
  let geometry = district.geometry || district.geom || district.boundaries;
  
  // If no valid geometry, return a placeholder
  if (!geometry || !geometry.type || !geometry.coordinates) {
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
