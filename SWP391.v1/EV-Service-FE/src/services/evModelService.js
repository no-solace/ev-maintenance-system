import api from './api';

/**
 * EV Model Service
 * Handles EV model related API calls
 */

const evModelService = {
  /**
   * Get all EV models
   * @returns {Promise}
   */
  getAllModels: async () => {
    try {
      const response = await api.get('/ev-models');
      return response; // Returns array directly
    } catch (error) {
      console.error('Error fetching EV models:', error);
      return [];
    }
  }
};

export default evModelService;
