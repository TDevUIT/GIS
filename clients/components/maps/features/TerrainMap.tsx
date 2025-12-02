'use client';

import { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useTerrains } from '@/hooks/api';
import {
  convertTerrainToPolygon,
  getElevationColor,
  getElevationLabel,
  getSlopeLabel,
  parseGeoJSON,
  TerrainPolygon
} from '@/utils/terrainHelpers';
import { Loader2, AlertCircle, Mountain } from 'lucide-react';

interface TerrainMapProps {
  onPolygonClick?: (polygon: TerrainPolygon) => void;
}

export default function TerrainMap({ onPolygonClick }: TerrainMapProps) {
  const map = useMap();
  const [terrainData, setTerrainData] = useState<TerrainPolygon[]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<TerrainPolygon | null>(null);

  const { data: gisTerrainData, isLoading, error } = useTerrains();

  useEffect(() => {
    if (gisTerrainData?.data) {
      try {
        const terrains = Array.isArray(gisTerrainData.data)
          ? gisTerrainData.data
          : [gisTerrainData.data];

        const polygons = terrains
          .map(convertTerrainToPolygon)
          .filter((polygon) => polygon.geometry !== null);

        if (polygons.length === 0 && terrains.length > 0) {
          console.warn('⚠️ No terrain polygons have valid geometry.');
        } else {
          console.log(`✅ Loaded ${polygons.length} terrain polygons`);
        }

        setTerrainData(polygons);
      } catch (error) {
        console.error('Error converting terrain data:', error);
        setTerrainData([]);
      }
    }
  }, [gisTerrainData]);

  if (isLoading) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-slate-200">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Đang tải dữ liệu địa hình...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-4 rounded-lg shadow-lg border border-red-200 max-w-md">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-700 mb-1">Lỗi tải dữ liệu</h3>
            <p className="text-sm text-red-600">
              {(error as Error)?.message || 'Không thể tải dữ liệu địa hình'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasValidData = terrainData.length > 0;
  const hasRawData = gisTerrainData?.data && (
    Array.isArray(gisTerrainData.data) ? gisTerrainData.data.length > 0 : true
  );

  return (
    <>
      {!isLoading && hasRawData && !hasValidData && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-yellow-50/95 backdrop-blur-md px-6 py-4 rounded-lg shadow-lg border border-yellow-300 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Không có dữ liệu hình học</h3>
              <p className="text-sm text-yellow-700">
                Dữ liệu địa hình không có thông tin hình học (geometry).
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute top-68 left-24 bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-slate-200"
        style={{ zIndex: 1000 }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-slate-800">Độ cao (m)</span>
            <Mountain className="w-4 h-4 text-slate-600" />
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#0ea5e9' }}></div>
              <span className="text-gray-700">&lt; 10m</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }}></div>
              <span className="text-gray-700">10-50m</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
              <span className="text-gray-700">50-100m</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }}></div>
              <span className="text-gray-700">100-200m</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
              <span className="text-gray-700">200-300m</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
              <span className="text-gray-700">300-500m</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9333ea' }}></div>
              <span className="text-gray-700">500-1000m</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#7c3aed' }}></div>
              <span className="text-gray-700">&gt; 1000m</span>
            </div>
          </div>

          <div className="pt-2 border-t text-xs text-gray-500">
            <strong>{terrainData.length}</strong> khu vực
          </div>
        </div>
      </div>

      {terrainData.map((polygon) => {
        const color = getElevationColor(polygon.elevation);
        const geojson = parseGeoJSON(polygon.geometry);

        if (!geojson) return null;

        return (
          <GeoJSON
            key={polygon.id}
            data={geojson}
            style={{
              fillColor: color,
              fillOpacity: 0.6,
              color: color,
              weight: 1,
              opacity: 0.8,
            }}
            eventHandlers={{
              click: () => {
                setSelectedPolygon(polygon);
                if (onPolygonClick) {
                  onPolygonClick(polygon);
                }
              },
            }}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`
                <div class="p-2 min-w-[200px]">
                  <h3 class="font-bold text-base mb-2">Địa hình</h3>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Độ cao:</span>
                      <span class="font-semibold text-gray-800">
                        ${polygon.elevation.toFixed(1)} m
                      </span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Mức độ:</span>
                      <span class="font-semibold px-2 py-0.5 rounded text-white text-xs" style="background-color: ${color};">
                        ${getElevationLabel(polygon.elevation)}
                      </span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Độ dốc:</span>
                      <span class="text-xs text-gray-600">
                        ${polygon.slope.toFixed(1)}° (${getSlopeLabel(polygon.slope)})
                      </span>
                    </div>
                    ${polygon.aspect !== null ? `
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600">Hướng:</span>
                        <span class="text-xs text-gray-600">${polygon.aspect.toFixed(0)}°</span>
                      </div>
                    ` : ''}
                  </div>
                </div>
              `);
            }}
          />
        );
      })}
    </>
  );
}
