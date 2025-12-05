/**
 * API Response Interface
 * Generic interface for API responses from the backend
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}
