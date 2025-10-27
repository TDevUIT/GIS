/**
 * Query Helpers - Utility functions for React Query hooks
 * 
 * These helpers prevent undefined IDs from being passed to API endpoints
 */

/**
 * Creates a safe query key that handles undefined values
 * @param baseKey - The base query key
 * @param id - The ID parameter (can be undefined)
 * @returns A safe query key array
 */
export function createSafeQueryKey(baseKey: string[], id?: string): string[] {
  return [...baseKey, id || 'none'];
}

/**
 * Creates a safe query function that throws error if ID is undefined
 * @param fn - The API function to call
 * @param id - The ID parameter
 * @param resourceName - Name of the resource (for error message)
 * @returns A function that calls the API with proper error handling
 */
export function createSafeQueryFn<T>(
  fn: (id: string) => Promise<T>,
  id: string | undefined,
  resourceName: string
): () => Promise<T> {
  return () => {
    if (!id) {
      throw new Error(`${resourceName} ID is required`);
    }
    return fn(id);
  };
}

/**
 * Checks if an ID is valid (not undefined, not empty string)
 * @param id - The ID to check
 * @returns true if ID is valid
 */
export function isValidId(id: string | undefined | null): id is string {
  return !!id && id !== 'undefined' && id !== 'null' && id.trim() !== '';
}
