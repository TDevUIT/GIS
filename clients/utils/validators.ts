
export const validators = {

  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidCoordinate: (lat: number, lng: number): boolean => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  },

  isValidPhoneNumber: (phone: string): boolean => {
    const phoneRegex = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone);
  },

  isRequired: (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  },

  isValidDateRange: (startDate: Date, endDate: Date): boolean => {
    return startDate <= endDate;
  }
};
