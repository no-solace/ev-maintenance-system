import api from './api';

/**
 * VNPay Service
 * Handles VNPay payment integration for e-transfer
 */

const vnpayService = {
  /**
   * Create VNPay payment URL
   * @param {Object} paymentData - Payment information
   * @param {number} paymentData.amount - Payment amount
   * @param {string} paymentData.orderInfo - Order description
   * @param {number} paymentData.paymentId - Payment ID
   * @param {string} paymentData.invoiceNumber - Invoice number
   * @returns {Promise}
   */
  createPaymentUrl: async (paymentData) => {
    try {
      console.log('📤 Creating VNPay payment URL:', paymentData);
      console.log('🔗 API endpoint: /vnpay/create-payment-url');
      
      const requestBody = {
        amount: paymentData.amount,
        orderInfo: paymentData.orderInfo || `Thanh toan hoa don ${paymentData.invoiceNumber}`,
        paymentId: paymentData.paymentId,
        invoiceNumber: paymentData.invoiceNumber
      };
      
      console.log('📦 Request body:', requestBody);
      
      const response = await api.post('/vnpay/create-payment-url', requestBody);
      
      console.log('✅ VNPay response:', response);
      
      // Handle different response formats
      if (response.success === true || response.paymentUrl) {
        return {
          success: true,
          data: response.paymentUrl ? { paymentUrl: response.paymentUrl } : response
        };
      } else {
        return {
          success: false,
          error: response.message || 'Không nhận được payment URL từ server'
        };
      }
    } catch (error) {
      console.error('❌ Error creating VNPay payment URL:', error);
      
      let errorMessage = 'Không thể tạo liên kết thanh toán VNPay';
      
      if (error.response) {
        // Server returned an error response
        console.error('🔴 Server error response:', error.response.data);
        console.error('🔴 Status code:', error.response.status);
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        console.error('🔴 No response from server');
        console.error('🔴 Request:', error.request);
        errorMessage = 'Server không phản hồi. Vui lòng kiểm tra: ' +
          '1. Backend server có đang chạy? ' +
          '2. URL API có đúng không? (hiện tại: ' + (api.defaults?.baseURL || 'N/A') + ') ' +
          '3. Endpoint /vnpay/create-payment-url có tồn tại?';
      } else {
        // Something else happened
        console.error('🔴 Request setup error:', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  /**
   * Handle VNPay IPN (Instant Payment Notification)
   * @param {Object} queryParams - Query parameters from VNPay callback
   * @returns {Promise}
   */
  handleIPN: async (queryParams) => {
    try {
      console.log('📥 Processing VNPay IPN:', queryParams);
      const response = await api.get('/vnpay/ipn', { params: queryParams });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error processing VNPay IPN:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Lỗi xử lý thông báo thanh toán'
      };
    }
  },

  /**
   * Handle VNPay return (when user returns from VNPay)
   * @param {Object} queryParams - Query parameters from VNPay redirect
   * @returns {Promise}
   */
  handleReturn: async (queryParams) => {
    try {
      console.log('📥 Processing VNPay return:', queryParams);
      const response = await api.get('/vnpay/return', { params: queryParams });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error processing VNPay return:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Lỗi xử lý kết quả thanh toán'
      };
    }
  },

  /**
   * Query transaction status from VNPay
   * @param {string} transactionNo - VNPay transaction number
   * @param {string} transactionDate - Transaction date (yyyyMMddHHmmss)
   * @returns {Promise}
   */
  queryTransaction: async (transactionNo, transactionDate) => {
    try {
      console.log('🔍 Querying VNPay transaction:', transactionNo);
      const response = await api.post('/vnpay/query-transaction', {
        transactionNo,
        transactionDate
      });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error querying VNPay transaction:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể truy vấn giao dịch'
      };
    }
  },

  /**
   * Refund a VNPay transaction
   * @param {Object} refundData - Refund information
   * @returns {Promise}
   */
  refundTransaction: async (refundData) => {
    try {
      console.log('💸 Processing VNPay refund:', refundData);
      const response = await api.post('/vnpay/refund', refundData);
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('❌ Error processing VNPay refund:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể hoàn tiền'
      };
    }
  }
};

export default vnpayService;
