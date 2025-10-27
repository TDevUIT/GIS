'use client';

import { useEffect, useState, useMemo } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGisAccidents } from '@/hooks/api/useGisAccidentsQuery';
import { useGisTraffics } from '@/hooks/api/useGisTrafficsQuery';
import { AccidentPoint } from '@/types';
import {
  convertAccidentToPoint,
  getSeverityColor,
  getSeverityLabel,
} from '@/utils/accidentHelpers';
import { Loader2, AlertCircle, Filter, X } from 'lucide-react';

interface AccidentMapProps {
  onAccidentClick?: (accident: AccidentPoint) => void;
}

export default function AccidentMap({
  onAccidentClick,
}: AccidentMapProps) {
  const map = useMap();
  const [accidentsData, setAccidentsData] = useState<AccidentPoint[]>([]);
  const [selectedAccident, setSelectedAccident] = useState<AccidentPoint | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    severity: [] as string[],
    dateRange: 30,
  });

  const { data: gisAccidentsData, isLoading, error } = useGisAccidents();
  const { data: gisTrafficData } = useGisTraffics();


  useEffect(() => {
    if (gisAccidentsData?.data) {
      try {
        const accidents = Array.isArray(gisAccidentsData.data)
          ? gisAccidentsData.data
          : [gisAccidentsData.data];
        
        // Get traffic data array for coordinate extraction
        const trafficDataArray = gisTrafficData?.data 
          ? (Array.isArray(gisTrafficData.data) ? gisTrafficData.data : [gisTrafficData.data])
          : [];
        
        const points = accidents
          .map((accident) => convertAccidentToPoint(accident, trafficDataArray))
          .filter((point) => {
            // Only include accidents with valid coordinates
            return point.lat !== undefined && 
                   point.lng !== undefined && 
                   !isNaN(point.lat) && 
                   !isNaN(point.lng);
          });
        
        if (points.length === 0 && accidents.length > 0) {
          console.warn('⚠️ No accidents have valid coordinates. Waiting for traffic data or location info.');
        } else {
          console.log(`✅ Loaded ${points.length} accidents with coordinates`);
        }
        
        setAccidentsData(points);
      } catch (error) {
        console.error('Error converting accident data:', error);
        setAccidentsData([]);
      }
    }
  }, [gisAccidentsData, gisTrafficData]);

  const filteredAccidents = useMemo(() => {
    return accidentsData.filter((accident) => {
      if (filters.severity.length > 0 && !filters.severity.includes(accident.severity)) {
        return false;
      }

      const accidentDate = new Date(accident.accidentDate);
      const daysAgo = (Date.now() - accidentDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysAgo > filters.dateRange) {
        return false;
      }

      return true;
    });
  }, [accidentsData, filters]);


  const handleFilterChange = (severity: string) => {
    setFilters((prev) => {
      const newSeverity = prev.severity.includes(severity)
        ? prev.severity.filter((s) => s !== severity)
        : [...prev.severity, severity];
      return { ...prev, severity: newSeverity };
    });
  };

  if (isLoading) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-red-200">
        <div className="flex items-center gap-3 text-red-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Đang tải dữ liệu tai nạn...</span>
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
              {(error as any)?.message || 'Không thể tải dữ liệu tai nạn từ server'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show warning if no accidents have valid coordinates
  const hasValidData = filteredAccidents.length > 0;
  const hasRawData = gisAccidentsData?.data && (
    Array.isArray(gisAccidentsData.data) ? gisAccidentsData.data.length > 0 : true
  );

  return (
    <>
      {/* Warning when API returns data but no valid coordinates */}
      {!isLoading && hasRawData && !hasValidData && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-yellow-50/95 backdrop-blur-md px-6 py-4 rounded-lg shadow-lg border border-yellow-300 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Không hiển thị được tai nạn</h3>
              <p className="text-sm text-yellow-700">
                Accidents được liên kết với traffic qua trafficId, nhưng không thể lấy tọa độ từ traffic lines. 
                Đảm bảo traffic data có trường 'geom' hợp lệ.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter controls */}
      <div className="absolute top-20 right-6 z-[1000] flex flex-col gap-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white/95 backdrop-blur-md hover:bg-white p-2.5 rounded-lg shadow-md transition-all hover:shadow-lg border border-gray-200"
          title="Filters"
        >
          <Filter className="w-4 h-4 text-gray-700" />
        </button>

        {showFilters && (
          <div className="bg-white/95 backdrop-blur-md p-4 rounded-lg shadow-xl border border-gray-200 w-64">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-800">Bộ lọc</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Mức độ nghiêm trọng</label>
                <div className="space-y-2">
                  {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((severity) => (
                    <label key={severity} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.severity.includes(severity)}
                        onChange={() => handleFilterChange(severity)}
                        className="rounded border-gray-300"
                      />
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getSeverityColor(severity) }}
                      />
                      <span className="text-sm text-gray-700">{getSeverityLabel(severity)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Khoảng thời gian: {filters.dateRange} ngày
                </label>
                <input
                  type="range"
                  min="7"
                  max="90"
                  step="7"
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="pt-2 border-t">
                <div className="text-xs text-gray-600">
                  Hiển thị: <strong>{filteredAccidents.length}</strong> / {accidentsData.length} tai nạn
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredAccidents.map((accident) => {
          const color = getSeverityColor(accident.severity);
          const icon = L.divIcon({
            className: 'custom-accident-marker',
            html: `<div style="
              background-color: ${color};
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 11px;
              font-weight: bold;
            ">${accident.casualties || '!'}</div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          return (
            <Marker
              key={accident.id}
              position={[accident.lat, accident.lng]}
              icon={icon}
              zIndexOffset={1000}
              eventHandlers={{
                click: () => {
                  setSelectedAccident(accident);
                  if (onAccidentClick) {
                    onAccidentClick(accident);
                  }
                },
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-base mb-2">{accident.roadName}</h3>
                  <div className="space-y-1 text-sm">
                    <div>
                      <strong>Mức độ:</strong>{' '}
                      <span style={{ color }}>{getSeverityLabel(accident.severity)}</span>
                    </div>
                    <div>
                      <strong>Thương vong:</strong> {accident.casualties} người
                    </div>
                    <div>
                      <strong>Ngày:</strong> {new Date(accident.accidentDate).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
    </>
  );
}
