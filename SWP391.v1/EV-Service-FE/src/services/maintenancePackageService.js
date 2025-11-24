import api from './api';

export const maintenancePackageService = {
  //  Lay danh sach goi bao duong
  getAllPackages: async () => {
    try {
      const response = await api.get('/receptions/maintenance-packages');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách gói bảo dưỡng'
      };
    }
  }
};
