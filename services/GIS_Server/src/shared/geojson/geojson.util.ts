export function withParsedGeom<T extends Record<string, unknown>>(record: T): T {
  const geom = record.geom;
  if (typeof geom !== 'string') {
    return record;
  }

  try {
    return { ...record, geom: JSON.parse(geom) };
  } catch {
    return record;
  }
}
