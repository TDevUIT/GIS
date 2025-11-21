
export const formatters = {

  formatDate: (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  },

  formatTime: (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString('vi-VN');
  },

  formatNumber: (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  },

  formatAQI: (aqi: number) => {
    if (aqi <= 50) return { level: 'Good', color: 'green' };
    if (aqi <= 100) return { level: 'Moderate', color: 'yellow' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: 'orange' };
    if (aqi <= 200) return { level: 'Unhealthy', color: 'red' };
    return { level: 'Very Unhealthy', color: 'purple' };
  },

  formatDistance: (meters: number) => {
    if (meters < 1000) return `${meters}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  }
};
