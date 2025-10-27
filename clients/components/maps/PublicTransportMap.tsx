'use client';

import { useEffect, useState } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGisPublicTransports } from '@/hooks/api/useGisPublicTransportsQuery';
import {
  convertPublicTransportToRoute,
  getTransportModeColor,
  getTransportModeLabel,
  parseGeoJSON,
  PublicTransportRoute,
  TransportMode
} from '@/utils/publicTransportHelpers';
import { Loader2, AlertCircle, Bus } from 'lucide-react';

interface PublicTransportMapProps {
  onRouteClick?: (route: PublicTransportRoute) => void;
}

export default function PublicTransportMap({ onRouteClick }: PublicTransportMapProps) {
  const map = useMap();
  const [transportData, setTransportData] = useState<PublicTransportRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<PublicTransportRoute | null>(null);

  const { data: gisTransportData, isLoading, error } = useGisPublicTransports();

  useEffect(() => {
    if (gisTransportData?.data) {
      try {
        const transports = Array.isArray(gisTransportData.data)
          ? gisTransportData.data
          : [gisTransportData.data];

        const routes = transports
          .map(convertPublicTransportToRoute)
          .filter((route) => route.geometry !== null);

        if (routes.length === 0 && transports.length > 0) {
          console.warn('⚠️ No public transport routes have valid geometry.');
        } else {
          console.log(`✅ Loaded ${routes.length} public transport routes`);
        }

        setTransportData(routes);
      } catch (error) {
        console.error('Error converting public transport data:', error);
        setTransportData([]);
      }
    }
  }, [gisTransportData]);

  if (isLoading) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-blue-200">
        <div className="flex items-center gap-3 text-blue-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Đang tải dữ liệu giao thông công cộng...</span>
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
              {(error as any)?.message || 'Không thể tải dữ liệu giao thông công cộng'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasValidData = transportData.length > 0;
  const hasRawData = gisTransportData?.data && (
    Array.isArray(gisTransportData.data) ? gisTransportData.data.length > 0 : true
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
                Dữ liệu giao thông công cộng không có thông tin hình học (geometry).
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute bottom-20 left-6 bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-blue-200"
        style={{ zIndex: 1000 }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-blue-800">Giao thông công cộng</span>
            <Bus className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-gray-700">Xe buýt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-gray-700">Metro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
              <span className="text-gray-700">BRT</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 rounded" style={{ backgroundColor: '#06b6d4' }}></div>
              <span className="text-gray-700">Đường thủy</span>
            </div>
          </div>

          <div className="pt-2 border-t text-xs text-gray-500">
            <strong>{transportData.length}</strong> tuyến
          </div>
        </div>
      </div>

      {transportData.map((route) => {
        const color = getTransportModeColor(route.mode);
        const geojson = parseGeoJSON(route.geometry);

        if (!geojson) return null;

        return (
          <GeoJSON
            key={route.id}
            data={geojson}
            style={{
              color: color,
              weight: 4,
              opacity: 0.8,
            }}
            eventHandlers={{
              click: () => {
                setSelectedRoute(route);
                if (onRouteClick) {
                  onRouteClick(route);
                }
              },
              mouseover: (e) => {
                e.target.setStyle({ weight: 6, opacity: 1 });
              },
              mouseout: (e) => {
                e.target.setStyle({ weight: 4, opacity: 0.8 });
              },
            }}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`
                <div class="p-2 min-w-[220px]">
                  <h3 class="font-bold text-base mb-2">${route.routeName}</h3>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Số hiệu:</span>
                      <span class="font-semibold text-gray-800">
                        ${route.routeNumber}
                      </span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Loại:</span>
                      <span class="font-semibold px-2 py-0.5 rounded text-white text-xs" style="background-color: ${color};">
                        ${getTransportModeLabel(route.mode)}
                      </span>
                    </div>
                    ${route.operator ? `
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600">Đơn vị:</span>
                        <span class="text-xs text-gray-600">${route.operator}</span>
                      </div>
                    ` : ''}
                    ${route.frequency ? `
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600">Tần suất:</span>
                        <span class="text-xs text-gray-600">${route.frequency} phút/chuyến</span>
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
