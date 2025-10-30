export function getDensityColor(density: number): string {
  if (density < 1000) return '#dcfce7';
  if (density < 5000) return '#86efac';
  if (density < 10000) return '#4ade80';
  if (density < 15000) return '#22c55e';
  if (density < 20000) return '#16a34a';
  if (density < 30000) return '#f59e0b';
  if (density < 40000) return '#f97316';
  return '#dc2626';
}

export function getDensityLabel(density: number): string {
  if (density < 1000) return 'Rất thấp';
  if (density < 5000) return 'Thấp';
  if (density < 10000) return 'Trung bình thấp';
  if (density < 15000) return 'Trung bình';
  if (density < 20000) return 'Trung bình cao';
  if (density < 30000) return 'Cao';
  if (density < 40000) return 'Rất cao';
  return 'Cực cao';
}

const DISTRICT_CENTERS: Record<string, [number, number]> = {
  'Quận 1': [10.7769, 106.7009],
  'Quận 3': [10.7835, 106.6881],
  'Quận 4': [10.7590, 106.7041],
  'Quận 5': [10.7545, 106.6664],
  'Quận 6': [10.7486, 106.6350],
  'Quận 7': [10.7335, 106.7219],
  'Quận 8': [10.7412, 106.6778],
  'Quận 10': [10.7726, 106.6694],
  'Quận 11': [10.7624, 106.6499],
  'Quận 12': [10.8632, 106.6678],
  'Bình Thạnh': [10.8011, 106.7102],
  'Bình Tân': [10.7647, 106.6060],
  'Gò Vấp': [10.8379, 106.6717],
  'Phú Nhuận': [10.7978, 106.6831],
  'Tân Bình': [10.7992, 106.6525],
  'Tân Phú': [10.7877, 106.6284],
  'Thủ Đức': [10.8505, 106.7690],
};

export interface PopulationPoint {
  id: string;
  lat: number;
  lng: number;
  total: number;
  male: number;
  female: number;
  density: number;
  households: number;
  year: number;
  districtName: string;
}

export function convertPopulationToPoint(population: any): PopulationPoint {
  let lat = population.latitude || population.lat;
  let lng = population.longitude || population.lng;

  if (population.geom || population.location) {
    try {
      const geom = population.geom || population.location;
      const parsed = typeof geom === 'string' ? JSON.parse(geom) : geom;

      if (parsed.type === 'Point' && Array.isArray(parsed.coordinates)) {
        [lng, lat] = parsed.coordinates;
      }
    } catch (error) {
      console.warn('Failed to parse geom:', error);
    }
  }

  const districtName = population.district?.name || population.districtName || 'Chưa xác định';
  
  if (!lat || !lng) {
    const center = DISTRICT_CENTERS[districtName];
    if (center) {
      [lat, lng] = center;
    }
  }

  const total = population.populationTotal || population.total || 0;
  const male = population.male || Math.floor(total * 0.49);
  const female = population.female || Math.floor(total * 0.51);
  
  const area = 10;
  const density = Math.round(total / area);

  return {
    id: population.id,
    lat: lat,
    lng: lng,
    total: total,
    male: male,
    female: female,
    density: density,
    households: population.householdsTotal || population.households || 0,
    year: population.year || new Date().getFullYear(),
    districtName: districtName,
  };
}
