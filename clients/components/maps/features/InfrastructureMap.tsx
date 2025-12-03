'use client';

import { useEffect, useState } from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useInfrastructures } from '@/hooks/api';
import {
  convertInfrastructureToPoint,
  getInfrastructureColor,
  getInfrastructureLabel,
  getInfrastructureIcon,
  InfrastructurePoint
} from '@/utils/infrastructureHelpers';
import { Loader2, AlertCircle, Building2 } from 'lucide-react';

interface InfrastructureMapProps {
  onPointClick?: (point: InfrastructurePoint) => void;
}

export default function InfrastructureMap({ onPointClick }: InfrastructureMapProps) {
  // const map = useMap();
  const [infrastructureData, setInfrastructureData] = useState<InfrastructurePoint[]>([]);
  const [, setSelectedPoint] = useState<InfrastructurePoint | null>(null);

  const { data: infrastructureResponse, isLoading, error } = useInfrastructures();

  useEffect(() => {
    if (infrastructureResponse?.data) {
      try {
        const infrastructures = Array.isArray(infrastructureResponse.data)
          ? infrastructureResponse.data
          : [infrastructureResponse.data];

        const points = infrastructures
          .map(convertInfrastructureToPoint)
          .filter((point) => {
            return point.lat !== undefined &&
                   point.lng !== undefined &&
                   !isNaN(point.lat) &&
                   !isNaN(point.lng);
          });

        if (points.length === 0 && infrastructures.length > 0) {
          console.warn('?? No infrastructure points have valid coordinates.');
        } else {
          console.log(`? Loaded ${points.length} infrastructure points`);
        }

        setInfrastructureData(points);
      } catch (error) {
        console.error('Error converting infrastructure data:', error);
        setInfrastructureData([]);
      }
    }
  }, [infrastructureResponse]);

  if (isLoading) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-indigo-200">
        <div className="flex items-center gap-3 text-indigo-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Đang tải dữ liệu cơ sở hạ tầng...</span>
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
              {(error as Error)?.message || 'Không thể tải dữ liệu cơ sở hạ tầng'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasValidData = infrastructureData.length > 0;
  const hasRawData = infrastructureResponse?.data && (
    Array.isArray(infrastructureResponse.data) ? infrastructureResponse.data.length > 0 : true
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
                Dữ liệu cơ sở hạ tầng không có thông tin tọa độ (location).
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute top-32 left-24 bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-indigo-200"
        style={{ zIndex: 1000 }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-indigo-800">Cơ sở hạ tầng</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-gray-700">Trường học</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
              <span className="text-gray-700">Bệnh viện</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-gray-700">Công viên</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f59e0b' }}></div>
              <span className="text-gray-700">Chợ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#8b5cf6' }}></div>
              <span className="text-gray-700">Tiện ích</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#6366f1' }}></div>
              <span className="text-gray-700">Hành chính</span>
            </div>
          </div>

          <div className="pt-2 border-t text-xs text-gray-500">
            <strong>{infrastructureData.length}</strong> cơ sở
          </div>
        </div>
      </div>

      {infrastructureData.map((point) => {
        const color = getInfrastructureColor(point.category);
        const emoji = getInfrastructureIcon(point.category);
        const icon = L.divIcon({
          className: 'custom-infrastructure-marker',
          html: `<div style="
            background-color: ${color};
            width: 32px;
            height: 32px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          ">${emoji}</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        return (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={icon}
            zIndexOffset={500}
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
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-base mb-2">{point.name}</h3>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Loại:</span>
                    <span
                      className="font-semibold px-2 py-0.5 rounded text-white text-xs"
                      style={{ backgroundColor: color }}
                    >
                      {getInfrastructureLabel(point.category)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Quận/Huyện:</span>
                    <span className="font-semibold text-gray-800">
                      {point.districtName}
                    </span>
                  </div>
                  {point.capacity && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sức chứa:</span>
                      <span className="font-semibold text-gray-800">
                        {point.capacity.toLocaleString()} người
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`text-xs font-medium ${point.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}`}>
                      {point.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </div>
                  {point.description && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-600">{point.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
