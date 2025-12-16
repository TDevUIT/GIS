'use client';

import { useEffect, useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import { useUrbanPlans } from '@/hooks/api';
import {
  convertUrbanPlanToPolygon,
  getZoningTypeColor,
  getZoningTypeLabel,
  getStatusLabel,
  parseGeoJSON,
  UrbanPlanPolygon
} from '@/utils/urbanPlanHelpers';
import { Loader2, AlertCircle, FileText } from 'lucide-react';

interface UrbanPlanMapProps {
  onPolygonClick?: (polygon: UrbanPlanPolygon) => void;
}

export default function UrbanPlanMap({ onPolygonClick }: UrbanPlanMapProps) {
  const [urbanPlanData, setUrbanPlanData] = useState<UrbanPlanPolygon[]>([]);

  const { data: gisUrbanPlanData, isLoading, error } = useUrbanPlans();

  useEffect(() => {
    if (gisUrbanPlanData?.data) {
      try {
        const urbanPlans = Array.isArray(gisUrbanPlanData.data)
          ? gisUrbanPlanData.data
          : [gisUrbanPlanData.data];

        const polygons = urbanPlans
          .map(convertUrbanPlanToPolygon)
          .filter((polygon) => polygon.geometry !== null);

        if (polygons.length === 0 && urbanPlans.length > 0) {
          console.warn('No urban plan polygons have valid geometry.');
        } else {
          console.log(`Loaded ${polygons.length} urban plan polygons`);
        }

        setUrbanPlanData(polygons);
      } catch (error) {
        console.error('Error converting urban plan data:', error);
        setUrbanPlanData([]);
      }
    }
  }, [gisUrbanPlanData]);

  if (isLoading) {
    return (
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-white/95 backdrop-blur-md px-6 py-3 rounded-lg shadow-lg border border-indigo-200">
        <div className="flex items-center gap-3 text-indigo-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="font-medium">Đang tải dữ liệu quy hoạch đô thị...</span>
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
              {(error as Error)?.message || 'Không thể tải dữ liệu quy hoạch đô thị'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const hasValidData = urbanPlanData.length > 0;
  const hasRawData = gisUrbanPlanData?.data && (
    Array.isArray(gisUrbanPlanData.data) ? gisUrbanPlanData.data.length > 0 : true
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
                Dữ liệu quy hoạch đô thị không có thông tin hình học (geometry).
              </p>
            </div>
          </div>
        </div>
      )}

      <div
        className="absolute top-80 left-24 bg-white/95 backdrop-blur-md p-3 rounded-lg shadow-lg border border-indigo-200"
        style={{ zIndex: 1000 }}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-semibold text-indigo-800">Quy hoạch</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#fbbf24' }}></div>
              <span className="text-gray-700">Khu dân cư</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ec4899' }}></div>
              <span className="text-gray-700">Thương mại</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#8b5cf6' }}></div>
              <span className="text-gray-700">Công nghiệp</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10b981' }}></div>
              <span className="text-gray-700">Cây xanh</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3b82f6' }}></div>
              <span className="text-gray-700">Dịch vụ công</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
              <span className="text-gray-700">Hỗn hợp</span>
            </div>
          </div>

          <div className="pt-2 border-t text-xs text-gray-500">
            <strong>{urbanPlanData.length}</strong> khu vực
          </div>
        </div>
      </div>

      {urbanPlanData.map((polygon) => {
        const color = getZoningTypeColor(polygon.zoningType);
        const geojson = parseGeoJSON(polygon.geometry);

        if (!geojson) return null;

        return (
          <GeoJSON
            key={polygon.id}
            data={geojson}
            style={{
              fillColor: color,
              fillOpacity: 0.5,
              color: color,
              weight: 2,
              opacity: 0.9,
              dashArray: polygon.status === 'APPROVED' ? undefined : '5, 5',
            }}
            eventHandlers={{
              click: () => {
                if (onPolygonClick) {
                  onPolygonClick(polygon);
                }
              },
            }}
            onEachFeature={(feature, layer) => {
              layer.bindPopup(`
                <div class="p-2 min-w-[220px]">
                  <h3 class="font-bold text-base mb-2">${polygon.planName}</h3>
                  <div class="space-y-1.5 text-sm">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Loại:</span>
                      <span class="font-semibold px-2 py-0.5 rounded text-white text-xs" style="background-color: ${color};">
                        ${getZoningTypeLabel(polygon.zoningType)}
                      </span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-600">Trạng thái:</span>
                      <span class="text-xs ${polygon.status === 'APPROVED' ? 'text-green-600' : polygon.status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'} font-medium">
                        ${getStatusLabel(polygon.status)}
                      </span>
                    </div>
                    ${polygon.approvalDate ? `
                      <div class="flex justify-between items-center">
                        <span class="text-gray-600">Ngày duyệt:</span>
                        <span class="text-xs text-gray-600">
                          ${new Date(polygon.approvalDate).toLocaleDateString('vi-VN')}
                        </span>
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
