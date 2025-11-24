import api from './api';

const adminService = {
  getDashboardStats: async () => {
    try {
      console.log('📊 Fetching admin dashboard stats...');
      // goi api 
      const response = await api.get('/admin/dashboard/stats');
      console.log('📊 API Response:', response);
      
      return {
        success: response.success,
        data: response.data,
        error: response.message
      };
    } catch (error) {
      console.error('❌ Error fetching admin dashboard stats:', error);
      console.error('Error response:', error.response);
      return {
        success: false,
        error: error.response?.message || error.message
      };
    }
  },
  // lay thong ke theo khoang thoi gian
  getAnalyticsByTimeRange: async (timeRange = '6MONTHS') => {
    try {
      console.log('📈 Fetching analytics for time range:', timeRange);
      const response = await api.get(`/admin/analytics/time-range?range=${timeRange}`);
      console.log('📈 Analytics API Response:', response);
      
      return {
        success: response.success,
        data: response.data,
        error: response.message
      };
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      console.error('Error response:', error.response);
      return {
        success: false,
        error: error.response?.message || error.message
      };
    }
  }
};

export default adminService;
