import api from './api';
export const authService = {
  // dang nhap
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response;
  },
  
  // dang ky
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
  },
  
  // dang xuat
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response;
  },
  
  // lay thong tin nguoi dung hien tai
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response;
  },
  
  // lam moi token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response;
  },
  
  forgotPassword: async (email) => {
    try {
      const response = await api.post('/auth/password/forgot', { email });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },
  
  // Verify OTP for password reset
  verifyOTP: async (email, otpCode) => {
    try {
      const response = await api.post('/auth/password/verify-otp', { email, otpCode });
      return response;
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  },
  
  // Reset password with OTP
  resetPasswordWithOTP: async (email, otpCode, newPassword) => {
    try {
      const response = await api.post('/auth/password/reset', { 
        email, 
        otpCode, 
        newPassword 
      });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
  resetPassword: async (token, newPassword) => {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        password: newPassword,
      });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },
  
  // doi mat khau
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response;
  },
  
  // xac thuc email
  verifyEmail: async (token) => {
    const response = await api.post('/auth/verify-email', { token });
    return response;
  },
  resendVerificationEmail: async () => {
    try {
      const response = await api.post('/auth/resend-verification');
      return response;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  },
  
  // kiem tra token sau khi reset password
  verifyResetToken: async (token) => {
    try {
      const response = await api.get(`/auth/verify-reset-token/${token}`);
      return response;
    } catch (error) {
      console.error('Verify token error:', error);
      throw error;
    }
  },
};