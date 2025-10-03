
export const databaseConfig = {

  localStorage: {
    userPreferences: 'ie402_user_preferences',
    mapSettings: 'ie402_map_settings',
    dashboardLayout: 'ie402_dashboard_layout',
    recentSearches: 'ie402_recent_searches'
  },

  cache: {
maxAge: 5 * 60 * 1000,
maxSize: 100,
    prefix: 'ie402_cache_'
  }
};
