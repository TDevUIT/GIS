'use client';

import { useEffect, useState } from 'react';
import { GeoJSON, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useWards } from '@/hooks/api';
import { WardGeoJSON } from '@/types';
import { convertWardToGeoJSON } from '@/utils/geoHelpers';

interface WardMapProps {
  districtId?: string;
  onWardClick?: (ward: WardGeoJSON) => void;
  highlightedWardId?: string;
  showLabels?: boolean;
}

export default function WardMap({
  districtId,
  onWardClick,
  highlightedWardId,
  showLabels = true,
}: WardMapProps) {
  const map = useMap();
  const [selectedWard, setSelectedWard] = useState<WardGeoJSON | null>(null);
  const [geoJsonData, setGeoJsonData] = useState<WardGeoJSON[]>([]);

  const { data: wardsData, isLoading, error } = useWards(districtId);

  useEffect(() => {
    if (wardsData?.data) {
      try {
        const wards = Array.isArray(wardsData.data) ? wardsData.data : [wardsData.data];
        const geoJson = wards.map(convertWardToGeoJSON);
        setGeoJsonData(geoJson);
      } catch (error) {
        console.error('Error converting ward data:', error);
        setGeoJsonData([]);
      }
    }
  }, [wardsData, districtId]);

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

  const handleWardClick = (ward: WardGeoJSON) => {
    setSelectedWard(ward);
    if (onWardClick) {
      onWardClick(ward);
    }
  };

  const getWardStyle = (feature?: any) => {
    const isHighlighted = feature?.id === highlightedWardId;
    const isSelected = feature?.id === selectedWard?.id;

    return {
      fillColor: isSelected ? '#8b5cf6' : isHighlighted ? '#10b981' : '#a78bfa',
      fillOpacity: isSelected ? 0.6 : isHighlighted ? 0.5 : 0.3,
      color: isSelected ? '#6d28d9' : isHighlighted ? '#059669' : '#7c3aed',
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
        layer.setStyle(getWardStyle(feature));
      },
      click: () => {
        handleWardClick(feature as WardGeoJSON);
      },
    });

    if (showLabels && feature.properties?.name) {
      const bounds = (layer as any).getBounds();
      const center = bounds.getCenter();

      L.marker(center, {
        icon: L.divIcon({
          className: 'ward-label',
          html: `<div style="font-size: 11px; font-weight: 600; color: #6d28d9; text-shadow: 1px 1px 2px white, -1px -1px 2px white; white-space: nowrap; pointer-events: none;">${feature.properties.name}</div>`,
          iconSize: [100, 20],
          iconAnchor: [50, 10],
        }),
      }).addTo(map);
    }
  };

  return (
    <>
      {geoJsonData.map((ward) => (
        <GeoJSON
          key={ward.id}
          data={ward as any}
          style={getWardStyle}
          onEachFeature={onEachFeature}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg text-gray-800 mb-2 border-b pb-2">
                {ward.properties.name}
              </h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">MÃ£:</span>
                  <span className="font-semibold text-gray-800">{ward.properties.code}</span>
                </div>
                {ward.properties.districtName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quáº­n:</span>
                    <span className="font-semibold text-gray-800">
                      {ward.properties.districtName}
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
