import api from './api';

export const issueService = {
  // Lấy tất cả issues
  getAllIssues: async () => {
    try {
      const response = await api.get('/issues');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách vấn đề kỹ thuật'
      };
    }
  },
  
  // Lấy issues theo offer type
  getIssuesByOfferType: async (offerTypeId) => {
    try {
      const response = await api.get(`/issues/by-offer-type/${offerTypeId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách vấn đề kỹ thuật'
      };
    }
  },
  
  // Lấy issue theo ID
  getIssueById: async (id) => {
    try {
      const response = await api.get(`/issues/${id}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy thông tin vấn đề kỹ thuật'
      };
    }
  },
};
