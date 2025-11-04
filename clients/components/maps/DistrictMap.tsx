'use client';

import { useEffect, useState } from 'react';
import { GeoJSON, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useDistricts } from '@/hooks/api/useDistrictsQuery';
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
    const payload = (districtsData as any)?.data ?? districtsData;
    if (payload) {
      try {
        console.log('📍 Districts raw data:', payload);
        
        const districts = Array.isArray(payload) ? payload : [payload];
        console.log('📍 Districts array:', districts);

        const geoJson: DistrictGeoJSON[] = districts
          .filter((district: any) => {
            const hasGeom = district && (district.geom || district.geometry);
            if (!hasGeom) {
              console.warn('⚠️ District without geom:', district?.name);
            }
            return hasGeom;
          })
          .map((district: any) => {
            const converted = convertDistrictToGeoJSON(district);
            console.log('✅ Converted district:', district.name, converted);
            return converted;
          });

        console.log('📍 Total GeoJSON features:', geoJson.length);
        setGeoJsonData(geoJson);
      } catch (error) {
        console.error('❌ Error converting district data:', error);
        setGeoJsonData([]);
      }
    }
  }, [districtsData]);

  useEffect(() => {
    if (geoJsonData.length > 0 && map) {
      try {
        const bounds = L.geoJSON(geoJsonData as any).getBounds();
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (error) {}
    }
  }, [geoJsonData, map]);

  const handleDistrictClick = (district: DistrictGeoJSON) => {
    setSelectedDistrict(district);
    if (onDistrictClick) {
      onDistrictClick(district);
    }
  };

  const getDistrictStyle = (feature?: any) => {
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

  const onEachFeature = (feature: any, layer: L.Layer) => {
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
        const bounds = (layer as any).getBounds?.();
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
          <span className="font-medium">Đang tải dữ liệu quận/huyện...</span>
        </div>
      </div>
    );
  }

  if (districtsError) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-4 rounded-lg shadow-lg border border-red-200 max-w-md">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-700 mb-1">Lỗi tải dữ liệu</h3>
            <p className="text-sm text-red-600">
              {(districtsError as any)?.message || 'Không thể tải dữ liệu quận/huyện từ server'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  console.log('📍 Rendering', geoJsonData.length, 'districts on map');

  return (
    <>
      {geoJsonData.map((district) => (
        <GeoJSON
          key={district.id}
          data={district as any}
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
                  <span className="text-gray-600">Mã:</span>
                  <span className="font-semibold text-gray-800">{district.properties.code}</span>
                </div>
                {district.properties.areaKm2 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diện tích:</span>
                    <span className="font-semibold text-gray-800">
                      {district.properties.areaKm2.toFixed(2)} km²
                    </span>
                  </div>
                )}
                {district.properties.densityPerKm2 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mật độ:</span>
                    <span className="font-semibold text-gray-800">
                      {district.properties.densityPerKm2.toLocaleString()} người/km²
                    </span>
                  </div>
                )}
                {district.properties.population && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dân số:</span>
                    <span className="font-semibold text-gray-800">
                      {district.properties.population.toLocaleString()} người
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
