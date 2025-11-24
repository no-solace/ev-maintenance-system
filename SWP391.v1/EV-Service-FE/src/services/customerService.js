import api from './api';


const customerService = {
 // Lay tat ca khach hang
  getAllCustomers: async () => {
    try {
      const response = await api.get('/customers');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch customers'
      };
    }
  },
// Lay lich su bao duong cua khach hang dang dang nhap
  getMyReceptions: async () => {
    try {
      const response = await api.get('/customers/my-receptions');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch maintenance history'
      };
    }
  }
};

export default customerService;
