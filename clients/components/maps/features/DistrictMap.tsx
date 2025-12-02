'use client';

import { useEffect, useState } from 'react';
import { GeoJSON, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useDistricts } from '@/hooks/api';
import { DistrictGeoJSON } from '@/types';
import { convertDistrictToGeoJSON } from '@/utils/geoHelpers';
import { Loader2, AlertCircle } from 'lucide-react';

interface DistrictMapProps {
  onDistrictClick?: (district: DistrictGeoJSON) => void;
  highlightedDistrictId?: string;
  showLabels?: boolean;
}

export default function DistrictMap({
  onDistrictClick,
  highlightedDistrictId,
  showLabels = true,
}: DistrictMapProps) {
  const map = useMap();
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictGeoJSON | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<DistrictGeoJSON[]>([]);

  const { data: districtsData, isLoading: districtsLoading, error: districtsError } = useDistricts();

  useEffect(() => {
    const payload = (districtsData as unknown as { data?: unknown })?.data ?? districtsData;
    if (payload) {
      try {
        console.log('ðŸ“ Districts raw data:', payload);

        const districts = Array.isArray(payload) ? payload : [payload];
        console.log('ðŸ“ Districts array:', districts);

        const geoJson: DistrictGeoJSON[] = districts
          .filter((district: unknown) => {
            const hasGeom = district && (district.geom || district.geometry);
            if (!hasGeom) {
              console.warn('âš ï¸ District without geom:', district?.name);
            }
            return hasGeom;
          })
          .map((district: unknown) => {
            const converted = convertDistrictToGeoJSON(district);
            console.log('âœ… Converted district:', district.name, converted);
            return converted;
          });

        console.log('ðŸ“ Total GeoJSON features:', geoJson.length);
        setGeoJsonData(geoJson);
      } catch (error) {
        console.error('âŒ Error converting district data:', error);
        setGeoJsonData([]);
      }
    }
  }, [districtsData]);

  useEffect(() => {
    if (geoJsonData.length > 0 && map) {
      try {
        const bounds = L.geoJSON(geoJsonData as GeoJSON.FeatureCollection).getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch {
        // Silently ignore bounds errors
      }
    }
  }, [geoJsonData, map]);

  const handleDistrictClick = (district: DistrictGeoJSON) => {
    setSelectedDistrict(district);
    if (onDistrictClick) {
      onDistrictClick(district);
    }
  };

  const getDistrictStyle = (feature?: GeoJSON.Feature) => {
    const isHighlighted = feature?.id === highlightedDistrictId;
    const isSelected = feature?.id === selectedDistrict?.id;

    return {
      fillColor: isSelected ? '#3b82f6' : isHighlighted ? '#10b981' : '#60a5fa',
      fillOpacity: isSelected ? 0.6 : isHighlighted ? 0.5 : 0.3,
      color: isSelected ? '#1e40af' : isHighlighted ? '#059669' : '#2563eb',
      weight: isSelected ? 3 : isHighlighted ? 2.5 : 2,
      opacity: 1,
    };
  };

  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    layer.on({
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({
          fillOpacity: 0.7,
          weight: 3,
        });
      },
      mouseout: (e) => {
        const layer = e.target;
        layer.setStyle(getDistrictStyle(feature));
      },
      click: () => {
        handleDistrictClick(feature as DistrictGeoJSON);
      },
    });

    if (showLabels && feature.properties?.name) {
      try {
        const bounds = (layer as L.Polygon | L.Polyline).getBounds?.();
        if (bounds && bounds.isValid && bounds.isValid()) {
          const center = bounds.getCenter();

          if (center && center.lat !== undefined && center.lng !== undefined) {
            L.marker(center, {
              icon: L.divIcon({
                className: 'district-label',
                html: `<div style="font-size: 12px; font-weight: 600; color: #1e40af; text-shadow: 1px 1px 2px white, -1px -1px 2px white; white-space: nowrap; pointer-events: none;">${feature.properties.name}</div>`,
                iconSize: [100, 20],
                iconAnchor: [50, 10],
              }),
            }).addTo(map);
          }
        }
      } catch (error) {
        // Silently fail if bounds cannot be calculated
        console.warn('Could not add label for district:', feature.properties.name, error);
      }
    }
  };

  if (districtsLoading) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-blue-200">
        <div className="flex items-center gap-3 text-blue-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Äang táº£i dá»¯ liá»‡u quáº­n/huyá»‡n...</span>
        </div>
      </div>
    );
  }

  if (districtsError) {
    return (

  console.log('ðŸ“ Rendering', geoJsonData.length, 'districts on map');

  return (
    <>
      {geoJsonData.map((district) => (
        <GeoJSON
          key={district.id}
          data={district as GeoJSON.Feature}
          style={getDistrictStyle}
          onEachFeature={onEachFeature}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg text-gray-800 mb-2 border-b pb-2">
                {district.properties.name}
              </h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">MÃ£:</span>
                  <span className="font-semibold text-gray-800">{district.properties.code}</span>
                </div>
                {district.properties.areaKm2 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diá»‡n tÃ­ch:</span>
                    <span className="font-semibold text-gray-800">
                      {district.properties.areaKm2.toFixed(2)} kmÂ²
                    </span>
                  </div>
                )}
                {district.properties.densityPerKm2 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Máº­t Ä‘á»™:</span>
                    <span className="font-semibold text-gray-800">
                      {district.properties.densityPerKm2.toLocaleString()} ngÆ°á»i/kmÂ²
                    </span>
                  </div>
                )}
                {district.properties.population && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">DÃ¢n sá»‘:</span>
                    <span className="font-semibold text-gray-800">
                      {district.properties.population.toLocaleString()} ngÆ°á»i
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Popup>
        </GeoJSON>
      ))}
    </>
  );
}
