'use client';

import dynamic from 'next/dynamic';
import { useDistrict } from '@/hooks/api/useDistrictsQuery';
import { useGisDistrict } from '@/hooks/api/useGisDistrictsQuery';
import { District } from '@/types';
import { 
  MapPin, 
  Users, 
  Maximize, 
  AlertCircle,
  Loader2,
  ArrowLeft,
  Map
} from 'lucide-react';

// Dynamically import DistrictMapPreview to avoid SSR issues with Leaflet
const DistrictMapPreview = dynamic(() => import('./DistrictMapPreview'), {
  ssr: false,
  loading: () => (
    <div className="bg-white border border-gray-200 rounded-lg p-8">
      <div className="flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-3" />
        <span className="text-gray-600">Đang tải bản đồ...</span>
      </div>
    </div>
  ),
});

interface DistrictDetailProps {
  id: string;
  onBack?: () => void;
}

export default function DistrictDetail({ id, onBack }: DistrictDetailProps) {
  const { data, isLoading, error, refetch } = useDistrict(id);
  const { data: gisData, isLoading: gisLoading } = useGisDistrict(id);

  const district = data?.data as District | undefined;
  // GIS API has been unwrapped, so gisData.data directly contains the district with geom
  const gisDistrict = gisData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Đang tải thông tin quận/huyện...</p>
        </div>
      </div>
    );
  }

  if (error || !district) {
    return (
      <div className="bg-white border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-700 mb-1">Lỗi tải dữ liệu</h3>
            <p className="text-sm text-red-600 mb-3">
              {(error as any)?.message || 'Không thể tải thông tin quận/huyện'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Quay lại"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {district.name}
                </h1>
                <p className="text-sm text-gray-600">
                  Mã: {district.code}
                </p>
              </div>
            </div>
          </div>

          {/* View only - no edit/delete actions */}
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Maximize className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Diện tích</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {district.areaKm2?.toFixed(2) || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-1">km²</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Mật độ dân số</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {district.densityPerKm2?.toLocaleString() || 'N/A'}
          </p>
          <p className="text-sm text-gray-600 mt-1">người/km²</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Map className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">ID</h3>
          </div>
          <p className="text-sm font-mono text-gray-600 break-all">
            {district.id}
          </p>
        </div>
      </div>

      {/* Map Preview */}
      {gisDistrict?.geom && (
        <DistrictMapPreview 
          geometry={gisDistrict.geom}
          districtName={district.name}
        />
      )}

      {/* Loading state for map */}
      {gisLoading && !gisDistrict && (
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-3" />
            <span className="text-gray-600">Đang tải bản đồ...</span>
          </div>
        </div>
      )}

      {/* No GIS data available */}
      {!gisLoading && !gisDistrict?.geom && (
        <div className="bg-white border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-700 mb-1">Không có dữ liệu GIS</h3>
              <p className="text-sm text-yellow-600">
                Dữ liệu bản đồ cho quận/huyện này chưa có sẵn.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
