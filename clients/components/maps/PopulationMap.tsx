'use client';

import { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGisPopulations } from '@/hooks/api/useGisPopulationsQuery';
import {
  convertPopulationToPoint,
  getDensityColor,
  getDensityLabel,
  PopulationPoint
} from '@/utils/populationHelpers';
import { Loader2, AlertCircle, Users } from 'lucide-react';

interface PopulationMapProps {
  onPointClick?: (point: PopulationPoint) => void;
}

export default function PopulationMap({ onPointClick }: PopulationMapProps) {
  const map = useMap();
  const [populationData, setPopulationData] = useState<PopulationPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<PopulationPoint | null>(null);

  const { data: gisPopulationData, isLoading, error } = useGisPopulations();

  useEffect(() => {
    if (gisPopulationData?.data) {
      try {
        const populations = Array.isArray(gisPopulationData.data)
          ? gisPopulationData.data
          : [gisPopulationData.data];

        const points = populations
          .map(convertPopulationToPoint)
          .filter((point) => {
            return point.lat !== undefined &&
                   point.lng !== undefined &&
                   !isNaN(point.lat) &&
                   !isNaN(point.lng);
          });

        if (points.length === 0 && populations.length > 0) {
          console.warn('⚠️ No population points have valid coordinates.');
        } else {
          console.log(`✅ Loaded ${points.length} population points`);
        }

        setPopulationData(points);
      } catch (error) {
        console.error('Error converting population data:', error);
        setPopulationData([]);
      }
    }
  }, [gisPopulationData]);

  if (isLoading) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-purple-200">
        <div className="flex items-center gap-3 text-purple-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Đang tải dữ liệu dân số...</span>
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
              {(error as any)?.message || 'Không thể tải dữ liệu dân số'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasValidData = populationData.length > 0;
  const hasRawData = gisPopulationData?.data && (
    Array.isArray(gisPopulationData.data) ? gisPopulationData.data.length > 0 : true
  );

  return (
    <>
      {!isLoading && hasRawData && !hasValidData && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-yellow-50/95 backdrop-blur-md px-6 py-4 rounded-lg shadow-lg border border-yellow-300 max-w-md">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Không có tọa độ</h3>
              <p className="text-sm text-yellow-700">
                Dữ liệu dân số không có thông tin tọa độ (location).
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute top-56 left-24 bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-purple-200"
        style={{ zIndex: 1000 }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-purple-800">Mật độ dân số</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#dcfce7' }}></div>
              <span className="text-gray-700">&lt; 1K người/km²</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#86efac' }}></div>
              <span className="text-gray-700">1K - 5K</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#4ade80' }}></div>
              <span className="text-gray-700">5K - 10K</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
              <span className="text-gray-700">10K - 15K</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#16a34a' }}></div>
              <span className="text-gray-700">15K - 20K</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f59e0b' }}></div>
              <span className="text-gray-700">20K - 30K</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f97316' }}></div>
              <span className="text-gray-700">30K - 40K</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#dc2626' }}></div>
              <span className="text-gray-700">&gt; 40K</span>
            </div>
          </div>

          <div className="pt-2 border-t text-xs text-gray-500">
            <strong>{populationData.length}</strong> điểm
          </div>
        </div>
      </div>

      {populationData.map((point) => {
        const color = getDensityColor(point.density);
        const densityK = (point.density / 1000).toFixed(1);
        const icon = L.divIcon({
          className: 'custom-population-marker',
          html: `<div style="
            background-color: ${color};
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${point.density > 15000 ? 'white' : '#1f2937'};
            font-size: 10px;
            font-weight: bold;
            flex-direction: column;
          ">
            <div style="font-size: 11px;">${densityK}K</div>
          </div>`,
          iconSize: [40, 40],
          iconAnchor: [20, 20],
        });

        return (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={icon}
            zIndexOffset={400}
            eventHandlers={{
              click: () => {
                setSelectedPoint(point);
                if (onPointClick) {
                  onPointClick(point);
                }
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[220px]">
                <h3 className="font-bold text-base mb-2">{point.districtName}</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Mật độ:</span>
                    <span
                      className="font-semibold px-2 py-0.5 rounded text-white text-xs"
                      style={{ backgroundColor: color }}
                    >
                      {point.density.toLocaleString()} người/km²
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tổng dân số:</span>
                    <span className="font-semibold text-gray-800">
                      {point.total.toLocaleString()} người
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nam:</span>
                    <span className="text-blue-600 font-medium">
                      {point.male.toLocaleString()} ({((point.male / point.total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nữ:</span>
                    <span className="text-pink-600 font-medium">
                      {point.female.toLocaleString()} ({((point.female / point.total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hộ gia đình:</span>
                    <span className="font-semibold text-gray-800">
                      {point.households.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Năm:</span>
                    <span className="text-xs text-gray-600">{point.year}</span>
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
