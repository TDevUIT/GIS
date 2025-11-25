export const ROUTES = {
  HOME: '/',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Maps & GIS
  MAPS: {
    INDEX: '/maps',
    VIEWER: '/maps/viewer',
    ANALYSIS: '/maps/analysis',
    LAYERS: '/maps/layers',

  },
  DISTRICTS: '/districts',
  // Incidents Management
  INCIDENTS: {
    INDEX: '/incidents',
    CREATE: '/incidents/create',
    DETAIL: (id: string) => `/incidents/${id}`,
    EDIT: (id: string) => `/incidents/${id}/edit`,
    LIST: '/incidents/list',
  },

  // Reports
  REPORTS: {
    INDEX: '/reports',
    CREATE: '/reports/create',
    DETAIL: (id: string) => `/reports/${id}`,
    STATISTICS: '/reports/statistics',
    EXPORT: '/reports/export',
  },

  // Analytics (Merged into Reports)
  // ANALYTICS: {
  //   INDEX: '/analytics',
  //   OVERVIEW: '/analytics/overview',
  //   TRENDS: '/analytics/trends',
  //   HEATMAP: '/analytics/heatmap',
  //   INSIGHTS: '/analytics/insights',
  // },

  // Features Demo
  FEATURES: {
    INDEX: '/features-demo',
    COMPONENTS: '/features-demo/components',
    EXAMPLES: '/features-demo/examples',
  },

  // User Management
  USER: {
    PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
    PREFERENCES: '/user/preferences',
  },

  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    LOGOUT: '/auth/logout',
  },

  // Settings
  SETTINGS: {
    INDEX: '/settings',
    GENERAL: '/settings/general',
    NOTIFICATIONS: '/settings/notifications',
    SECURITY: '/settings/security',
    INTEGRATIONS: '/settings/integrations',
  },

  // Error Pages
  ERROR: {
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/401',
    FORBIDDEN: '/403',
    SERVER_ERROR: '/500',
  },
} as const;

export const API_ROUTES = {
  // GIS Service
  GIS: {
    BASE: '/api/gis',
    LAYERS: '/api/gis/layers',
    FEATURES: '/api/gis/features',
    ANALYZE: '/api/gis/analyze',
    GEOCODE: '/api/gis/geocode',
  },

  // Web Service
  WEB: {
    BASE: '/api/web',
    INCIDENTS: '/api/web/incidents',
    REPORTS: '/api/web/reports',
    ANALYTICS: '/api/web/analytics',
    USERS: '/api/web/users',
  },

  // Simulation Service
  SIMULATION: {
    BASE: '/api/simulation',
    RUN: '/api/simulation/run',
    RESULTS: '/api/simulation/results',
    SCENARIOS: '/api/simulation/scenarios',
  },
} as const;


export const EXTERNAL_LINKS = {
  DOCUMENTATION: 'https://github.com/your-repo/IE402-ALL/docs',
  GITHUB: 'https://github.com/your-repo/IE402-ALL',
  SUPPORT: 'https://support.your-domain.com',
} as const;

export const NAVIGATION = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'dashboard',
    requiresAuth: true,
  },
  {
    label: 'Maps',
    path: ROUTES.MAPS.INDEX,
    icon: 'map',
    requiresAuth: true,
    children: [
      { label: 'Map Viewer', path: ROUTES.MAPS.VIEWER },
      { label: 'Analysis', path: ROUTES.MAPS.ANALYSIS },
      { label: 'Layers', path: ROUTES.MAPS.LAYERS },
    ],
  },
  {
    label: 'Incidents',
    path: ROUTES.INCIDENTS.INDEX,
    icon: 'alert',
    requiresAuth: true,
    children: [
      { label: 'All Incidents', path: ROUTES.INCIDENTS.LIST },
      { label: 'Create New', path: ROUTES.INCIDENTS.CREATE },
    ],
  },
  {
    label: 'Reports',
    path: ROUTES.REPORTS.INDEX,
    icon: 'file-text',
    requiresAuth: true,
    children: [
      { label: 'Statistics', path: ROUTES.REPORTS.STATISTICS },
      { label: 'Create Report', path: ROUTES.REPORTS.CREATE },
    ],
  },
  // Analytics merged into Reports page
  // {
  //   label: 'Analytics',
  //   path: ROUTES.ANALYTICS.INDEX,
  //   icon: 'chart',
  //   requiresAuth: true,
  //   children: [
  //     { label: 'Overview', path: ROUTES.ANALYTICS.OVERVIEW },
  //     { label: 'Trends', path: ROUTES.ANALYTICS.TRENDS },
  //     { label: 'Heatmap', path: ROUTES.ANALYTICS.HEATMAP },
  //   ],
  // },
] as const;

export const BREADCRUMB_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  maps: 'Maps',
  viewer: 'Map Viewer',
  analysis: 'Analysis',
  layers: 'Layers',
  incidents: 'Incidents',
  create: 'Create',
  edit: 'Edit',
  reports: 'Reports',
  statistics: 'Statistics',
  analytics: 'Analytics',
  overview: 'Overview',
  trends: 'Trends',
  heatmap: 'Heatmap',
  insights: 'Insights',
  settings: 'Settings',
  profile: 'Profile',
  'features-demo': 'Features Demo',
};


export const requiresAuth = (path: string): boolean => {
  const publicRoutes: string[] = [
    ROUTES.HOME,
    ROUTES.AUTH.LOGIN,
    ROUTES.AUTH.REGISTER,
    ROUTES.AUTH.FORGOT_PASSWORD,
  ];
  return !publicRoutes.includes(path);
};

export const getBreadcrumbs = (path: string) => {
  const segments = path.split('/').filter(Boolean);
  return segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const label = BREADCRUMB_LABELS[segment] || segment;
    return { label, path };
  });
};


export const matchRoute = (currentPath: string, routePattern: string): boolean => {
  const pattern = routePattern.replace(/\[.*?\]/g, '[^/]+');
  const regex = new RegExp(`^${pattern}$`);
  return regex.test(currentPath);
};


export type RouteKey = keyof typeof ROUTES;
export type NavigationItem = typeof NAVIGATION[number];
