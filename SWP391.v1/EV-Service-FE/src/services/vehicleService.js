import api from './api';

export const vehicleService = {
  // Lấy danh sách xe của customer đang đăng nhập
  getMyVehicles: async () => {
    const response = await api.get('/customers/my-vehicles');
    return response; // api interceptor already returns response.data
  },

  // Lấy tất cả các model xe điện
  getAllModels: async () => {
    try {
      const response = await api.get('/vehicles/models');
      return response; // Returns array directly
    } catch (error) {
      console.error('Error fetching EV models:', error);
      return [];
    }
  },

  // Tìm kiếm xe theo biển số hoặc VIN
  searchVehicle: async (licensePlate, vin) => {
    try {
      const params = new URLSearchParams();
      if (licensePlate) params.append('licensePlate', licensePlate);
      if (vin) params.append('vin', vin);
      
      const response = await api.get(`/vehicles/search?${params.toString()}`);
      
      // Xử lý phản hồi từ backend
      if (response.success) {
        return {
          success: true,
          data: response.data
        };
      } else if (response.notFound) {
        return {
          success: false,
          notFound: true
        };
      } else {
        return {
          success: false,
          error: response.message || 'Không thể tìm kiếm xe'
        };
      }
    } catch (error) {
      //  404 ko tim thay 
      if (error.response?.status === 404) {
        return {
          success: false,
          notFound: true
        };
      }
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Không thể tìm kiếm xe'
      };
    }
  },
};

export default vehicleService;
