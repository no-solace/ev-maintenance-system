import api from './api';

/**
 * Booking Service
 * Handles all booking related API calls
 */

const bookingService = {
  /**
   * Create a new booking
   * @param {Object} bookingData - { eVId, centerId, bookingDate, bookingTime, customerName, customerPhone, customerEmail, customerAddress, offerTypeId, packageId, problemDescription, notes }
   * @returns {Promise} - BookingResponseDTO
   */
  createBooking: async (bookingData) => {
    try {
      const payload = {
        eVId: bookingData.eVId || bookingData.vehicleId,
        centerId: bookingData.centerId,
        bookingDate: bookingData.bookingDate || bookingData.date,
        bookingTime: bookingData.bookingTime || bookingData.time,
        customerName: bookingData.customerName || null,
        customerPhone: bookingData.customerPhone || null,
        customerEmail: bookingData.customerEmail || null,
        customerAddress: bookingData.customerAddress || null,
        offerTypeId: bookingData.offerTypeId || null,
        packageId: bookingData.packageId || null,
        problemDescription: bookingData.problemDescription || null,
        notes: bookingData.notes || null
      };
      
      console.log('📤 Sending booking payload to backend:', payload);
      const response = await api.post('/bookings', payload);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tạo booking'
      };
    }
  },

  /**
   * Get available time slots for a specific center and date
   * @param {number} centerId - Service center ID
   * @param {string} date - Date in format YYYY-MM-DD
   * @returns {Promise} - TimeSlotResponseDTO
   */
  getAvailableTimeSlots: async (centerId, date) => {
    try {
      const response = await api.get(`/bookings/${centerId}/${date}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách time slots'
      };
    }
  },

  /**
   * Get all offer types (service types)
   * @returns {Promise} - List<OfferTypeDTO>
   */
  getOfferTypes: async () => {
    try {
      const response = await api.get('/offer-types');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách dịch vụ'
      };
    }
  },

  /**
   * Get all bookings (for technician, staff, admin)
   * @returns {Promise} - List of all bookings
   */
  getAllBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách booking'
      };
    }
  },

  /**
   * Get customer's bookings
   * @param {string} status - 'upcoming', 'completed', 'cancelled', or 'all'
   * @returns {Promise} - List of bookings
   */
  getMyBookings: async (status = 'all') => {
    try {
      const endpoint = status === 'all' 
        ? '/bookings/customer/my' 
        : `/bookings/customer/my?status=${status}`;
      
      const response = await api.get(endpoint);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách booking'
      };
    }
  },

  /**
   * Get booking details by ID
   * @param {number} bookingId - Booking ID
   * @returns {Promise} - Booking details
   */
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy thông tin booking'
      };
    }
  },

  /**
   * Request cancellation (customer only, for paid bookings)
   * @param {number} bookingId - Booking ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise}
   */
  requestCancellation: async (bookingId, reason) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/request-cancel`, reason || '');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể gửi yêu cầu hủy'
      };
    }
  },

  /**
   * Approve cancellation (staff only)
   * @param {number} bookingId - Booking ID
   * @returns {Promise}
   */
  approveCancellation: async (bookingId) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/approve-cancel`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể chấp thuận hủy'
      };
    }
  },

  /**
   * Reject cancellation (staff only)
   * @param {number} bookingId - Booking ID
   * @param {string} reason - Rejection reason
   * @returns {Promise}
   */
  rejectCancellation: async (bookingId, reason) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/reject-cancel`, reason || '');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể từ chối hủy'
      };
    }
  },

  /**
   * Cancel a booking directly (for unpaid bookings or staff override)
   * @param {number} bookingId - Booking ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise}
   */
  cancelBooking: async (bookingId, reason) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`, reason || '');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể hủy booking'
      };
    }
  },

  /**
   * Reschedule a booking
   * @param {number} bookingId - Booking ID
   * @param {Object} newSchedule - { bookingDate, bookingTime }
   * @returns {Promise}
   */
  rescheduleBooking: async (bookingId, newSchedule) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/reschedule`, newSchedule);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể đổi lịch booking'
      };
    }
  },

  // ======================
  // STAFF WORKFLOW METHODS
  // ======================
  
  /**
   * Get bookings by status
   * @param {string} status - PENDING, APPROVED, ASSIGNED, IN_PROGRESS, COMPLETED, REJECTED, CANCELLED
   * @returns {Promise}
   */
  getBookingsByStatus: async (status) => {
    try {
      const response = await api.get(`/bookings/status/${status}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách booking'
      };
    }
  },


  /**
   * Staff assign technician to booking
   * @param {number} bookingId
   * @param {number} technicianId
   * @returns {Promise}
   */
  assignTechnician: async (bookingId, technicianId) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/assign?technicianId=${technicianId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể phân công technician'
      };
    }
  },

  /**
   * Get technician's assigned vehicle receptions (workload)
   * @param {number} technicianId
   * @returns {Promise}
   */
  getTechnicianBookings: async (technicianId) => {
    try {
      // Use vehicle-receptions endpoint instead of bookings
      const response = await api.get(`/vehicle-receptions/technician/${technicianId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách công việc'
      };
    }
  },

  /**
   * Get all technicians (ADMIN ONLY)
   * Staff should use getMyTechnicians() instead
   * @returns {Promise}
   */
  getTechnicians: async () => {
    try {
      const response = await api.get('/employees/technicians');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách technician'
      };
    }
  },
  
  /**
   * Get technicians by service center (ADMIN ONLY)
   * Staff should use getMyTechnicians() instead
   * @param {number} centerId - Service center ID
   * @returns {Promise}
   */
  getTechniciansByCenter: async (centerId) => {
    try {
      const response = await api.get(`/employees/technicians/center/${centerId}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách technician'
      };
    }
  },
  
  /**
   * Get technicians from the authenticated staff's service center
   * THIS IS THE METHOD STAFF SHOULD USE
   * @returns {Promise}
   */
  getMyTechnicians: async () => {
    try {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await api.get(`/employees/technicians/my-center?_t=${timestamp}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy danh sách technician'
      };
    }
  },
  
  /**
   * Get booking statistics
   * @returns {Promise} Statistics with counts by status
   */
  getBookingStatistics: async () => {
    try {
      const response = await api.get('/bookings/statistics');
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể lấy thống kê booking'
      };
    }
  },

  /**
   * Create deposit payment for booking
   * @param {number} bookingId - Booking ID
   * @returns {Promise} - Payment URL and deposit info
   */
  createDepositPayment: async (bookingId) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/create-deposit-payment`);
      return {
        success: true,
        paymentUrl: response.paymentUrl,
        depositAmount: response.depositAmount,
        depositPolicy: response.depositPolicy,
        invoiceNumber: response.invoiceNumber
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tạo thanh toán đặt cọc'
      };
    }
  },

  /**
   * Staff receive vehicle at center
   * @param {number} bookingId
   * @param {Object} receptionData - Vehicle reception details
   * @returns {Promise}
   */
  receiveVehicle: async (bookingId, receptionData) => {
    try {
      const response = await api.post(`/bookings/${bookingId}/receive`, receptionData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tiếp nhận xe'
      };
    }
  }
};

export default bookingService;
