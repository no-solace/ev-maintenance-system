import api from './api';

export const maintenancePackageService = {
  // Get all maintenance packages
  getAllPackages: async () => {
    try {
      const response = await api.get('/maintenance-packages');
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
  },
  
  // Get packages by offer type
  getPackagesByOfferType: async (offerTypeId) => {
    try {
      const response = await api.get(`/maintenance-packages/by-offer-type/${offerTypeId}`);
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
