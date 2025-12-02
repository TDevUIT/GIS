import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReports,
  generateReport,
  downloadReport,
  getReportStatus,
  deleteReport
} from '@/services';
import { QUERY_STALE_TIME } from '@/config/queryConfig';


export function useReports(type?: string) {
  return useQuery({
    queryKey: ['reports', type],
    queryFn: () => getReports(type),
    staleTime: QUERY_STALE_TIME.SHORT,
  });
}

export function useReportStatus(reportId: string) {
  return useQuery({
    queryKey: ['reports', reportId, 'status'],
    queryFn: () => getReportStatus(reportId),
    enabled: !!reportId,
    staleTime: QUERY_STALE_TIME.SHORT,
    refetchInterval: 5000, // Auto-refresh every 5 seconds for status updates
  });
}


export function useGenerateReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateReport,
    onSuccess: () => {
      // Invalidate reports list to refresh after generating new report
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useDownloadReport() {
  return useMutation({
    mutationFn: downloadReport,
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      // Invalidate reports list to refresh after deletion
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}
