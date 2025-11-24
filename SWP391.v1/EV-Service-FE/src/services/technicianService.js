import api from './api';

const technicianService = {
 // Lay danh sach cong viec cua technician dang nhap
  getMyReceptions: async () => {
    try {
      console.log('🔄 Loading my receptions...');
      const response = await api.get('/technician/my-receptions');
      console.log('✅ My receptions loaded:', response);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error loading my receptions:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể tải danh sách công việc'
      };
    }
  },

// Lay chi tiet cong viec theo id
  getReceptionById: async (receptionId) => {
    try {
      console.log(`🔄 Loading reception #${receptionId}...`);
      const response = await api.get(`/technician/receptions/${receptionId}`);
      console.log('✅ Reception loaded:', response);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error loading reception:', error);
      
      // Xu ly 403 Forbidden (khong duoc giao viec cho technician nay)
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Bạn không có quyền truy cập công việc này'
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể tải thông tin công việc'
      };
    }
  },
// Cap nhat trang thai cong viec
  updateReceptionStatus: async (receptionId, status) => {
    try {
      console.log(`🔄 Updating reception #${receptionId} status to ${status}...`);
      const response = await api.patch(`/receptions/${receptionId}/status`, { status });
      console.log('✅ Reception status updated:', response);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error updating reception status:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể cập nhật trạng thái'
      };
    }
  },
// Them phu tung vao don tiep nhan
  addSpareParts: async (receptionId, sparePartIds) => {
    try {
      console.log(`🔄 Adding spare parts to reception #${receptionId}...`);
      const response = await api.patch(`/receptions/${receptionId}/add-parts`, { sparePartIds });
      console.log('✅ Spare parts added:', response);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error adding spare parts:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể thêm phụ tùng'
      };
    }
  },
// Lay danh sach phu tung cua don tiep nhan
  getSpareParts: async (receptionId) => {
    try {
      console.log(`🔄 Loading spare parts for reception #${receptionId}...`);
      const response = await api.get(`/receptions/${receptionId}/spare-parts`);
      console.log('✅ Spare parts loaded:', response);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error loading spare parts:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Không thể lấy danh sách phụ tùng'
      };
    }
  }
};

export default technicianService;
