import api from './api';

/**
 * Vehicle Reception Service
 * Handles all vehicle reception related API calls
 */

const vehicleReceptionService = {
  /**
   * Create a new vehicle reception record
   * @param {Object} receptionData - Vehicle reception data
   * @returns {Promise}
   */
  createReception: async (receptionData) => {
    try {
      console.log('📤 Sending vehicle reception to backend:', receptionData);
      const response = await api.post('/vehicle-reception', receptionData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error creating reception:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể tạo phiếu tiếp nhận'
      };
    }
  },

  /**
   * Get all vehicle receptions
   * @returns {Promise}
   */
  getAllReceptions: async () => {
    try {
      const response = await api.get('/vehicle-reception');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể lấy danh sách tiếp nhận'
      };
    }
  },

  /**
   * Get reception by ID
   * @param {number} receptionId
   * @returns {Promise}
   */
  getReceptionById: async (receptionId) => {
    try {
      const response = await api.get(`/vehicle-reception/${receptionId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể lấy thông tin tiếp nhận'
      };
    }
  },

  /**
   * Get receptions by status
   * @param {string} status - Reception status
   * @returns {Promise}
   */
  getReceptionsByStatus: async (status) => {
    try {
      const response = await api.get(`/vehicle-reception/status/${status}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể lấy danh sách tiếp nhận'
      };
    }
  },

  /**
   * Get receptions by technician
   * @param {number} technicianId
   * @returns {Promise}
   */
  getReceptionsByTechnician: async (technicianId) => {
    try {
      const response = await api.get(`/vehicle-reception/technician/${technicianId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể lấy danh sách tiếp nhận'
      };
    }
  },

  /**
   * Update reception status
   * @param {number} receptionId
   * @param {string} status
   * @returns {Promise}
   */
  updateReceptionStatus: async (receptionId, status) => {
    try {
      const response = await api.patch(`/vehicle-reception/${receptionId}/status`, { status });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể cập nhật trạng thái'
      };
    }
  },

  /**
   * Add spare parts to reception
   * @param {number} receptionId
   * @param {Array<number>} sparePartIds
   * @returns {Promise}
   */
  addSpareParts: async (receptionId, sparePartIds) => {
    try {
      const response = await api.patch(`/vehicle-reception/${receptionId}/add-parts`, { sparePartIds });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể thêm phụ tùng'
      };
    }
  },

  /**
   * Assign or reassign technician to a reception
   * @param {number} receptionId - Reception ID
   * @param {number} technicianId - Technician ID
   * @returns {Promise}
   */
  assignTechnician: async (receptionId, technicianId) => {
    try {
      const response = await api.patch(
        `/vehicle-reception/${receptionId}/assign-technician?technicianId=${technicianId}`
      );
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể phân công kỹ thuật viên'
      };
    }
  },

  /**
   * Search vehicle by license plate or VIN
   * Returns vehicle information with history to auto-fill the form
   * @param {string} licensePlate - License plate number
   * @param {string} vin - Vehicle Identification Number
   * @returns {Promise}
   */
  searchVehicleHistory: async (licensePlate, vin) => {
    try {
      const params = new URLSearchParams();
      if (licensePlate) params.append('licensePlate', licensePlate);
      if (vin) params.append('vin', vin);
      
      // Use ElectricVehicleController endpoint
      const response = await api.get(`/vehicles/search?${params.toString()}`);
      
      // Handle ApiResponse wrapper
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
      // 404 means vehicle not found
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
  }
};

export default vehicleReceptionService;
