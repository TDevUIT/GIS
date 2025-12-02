'use client';

import { useState } from 'react';
import { DistrictList } from '@/components/districts';
import ErrorBoundary from '@/components/common/feedback/ErrorBoundary';
import { District } from '@/types';

export default function DistrictsPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
    console.log('Selected district:', district);
  };

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <span className="text-red-600 text-xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
              Lỗi tải trang
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Đã xảy ra lỗi khi tải danh sách quận/huyện.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tải lại trang
            </button>
          </div>
        </div>
      }
    >
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DistrictList onDistrictSelect={handleDistrictSelect} />

          {selectedDistrict && (
            <div className="fixed bottom-6 right-6 bg-white border border-blue-200 rounded-lg shadow-xl p-4 max-w-sm z-50">
              <button
                onClick={() => setSelectedDistrict(null)}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
              <h3 className="font-bold text-lg text-gray-900 mb-2 pr-6">
                {selectedDistrict.name}
              </h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <strong>Mã:</strong> {selectedDistrict.code}
                </p>
                {selectedDistrict.areaKm2 && (
                  <p>
                    <strong>Diện tích:</strong> {selectedDistrict.areaKm2.toFixed(2)} km²
                  </p>
                )}
                {selectedDistrict.densityPerKm2 && (
                  <p>
                    <strong>Mật độ:</strong>{' '}
                    {selectedDistrict.densityPerKm2.toLocaleString()} người/km²
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
