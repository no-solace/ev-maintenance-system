import React, { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiDownload,
  FiCreditCard,
  FiX,
} from "react-icons/fi";
import { vinfastModels } from "../../data/serviceCenters";
import Button from "../ui/Button";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import bookingService from "../../services/bookingService";
 // giao dien modal dat lich thanh cong
const BookingSuccessModal = ({ isOpen, onClose, data, paymentCompleted = false }) => {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  
  // Kiểm tra nếu quay lại từ trang thanh toán thành công
  const urlParams = new URLSearchParams(window.location.search);
  const isPaymentSuccess = paymentCompleted || urlParams.get('paymentSuccess') === 'true';

  useEffect(() => {
    if (isOpen) {
      console.log('🎊 BookingSuccessModal opened');
      //  Hiệu ứng confetti khi mở modal
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen]);
  // lay ten xe tu id
  const getVehicleName = () => {
    const vehicle = vinfastModels.find((v) => v.id === data.vehicle);
    return vehicle?.name || "";
  };
  // lay tom tat dich vu
  const getServiceSummary = () => {
    if (data.service?.id === "maintenance") {
      return `${data.service.name} - ${data.servicePackage?.name}`;
    } else if (data.service?.id === "parts") {
      return `${data.service.name} (${data.parts.length} phụ tùng)`;
    } else if (data.service?.id === "repair") {
      return data.service.name;
    }
    return "";
  };
  // định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    return `${days[date.getDay()]}, ${date.toLocaleDateString("vi-VN")}`;
  };

  // xu ly thanh toan
  const handlePayment = async () => {
    if (!data.bookingId) {
      toast.error("Không tìm thấy mã đặt lịch");
      return;
    }
   // tao thanh toan dat coc
    try {
      setIsPaymentLoading(true);
      console.log("💳 Creating deposit payment for booking:", data.bookingId);
      const paymentResponse = await bookingService.createDepositPayment(
        data.bookingId
      );

      if (paymentResponse.success && paymentResponse.paymentUrl) {
        toast.success("Đang chuyển đến trang thanh toán...");
        // Lưu booking hiện tại để hiển thị sau khi thanh toán
        try {
          sessionStorage.setItem('pendingBooking', JSON.stringify(data));
        } catch (e) {
          console.warn('Could not store pending booking in sessionStorage', e);
        }
        // Chuyển hướng đến VNPay
        window.location.href = paymentResponse.paymentUrl;
      } else {
        toast.error(paymentResponse.error || "Không thể tạo thanh toán");
        setIsPaymentLoading(false);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Có lỗi xảy ra khi tạo thanh toán");
      setIsPaymentLoading(false);
    }
  };
  // xem lich dat lich
  const handleViewBookings = () => {
    window.location.href = "/app/my-bookings";
  };

  if (!isOpen) return null;
  // giao dien modal dat lich thanh cong
  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl transition-all">
          {/* Header */}
          <div
            className="px-8 py-6 rounded-t-2xl border-b relative"
            style={{ backgroundColor: '#027C9D', borderColor: '#027C9D' }}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-lg hover:bg-[#80D3EF] focus:outline-none transition"
              aria-label="Đóng modal"
            >
              <FiX className="w-6 h-6" style={{ color: '#f0f9ff' }} />
            </button>
            <h2 className="text-2xl font-bold text-white text-center">
              Đã tạo lịch hẹn thành công
            </h2>
          </div>

          {/* Content */}
          <div
            className="p-8"
            style={{ 
              backgroundColor: '#e7faff',
              maxHeight: '70vh',
              overflowY: 'auto'
            }}
          >
            {/* Booking Details */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-3">
                  Chi tiết lịch hẹn cho xe VinFast {data.vehicleData?.model || getVehicleName()}
                  {data.vehicleData?.licensePlate && ` - ${data.vehicleData.licensePlate}`}
                </p>
                
                <div className="space-y-2">
                  {/* Customer Information */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-600 flex-shrink-0">Họ tên:</span>
                    <span className="font-medium text-right">{data.customerInfo.name}</span>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-600 flex-shrink-0">Số điện thoại:</span>
                    <span className="font-medium text-right">{data.customerInfo.phone}</span>
                  </div>
                  
                  {/* Service Information */}
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
                    <span className="font-medium text-right">{formatDate(data.date)}, {data.timeSlot}</span>
                  </div>
                  
                  {data.vehicleData?.vin && (
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-600 flex-shrink-0">VIN:</span>
                      <span className="font-medium text-right">{data.vehicleData.vin}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Process Timeline */}
            <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg">
              <h4 className="font-semibold text-base text-gray-900 mb-4 text-center">Quy trình tiếp theo</h4>
              <div className="flex justify-between items-start">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mb-2">
                    ✓
                  </div>
                  <span className="text-sm text-gray-600 text-center">Đã gửi</span>
                </div>

                <div className="flex-1 h-0.5 bg-gray-300 mx-2" style={{ marginTop: '20px' }}></div>

                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 text-white rounded-full flex items-center justify-center mb-2 ${
                    isPaymentSuccess ? 'bg-green-600' : 'bg-yellow-500 animate-pulse'
                  }`}>
                    {isPaymentSuccess ? '✓' : '2'}
                  </div>
                  <span className="text-sm text-gray-600 text-center">Chờ thanh toán</span>
                </div>

                <div className="flex-1 h-0.5 bg-gray-300 mx-2" style={{ marginTop: '20px' }}></div>

                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 text-white rounded-full flex items-center justify-center mb-2 ${
                    isPaymentSuccess ? 'bg-green-600' : 'bg-gray-300'
                  }`}>
                    {isPaymentSuccess ? '✓' : '3'}
                  </div>
                  <span className="text-sm text-gray-600 text-center">Hoàn thành</span>
                </div>
              </div>
            </div>

            {/* Warning/Success notice */}
            {!isPaymentSuccess ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 text-center">
                  <strong>⚠️ Lưu ý:</strong> Vui lòng thanh toán đặt cọc để xác nhận lịch hẹn và tải biên nhận.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-left">
                  <p className="text-sm text-green-800 font-medium mb-1">
                    Thanh toán thành công!
                  </p>
                  <p className="text-sm text-green-700">
                    Biên nhận đã được gửi đến email: <strong>{data.customerInfo.email || 'của bạn'}</strong>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    (Vui lòng kiểm tra hòm thư đến hoặc thư mục spam)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-[#027C9D] bg-[#80d3ef] rounded-b-2xl">
            <div className="flex justify-center gap-3">
              {!isPaymentSuccess ? (
                <>
                  <Button
                    onClick={handlePayment}
                    disabled={isPaymentLoading}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 font-semibold"
                  >
                    {isPaymentLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <FiCreditCard className="mr-2" />
                        Thanh toán ngay
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={handleViewBookings}
                    variant="outline"
                    className="border-white bg-white text-blue-600 hover:bg-blue-50 font-semibold"
                  >
                    Xem lịch hẹn
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleViewBookings}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                >
                  <FiCheckCircle className="mr-2" />
                  Xem lịch hẹn
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
