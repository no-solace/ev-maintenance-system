import React, { useEffect, useState } from "react";
import {
  FiCheckCircle,
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiMail,
  FiDownload,
  FiCreditCard,
  FiUser,
  FiTruck,
  FiClock,
} from "react-icons/fi";
import { vinfastModels } from "../../../data/serviceCenters";
import Button from "../../ui/Button";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import bookingService from "../../../services/bookingService";

const BookingSuccess = ({ data, onNext, paymentCompleted = false }) => {
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  
  // Check if returning from payment success
  const urlParams = new URLSearchParams(window.location.search);
  const isPaymentSuccess = paymentCompleted || urlParams.get('paymentSuccess') === 'true';

  useEffect(() => {
    // hieu ung sau khi dat lich thang cong,add npm canvas
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const getVehicleName = () => {
    const vehicle = vinfastModels.find((v) => v.id === data.vehicle);
    return vehicle?.name || "";
  };

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

  const handleDownloadReceipt = () => {
    // tao thong tin dat lich ra file text
    const receipt = `
BIÊN NHẬN ĐẶT LỊCH DỊCH VỤ VINFAST
=====================================
Mã đặt lịch: ${data.bookingId}
Ngày đặt: ${new Date().toLocaleString("vi-VN")}
Trạng thái: ĐÃ XÁC NHẬN

THÔNG TIN KHÁCH HÀNG
-------------------------------------
Họ tên: ${data.customerInfo.name}
Số điện thoại: ${data.customerInfo.phone}
${data.customerInfo.email ? `Email: ${data.customerInfo.email}` : ''}
${data.customerInfo.address ? `Địa chỉ: ${data.customerInfo.address}` : ''}

THÔNG TIN DỊCH VỤ
-------------------------------------
Trung tâm: ${data.center?.name}
Địa chỉ: ${data.center?.address}
Ngày hẹn: ${formatDate(data.date)}
Giờ hẹn: ${data.timeSlot}
Xe: VinFast ${getVehicleName()}
Dịch vụ: ${getServiceSummary()}
${data.notes ? `Ghi chú: ${data.notes}` : ""}

LƯU Ý
-------------------------------------
- Vui lòng đến đúng giờ đã hẹn
- Mang theo giấy tờ xe
- Liên hệ hotline nếu cần hỗ trợ

Hotline: ${data.center?.phone}
=====================================
    `;

    // tao va tai file text
    const blob = new Blob([receipt], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `VinFast_Booking_${data.bookingId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  const handlePayment = async () => {
    if (!data.bookingId) {
      toast.error("Không tìm thấy mã đặt lịch");
      return;
    }

    try {
      setIsPaymentLoading(true);
      console.log("💳 Creating deposit payment for booking:", data.bookingId);
      const paymentResponse = await bookingService.createDepositPayment(
        data.bookingId
      );

      if (paymentResponse.success && paymentResponse.paymentUrl) {
        toast.success("Đang chuyển đến trang thanh toán...");
        // Redirect to VNPay
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

  const handleViewBookings = () => {
    window.location.href = "/app/my-bookings";
  };

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {isPaymentSuccess ? 'Đặt lịch thành công!' : 'Đặt lịch thành công!'}
      </h3>
      <p className="text-gray-600 mb-2">
        {isPaymentSuccess 
          ? 'Lịch hẹn của bạn đã được xác nhận. Chúng tôi sẽ liên hệ với bạn sớm.'
          : 'Lịch hẹn của bạn đã được tạo. Vui lòng thanh toán đặt cọc trong vòng 15 phút để xác nhận.'}
      </p>
      <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg text-left max-w-2xl mx-auto">
        <h4 className="font-semibold text-gray-900 mb-4">Chi tiết lịch hẹn</h4>

        <div className="space-y-6">
          {/* Service Information */}
          <div>
            <h5 className="text-sm font-semibold text-gray-900 mb-3">Thông tin dịch vụ</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Trung tâm:</span>
                <span className="text-gray-900 text-right font-medium">{data.center?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Địa chỉ:</span>
                <span className="text-gray-900 text-right">{data.center?.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày hẹn:</span>
                <span className="text-gray-900 text-right">{formatDate(data.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Giờ hẹn:</span>
                <span className="text-gray-900 text-right font-medium">{data.timeSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Xe:</span>
                <span className="text-gray-900 text-right">VinFast {getVehicleName()}</span>
              </div>
              {data.vehicleData?.licensePlate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Biển số:</span>
                  <span className="text-gray-900 text-right font-medium">{data.vehicleData.licensePlate}</span>
                </div>
              )}
              {data.vehicleData?.vin && (
                <div className="flex justify-between">
                  <span className="text-gray-600">VIN:</span>
                  <span className="text-gray-900 text-right font-mono text-xs">{data.vehicleData.vin}</span>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="pt-4 border-t">
            <h5 className="text-sm font-semibold text-gray-900 mb-3">Thông tin khách hàng</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Họ tên:</span>
                <span className="text-gray-900 text-right font-medium">{data.customerInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="text-gray-900 text-right">{data.customerInfo.phone}</span>
              </div>
              {data.customerInfo.email && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-900 text-right break-all">{data.customerInfo.email}</span>
                </div>
              )}
              {data.customerInfo.address && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Địa chỉ:</span>
                  <span className="text-gray-900 text-right">{data.customerInfo.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8 p-4 bg-gray-50 rounded-lg max-w-2xl mx-auto">
        <h4 className="font-medium text-gray-900 mb-4">Quy trình tiếp theo</h4>
        <div className="flex justify-between items-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center mb-2">
              ✓
            </div>
            <span className="text-xs text-gray-600">Đã gửi</span>
          </div>

          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>

          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 text-white rounded-full flex items-center justify-center mb-2 ${
              isPaymentSuccess ? 'bg-green-600' : 'bg-yellow-500 animate-pulse'
            }`}>
              {isPaymentSuccess ? '✓' : '2'}
            </div>
            <span className="text-xs text-gray-600">Chờ thanh toán</span>
          </div>

          <div className="flex-1 h-0.5 bg-gray-300 mx-2"></div>

          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 text-white rounded-full flex items-center justify-center mb-2 ${
              isPaymentSuccess ? 'bg-green-600' : 'bg-gray-300'
            }`}>
              {isPaymentSuccess ? '✓' : '3'}
            </div>
            <span className="text-xs text-gray-600">Hoàn thành</span>
          </div>
        </div>
      </div>
      {!isPaymentSuccess ? (
        <div className="flex justify-center gap-3">
          <Button
            onClick={handleDownloadReceipt}
            variant="outline"
            className="border-gray-300"
          >
            <FiDownload className="mr-2" />
            Tải biên nhận
          </Button>

          <Button
            onClick={handlePayment}
            disabled={isPaymentLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
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
            className="border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Xem lịch hẹn
          </Button>
        </div>
      ) : (
        <div className="flex justify-center gap-3">
          <Button
            onClick={handleDownloadReceipt}
            variant="outline"
            className="border-gray-300"
          >
            <FiDownload className="mr-2" />
            Tải biên nhận
          </Button>

          <Button
            onClick={handleViewBookings}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <FiCheckCircle className="mr-2" />
            Xem lịch hẹn
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingSuccess;
