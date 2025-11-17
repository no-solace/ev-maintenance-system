import api from './api';

/**
 * Payment Service
 * Handles all payment and invoice related API calls
 */

const paymentService = {
  /**
   * Create a new payment/invoice
   * @param {Object} paymentData - Payment data
   * @returns {Promise}
   */
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

  /**
   * Get all payments
   * @returns {Promise}
   */
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

  /**
   * Get payment by ID
   * @param {number} paymentId
   * @returns {Promise}
   */
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

  /**
   * Get payment by invoice number
   * @param {string} invoiceNumber
   * @returns {Promise}
   */
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

  /**
   * Get payments by status
   * @param {string} status - PENDING, PAID, COMPLETED
   * @returns {Promise}
   */
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

  /**
   * Search payments by keyword
   * @param {string} searchTerm - Search keyword
   * @returns {Promise}
   */
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

  /**
   * Mark payment as paid (confirm payment received)
   * @param {number} paymentId
   * @param {string} paymentMethod - CASH or VNPAY
   * @returns {Promise}
   */
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

  /**
   * Mark payment as completed (confirm bank transfer)
   * @param {number} paymentId
   * @returns {Promise}
   */
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

  /**
   * Update payment status
   * @param {number} paymentId
   * @param {string} status - PENDING, PAID, COMPLETED
   * @returns {Promise}
   */
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

  /**
   * Get payment statistics
   * @returns {Promise}
   */
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

  /**
   * Get payments by date range
   * @param {string} startDate - ISO date string
   * @param {string} endDate - ISO date string
   * @returns {Promise}
   */
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

  /**
   * Create payment from vehicle reception (primary workflow)
   * @param {number} receptionId
   * @returns {Promise}
   */
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
