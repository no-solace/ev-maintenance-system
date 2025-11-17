import api from './api';

export const sparePartService = {
  // Lấy tất cả spare parts
  getAllSpareParts: async () => {
    const response = await api.get('/spare-parts');
    return response;
  },
  
  // Lấy spare parts còn hàng
  getInStockParts: async () => {
    const response = await api.get('/spare-parts/in-stock');
    return response;
  },
  
  // Lấy spare part theo ID
  getSparePartById: async (id) => {
    const response = await api.get(`/spare-parts/${id}`);
    return response;
  },
  
  // Admin: Thêm spare part mới
  createSparePart: async (sparePartData) => {
    const response = await api.post('/spare-parts', sparePartData);
    return response;
  },
  
  // Admin: Cập nhật spare part
  updateSparePart: async (id, sparePartData) => {
    const response = await api.put(`/spare-parts/${id}`, sparePartData);
    return response;
  },
  
  // Admin: Xóa spare part
  deleteSparePart: async (id) => {
    const response = await api.delete(`/spare-parts/${id}`);
    return response;
  },
};
