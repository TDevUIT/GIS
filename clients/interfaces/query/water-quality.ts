/**
 * Water Quality Query Interface
 * Query parameters for water quality service
 */

export interface WaterQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}
