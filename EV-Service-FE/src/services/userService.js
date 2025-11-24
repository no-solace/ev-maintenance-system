import api from './api';

export const userService = {
  //  Lay tat ca nguoi dung
  getAllUsers: async () => {
    try {
      //  enintport 
      const [customersResult, employeesResult] = await Promise.all([
        api.get('/customers'),
        api.get('/employees')
      ]);
      
      const allUsers = [...customersResult, ...employeesResult];
      return {
        success: true,
        data: allUsers
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tải danh sách người dùng'
      };
    }
  },

  // lay thong tin nguoi dung theo id
  getUserById: async (userId) => {
    try {
      //  fetching  customer first
      try {
        const response = await api.get(`/customers/${userId}`);
        return {
          success: true,
          data: response
        };
      } catch {
        const response = await api.get(`/employees/${userId}`);
        return {
          success: true,
          data: response
        };
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tải thông tin người dùng'
      };
    }
  },

  // Tao nguoi dung moi - Luu y: Endpoint nay co the khong ton tai trong backend
  createUser: async (userData) => {
    try {
      // Endpoint nay can duoc thuc hien trong backend
      const response = await api.post('/users', userData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tạo người dùng'
      };
    }
  },

  //  cap nhat thong tin nguoi dung 
  updateUser: async (userId, userData) => {
    try {
      // Endpoint nay can duoc thuc hien trong backend
      const response = await api.put(`/users/${userId}`, userData);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể cập nhật người dùng'
      };
    }
  },

  // Xóa người dùng - Lưu ý: Endpoint này có thể không tồn tại trong backend
  deleteUser: async (userId) => {
    try {
      // Endpoint này cần được thực hiện trong backend
      await api.delete(`/users/${userId}`);
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể xóa người dùng'
      };
    }
  },

  // Lay tat ca khach hang  
  getAllCustomers: async () => {
    try {
      const data = await api.get('/customers', {
        params: { _t: Date.now() } // cacher 
      });
      return {
        success: true,
        data: data // api san sang 
      };
    } catch (error) {
      console.error('Error fetching customers:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tải danh sách khách hàng'
      };
    }
  },

  // Lay tat ca nhan vien
  getAllEmployees: async () => {
    try {
      const data = await api.get('/employees');
      return {
        success: true,
        data: data // api san sang 
      };
    } catch (error) {
      console.error('Error fetching employees:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tải danh sách nhân viên'
      };
    }
  },

  //  tim kiem nguoi dung
  searchUsers: async (query) => {
    try {
      // tim kiem ca khach hang va nhan vien
      const [customers, employees] = await Promise.all([
        api.get('/customers'),
        api.get('/employees')
      ]);
      
      const allUsers = [...customers, ...employees];
      const searchLower = query.toLowerCase();
      const filtered = allUsers.filter(user => 
        user.fullName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.includes(query)
      );
      
      return {
        success: true,
        data: filtered
      };
    } catch (error) {
      console.error('Error searching users:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Không thể tìm kiếm người dùng'
      };
    }
  }
};

export default userService;
