import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../constants/config';
import toast from 'react-hot-toast';
//axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
api.interceptors.request.use(
  (config) => {
    // Lay token tu localStorage
    let token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    //  Neu khong co token trong localStorage, thu lay tu auth state
    if (!token) {
      const authState = localStorage.getItem('ev_auth_state');
      if (authState) {
        try {
          const parsedState = JSON.parse(authState);
          token = parsedState?.state?.token;
        } catch (error) {
          console.error('Failed to parse auth state:', error);
        }
      }
    }
    
    if (token && typeof token === 'string') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
//check token
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;
   // kiem tra loi token 
    if (response) {
      switch (response.status) {
        //token khong hop le
        case 401:
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          window.location.href = '/login';
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          break;
          
        case 403:
          toast.error('Bạn không có quyền thực hiện hành động này.');
          break;
          
        case 404:
          toast.error('Không tìm thấy dữ liệu.');
          break;
          // loi tiep nhan du lieu
        case 422:          
          const validationErrors = response.data.errors;
          if (validationErrors) {
            Object.keys(validationErrors).forEach((key) => {
              toast.error(validationErrors[key][0]);
            });
          }
          break;
          // khong co tin hieu
        case 500:
          toast.error('Lỗi server. Vui lòng thử lại sau.');
          break;
          
        default:
          toast.error(response.data.message || 'Đã có lỗi xảy ra.');
      }
      //khong co phan hoi
    } else if (error.request) {
      toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
    } else { // loi khac 
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
    
    return Promise.reject(error);
  }
);

export default api;