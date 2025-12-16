'use client';

import { X } from 'lucide-react';
import {
  useAnalyticsSummary,
  useInfrastructureByCategory,
} from '@/hooks/api';

interface InfoPanelProps {
  type: string;
  onClose: () => void;
}

export default function InfoPanel({ type, onClose }: InfoPanelProps) {
  const { data: summaryResponse } = useAnalyticsSummary();
  const { data: infrastructureResponse } = useInfrastructureByCategory();
  // const { data: publicTransportResponse } = usePublicTransportSummary();
  // const { data: accidentsResponse } = useAccidentSummaryBySeverity();
  // const { data: airQualityResponse } = useAirQualityRanking();
  // const { data: waterQualityResponse } = useWaterQualityRanking();

  const summary = summaryResponse?.data?.data || summaryResponse?.data;
  const infrastructure = infrastructureResponse?.data?.data || infrastructureResponse?.data;
  // const publicTransport = publicTransportResponse?.data?.data || publicTransportResponse?.data;
  // const accidents = accidentsResponse?.data?.data || accidentsResponse?.data;
  // const airQuality = airQualityResponse?.data?.data || airQualityResponse?.data;
  // const waterQuality = waterQualityResponse?.data?.data || waterQualityResponse?.data;

  const getTitle = () => {
    switch (type) {
      case 'community':
        return 'Thông tin Cộng đồng';
      case 'religious':
        return 'Thông tin Tôn giáo';
      case 'personal':
        return 'Thông tin Cá nhân';
      case 'buildings':
        return 'Thông tin Tòa nhà';
      case 'business':
        return 'Thông tin Doanh nghiệp';
      default:
        return 'Thông tin';
    }
  };

  const getContent = () => {
    switch (type) {
      case 'community':
        return (
          <div className="space-y-3">
            <InfoItem
              label="Tổng số quận/huyện"
              value={summary?.totalDistricts || 'N/A'}
            />
            <InfoItem
              label="Tổng dân số"
              value={summary?.latestPopulationData?.total?.toLocaleString() || 'N/A'}
            />
            <InfoItem
              label="Năm thống kê"
              value={summary?.latestPopulationData?.year || 'N/A'}
            />
            <div className="pt-3 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Cơ sở hạ tầng cộng đồng</h4>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {infrastructure && Array.isArray(infrastructure) && infrastructure.map((item: any, index: number) => (
                <InfoItem
                  key={index}
                  label={item.category}
                  value={item.count}
                />
              ))}
            </div>
          </div>
        );

      case 'religious':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const religiousInfra = infrastructure?.find((item: any) =>
          item.category === 'RELIGIOUS' || item.category === 'TEMPLE' || item.category === 'CHURCH'
        );
        return (
          <div className="space-y-3">
            <InfoItem
              label="Cơ sở tôn giáo"
              value={religiousInfra?.count || 'N/A'}
            />
            <InfoItem
              label="Phân bố theo quận"
              value="Xem bản đồ"
            />
          </div>
        );

      case 'personal':
        return (
          <div className="space-y-3">
            <InfoItem
              label="Tổng hộ dân"
              value="N/A"
            />
            <InfoItem
              label="Trung bình số người/hộ"
              value="N/A"
            />
            <InfoItem
              label="Cá nhân kinh doanh"
              value="N/A"
            />
            <InfoItem
              label="Cơ sở dịch vụ cá nhân"
              value="N/A"
            />
          </div>
        );

      case 'buildings':
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const buildingTypes = infrastructure?.filter((item: any) =>
          ['HOSPITAL', 'SCHOOL', 'MARKET', 'PARK'].includes(item.category)
        );
        return (
          <div className="space-y-3">
            <InfoItem
              label="Tổng cơ sở hạ tầng"
              value={summary?.totalInfrastructures || 'N/A'}
            />
            <div className="pt-3 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Phân loại</h4>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {buildingTypes && buildingTypes.map((item: any, index: number) => (
                <InfoItem
                  key={index}
                  label={item.category}
                  value={item.count}
                />
              ))}
            </div>
            <InfoItem
              label="Tổng diện tích xây dựng"
              value="N/A m²"
            />
          </div>
        );

      case 'business':
        return (
          <div className="space-y-3">
            <InfoItem
              label="Tổng số doanh nghiệp đăng ký"
              value="N/A"
            />
            <InfoItem
              label="Doanh nghiệp hoạt động công nghiệp"
              value="N/A"
            />
            <InfoItem
              label="Doanh nghiệp vận tải & kho bãi"
              value="N/A"
            />
            <InfoItem
              label="Doanh nghiệp dịch vụ lưu trú"
              value="N/A"
            />
            <div className="pt-3 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Quy mô nhân sự</h4>
              <InfoItem label="Dưới 2 nhân viên" value="N/A" />
              <InfoItem label="2-5 nhân viên" value="N/A" />
              <InfoItem label="5-10 nhân viên" value="N/A" />
              <InfoItem label="10-20 nhân viên" value="N/A" />
              <InfoItem label="20+ nhân viên" value="N/A" />
            </div>
            <div className="pt-3 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Thông tin tài chính</h4>
              <InfoItem label="Tổng doanh thu" value="N/A" />
              <InfoItem label="Doanh thu TB/DN" value="N/A" />
              <InfoItem label="Tổng vốn đầu tư" value="N/A" />
              <InfoItem label="Tổng tài sản" value="N/A" />
            </div>
          </div>
        );

      default:
        return <div>Chọn một mục để xem thông tin</div>;
    }
  };

  return (
    <div className="absolute left-24 top-36 z-[1000] w-96 max-h-[calc(100vh-200px)]">
      <div className="bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
          <h3 className="font-semibold">{getTitle()}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-280px)]">
          {getContent()}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center py-2 text-sm border-b border-gray-800 last:border-0">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
