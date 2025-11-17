import api from './api';

/**
 * Service Center API Service
 */
const serviceCenterService = {
  /**
   * Lấy tất cả trung tâm dịch vụ
   * @returns {Promise<Array>} Danh sách service centers
   */
  getAllCenters: async () => {
    try {
      const response = await api.get('/centers');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Get centers error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tải danh sách trung tâm'
      };
    }
  },

  /**
   * Lấy thông tin trung tâm theo ID
   * @param {number} centerId - ID của trung tâm
   * @returns {Promise<Object>} Thông tin trung tâm
   */
  getCenterById: async (centerId) => {
    try {
      const response = await api.get(`/centers/${centerId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tải thông tin trung tâm'
      };
    }
  }
};

export default serviceCenterService;
