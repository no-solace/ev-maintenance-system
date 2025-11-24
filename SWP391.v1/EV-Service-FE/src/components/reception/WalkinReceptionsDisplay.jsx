import React from 'react';
import { FiUsers, FiClock, FiUser, FiTruck } from 'react-icons/fi';

const WalkinReceptionsDisplay = ({ receptions, loading }) => {
  console.log('🚶 WalkinReceptionsDisplay render:', { receptions, loading });
  // hien thi loading khi dang tai du lieu
  if (loading) {
    return (
      <div className="border border-blue-200 rounded-lg mb-4 p-4 bg-white">
        <div className="text-center text-gray-500">
          🔄 Đang tải danh sách xe walk-in...
        </div>
      </div>
    );
  }
 // hien thi messege neu khong co du lieu
  if (!receptions) {
    return (
      <div className="border border-yellow-200 rounded-lg mb-4 p-4 bg-yellow-50">
        <div className="text-center text-yellow-700">
          ⚠️ Chưa có dữ liệu reception. Vui lòng kiểm tra kết nối.
        </div>
      </div>
    );
  }
   // hien thi messege neu khong co xe walk-in
  if (!receptions.length || receptions.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg mb-4 p-4 bg-gray-50">
        <div className="text-center text-gray-500">
          ✅ Không có xe walk-in đang chờ
        </div>
      </div>
    );
  }
 // tra ve giao dien danh sach xe walk-in
  return (
    <div className="border border-orange-200 rounded-lg mb-4 p-4 bg-orange-50">
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <FiUsers className="text-orange-600" />
          Xe Walk-in đang chờ (FIFO - First In First Out)
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Tổng: {receptions.length} xe chưa có booking • Phục vụ theo thứ tự đến trước
        </p>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {receptions.map((reception, index) => (
          <div 
            key={reception.receptionId} 
            className="bg-white p-3 rounded-lg border border-orange-200 hover:border-orange-400 transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Queue Number */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-700 font-bold text-sm">
                    #{index + 1}
                  </span>
                </div>
              </div>

              {/* Reception Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    <FiUser className="text-gray-400 text-sm flex-shrink-0" />
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {reception.customerName}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    reception.status === 'RECEIVED' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {reception.status === 'RECEIVED' ? 'Vừa tiếp nhận' : 'Đang xử lý'}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <FiTruck className="text-xs" />
                  <span className="truncate">
                    {reception.vehicleModel} • {reception.licensePlate}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FiClock className="text-xs" />
                  <span>
                    Đến lúc: {new Date(reception.createdAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {reception.assignedTechnician && (
                  <div className="mt-1 text-xs text-green-600">
                    ✓ KTV: {reception.assignedTechnician}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WalkinReceptionsDisplay;
