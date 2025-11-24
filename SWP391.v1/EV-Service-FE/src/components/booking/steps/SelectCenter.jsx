import React, { useState, useEffect } from 'react';
import { FiMapPin, FiPhone, FiClock, FiNavigation, FiAlertCircle } from 'react-icons/fi';
import { calculateDistance } from '../../../data/serviceCenters';
import serviceCenterService from '../../../services/serviceCenterService';
import toast from 'react-hot-toast';

const SelectCenter = ({ data, onNext }) => {
  const [centers, setCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(data.center);
  const [userLocation, setUserLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [error, setError] = useState(null);

  // fetch trung tam` khi component load
  useEffect(() => {
    fetchServiceCenters();
    //  lay vi tri nguoi dung
    getUserLocation();
  }, []);

  // Tính khoảng cách khi có cả vị trí người dùng và danh sách trung tâm
  useEffect(() => {
    if (userLocation && centers.length > 0) {
      // kiểm tra nếu chưa có khoảng cách thì tính
      const hasDistances = centers.some(c => c.distance !== null && c.distance !== undefined);
      if (!hasDistances) {
        console.log('📍 Triggering distance calculation...');
        calculateAndSortByDistance();
      }
    }
  }, [userLocation, centers.length]);

  //  lay vi tri nguoi dung
  const getUserLocation = () => {
    if (navigator.geolocation) {
      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('📍 User location:', latitude, longitude);
          setUserLocation({ lat: latitude, lng: longitude });
          setLoadingLocation(false);
        },
        (error) => {
          console.error('❌ Error getting location:', error);
          setLoadingLocation(false);
          // Hiển thị thông báo cho người dùng
          if (error.code === error.PERMISSION_DENIED) {
            toast.error('Vui lòng cho phép truy cập vị trí để xem khoảng cách đến các trung tâm');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    }
  };

  // Calculate distance and sort centers
  const calculateAndSortByDistance = () => {
    if (!userLocation) return;

    setCenters(prevCenters => {
      if (prevCenters.length === 0) return prevCenters;
      
      console.log('🔍 Calculating distances for', prevCenters.length, 'centers');
      
      const centersWithDistance = prevCenters.map(center => {
        // Use coordinates from backend
        if (center.latitude && center.longitude) {
          const distance = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            center.latitude,
            center.longitude
          );
          console.log(`📏 ${center.name}: ${distance} km`);
          return {
            ...center,
            distance: distance.toFixed(1)
          };
        } else {
          console.warn(`⚠️ ${center.name} không có tọa độ`);
          return {
            ...center,
            distance: null
          };
        }
      }).sort((a, b) => {
        // S ắp xếp khoảng cách, null ở cuối
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return parseFloat(a.distance) - parseFloat(b.distance);
      });
      
      return centersWithDistance;
    });
  };
  // fetch danh sach trung tam` tu backend
  async function fetchServiceCenters() {
    try {
      setLoadingCenters(true);
      setError(null);
      
      const response = await serviceCenterService.getAllCenters();
      
      if (response.success) {
        console.log('✅ Fetched', response.data.length, 'service centers');
        
        // Chuyển đổi dữ liệu backend để phù hợp với cấu trúc component
        const transformedCenters = response.data.map(center => {
          console.log(`🏢 ${center.centerName}: lat=${center.latitude}, lng=${center.longitude}`);
          return {
            id: center.id, // Backend trả về id luôn
            name: center.centerName,
            address: center.centerAddress, // Backend trả về centerAddress
            phone: center.centerPhone,
            openTime: center.startTime || '07:30',
            closeTime: center.endTime || '18:30',
            workingDays: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7'], // Default
            rating: 4.7, // Mock rating
            technicians: 6, // Mock
            services: ['maintenance', 'repair', 'parts'], // Mock
            maxCapacity: center.maxCapacity || 10,
            latitude: center.latitude,
            longitude: center.longitude,
            distance: null // Sẽ được tính nếu có vị trí người dùng
          };
        });
        
        setCenters(transformedCenters);
        // Tính khoảng cách sẽ được xử lý bởi useEffect
      } else {
        setError(response.error);
        toast.error(response.error || 'Không thể tải danh sách trung tâm');
      }
    } catch (err) {
      console.error('Fetch centers error:', err);
      setError('Không thể kết nối đến server');
      toast.error('Không thể tải danh sách trung tâm');
    } finally {
      setLoadingCenters(false);
    }
  }
  // xử lý chọn trung tâm
  const handleSelectCenter = (center) => {
    setSelectedCenter(center);
  };

  // Tự động lưu khi chọn thay đổi
  useEffect(() => {
    if (selectedCenter) {
      onNext({ center: selectedCenter });
    }
  }, [selectedCenter, onNext]);
  // kiem tra trung tam co lam viec hom nay khong
  const isToday = (days) => {
    const today = new Date().getDay();
    const dayMap = { 'CN': 0, 'T2': 1, 'T3': 2, 'T4': 3, 'T5': 4, 'T6': 5, 'T7': 6 };
    const todayName = Object.keys(dayMap).find(key => dayMap[key] === today);
    return days.includes(todayName);
  };
  // lay thong tin xe
  const getVehicleInfo = () => {
    const model = data.vehicleData?.model || '';
    const plate = data.vehicleData?.licensePlate || '';
    if (model && plate) {
      return `VinFast ${model} - ${plate}`;
    } else if (model) {
      return `VinFast ${model}`;
    }
    return 'xe của bạn';
  };
 // giao dien chon trung tam
  return (
    <div className="flex flex-col h-full">
      <p className="text-sm text-gray-600 mb-4">
        Chọn trung tâm dịch vụ gần bạn nhất hoặc thuận tiện nhất
      </p>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-2">Thông tin đặt lịch cho xe {getVehicleInfo()}</p>
        </div>
      </div>

      {loadingLocation && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          <FiNavigation className="inline mr-2 animate-pulse" />
          Đang xác định vị trí của bạn...
        </div>
      )}
      
      {!loadingLocation && !userLocation && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-yellow-800">
              <FiMapPin className="mr-2" />
              <span>Bật định vị để xem khoảng cách đến các trung tâm</span>
            </div>
            <button
              onClick={getUserLocation}
              className="ml-3 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
            >
              Định vị
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 rounded-lg text-sm text-red-700">
          <FiAlertCircle className="inline mr-2" />
          {error}
        </div>
      )}

      <div className="flex-1">
        {loadingCenters ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách trung tâm...</p>
            </div>
          </div>
        ) : centers.length === 0 ? (
          <div className="text-center py-12">
            <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Không tìm thấy trung tâm dịch vụ</p>
            <button 
              onClick={fetchServiceCenters}
              className="mt-4 text-teal-600 hover:text-teal-700"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
            {centers.map((center) => (
              <div
                key={center.id}
                onClick={() => handleSelectCenter(center)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md
                  ${selectedCenter?.id === center.id 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-teal-300'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-semibold text-gray-900">{center.name}</h4>
                      {center.distance && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          {center.distance} km
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <FiMapPin className="mr-2 text-gray-400 flex-shrink-0" />
                        <span>{center.address}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <FiPhone className="mr-2 text-gray-400" />
                        <span>{center.phone}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <FiClock className="mr-2 text-gray-400" />
                        <span>{center.openTime} - {center.closeTime}</span>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectCenter;
