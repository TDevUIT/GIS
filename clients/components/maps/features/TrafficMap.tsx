'use client';

import { useEffect, useState } from 'react';
import { Polyline, Popup } from 'react-leaflet';
import { useTraffics } from '@/hooks/api';
import { TrafficLine } from '@/types';
import {
  convertTrafficToLine,
  getCongestionLabel,
} from '@/utils/trafficHelpers';
import { Loader2, AlertCircle } from 'lucide-react';

interface TrafficMapProps {
  onRoadClick?: (traffic: TrafficLine) => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export default function TrafficMap({
  onRoadClick,
  autoRefresh = true,
  refreshInterval = 30000,
}: TrafficMapProps) {
  const [trafficData, setTrafficData] = useState<TrafficLine[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const { data: gisTrafficData, isLoading, error, refetch } = useTraffics();

  useEffect(() => {
    if (gisTrafficData?.data) {
      try {
        const traffics = Array.isArray(gisTrafficData.data)
          ? gisTrafficData.data
          : [gisTrafficData.data];

        const lines = traffics
          .map(convertTrafficToLine)
          .filter((line) => {
            // Only include traffic with valid coordinates
            return line.coordinates &&
                   Array.isArray(line.coordinates) &&
                   line.coordinates.length > 0;
          });

        if (lines.length === 0 && traffics.length > 0) {
          console.warn('âš ï¸ No traffic data has valid coordinates. Check geom field parsing.');
        } else {
          console.log(`âœ… Loaded ${lines.length} traffic lines`);
        }

        setTrafficData(lines);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error converting traffic data:', error);
        setTrafficData([]);
      }
    }
  }, [gisTrafficData]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetch();
      console.log('ðŸ”„ Traffic data refreshed');
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refetch]);

  const handleRoadClick = (traffic: TrafficLine) => {
    if (onRoadClick) {
      onRoadClick(traffic);
    }
  };

  if (isLoading) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-blue-200">
        <div className="flex items-center gap-3 text-blue-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Äang táº£i dá»¯ liá»‡u giao thÃ´ng...</span>
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
              {(error as Error)?.message || 'KhÃ´ng thá»ƒ táº£i dá»¯ liá»‡u giao thÃ´ng tá»« server'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have valid data
  const hasValidData = trafficData.length > 0;
  const hasRawData = gisTrafficData?.data && (
    Array.isArray(gisTrafficData.data) ? gisTrafficData.data.length > 0 : true
  );

  return (
    <>
      {/* Warning when API returns data but no valid coordinates */}
      {!isLoading && hasRawData && !hasValidData && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-yellow-50/95 backdrop-blur-md px-6 py-4 rounded-lg shadow-lg border border-yellow-300 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">KhÃ´ng cÃ³ dá»¯ liá»‡u geometry</h3>
              <p className="text-sm text-yellow-700">
                API tráº£ vá» dá»¯ liá»‡u giao thÃ´ng nhÆ°ng khÃ´ng parse Ä‘Æ°á»£c tá»a Ä‘á»™ tá»« trÆ°á»ng 'geom'.
                Kiá»ƒm tra console Ä‘á»ƒ xem chi tiáº¿t.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legend and live indicator */}
      <div
        className="absolute bottom-44 right-6 bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-blue-200"
        style={{ zIndex: 1000 }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-blue-800">Giao thÃ´ng</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-blue-600 font-medium">Live</span>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-green-500 rounded"></div>
              <span className="text-gray-700">ThÃ´ng thoÃ¡ng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-amber-500 rounded"></div>
              <span className="text-gray-700">Trung bÃ¬nh</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-orange-600 rounded"></div>
              <span className="text-gray-700">ÄÃ´ng Ä‘Ãºc</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-1 bg-red-600 rounded"></div>
              <span className="text-gray-700">Táº¯c ngháº½n</span>
            </div>
          </div>

          <div className="pt-2 border-t text-xs text-gray-500">
            Cáº­p nháº­t: {lastUpdate.toLocaleTimeString('vi-VN')}
          </div>
        </div>
      </div>

      {trafficData.map((traffic) => (
        <Polyline
          key={traffic.id}
          positions={traffic.coordinates as [number, number][]}
          pane="overlayPane"
          pathOptions={{
            color: traffic.color,
            weight: 6,
            opacity: 0.8,
            lineJoin: 'round',
            lineCap: 'round',
          }}
          eventHandlers={{
            click: () => handleRoadClick(traffic),
            mouseover: (e) => {
              const layer = e.target;
              layer.setStyle({
                weight: 8,
                opacity: 1,
              });
            },
            mouseout: (e) => {
              const layer = e.target;
              layer.setStyle({
                weight: 6,
                opacity: 0.8,
              });
            },
          }}
        >
          <Popup>
            <div className="p-2 min-w-[220px]">
              <h3 className="font-bold text-base text-gray-800 mb-2 border-b pb-2">
                {traffic.roadName}
              </h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tráº¡ng thÃ¡i:</span>
                  <span
                    className="font-semibold px-2 py-0.5 rounded text-white text-xs"
                    style={{ backgroundColor: traffic.color }}
                  >
                    {getCongestionLabel(traffic.congestionLevel)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">LÆ°u lÆ°á»£ng:</span>
                  <span className="font-semibold text-gray-800">
                    {traffic.trafficVolume.toLocaleString()} xe/ngÃ y
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tá»‘c Ä‘á»™ TB:</span>
                  <span className="font-semibold text-gray-800">{traffic.averageSpeed} km/h</span>
                </div>
              </div>
            </div>
          </Popup>
        </Polyline>
      ))}
    </>
  );
}
