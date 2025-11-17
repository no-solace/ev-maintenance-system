import api from './api';

export const vehicleService = {
  // Lấy danh sách xe của customer đang đăng nhập
  getMyVehicles: async () => {
    const response = await api.get('/me/vehicles');
    return response; // api interceptor already returns response.data
  },
};

export default vehicleService;
