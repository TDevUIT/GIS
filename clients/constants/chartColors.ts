/**
 * Chart color palettes for analytics and data visualization
 * Provides consistent color schemes across all chart components
 */

/**
 * 5-color grayscale palette for smaller datasets
 * Used in: AnalyticsPanel, basic charts
 */
export const CHART_COLORS_5 = [
  '#374151', // gray-700
  '#6b7280', // gray-500
  '#9ca3af', // gray-400
  '#d1d5db', // gray-300
  '#e5e7eb', // gray-200
];

/**
 * 6-color grayscale palette for medium datasets
 * Used in: TerrainRiskAnalysis
 */
export const CHART_COLORS_6 = [
  '#374151', // gray-700
  '#6b7280', // gray-500
  '#9ca3af', // gray-400
  '#d1d5db', // gray-300
  '#e5e7eb', // gray-200
  '#f3f4f6', // gray-100
];

/**
 * 7-color grayscale palette for larger datasets
 * Used in: AccidentTimeAnalysis, DemographicsAnalysis
 */
export const CHART_COLORS_7 = [
  '#374151', // gray-700
  '#6b7280', // gray-500
  '#9ca3af', // gray-400
  '#d1d5db', // gray-300
  '#e5e7eb', // gray-200
  '#f3f4f6', // gray-100
  '#f9fafb', // gray-50
];

/**
 * Default chart color palette (5 colors)
 * Use this for most common cases
 */
export const CHART_COLORS = CHART_COLORS_5;

/**
 * Primary chart color for single-series charts
 */
export const PRIMARY_CHART_COLOR = '#374151';

/**
 * Secondary chart color for dual-series charts
 */
export const SECONDARY_CHART_COLOR = '#6b7280';
