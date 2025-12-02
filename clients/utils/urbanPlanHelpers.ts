export function getZoningTypeColor(zoningType: string): string {
  switch (zoningType) {
    case 'RESIDENTIAL':
      return '#fbbf24';
    case 'COMMERCIAL':
      return '#ec4899';
    case 'INDUSTRIAL':
      return '#8b5cf6';
    case 'GREEN_SPACE':
      return '#10b981';
    case 'PUBLIC_SERVICE':
      return '#3b82f6';
    case 'MIXED_USE':
      return '#f97316';
    case 'TRANSPORT':
      return '#64748b';
    case 'HERITAGE':
      return '#dc2626';
    case 'WATER':
      return '#06b6d4';
    default:
      return '#6b7280';
  }
}

export function getZoningTypeLabel(zoningType: string): string {
  switch (zoningType) {
    case 'RESIDENTIAL':
      return 'Khu dân cư';
    case 'COMMERCIAL':
      return 'Thương mại';
    case 'INDUSTRIAL':
      return 'Công nghiệp';
    case 'GREEN_SPACE':
      return 'Cây xanh';
    case 'PUBLIC_SERVICE':
      return 'Dịch vụ công';
    case 'MIXED_USE':
      return 'Hỗn hợp';
    case 'TRANSPORT':
      return 'Giao thông';
    case 'HERITAGE':
      return 'Di sản';
    case 'WATER':
      return 'Mặt nước';
    default:
      return 'Không xác định';
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case 'APPROVED':
      return 'Đã phê duyệt';
    case 'PENDING':
      return 'Chờ duyệt';
    case 'UNDER_REVIEW':
      return 'Đang xem xét';
    case 'IMPLEMENTED':
      return 'Đã thực hiện';
    case 'REJECTED':
      return 'Bị từ chối';
    default:
      return 'Không xác định';
  }
}

export interface UrbanPlanPolygon {
  id: string;
  planName: string;
  zoningType: string;
  status: string;
  approvalDate: string | null;
  description: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geometry: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function convertUrbanPlanToPolygon(urbanPlan: any): UrbanPlanPolygon {
  return {
    id: urbanPlan.id,
    planName: urbanPlan.planName || urbanPlan.plan_name || 'Chưa có tên',
    zoningType: urbanPlan.zoningType || urbanPlan.zoning_type || 'MIXED_USE',
    status: urbanPlan.status || 'PENDING',
    approvalDate: urbanPlan.approvalDate || urbanPlan.approval_date || null,
    description: urbanPlan.description || null,
    geometry: urbanPlan.geom || urbanPlan.geometry || null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseGeoJSON(geom: any): any {
  try {
    if (typeof geom === 'string') {
      return JSON.parse(geom);
    }
    return geom;
  } catch (error) {
    console.warn('Failed to parse geometry:', error);
    return null;
  }
}
