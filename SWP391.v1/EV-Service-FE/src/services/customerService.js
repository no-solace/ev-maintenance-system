import api from './api';

/**
 * Customer Service
 * Handles all customer related API calls
 */

const customerService = {
  /**
   * Get all customers
   * @returns {Promise} - List of customers with role CUSTOMER
   */
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
  }
};

export default customerService;
