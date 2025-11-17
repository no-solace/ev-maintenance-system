import React, { useState } from "react";
import { FiCalendar, FiChevronRight, FiAlertCircle } from "react-icons/fi";
import Button from "../../ui/Button";

const SelectDate = ({ data, onNext, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(data.date || "");

  // gioi han chon ngay
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(minDate.getDate() + 1); // ngay mai
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 7); // 7 ngay toi

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

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

  const isWeekend = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6; // chu nhat hoac thu 7
  };

  const handleNext = () => {
    if (selectedDate) {
      onNext({ date: selectedDate });
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Chọn ngày hẹn
        </h3>
        <p className="text-sm text-gray-600">
          Chọn ngày bạn muốn mang xe đến {data.center?.name}
        </p>
        <div className="mt-4 p-3 bg-teal-50 rounded-lg">
          <div className="flex items-start">
            <FiAlertCircle className="text-teal-600 mt-0.5 mr-2" />
            <div className="text-sm">
              <p className="font-medium text-teal-900">Trung tâm đã chọn:</p>
              <p className="text-teal-700">{data.center?.name}</p>
              <p className="text-teal-600 text-xs mt-1">
                Giờ làm việc: {data.center?.openTime} - {data.center?.closeTime}
                ({data.center?.workingDays.join(", ")})
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ngày hẹn <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={formatDate(minDate)}
              max={formatDate(maxDate)}
            />
            <FiCalendar className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>

          {selectedDate && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Bạn đã chọn:{" "}
                <span className="font-medium text-gray-900">
                  {getDayOfWeek(selectedDate)}, ngày{" "}
                  {formatDisplayDate(selectedDate)}
                </span>
              </p>
              {isWeekend(selectedDate) && (
                <p className="text-sm text-orange-600 mt-1">
                  <FiAlertCircle className="inline mr-1" />
                  Cuối tuần có thể đông hơn, vui lòng đến sớm
                </p>
              )}
            </div>
          )}
        </div>
        <div className="p-4 bg-amber-50 rounded-lg">
          <h4 className="text-sm font-medium text-amber-900 mb-2">Lưu ý:</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Vui lòng đặt lịch trước 1 ngày</li>
            <li>• Có thể đặt lịch tối đa 7 ngày từ hôm nay</li>
            <li>
              • Nếu cần hẹn gấp, vui lòng gọi hotline: {data.center?.phone}
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!selectedDate}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6"
        >
          Tiếp tục
          <FiChevronRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SelectDate;
