'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDistricts } from '@/hooks/api/useDistrictsQuery';
import { District } from '@/types';
import DistrictCard from './DistrictCard';
import DistrictListSkeleton from './DistrictListSkeleton';
import { Search, AlertCircle, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DistrictListProps {
  onDistrictSelect?: (district: District) => void;
  itemsPerPage?: number;
}

export default function DistrictList({
  onDistrictSelect,
  itemsPerPage = 9,
}: DistrictListProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'name' | 'area' | 'density'>('name');

  const { data, isLoading, error, refetch } = useDistricts();
  const districts = useMemo(() => {
    if (!data?.data) return [];
    return Array.isArray(data.data) ? data.data : [data.data];
  }, [data]);

  const filteredDistricts = useMemo(() => {
    let filtered = [...districts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (district) =>
          district.name.toLowerCase().includes(query) ||
          district.code.toLowerCase().includes(query)
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'vi');
        case 'area':
          return (b.areaKm2 || 0) - (a.areaKm2 || 0);
        case 'density':
          return (b.densityPerKm2 || 0) - (a.densityPerKm2 || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [districts, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredDistricts.length / itemsPerPage);
  const paginatedDistricts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredDistricts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredDistricts, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleSort = (value: 'name' | 'area' | 'density') => {
    setSortBy(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
        </div>
        <DistrictListSkeleton count={itemsPerPage} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-700 mb-1">Lỗi tải dữ liệu</h3>
            <p className="text-sm text-red-600 mb-3">
              {(error as any)?.message || 'Không thể tải danh sách quận/huyện'}
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
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Danh sách Quận/Huyện
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {filteredDistricts.length} quận/huyện
            {searchQuery && ` (từ "${searchQuery}")`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Tìm kiếm quận/huyện..."
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={sortBy}
            onChange={(e) => handleSort(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="name">Tên A-Z</option>
            <option value="area">Diện tích</option>
            <option value="density">Mật độ dân số</option>
          </select>
        </div>
      </div>

      {paginatedDistricts.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Không tìm thấy kết quả
          </h3>
          <p className="text-gray-600 mb-4">
            Không có quận/huyện nào phù hợp với từ khóa "{searchQuery}"
          </p>
          <button
            onClick={() => handleSearch('')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Xóa bộ lọc
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedDistricts.map((district) => (
              <DistrictCard
                key={district.id}
                district={district}
                onClick={(d) => {
                  onDistrictSelect?.(d);
                  router.push(`/districts/${d.id}`);
                }}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="text-sm text-gray-600">
                Trang {currentPage} / {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="text-sm text-gray-600">
                {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredDistricts.length)} /{' '}
                {filteredDistricts.length}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
