import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBattery, FiCalendar, FiInfo, FiTruck, FiShield, FiAlertCircle, FiCheckCircle, FiClock, FiTool } from 'react-icons/fi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatDate } from '../utils/format';
import MultiStepBooking from '../components/booking/MultiStepBooking';
import vehicleService from '../services/vehicleService';

const MyVehicles = () => {
  const navigate = useNavigate();

  // Trạng thái mở/đóng modal đặt lịch
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  // Xe được chọn để đặt lịch (nếu muốn dùng)
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const data = await vehicleService.getMyVehicles();
        setVehicles(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching vehicles:', err);
        setError('Không thể tải danh sách xe. Vui lòng thử lại sau.');
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Hàm mở modal đặt lịch và chọn xe đó
  const openBookingModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setIsBookingOpen(true);
  };

  // Hàm đóng modal đặt lịch
  const closeBookingModal = () => {
    setSelectedVehicle(null);
    setIsBookingOpen(false);
  };

  // Kiểm tra trạng thái bảo hành
  const isWarrantyActive = (vehicle) => {
    if (!vehicle.warrantyEndDate) return false;
    const today = new Date();
    
    // Parse dd-MM-yyyy format from backend
    let endDate;
    const dateStr = vehicle.warrantyEndDate;
    if (dateStr.includes('-') && dateStr.split('-')[0].length === 2) {
      const [day, month, year] = dateStr.split('-');
      endDate = new Date(`${year}-${month}-${day}`);
    } else {
      endDate = new Date(dateStr);
    }
    
    return endDate >= today;
  };

  // Lấy thông tin trạng thái xe
  const getStatusInfo = (status) => {
    const statusMap = {
      AVAILABLE: {
        label: 'Sẵn sàng',
        icon: FiCheckCircle,
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-200'
      },
      BOOKED: {
        label: 'Đã đặt lịch',
        icon: FiClock,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200'
      },
      IN_SERVICE: {
        label: 'Đang bảo dưỡng',
        icon: FiTool,
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-200'
      },
      COMPLETED: {
        label: 'Hoàn thành',
        icon: FiCheckCircle,
        bgColor: 'bg-gray-100',
        textColor: 'text-gray-700',
        borderColor: 'border-gray-200'
      }
    };
    return statusMap[status] || statusMap.AVAILABLE;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-3">
        Xe Của Tôi
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      ) : error ? (
        <Card className="text-center py-12 bg-red-50">
          <FiAlertCircle className="text-5xl text-red-500 mx-auto mb-4" />
          <p className="text-red-700 text-lg">{error}</p>
        </Card>
      ) : !vehicles || vehicles.length === 0 ? (
        <Card className="text-center py-20">
          <FiTruck className="text-7xl text-gray-300 mx-auto mb-6" />
          <p className="text-gray-500 text-lg mb-6">Bạn chưa có xe nào trong danh sách</p>
        </Card>
      ) : (
        <div className="space-y-8">
          {vehicles.map(vehicle => (
            <Card
              key={vehicle.id}
              className="flex flex-col md:flex-row items-center md:items-stretch md:gap-8 shadow-md rounded-xl overflow-hidden border border-gray-100"
            >
              <div className="md:w-48 w-full h-32 md:h-40 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                <img
                  src={vehicle.image}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="object-contain h-24 w-24"
                />
              </div>
              <div className="flex-1 px-0 md:px-3 py-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">VinFast {vehicle.model}</h3>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {vehicle.warrantyEndDate && isWarrantyActive(vehicle) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      <FiShield className="w-3 h-3" />
                      Bảo hành
                    </span>
                  )}
                  {vehicle.warrantyEndDate && !isWarrantyActive(vehicle) && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      <FiAlertCircle className="w-3 h-3" />
                      Hết bảo hành
                    </span>
                  )}
                  {vehicle.maintenanceStatus && (() => {
                    const statusInfo = getStatusInfo(vehicle.maintenanceStatus);
                    const StatusIcon = statusInfo.icon;
                    return (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 ${statusInfo.bgColor} ${statusInfo.textColor} text-xs font-semibold rounded-full border ${statusInfo.borderColor}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {statusInfo.label}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-gray-600 mb-1">
                  {vehicle.purchaseDate && `Mua ngày: ${formatDate(vehicle.purchaseDate)}`}
                  {vehicle.warrantyEndDate && ` • Bảo hành đến: ${formatDate(vehicle.warrantyEndDate)}`}
                </p>
                <div className="font-mono text-teal-700 text-lg mb-2">{vehicle.licensePlate}</div>
                {vehicle.vin && (
                  <div className="text-xs text-gray-500">VIN: {vehicle.vin}</div>
                )}
              </div>
              
              <div className="flex flex-row md:flex-col gap-3 md:pr-6 md:justify-center items-center md:items-end py-4">
                {vehicle.maintenanceStatus && (vehicle.maintenanceStatus === 'BOOKED' || vehicle.maintenanceStatus === 'IN_SERVICE') ? (
                  <div className="text-center">
                    <Button
                      variant="primary"
                      size="sm"
                      disabled
                      className="min-w-[140px] font-semibold opacity-50 cursor-not-allowed"
                    >
                      Đặt lịch bảo dưỡng
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
                      {vehicle.maintenanceStatus === 'BOOKED' ? 'Xe đã có lịch hẹn' : 'Xe đang bảo dưỡng'}
                    </p>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openBookingModal(vehicle)} // Mở modal đặt lịch cho xe này
                    className="min-w-[140px] font-semibold"
                  >
                    Đặt lịch bảo dưỡng
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/app/vehicle-history")} // đến trang lịch sử bảo dưỡng
                >
                  Lịch sử bảo dưỡng
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal đặt lịch */}
      <MultiStepBooking
        isOpen={isBookingOpen}
        onClose={closeBookingModal}
        vehicle={selectedVehicle} // Có thể truyền xe được chọn nếu cần
      />
    </div>
  );
};

export default MyVehicles;
