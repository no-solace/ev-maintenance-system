import React, { useState, useEffect } from 'react';
import { FiClock, FiAlertCircle } from 'react-icons/fi';
import bookingService from '../../../services/bookingService';
import toast from 'react-hot-toast';

const SelectTimeSlot = ({ data, onNext }) => {
  const [selectedTime, setSelectedTime] = useState(data.timeSlot || null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //  fetch data khung gio tu backend
    const fetchTimeSlots = async () => {
      console.log('\u{1F50D} Checking time slot fetch conditions:');
      console.log('  - Center ID:', data.center?.id);
      console.log('  - Date:', data.date);
      console.log('  - Full center:', data.center);
      
      if (!data.center?.id || !data.date) {
        console.warn('\u{26A0}\uFE0F Missing center or date, skipping fetch');
        return;
      }

      try {
        setLoading(true);
        console.log(`\u{1F4E1} Fetching time slots for center ${data.center.id} on ${data.date}`);
        
        // Goi API: GET /bookings/{centerId}/{date}
        const response = await bookingService.getAvailableTimeSlots(
          data.center.id,
          data.date
        );
        
        console.log('\u{1F4E5} Time slots API response:', response);

        if (response.success && response.data) {
          // Chuyen doi du lieu backend ve dinh dang frontend
          // Backend trả về: { date, center, slots: [...] }
          const slots = response.data.slots?.map(slot => {
            //  Chuyen doi thoi gian ve dang "HH:MM"
            let timeStr;
            if (Array.isArray(slot.time)) {
              const [hour, minute] = slot.time;
              timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            } else {
              timeStr = slot.time;
            }
            
            return {
              time: timeStr,
              available: slot.available
            };
          }) || [];
          console.log('🕒 Available slots:', slots);
          setAvailableSlots(slots);
        } else {
          console.error('\u{274C} API returned error:', response.error);
          toast.error(response.error || 'Không thể tải danh sách khung giờ');
          setAvailableSlots([]);
        }
      } catch (error) {
        console.error('\u{274C} Error fetching time slots:', error);
        console.error('Error details:', error.response || error.message);
        toast.error('Có lỗi xảy ra khi tải khung giờ');
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [data.date, data.center]);

  // Tu dong luu thoi gian chon vao parent
  useEffect(() => {
    if (selectedTime) {
      onNext({ timeSlot: selectedTime });
    }
  }, [selectedTime, onNext]);
 // Tinh toan thoi gian ket thuc dua tren thoi gian bat dau va thoi luong an uoc tinh
  const getEstimatedDuration = () => {
    if (data.service?.id === 'maintenance') {
      return data.servicePackage?.duration || 60;
    } else if (data.service?.id === 'parts') {
      return 30 + (data.parts.length * 15); // 30p mỗi slot
    } else if (data.service?.id === 'repair') {
      return 90; // mặc định total sua 90 phút
    }
    return 60;
  };
  //  dinh dang ngay thang
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return `${days[date.getDay()]}, ${date.toLocaleDateString('vi-VN')}`;
  };
  // Tinh toan thoi gian ket thuc
  const getEndTime = (startTime) => {
    const duration = getEstimatedDuration();
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };
  // Tom tat dich vu
  const getServiceSummary = () => {
    if (data.service?.id === 'maintenance') {
      return `Bảo dưỡng - ${data.servicePackage?.name}`;
    } else if (data.service?.id === 'parts') {
      return `Thay thế ${data.parts.length} phụ tùng`;
    } else if (data.service?.id === 'repair') {
      return 'Sửa chữa';
    }
    return 'Bảo dưỡng định kỳ'; // Default service
  };
 //  lay thong tin xe
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
  // giao dien chon khung gio
  return (
    <div className="flex flex-col h-full">
      <p className="text-sm text-gray-600 mb-4">
        Chọn giờ hẹn phù hợp với bạn
      </p>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-2">Thông tin đặt lịch cho xe {getVehicleInfo()}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-600 flex-shrink-0">Trung tâm:</span>
              <span className="font-medium text-right">{data.center?.name}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-600 flex-shrink-0">Địa chỉ:</span>
              <span className="font-medium text-right line-clamp-1">{data.center?.address}</span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-600 flex-shrink-0">Thời gian:</span>
              <span className="font-medium text-right">{formatDate(data.date)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải khung giờ...</p>
            </div>
          </div>
        ) : availableSlots.length === 0 ? (
          <div className="text-center py-8">
            <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Không có khung giờ nào trong ngày này</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="grid grid-cols-5 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition-all
                      ${!slot.available 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : selectedTime === slot.time
                        ? 'bg-teal-600 text-white shadow-md'
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-teal-400 hover:bg-gray-50'}`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded mr-1"></div>
                Còn chỗ
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-100 rounded mr-1"></div>
                Đã kín
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-teal-600 rounded mr-1"></div>
                Đã chọn
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer Note */}
      {!loading && availableSlots.length > 0 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-2">Lưu ý</p>
            <ul className="space-y-1">
              <li>• Khung giờ có thể thay đổi tùy theo tình hình thực tế</li>
              <li>• Chúng tôi sẽ liên hệ xác nhận trước 1 ngày</li>
              <li>• Nếu cần đổi lịch, vui lòng báo trước 4 giờ</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectTimeSlot;
