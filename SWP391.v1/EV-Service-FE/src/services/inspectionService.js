import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('ev_auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// Lay chi tiet cac muc kiem tra cho don tiep nhan
export const getInspectionDetailsForReception = async (receptionId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/inspection-records/reception/${receptionId}/details`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching inspection details:', error);
    throw error;
  }
};

//  Cap nhat trang thai muc kiem tra
export const updateInspectionRecordStatus = async (recordId, status) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/inspection-records/${recordId}/status`,
      null,
      {
        params: { status },
        headers: getAuthHeader()
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating inspection record:', error);
    throw error;
  }
};
// Lay cac muc kiem tra theo don tiep nhan
export const getInspectionRecordsByReception = async (receptionId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/inspection-records/reception/${receptionId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching inspection records:', error);
    throw error;
  }
};
// Cap nhat nhieu muc kiem tra
export const batchUpdateInspectionRecords = async (updates) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/inspection-records/batch-update`,
      { updates },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error batch updating inspection records:', error);
    throw error;
  }
};
