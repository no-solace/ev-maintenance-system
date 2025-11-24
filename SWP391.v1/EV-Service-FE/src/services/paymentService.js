import api from './api';


const paymentService = {
// tao hoa don moi
  createPayment: async (paymentData) => {
    try {
      console.log('📤 Sending payment data to backend:', paymentData);
      const response = await api.post('/payments', paymentData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error creating payment:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data || 'Không thể tạo hóa đơn'
      };
    }
  },
// Lay tat ca hoa don
  getAllPayments: async () => {
    try {
      const response = await api.get('/payments');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách hóa đơn'
      };
    }
  },
// Lay hoa don theo id
  getPaymentById: async (paymentId) => {
    try {
      const response = await api.get(`/payments/${paymentId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy thông tin hóa đơn'
      };
    }
  },
// Lay hoa don theo so hoa don
  getPaymentByInvoiceNumber: async (invoiceNumber) => {
    try {
      const response = await api.get(`/payments/invoice/${invoiceNumber}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy thông tin hóa đơn'
      };
    }
  },

// Lay hoa don theo trang thai
  getPaymentsByStatus: async (status) => {
    try {
      const response = await api.get(`/payments/status/${status}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách hóa đơn'
      };
    }
  },
// Tim kiem hoa don
  searchPayments: async (searchTerm) => {
    try {
      const response = await api.get(`/payments/search?q=${searchTerm}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tìm kiếm hóa đơn'
      };
    }
  },

// Xac nhan hoa don da thanh toan
  markAsPaid: async (paymentId, paymentMethod = 'CASH') => {
    try {
      const response = await api.post(`/payments/${paymentId}/mark-paid`, { paymentMethod });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Không thể xác nhận thanh toán'
      };
    }
  },
// Hoan tat hoa don
  markAsCompleted: async (paymentId) => {
    try {
      const response = await api.post(`/payments/${paymentId}/mark-completed`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data || 'Không thể hoàn tất thanh toán'
      };
    }
  },
// Cap nhat trang thai hoa don
  updatePaymentStatus: async (paymentId, status) => {
    try {
      const response = await api.patch(`/payments/${paymentId}/status`, { status });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể cập nhật trạng thái'
      };
    }
  },
// Lay thong ke hoa don
  getPaymentStatistics: async () => {
    try {
      const response = await api.get('/payments/statistics');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy thống kê thanh toán'
      };
    }
  },
// Lay hoa don theo khoang thoi gian
  getPaymentsByDateRange: async (startDate, endDate) => {
    try {
      const response = await api.get(`/payments/date-range?startDate=${startDate}&endDate=${endDate}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách hóa đơn'
      };
    }
  },
// Tao hoa don tu don tiep nhan
  createPaymentFromReception: async (receptionId) => {
    try {
      console.log('📤 Creating payment from vehicle reception:', receptionId);
      const response = await api.post(`/payments/from-reception/${receptionId}`);
      console.log('✅ Payment created successfully:', response);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error creating payment from reception:', error);
      return {
        success: false,
        error: error.response?.data || 'Không thể tạo hóa đơn từ tiếp nhận xe'
      };
    }
  }
};

export default paymentService;
