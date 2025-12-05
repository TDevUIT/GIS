/**
 * Air Quality Query Interface
 * Query parameters for air quality service
 */

export interface AirQualityQuery {
  districtId?: string;
  from?: string;
  to?: string;
}
