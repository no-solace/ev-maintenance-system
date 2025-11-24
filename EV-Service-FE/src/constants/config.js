//api 
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const APP_NAME = 'EV Service';
export const APP_VERSION = '1.0.0';

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'ev_auth_token',
  USER_DATA: 'ev_user_data',
  THEME: 'ev_theme',
  LANGUAGE: 'ev_language',
};

export const QUERY_KEYS = {
  USER: 'user',
  VEHICLES: 'vehicles',
  SERVICES: 'services',
  BOOKINGS: 'bookings',
  STATIONS: 'stations',
  NOTIFICATIONS: 'notifications',
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMIT_OPTIONS: [10, 20, 50, 100],
};