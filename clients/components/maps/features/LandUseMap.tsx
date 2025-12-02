'use client';

import { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useLandUses } from '@/hooks/api';
import {
  convertLandUseToPolygon,
  getLandUseColor,
  getLandUseLabel,
  parseGeoJSON,
  LandUsePolygon
} from '@/utils/landUseHelpers';
import { Loader2, AlertCircle, Map } from 'lucide-react';

interface LandUseMapProps {
  onPolygonClick?: (polygon: LandUsePolygon) => void;
}

export default function LandUseMap({ onPolygonClick }: LandUseMapProps) {
  const map = useMap();
  const [landUseData, setLandUseData] = useState<LandUsePolygon[]>([]);
  const [selectedPolygon, setSelectedPolygon] = useState<LandUsePolygon | null>(null);

  const { data: landUseResponse, isLoading, error } = useLandUses();

  useEffect(() => {
    if (landUseResponse?.data) {
      try {
        const landUses = Array.isArray(landUseResponse.data)
          ? landUseResponse.data
          : [landUseResponse.data];

        const polygons = landUses
          .map(convertLandUseToPolygon)
          .filter((polygon) => polygon.geometry !== null);

        if (polygons.length === 0 && landUses.length > 0) {
          console.warn('⚠️ No land use polygons have valid geometry.');
        } else {
          console.log(`✅ Loaded ${polygons.length} land use polygons`);
        }

        setLandUseData(polygons);
      } catch (error) {
        console.error('Error converting land use data:', error);
        setLandUseData([]);
      }
    }
  }, [landUseResponse]);

  if (isLoading) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-amber-200">
        <div className="flex items-center gap-3 text-amber-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Äang táº£i dá»¯ liá»‡u sá»­ dá»¥ng Ä‘áº¥t...</span>
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
            <h3 className="font-semibold text-red-700 mb-1">Lá»—i táº£i dá»¯ liá»‡u</h3>
            <p className="text-sm text-red-600">
              {(error as any)?.message || 'KhÃ´ng thá»ƒ táº£i dá»¯ liá»‡u sá»­ dá»¥ng Ä‘áº¥t'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasValidData = landUseData.length > 0;
  const hasRawData = landUseResponse?.data && (
    Array.isArray(landUseResponse.data) ? landUseResponse.data.length > 0 : true
  );

  return (
    <>
      {!isLoading && hasRawData && !hasValidData && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-yellow-50/95 backdrop-blur-md px-6 py-4 rounded-lg shadow-lg border border-yellow-300 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">KhÃ´ng cÃ³ dá»¯ liá»‡u hÃ¬nh há»c</h3>
              <p className="text-sm text-yellow-700">
                Dá»¯ liá»‡u sá»­ dá»¥ng Ä‘áº¥t khÃ´ng cÃ³ thÃ´ng tin hÃ¬nh há»c (geometry).
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute top-44 left-24 bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-amber-200"
        style={{ zIndex: 1000 }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-amber-800">Sá»­ dá»¥ng Ä‘áº¥t</span>
            <Map className="w-4 h-4 text-amber-600" />
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
              <span className="text-gray-700">Khu dÃ¢n cÆ°</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ec4899' }}></div>
              <span className="text-gray-700">ThÆ°Æ¡ng máº¡i</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8b5cf6' }}></div>
              <span className="text-gray-700">CÃ´ng nghiá»‡p</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }}></div>
              <span className="text-gray-700">NÃ´ng nghiá»‡p</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-gray-700">Rá»«ng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#06b6d4' }}></div>
              <span className="text-gray-700">Máº·t nÆ°á»›c</span>
            </div>
          </div>

          <div className="pt-2 border-t text-xs text-gray-500">
            <strong>{landUseData.length}</strong> khu vá»±c
          </div>
        </div>
      </div>

      {landUseData.map((polygon) => {
        const color = getLandUseColor(polygon.type);
        const geojson = parseGeoJSON(polygon.geometry);

        if (!geojson) return null;

        return (
          <GeoJSON
            key={polygon.id}
            data={geojson}
            style={{
              fillColor: color,
              fillOpacity: 0.4,
              color: color,
              weight: 2,
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
                  <h3 class="font-bold text-base mb-2">${getLandUseLabel(polygon.type)}</h3>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Loáº¡i:</span>
                      <span class="font-semibold px-2 py-0.5 rounded text-white text-xs" style="background-color: ${color};">
                        ${getLandUseLabel(polygon.type)}
                      </span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Diá»‡n tÃ­ch:</span>
                      <span class="font-semibold text-gray-800">
                        ${polygon.area.toLocaleString()} mÂ²
                      </span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Quáº­n/Huyá»‡n:</span>
                      <span class="font-semibold text-gray-800">
                        ${polygon.districtName}
                      </span>
                    </div>
                    ${polygon.zoning ? `
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600">Quy hoáº¡ch:</span>
                        <span class="text-xs text-gray-600">${polygon.zoning}</span>
                      </div>
                    ` : ''}
                    ${polygon.description ? `
                      <div class="pt-2 border-t">
                        <p class="text-xs text-gray-600">${polygon.description}</p>
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
