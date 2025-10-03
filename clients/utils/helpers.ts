
export const helpers = {

  generateId: (): string => {
    console.log('Generating unique ID');
    return Math.random().toString(36).substr(2, 9);
  },

  debounce: (func: Function, wait: number) => {
    console.log('Creating debounced function with wait:', wait);
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  deepClone: (obj: any) => {
    console.log('Deep cloning object');
    return JSON.parse(JSON.stringify(obj));
  },

  getDistance: (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    console.log('Calculating distance between coordinates');
const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
return R * c * 1000;
  },

  storage: {
    get: (key: string) => {
      console.log('Getting from localStorage:', key);
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
      }
      return null;
    },
    set: (key: string, value: string) => {
      console.log('Setting to localStorage:', key);
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, value);
      }
    },
    remove: (key: string) => {
      console.log('Removing from localStorage:', key);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
      }
    }
  }
};
