import api from './api';
// Service for vehicle receptions
const receptionService = {
 // Tao moi don tiep nhan xe
  createReception: async (receptionData) => {
    try {
      console.log('📤 Sending vehicle reception to backend:', receptionData);
      const response = await api.post('/receptions', receptionData);
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
// Lay tat ca don tiep nhan
  getAllReceptions: async () => {
    try {
      const response = await api.get('/receptions');
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
// Lay chi tiet don tiep nhan theo id
  getReceptionById: async (receptionId) => {
    try {
      const response = await api.get(`/receptions/${receptionId}`);
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
// Lay don tiep nhan theo trang thai
  getReceptionsByStatus: async (status) => {
    try {
      const response = await api.get(`/receptions/status/${status}`);
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
// Lay don tiep nhan theo ky thuat vien
  getReceptionsByTechnician: async (technicianId) => {
    try {
      const response = await api.get(`/receptions/technician/${technicianId}`);
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
// Cap nhat trang thai don tiep nhan
  updateReceptionStatus: async (receptionId, status) => {
    try {
      const response = await api.patch(`/receptions/${receptionId}/status`, { status });
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
// Them phu tung vao don tiep nhan
  addSpareParts: async (receptionId, sparePartIds) => {
    try {
      const response = await api.patch(`/receptions/${receptionId}/add-parts`, { sparePartIds });
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
// Phan cong ky thuat vien cho don tiep nhan
  assignTechnician: async (receptionId, technicianId) => {
    try {
      const response = await api.patch(
        `/receptions/${receptionId}/assign-technician?technicianId=${technicianId}`
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
//  Lay danh sach phu tung cua don tiep nhan
  getSpareParts: async (receptionId) => {
    try {
      const response = await api.get(`/receptions/${receptionId}/spare-parts`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể lấy danh sách phụ tùng'
      };
    }
  },
// Lay danh sach loai dich vu
  getAllOfferTypes: async () => {
    try {
      const response = await api.get('/receptions/offer-types');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể lấy danh sách loại dịch vụ'
      };
    }
  },
// Tim kiem lich su xe theo bien so hoac vin
  searchVehicleHistory: async (licensePlate, vin) => {
    try {
      const params = new URLSearchParams();
      if (licensePlate) params.append('licensePlate', licensePlate);
      if (vin) params.append('vin', vin);
      
      // Su dung ElectricVehicleController endpoint
      const response = await api.get(`/vehicles/search?${params.toString()}`);
      
      //  Xu ly phan hoi tu backend
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
      // 404  ko tim thay
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
// Lay danh sach walk-in trong hang doi
  getWalkinQueue: async () => {
    try {
      const response = await api.get('/receptions/walkin-queue');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể tải danh sách walk-in'
      };
    }
  }
};

export default receptionService;
