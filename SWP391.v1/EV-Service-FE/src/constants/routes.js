export const ROUTES = {
  // page
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  // dashboard
  DASHBOARD: '/dashboard',
  // xe dien
  VEHICLES: '/vehicles',
  VEHICLE_DETAIL: '/vehicles/:id',
  ADD_VEHICLE: '/vehicles/new',
  EDIT_VEHICLE: '/vehicles/:id/edit',  
  // dat lich
  SERVICES: '/services',
  SERVICE_DETAIL: '/services/:id',
  BOOKING: '/booking',
  BOOKING_DETAIL: '/booking/:id',
  MY_BOOKINGS: '/my-bookings',
  // thong tin ca nhan
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
//admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_SERVICES: '/admin/services',
  ADMIN_STATIONS: '/admin/stations',
  ADMIN_REPORTS: '/admin/reports',
};
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
];
export const ADMIN_ROUTES = [
  ROUTES.ADMIN,
  ROUTES.ADMIN_USERS,
  ROUTES.ADMIN_SERVICES,
  ROUTES.ADMIN_STATIONS,
  ROUTES.ADMIN_REPORTS,
];