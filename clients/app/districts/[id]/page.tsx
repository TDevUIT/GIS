'use client';

import { useParams, useRouter } from 'next/navigation';
import { DistrictDetail } from '@/components/districts';
import ErrorBoundary from '@/components/common/ErrorBoundary';

export default function DistrictDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const handleBack = () => {
    router.push('/districts');
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
              Đã xảy ra lỗi khi tải thông tin quận/huyện.
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
          <DistrictDetail 
            id={id} 
            onBack={handleBack}
          />
        </div>
      </div>
    </ErrorBoundary>
  );
}
