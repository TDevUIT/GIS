export function getElevationColor(elevation: number): string {
  if (elevation < 10) return '#0ea5e9';
  if (elevation < 50) return '#84cc16';
  if (elevation < 100) return '#22c55e';
  if (elevation < 200) return '#eab308';
  if (elevation < 300) return '#f97316';
  if (elevation < 500) return '#dc2626';
  if (elevation < 1000) return '#9333ea';
  return '#7c3aed';
}

export function getElevationLabel(elevation: number): string {
  if (elevation < 10) return 'Thấp';
  if (elevation < 50) return 'Trung bình thấp';
  if (elevation < 100) return 'Trung bình';
  if (elevation < 200) return 'Cao';
  if (elevation < 300) return 'Rất cao';
  if (elevation < 500) return 'Núi thấp';
  if (elevation < 1000) return 'Núi cao';
  return 'Núi rất cao';
}

export function getSlopeLabel(slope: number): string {
  if (slope < 5) return 'Bằng phẳng';
  if (slope < 10) return 'Dốc nhẹ';
  if (slope < 20) return 'Dốc vừa';
  if (slope < 30) return 'Dốc';
  if (slope < 45) return 'Rất dốc';
  return 'Dốc đứng';
}

export interface TerrainPolygon {
  id: string;
  elevation: number;
  slope: number;
  aspect: number | null;
  terrainType: string;
  geometry: any;
}

export function convertTerrainToPolygon(terrain: any): TerrainPolygon {
  return {
    id: String(terrain?.id ?? terrain?._id ?? terrain?.gid ?? ''),
    elevation: Number(terrain?.elevation ?? terrain?.elev ?? 0),
    slope: Number(terrain?.slope ?? 0),
    aspect: terrain?.aspect ?? null,
    terrainType: terrain.terrainType || terrain.terrain_type || 'FLAT',
    geometry: terrain.geom || terrain.geometry || null,
  };
}

export function parseGeoJSON(geom: any): any {
  try {
    if (!geom) return null;

    if (typeof geom === 'string') {
      return JSON.parse(geom);
    }

    // Accept common GeoJSON shapes
    if (geom?.type === 'FeatureCollection') {
      return geom;
    }

    // If backend returns GeoJSON Feature, wrap it
    if (geom?.type === 'Feature' && geom?.geometry) {
      return geom;
    }

    // If backend returns raw geometry, wrap it as a Feature
    if (geom?.type && geom?.coordinates) {
      return {
        type: 'Feature',
        properties: {},
        geometry: geom,
      };
    }

    return geom;
  } catch (error) {
    console.warn('Failed to parse geometry:', error);
    return null;
  }
}
