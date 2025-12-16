'use client';

import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useWaterQualities } from '@/hooks/api';
import {
  convertWaterQualityToPoint,
  getWaterQualityColor,
  getWaterQualityLabel,
  WaterQualityPoint
} from '@/utils/waterQualityHelpers';
import { Loader2, AlertCircle, Droplets } from 'lucide-react';

interface WaterQualityMapProps {
  onPointClick?: (point: WaterQualityPoint) => void;
}

export default function WaterQualityMap({ onPointClick }: WaterQualityMapProps) {
  const [waterQualityData, setWaterQualityData] = useState<WaterQualityPoint[]>([]);

  const { data: waterQualityResponse, isLoading, error } = useWaterQualities();

  useEffect(() => {
    if (waterQualityResponse?.data) {
      try {
        const waterQualities = Array.isArray(waterQualityResponse.data)
          ? waterQualityResponse.data
          : [waterQualityResponse.data];

        const points = waterQualities
          .map(convertWaterQualityToPoint)
          .filter((point) => {
            return point.lat !== undefined &&
                   point.lng !== undefined &&
                   !isNaN(point.lat) &&
                   !isNaN(point.lng);
          });

        if (points.length === 0 && waterQualities.length > 0) {
          console.warn('⚠️ No water quality points have valid coordinates.');
        } else {
          console.log(`✅ Loaded ${points.length} water quality points`);
        }

        setWaterQualityData(points);
      } catch (error) {
        console.error('Error converting water quality data:', error);
        setWaterQualityData([]);
      }
    }
  }, [waterQualityResponse]);

  if (isLoading) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-blue-200">
        <div className="flex items-center gap-3 text-blue-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Đang tải dữ liệu chất lượng nước...</span>
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
              {(error as Error)?.message || 'Không thể tải dữ liệu chất lượng nước'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasValidData = waterQualityData.length > 0;
  const hasRawData = waterQualityResponse?.data && (
    Array.isArray(waterQualityResponse.data) ? waterQualityResponse.data.length > 0 : true
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
                Dữ liệu chất lượng nước không có thông tin tọa độ (location).
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute bottom-20 right-6 bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-blue-200"
        style={{ zIndex: 1000 }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-blue-800">Chất lượng nước</span>
            <Droplets className="w-4 h-4 text-blue-600" />
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-gray-700">Xuất sắc</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#84cc16' }}></div>
              <span className="text-gray-700">Tốt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f59e0b' }}></div>
              <span className="text-gray-700">Trung bình</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f97316' }}></div>
              <span className="text-gray-700">Kém</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-gray-700">Rất kém</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#dc2626' }}></div>
              <span className="text-gray-700">Không phù hợp</span>
            </div>
          </div>

          <div className="pt-2 border-t text-xs text-gray-500">
            <strong>{waterQualityData.length}</strong> điểm đo
          </div>
        </div>
      </div>

      {waterQualityData.map((point) => {
        const color = getWaterQualityColor(point.quality);
        const icon = L.divIcon({
          className: 'custom-water-marker',
          html: `<div style="
            background-color: ${color};
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 11px;
            font-weight: bold;
          ">${point.ph.toFixed(1)}</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        return (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={icon}
            zIndexOffset={500}
            eventHandlers={{
              click: () => {
                if (onPointClick) {
                  onPointClick(point);
                }
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-base mb-2">{point.sourceName}</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chất lượng:</span>
                    <span
                      className="font-semibold px-2 py-0.5 rounded text-white text-xs"
                      style={{ backgroundColor: color }}
                    >
                      {getWaterQualityLabel(point.quality)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">pH:</span>
                    <span className="font-semibold text-gray-800">
                      {point.ph.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">DO:</span>
                    <span className="font-semibold text-gray-800">
                      {point.dissolvedOxygen.toFixed(2)} mg/L
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Độ đục:</span>
                    <span className="font-semibold text-gray-800">
                      {point.turbidity.toFixed(1)} NTU
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Thời gian:</span>
                    <span className="text-xs text-gray-600">
                      {new Date(point.measuredAt).toLocaleString('vi-VN')}
                    </span>
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
