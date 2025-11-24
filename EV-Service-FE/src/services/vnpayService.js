import api from './api';
// dich vu vnpay 
const vnpayService = {
  createPaymentUrl: async (paymentData) => {
    try {
      console.log('📤 Creating VNPay payment URL:', paymentData);
      console.log('🔗 API endpoint: /vnpay/create-payment-url');
      // Chuẩn bị dữ liệu gửi đi
      const requestBody = {
        amount: paymentData.amount,
        orderInfo: paymentData.orderInfo || `Thanh toan hoa don ${paymentData.invoiceNumber}`,
        paymentId: paymentData.paymentId,
        invoiceNumber: paymentData.invoiceNumber
      };
      
      console.log('📦 Request body:', requestBody);
      
      const response = await api.post('/vnpay/create-payment-url', requestBody);
      
      console.log('✅ VNPay response:', response);
      
      // Xử lý các định dạng phản hồi khác nhau
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
        // Server trả về phản hồi lỗi
        console.error('🔴 Server error response:', error.response.data);
        console.error('🔴 Status code:', error.response.status);
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
      } else if (error.request) {
        // Request đã được gửi nhưng không nhận được phản hồi
        console.error('🔴 No response from server');
        console.error('🔴 Request:', error.request);
        errorMessage = 'Server không phản hồi. Vui lòng kiểm tra: ' +
          '1. Backend server có đang chạy? ' +
          '2. URL API có đúng không? (hiện tại: ' + (api.defaults?.baseURL || 'N/A') + ') ' +
          '3. Endpoint /vnpay/create-payment-url có tồn tại?';
      } else {
        // Có lỗi khác xảy ra
        console.error('🔴 Request setup error:', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },
// xu ly ipn tu vnpay
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
// xu ly return tu vnpay
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
// truy van giao dich vnpay
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
// hoan tien vnpay
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
