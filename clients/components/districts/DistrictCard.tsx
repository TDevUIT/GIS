'use client';

import { District } from '@/types';
import { MapPin, Users, Maximize } from 'lucide-react';

interface DistrictCardProps {
  district: District;
  onClick?: (district: District) => void;
}

export default function DistrictCard({ district, onClick }: DistrictCardProps) {
  return (
    <div
      onClick={() => onClick?.(district)}
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer hover:border-blue-400 group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {district.name}
            </h3>
            <p className="text-xs text-gray-500">{district.code}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {district.areaKm2 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Maximize className="w-4 h-4" />
              <span>Diện tích</span>
            </div>
            <span className="font-medium text-gray-900">
              {district.areaKm2.toFixed(2)} km²
            </span>
          </div>
        )}

        {district.densityPerKm2 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-4 h-4" />
              <span>Mật độ</span>
            </div>
            <span className="font-medium text-gray-900">
              {district.densityPerKm2.toLocaleString()} người/km²
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="text-sm text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
          Xem chi tiết →
        </div>
      </div>
    </div>
  );
}
