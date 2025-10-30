'use client';

import { useEffect, useState } from 'react';
import { GeoJSON, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useWards } from '@/hooks/api/useWardsQuery';
import { useGisWards } from '@/hooks/api/useGisWardsQuery';
import { WardGeoJSON } from '@/types';
import { convertWardToGeoJSON } from '@/utils/geoHelpers';
import { Loader2, AlertCircle } from 'lucide-react';

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

  const { data: wardsData, isLoading: wardsLoading, error: wardsError } = useWards(districtId);
  const { data: gisWardsData, isLoading: gisLoading, error: gisError } = useGisWards(districtId);

  useEffect(() => {
    if (gisWardsData?.data && wardsData?.data) {
      try {
        const gisWards = Array.isArray(gisWardsData.data) ? gisWardsData.data : [gisWardsData.data];
        const wards = Array.isArray(wardsData.data) ? wardsData.data : [wardsData.data];

        const geoJson: WardGeoJSON[] = gisWards.map((gisWard: any) => {
          const wardInfo = wards.find((w: any) => w.code === gisWard.code);
          return convertWardToGeoJSON({ ...gisWard, ...wardInfo });
        });

        setGeoJsonData(geoJson);
      } catch (error) {
        console.error('Error converting ward data:', error);
        setGeoJsonData([]);
      }
    } else if (gisWardsData?.data) {
      try {
        const gisWards = Array.isArray(gisWardsData.data) ? gisWardsData.data : [gisWardsData.data];
        const geoJson = gisWards.map(convertWardToGeoJSON);
        setGeoJsonData(geoJson);
      } catch (error) {
        console.error('Error converting ward data:', error);
        setGeoJsonData([]);
      }
    }
  }, [wardsData, gisWardsData, districtId]);

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

  const isLoading = wardsLoading || gisLoading;

  if (isLoading) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-purple-200">
        <div className="flex items-center gap-3 text-purple-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Đang tải dữ liệu phường/xã...</span>
        </div>
      </div>
    );
  }

  if (wardsError || gisError) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-4 rounded-lg shadow-lg border border-red-200 max-w-md">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-700 mb-1">Lỗi tải dữ liệu</h3>
            <p className="text-sm text-red-600">
              {wardsError?.message || gisError?.message || 'Không thể tải dữ liệu phường/xã từ server'}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                  <span className="text-gray-600">Mã:</span>
                  <span className="font-semibold text-gray-800">{ward.properties.code}</span>
                </div>
                {ward.properties.districtName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quận:</span>
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
