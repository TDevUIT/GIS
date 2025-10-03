import { QueryClient } from '@tanstack/react-query';
import { QUERY_STALE_TIME, QUERY_CACHE_TIME } from './queryConfig';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_STALE_TIME.MEDIUM,
      gcTime: QUERY_CACHE_TIME.MEDIUM,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: 1000,
    },
  },
});

if (process.env.NODE_ENV === 'development') {

  queryClient.getQueryCache().config.onError = (error) => {
    console.error('🔥 Query Error:', error);
  };
  
  queryClient.getMutationCache().config.onError = (error) => {
    console.error('🔥 Mutation Error:', error);
  };
}
