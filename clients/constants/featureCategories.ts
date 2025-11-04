import { LucideIcon } from 'lucide-react'
import {
  MapPin,
  Car,
  Wind,
  Droplet,
  AlertTriangle,
  Building2,
  Bus,
  Users,
  TreePine,
  Map,
  Mountain,
  BarChart3,
  MapPinned,
  Layers as LayersIcon,
  Activity,
  Gauge,
  Navigation,
  Search,
  Filter,
  TrendingUp,
} from 'lucide-react'

export interface FeatureAction {
  id: string
  name: string
  description: string
  icon: LucideIcon
  color: string
  badge?: string
  service: string // Service function name
}

export interface FeatureCategory {
  id: string
  name: string
  description: string
  icon: LucideIcon
  gradient: string
  actions: FeatureAction[]
}

export const FEATURE_CATEGORIES: FeatureCategory[] = [
  {
    id: 'traffic',
    name: 'Traffic & Roads',
    description: 'Monitor traffic flow and road conditions',
    icon: Car,
    gradient: 'from-blue-500 to-blue-700',
    actions: [
      {
        id: 'view-all-traffic',
        name: 'View All Traffic',
        description: 'Display all traffic data on map',
        icon: Car,
        color: 'blue',
        service: 'getAllTraffics',
      },
      {
        id: 'traffic-by-district',
        name: 'Filter by District',
        description: 'Show traffic in specific district',
        icon: Filter,
        color: 'blue',
        service: 'getAllTraffics',
      },
      {
        id: 'traffic-intersect',
        name: 'Find Intersecting',
        description: 'Find traffic data intersecting with area',
        icon: Search,
        color: 'blue',
        service: 'findIntersectingTraffics',
      },
      {
        id: 'traffic-risk',
        name: 'Risk Assessment',
        description: 'Analyze traffic risk areas',
        icon: AlertTriangle,
        color: 'orange',
        badge: 'Analytics',
        service: 'getTrafficRiskAssessment',
      },
    ],
  },
  {
    id: 'air-quality',
    name: 'Air Quality',
    description: 'Monitor air pollution and quality indices',
    icon: Wind,
    gradient: 'from-green-500 to-emerald-700',
    actions: [
      {
        id: 'view-all-air',
        name: 'View All Stations',
        description: 'Display all air quality monitoring stations',
        icon: Wind,
        color: 'green',
        service: 'getAllAirQualities',
      },
      {
        id: 'air-by-district',
        name: 'Filter by District',
        description: 'Show air quality in specific district',
        icon: Filter,
        color: 'green',
        service: 'getAllAirQualities',
      },
      {
        id: 'air-radius',
        name: 'Within Radius',
        description: 'Find stations within specified radius',
        icon: Navigation,
        color: 'green',
        service: 'getAirQualityWithinRadius',
      },
      {
        id: 'air-history',
        name: 'Quality History',
        description: 'View historical air quality data',
        icon: Activity,
        color: 'green',
        badge: 'Analytics',
        service: 'getAirQualityHistory',
      },
      {
        id: 'air-ranking',
        name: 'District Ranking',
        description: 'Compare air quality by district',
        icon: BarChart3,
        color: 'green',
        badge: 'Analytics',
        service: 'getAirQualityRankingByDistrict',
      },
    ],
  },
  {
    id: 'water-quality',
    name: 'Water Quality',
    description: 'Track water quality and contamination',
    icon: Droplet,
    gradient: 'from-cyan-500 to-blue-700',
    actions: [
      {
        id: 'view-all-water',
        name: 'View All Stations',
        description: 'Display all water quality stations',
        icon: Droplet,
        color: 'cyan',
        service: 'getAllWaterQualities',
      },
      {
        id: 'water-by-district',
        name: 'Filter by District',
        description: 'Show water quality in specific district',
        icon: Filter,
        color: 'cyan',
        service: 'getAllWaterQualities',
      },
      {
        id: 'water-history',
        name: 'Quality History',
        description: 'View historical water quality data',
        icon: Activity,
        color: 'cyan',
        badge: 'Analytics',
        service: 'getWaterQualityHistory',
      },
      {
        id: 'water-ranking',
        name: 'District Ranking',
        description: 'Compare water quality by district',
        icon: BarChart3,
        color: 'cyan',
        badge: 'Analytics',
        service: 'getWaterQualityRankingByDistrict',
      },
    ],
  },
  {
    id: 'accidents',
    name: 'Accidents & Safety',
    description: 'Track accidents and safety incidents',
    icon: AlertTriangle,
    gradient: 'from-red-500 to-orange-700',
    actions: [
      {
        id: 'view-all-accidents',
        name: 'View All Accidents',
        description: 'Display all accident locations',
        icon: AlertTriangle,
        color: 'red',
        service: 'getAllAccidents',
      },
      {
        id: 'accident-hotspots',
        name: 'Hotspot Analysis',
        description: 'Identify accident-prone areas',
        icon: MapPinned,
        color: 'red',
        badge: 'Analytics',
        service: 'getAccidentHotspots',
      },
      {
        id: 'accident-severity',
        name: 'By Severity',
        description: 'View accidents grouped by severity',
        icon: Gauge,
        color: 'orange',
        badge: 'Analytics',
        service: 'getAccidentSummaryBySeverity',
      },
      {
        id: 'accident-time',
        name: 'By Time of Day',
        description: 'Analyze accidents by time patterns',
        icon: Activity,
        color: 'red',
        badge: 'Analytics',
        service: 'getAccidentsByTimeOfDay',
      },
      {
        id: 'accident-day',
        name: 'By Day of Week',
        description: 'Analyze accidents by day patterns',
        icon: BarChart3,
        color: 'red',
        badge: 'Analytics',
        service: 'getAccidentsByDayOfWeek',
      },
    ],
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'View public facilities and services',
    icon: Building2,
    gradient: 'from-purple-500 to-indigo-700',
    actions: [
      {
        id: 'view-all-infra',
        name: 'View All',
        description: 'Display all infrastructure',
        icon: Building2,
        color: 'purple',
        service: 'getAllInfrastructures',
      },
      {
        id: 'infra-schools',
        name: 'Schools',
        description: 'Show all schools',
        icon: Building2,
        color: 'purple',
        service: 'getAllInfrastructures',
      },
      {
        id: 'infra-hospitals',
        name: 'Hospitals',
        description: 'Show all hospitals',
        icon: Building2,
        color: 'red',
        service: 'getAllInfrastructures',
      },
      {
        id: 'infra-parks',
        name: 'Parks',
        description: 'Show all parks',
        icon: TreePine,
        color: 'green',
        service: 'getAllInfrastructures',
      },
      {
        id: 'infra-radius',
        name: 'Within Radius',
        description: 'Find facilities near location',
        icon: Navigation,
        color: 'purple',
        service: 'getInfrastructuresWithinRadius',
      },
      {
        id: 'infra-category',
        name: 'By Category',
        description: 'Group by infrastructure type',
        icon: LayersIcon,
        color: 'purple',
        badge: 'Analytics',
        service: 'getInfrastructureByCategory',
      },
    ],
  },
  {
    id: 'public-transport',
    name: 'Public Transport',
    description: 'View bus routes and transit systems',
    icon: Bus,
    gradient: 'from-amber-500 to-orange-700',
    actions: [
      {
        id: 'view-all-transport',
        name: 'View All Routes',
        description: 'Display all public transport routes',
        icon: Bus,
        color: 'amber',
        service: 'getAllPublicTransports',
      },
      {
        id: 'transport-bus',
        name: 'Bus Routes',
        description: 'Show only bus routes',
        icon: Bus,
        color: 'amber',
        service: 'getAllPublicTransports',
      },
      {
        id: 'transport-metro',
        name: 'Metro Lines',
        description: 'Show metro/subway lines',
        icon: Navigation,
        color: 'blue',
        service: 'getAllPublicTransports',
      },
      {
        id: 'transport-intersect',
        name: 'Find Intersecting',
        description: 'Find routes intersecting with area',
        icon: Search,
        color: 'amber',
        service: 'findIntersectingPublicTransports',
      },
      {
        id: 'transport-summary',
        name: 'Summary by Mode',
        description: 'View transport statistics by mode',
        icon: BarChart3,
        color: 'amber',
        badge: 'Analytics',
        service: 'getPublicTransportSummaryByMode',
      },
      {
        id: 'transport-capacity',
        name: 'Capacity Analysis',
        description: 'Analyze transport capacity by mode',
        icon: Gauge,
        color: 'amber',
        badge: 'Analytics',
        service: 'getPublicTransportCapacityByMode',
      },
      {
        id: 'transport-frequent',
        name: 'Most Frequent',
        description: 'View most frequent routes',
        icon: TrendingUp,
        color: 'amber',
        badge: 'Analytics',
        service: 'getMostFrequentRoutes',
      },
    ],
  },
  {
    id: 'population',
    name: 'Population',
    description: 'Demographic and population data',
    icon: Users,
    gradient: 'from-pink-500 to-rose-700',
    actions: [
      {
        id: 'view-population',
        name: 'View All',
        description: 'Display population data',
        icon: Users,
        color: 'pink',
        service: 'getAllPopulations',
      },
      {
        id: 'population-history',
        name: 'Population History',
        description: 'View historical population trends',
        icon: TrendingUp,
        color: 'pink',
        badge: 'Analytics',
        service: 'getPopulationHistory',
      },
      {
        id: 'demographics',
        name: 'Demographics',
        description: 'Detailed demographic breakdown',
        icon: BarChart3,
        color: 'pink',
        badge: 'Analytics',
        service: 'getDemographicsSummary',
      },
      {
        id: 'households',
        name: 'Households',
        description: 'Household statistics',
        icon: Building2,
        color: 'pink',
        badge: 'Analytics',
        service: 'getHouseholdsSummary',
      },
    ],
  },
  {
    id: 'land-use',
    name: 'Land Use',
    description: 'Land utilization and zoning',
    icon: TreePine,
    gradient: 'from-lime-500 to-green-700',
    actions: [
      {
        id: 'view-land-use',
        name: 'View All',
        description: 'Display land use data',
        icon: TreePine,
        color: 'lime',
        service: 'getAllLandUses',
      },
      {
        id: 'land-by-type',
        name: 'Filter by Type',
        description: 'Show specific land use types',
        icon: Filter,
        color: 'lime',
        service: 'getAllLandUses',
      },
      {
        id: 'land-summary',
        name: 'Land Use Summary',
        description: 'Summary by district and year',
        icon: BarChart3,
        color: 'lime',
        badge: 'Analytics',
        service: 'getLandUseSummary',
      },
    ],
  },
  {
    id: 'terrain',
    name: 'Terrain & Geology',
    description: 'Elevation and terrain analysis',
    icon: Mountain,
    gradient: 'from-stone-500 to-gray-700',
    actions: [
      {
        id: 'view-terrain',
        name: 'View Terrain',
        description: 'Display terrain data',
        icon: Mountain,
        color: 'stone',
        service: 'getAllTerrains',
      },
      {
        id: 'terrain-summary',
        name: 'Terrain Summary',
        description: 'Summary by district',
        icon: BarChart3,
        color: 'stone',
        badge: 'Analytics',
        service: 'getTerrainSummaryByDistrict',
      },
      {
        id: 'landslide-risk',
        name: 'Landslide Risk',
        description: 'Identify high-risk areas',
        icon: AlertTriangle,
        color: 'orange',
        badge: 'Analytics',
        service: 'getLandslideRiskAreas',
      },
      {
        id: 'flood-prone',
        name: 'Flood Prone Areas',
        description: 'Identify flood risk zones',
        icon: Droplet,
        color: 'blue',
        badge: 'Analytics',
        service: 'getFloodProneAreas',
      },
      {
        id: 'soil-distribution',
        name: 'Soil Types',
        description: 'View soil type distribution',
        icon: Map,
        color: 'stone',
        badge: 'Analytics',
        service: 'getSoilTypeDistribution',
      },
    ],
  },
  {
    id: 'urban-planning',
    name: 'Urban Planning',
    description: 'City planning and zoning',
    icon: Map,
    gradient: 'from-indigo-500 to-purple-700',
    actions: [
      {
        id: 'view-urban-plans',
        name: 'View Plans',
        description: 'Display urban planning zones',
        icon: Map,
        color: 'indigo',
        service: 'getAllUrbanPlans',
      },
      {
        id: 'urban-by-zoning',
        name: 'By Zoning Type',
        description: 'Filter by zoning classification',
        icon: Filter,
        color: 'indigo',
        service: 'getAllUrbanPlans',
      },
    ],
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    description: 'Comprehensive data analytics',
    icon: BarChart3,
    gradient: 'from-violet-500 to-purple-700',
    actions: [
      {
        id: 'global-summary',
        name: 'Global Summary',
        description: 'Overall city statistics',
        icon: BarChart3,
        color: 'violet',
        service: 'getGlobalSummary',
      },
      {
        id: 'recent-activities',
        name: 'Recent Activities',
        description: 'Latest data updates',
        icon: Activity,
        color: 'violet',
        service: 'getRecentActivities',
      },
    ],
  },
  {
    id: 'districts',
    name: 'Districts & Wards',
    description: 'Administrative boundaries',
    icon: MapPin,
    gradient: 'from-teal-500 to-cyan-700',
    actions: [
      {
        id: 'view-districts',
        name: 'View Districts',
        description: 'Display all districts',
        icon: MapPin,
        color: 'teal',
        service: 'getAllDistricts',
      },
      {
        id: 'view-wards',
        name: 'View Wards',
        description: 'Display wards/communes',
        icon: MapPinned,
        color: 'teal',
        service: 'getAllWards',
      },
      {
        id: 'wards-by-district',
        name: 'Wards by District',
        description: 'Filter wards by district',
        icon: Filter,
        color: 'teal',
        service: 'getAllWards',
      },
    ],
  },
]

/**
 * Get category by ID
 */
export const getCategoryById = (id: string): FeatureCategory | undefined => {
  return FEATURE_CATEGORIES.find(cat => cat.id === id)
}

/**
 * Get all actions from all categories
 */
export const getAllActions = (): FeatureAction[] => {
  return FEATURE_CATEGORIES.flatMap(cat => cat.actions)
}

/**
 * Get action by ID
 */
export const getActionById = (id: string): FeatureAction | undefined => {
  return getAllActions().find(action => action.id === id)
}

/**
 * Color palette for feature buttons
 */
export const FEATURE_COLORS = {
  blue: 'bg-blue-500 hover:bg-blue-600 text-white',
  green: 'bg-green-500 hover:bg-green-600 text-white',
  red: 'bg-red-500 hover:bg-red-600 text-white',
  orange: 'bg-orange-500 hover:bg-orange-600 text-white',
  purple: 'bg-purple-500 hover:bg-purple-600 text-white',
  amber: 'bg-amber-500 hover:bg-amber-600 text-white',
  cyan: 'bg-cyan-500 hover:bg-cyan-600 text-white',
  pink: 'bg-pink-500 hover:bg-pink-600 text-white',
  lime: 'bg-lime-500 hover:bg-lime-600 text-white',
  stone: 'bg-stone-500 hover:bg-stone-600 text-white',
  indigo: 'bg-indigo-500 hover:bg-indigo-600 text-white',
  violet: 'bg-violet-500 hover:bg-violet-600 text-white',
  teal: 'bg-teal-500 hover:bg-teal-600 text-white',
}
