import React from 'react';
import { FiClock, FiCalendar, FiUser, FiPhone } from 'react-icons/fi';
import Card from '../ui/Card';

const BookingSlotsDisplay = ({ bookingSlots, loading }) => {
  // Debug log
  console.log('📦 BookingSlotsDisplay render:', { bookingSlots, loading });
  
  if (loading) {
    return (
      <div className="border border-blue-200 rounded-lg mb-4 p-4 bg-white">
        <div className="text-center text-gray-500">
          🔄 Đang tải thông tin booking...
        </div>
      </div>
    );
  }

  //  messege err neu khong co data
  if (!bookingSlots) {
    return (
      <div className="border border-yellow-200 rounded-lg mb-4 p-4 bg-yellow-50">
        <div className="text-center text-yellow-700">
          ⚠️ Chưa có dữ liệu booking. Vui lòng kiểm tra kết nối.
        </div>
      </div>
    );
  }
  // messege neu khong co slot
  if (!bookingSlots.slots || bookingSlots.slots.length === 0) {
    return (
      <div className="border border-gray-200 rounded-lg mb-4 p-4 bg-gray-50">
        <div className="text-center text-gray-500">
          ℹ️ Không có booking slots nào.
        </div>
      </div>
    );
  }
  // tra ve giao dien danh sach booking slots
  return (
    <div className="border border-blue-200 rounded-lg mb-4 p-4 bg-white">
        <div className="mb-3">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FiCalendar className="text-blue-600" />
            Lịch hẹn hôm nay tại {bookingSlots.centerName}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Tổng: {bookingSlots.totalTodayBookings} booking trong ngày
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {bookingSlots.slots.map((slot, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 ${ 
                slot.isCurrentSlot 
                  ? 'bg-blue-50 border-blue-500' 
                  : 'bg-gray-50 border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FiClock className={slot.isCurrentSlot ? 'text-blue-600' : 'text-gray-600'} />
                  <span className="font-semibold text-sm">
                    {slot.slotTime || '00:00'}
                  </span>
                </div>
                {slot.isCurrentSlot && (
                  <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    Hiện tại
                  </span>
                )}
              </div>

              <div className="mb-2">
                <span className={`text-xs font-medium ${
                  slot.bookingCount === 0 
                    ? 'text-green-600' 
                    : slot.bookingCount <= 2 
                    ? 'text-yellow-600' 
                    : 'text-red-600'
                }`}>
                  {slot.bookingCount === 0 
                    ? '✓ Trống' 
                    : `${slot.bookingCount} booking`
                  }
                </span>
              </div>

              {slot.bookings && slot.bookings.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {slot.bookings.map((booking, idx) => (
                    <div 
                      key={booking.bookingId || idx} 
                      className="bg-white p-2 rounded border border-gray-200"
                    >
                      <div className="flex items-start gap-1.5">
                        <FiUser className="text-gray-400 text-xs mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-gray-800 truncate">
                            {booking.customerName}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FiPhone className="text-xs" />
                            {booking.customerPhone}
                          </p>
                          {booking.vehicleModel && (
                            <p className="text-xs text-blue-600 truncate">
                              {booking.vehicleModel} - {booking.licensePlate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(!slot.bookings || slot.bookings.length === 0) && (
                <p className="text-xs text-gray-400 italic">Chưa có booking</p>
              )}
            </div>
          ))}
        </div>
    </div>
  );
};

export default BookingSlotsDisplay;
