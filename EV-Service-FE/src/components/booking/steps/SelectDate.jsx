import React, { useState, useRef } from "react";
import { FiCalendar, FiAlertCircle } from "react-icons/fi";

const SelectDate = ({ data, onNext }) => {
  // gioi han chon ngay
  const today = new Date();
  today.setHours(0, 0, 0, 0); //  dat gio ve 0h00
  
  const minDate = new Date(today); // cho phep chon tu hom nay
  
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 7); // 7 ngay toi

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Dat ngay mac dinh la hom nay neu chua co
  const [selectedDate, setSelectedDate] = useState(data.date || formatDate(today));
  const dateInputRef = useRef(null);

  // Tu dong luu ngay vao parent khi thay doi
  React.useEffect(() => {
    if (selectedDate) {
      onNext({ date: selectedDate });
    }
  }, [selectedDate, onNext]);

  const getDayOfWeek = (dateString) => {
    const days = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const date = new Date(dateString);
    return days[date.getDay()];
  };
  // dinh dang ngay dai
  const formatLongDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `ngày ${day} tháng ${month} năm ${year}`;
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
  // giao dien chon ngay
  return (
    <div className="flex flex-col h-full">
      <p className="text-sm text-gray-600 mb-4">
        Chọn ngày bạn muốn mang xe đến {data.center?.name}
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
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày hẹn <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            {/* Hidden native date input */}
            <input
              ref={dateInputRef}
              type="date"
              className="sr-only"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={formatDate(minDate)}
              max={formatDate(maxDate)}
              tabIndex={-1}
            />
            {/* Custom clickable display */}
            <button
              type="button"
              onClick={() => dateInputRef.current?.showPicker()}
              className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg bg-white hover:border-teal-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 transition-colors text-left"
            >
              <span className={`text-base font-medium ${selectedDate ? 'text-gray-900' : 'text-gray-400'}`}>
                {selectedDate 
                  ? `${getDayOfWeek(selectedDate)}, ${formatLongDate(selectedDate)}`
                  : 'Chọn ngày hẹn...'}
              </span>
            </button>
            <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-600 w-5 h-5 pointer-events-none" />
          </div>
        </div>

        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-2">Lưu ý</p>
            <ul className="space-y-1">
              <li>• Có thể đặt lịch từ hôm nay đến 7 ngày tới</li>
              <li>• Đặt lịch hôm nay vui lòng chọn giờ còn trống</li>
              <li>• Nếu cần hỗ trợ, vui lòng gọi hotline: {data.center?.phone}</li>
            </ul>
          </div>
        </div>
      </div>


    </div>
  );
};

export default SelectDate;
