
export const validators = {

  isValidEmail: (email: string): boolean => {
    console.log('Validating email:', email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidCoordinate: (lat: number, lng: number): boolean => {
    console.log('Validating coordinates:', lat, lng);
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  },

  isValidPhoneNumber: (phone: string): boolean => {
    console.log('Validating phone number:', phone);
    const phoneRegex = /^(\+84|0)[3|5|7|8|9][0-9]{8}$/;
    return phoneRegex.test(phone);
  },

  isRequired: (value: any): boolean => {
    console.log('Validating required field:', value);
    return value !== null && value !== undefined && value !== '';
  },

  isValidDateRange: (startDate: Date, endDate: Date): boolean => {
    console.log('Validating date range:', startDate, endDate);
    return startDate <= endDate;
  }
};
