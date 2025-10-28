
export function createSafeQueryKey(baseKey: string[], id?: string): string[] {
  return [...baseKey, id || 'none'];
}

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

export function isValidId(id: string | undefined | null): id is string {
  return !!id && id !== 'undefined' && id !== 'null' && id.trim() !== '';
}
