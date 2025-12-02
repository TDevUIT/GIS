'use client';

import { X } from 'lucide-react';
import { 
  useAnalyticsSummary, 
  useInfrastructureByCategory, 
  usePublicTransportSummary,
  useAccidentSummaryBySeverity,
  useAirQualityRanking,
  useWaterQualityRanking
} from '@/hooks/api';

interface InfoPanelProps {
  type: string;
  onClose: () => void;
}

export default function InfoPanel({ type, onClose }: InfoPanelProps) {
  const { data: summaryResponse } = useAnalyticsSummary();
  const { data: infrastructureResponse } = useInfrastructureByCategory();
  const { data: publicTransportResponse } = usePublicTransportSummary();
  const { data: accidentsResponse } = useAccidentSummaryBySeverity();
  const { data: airQualityResponse } = useAirQualityRanking();
  const { data: waterQualityResponse } = useWaterQualityRanking();

  const summary = summaryResponse?.data?.data || summaryResponse?.data;
  const infrastructure = infrastructureResponse?.data?.data || infrastructureResponse?.data;
  const publicTransport = publicTransportResponse?.data?.data || publicTransportResponse?.data;
  const accidents = accidentsResponse?.data?.data || accidentsResponse?.data;
  const airQuality = airQualityResponse?.data?.data || airQualityResponse?.data;
  const waterQuality = waterQualityResponse?.data?.data || waterQualityResponse?.data;

  const getTitle = () => {
    switch (type) {
      case 'community':
        return 'ThÃ´ng tin Cá»™ng Ä‘á»“ng';
      case 'religious':
        return 'ThÃ´ng tin TÃ´n giÃ¡o';
      case 'personal':
        return 'ThÃ´ng tin CÃ¡ nhÃ¢n';
      case 'buildings':
        return 'ThÃ´ng tin TÃ²a nhÃ ';
      case 'business':
        return 'ThÃ´ng tin Doanh nghiá»‡p';
      default:
        return 'ThÃ´ng tin';
    }
  };

  const getContent = () => {
    switch (type) {
      case 'community':
        return (
          <div className="space-y-3">
            <InfoItem 
              label="Tá»•ng sá»‘ quáº­n/huyá»‡n" 
              value={summary?.totalDistricts || 'N/A'} 
            />
            <InfoItem 
              label="Tá»•ng dÃ¢n sá»‘" 
              value={summary?.latestPopulationData?.total?.toLocaleString() || 'N/A'} 
            />
            <InfoItem 
              label="NÄƒm thá»‘ng kÃª" 
              value={summary?.latestPopulationData?.year || 'N/A'} 
            />
            <div className="pt-3 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">CÆ¡ sá»Ÿ háº¡ táº§ng cá»™ng Ä‘á»“ng</h4>
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
        const religiousInfra = infrastructure?.find((item: any) => 
          item.category === 'RELIGIOUS' || item.category === 'TEMPLE' || item.category === 'CHURCH'
        );
        return (
          <div className="space-y-3">
            <InfoItem 
              label="CÆ¡ sá»Ÿ tÃ´n giÃ¡o" 
              value={religiousInfra?.count || 'N/A'} 
            />
            <InfoItem 
              label="PhÃ¢n bá»‘ theo quáº­n" 
              value="Xem báº£n Ä‘á»“" 
            />
          </div>
        );

      case 'personal':
        return (
          <div className="space-y-3">
            <InfoItem 
              label="Tá»•ng há»™ dÃ¢n" 
              value="N/A" 
            />
            <InfoItem 
              label="Trung bÃ¬nh sá»‘ ngÆ°á»i/há»™" 
              value="N/A" 
            />
            <InfoItem 
              label="CÃ¡ nhÃ¢n kinh doanh" 
              value="N/A" 
            />
            <InfoItem 
              label="CÆ¡ sá»Ÿ dá»‹ch vá»¥ cÃ¡ nhÃ¢n" 
              value="N/A" 
            />
          </div>
        );

      case 'buildings':
        const buildingTypes = infrastructure?.filter((item: any) => 
          ['HOSPITAL', 'SCHOOL', 'MARKET', 'PARK'].includes(item.category)
        );
        return (
          <div className="space-y-3">
            <InfoItem 
              label="Tá»•ng cÆ¡ sá»Ÿ háº¡ táº§ng" 
              value={summary?.totalInfrastructures || 'N/A'} 
            />
            <div className="pt-3 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">PhÃ¢n loáº¡i</h4>
              {buildingTypes && buildingTypes.map((item: any, index: number) => (
                <InfoItem 
                  key={index}
                  label={item.category} 
                  value={item.count} 
                />
              ))}
            </div>
            <InfoItem 
              label="Tá»•ng diá»‡n tÃ­ch xÃ¢y dá»±ng" 
              value="N/A mÂ²" 
            />
          </div>
        );

      case 'business':
        return (
          <div className="space-y-3">
            <InfoItem 
              label="Tá»•ng sá»‘ doanh nghiá»‡p Ä‘Äƒng kÃ½" 
              value="N/A" 
            />
            <InfoItem 
              label="Doanh nghiá»‡p hoáº¡t Ä‘á»™ng cÃ´ng nghiá»‡p" 
              value="N/A" 
            />
            <InfoItem 
              label="Doanh nghiá»‡p váº­n táº£i & kho bÃ£i" 
              value="N/A" 
            />
            <InfoItem 
              label="Doanh nghiá»‡p dá»‹ch vá»¥ lÆ°u trÃº" 
              value="N/A" 
            />
            <div className="pt-3 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Quy mÃ´ nhÃ¢n sá»±</h4>
              <InfoItem label="DÆ°á»›i 2 nhÃ¢n viÃªn" value="N/A" />
              <InfoItem label="2-5 nhÃ¢n viÃªn" value="N/A" />
              <InfoItem label="5-10 nhÃ¢n viÃªn" value="N/A" />
              <InfoItem label="10-20 nhÃ¢n viÃªn" value="N/A" />
              <InfoItem label="20+ nhÃ¢n viÃªn" value="N/A" />
            </div>
            <div className="pt-3 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">ThÃ´ng tin tÃ i chÃ­nh</h4>
              <InfoItem label="Tá»•ng doanh thu" value="N/A" />
              <InfoItem label="Doanh thu TB/DN" value="N/A" />
              <InfoItem label="Tá»•ng vá»‘n Ä‘áº§u tÆ°" value="N/A" />
              <InfoItem label="Tá»•ng tÃ i sáº£n" value="N/A" />
            </div>
          </div>
        );

      default:
        return <div>Chá»n má»™t má»¥c Ä‘á»ƒ xem thÃ´ng tin</div>;
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
