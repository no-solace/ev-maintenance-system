import React, { useState, useEffect } from 'react';
import { FiCheck, FiUser, FiPhone, FiMail, FiMapPin, FiEdit2, FiAlertCircle } from 'react-icons/fi';
import { vinfastModels } from '../../../data/serviceCenters';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import toast from 'react-hot-toast';
import useAuthStore from '../../../store/authStore';
import bookingService from '../../../services/bookingService';
// infor booking
const ConfirmBooking = ({ data, onNext, onBack }) => {
  const { user } = useAuthStore();
  
  const [customerInfo, setCustomerInfo] = useState(data.customerInfo || {
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [notes, setNotes] = useState(data.notes || '');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // validation thong tin
  const validateForm = () => {
    const newErrors = {};
    //bat loi thong tin sai
    if (!customerInfo.name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{10,11}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
    }
    
    if (customerInfo.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Gọi API để tạo booking
      // Backend API: POST /bookings
      // Body: { eVId, centerId, bookingDate, bookingTime }
      // Format time: if already has seconds (HH:mm:ss), use as is; otherwise add :00
      const formattedTime = data.timeSlot.split(':').length === 3 
        ? data.timeSlot 
        : data.timeSlot + ':00';
      
      // Map service IDs to offer type IDs
      const getOfferTypeId = (serviceId) => {
        const mapping = {
          'maintenance': 1, // Bảo dưỡng định kỳ
          'parts': 2,       // Thay thế phụ tùng
          'repair': 3       // Sửa chữa
        };
        return mapping[serviceId] || null;
      };
      
      const bookingPayload = {
        eVId: parseInt(data.vehicleData?.id || data.vehicle?.id || data.vehicle) || null,
        centerId: parseInt(data.center?.id) || null,
        bookingDate: data.date,
        bookingTime: formattedTime,
        customerName: customerInfo.name || null,
        customerPhone: customerInfo.phone || null,
        customerEmail: customerInfo.email || null,
        customerAddress: customerInfo.address || null,
        offerTypeId: getOfferTypeId(data.service?.id),
        packageId: data.servicePackage?.id || null,
        problemDescription: data.problemDescription || null,
        notes: notes || null
      };
      
      console.log('📤 Creating booking with payload:', bookingPayload);
      console.log('Vehicle details:', {
        vehicleData: data.vehicleData,
        vehicleId: data.vehicleData?.id || data.vehicle?.id || data.vehicle,
        licensePlate: data.vehicleData?.licensePlate,
        vin: data.vehicleData?.vin,
        model: data.vehicleData?.model
      });
      console.log('Service details:', {
        service: data.service?.name,
        package: data.servicePackage?.name,
        problem: data.problemDescription
      });
      console.log('Customer info:', {
        name: customerInfo.name,
        phone: customerInfo.phone,
        email: customerInfo.email,
        address: customerInfo.address
      });
      
      // Validate required fields
      if (!bookingPayload.eVId || !bookingPayload.centerId) {
        toast.error('Thiếu thông tin xe hoặc trung tâm');
        setIsSubmitting(false);
        return;
      }
      
      const response = await bookingService.createBooking(bookingPayload);
      
      if (response.success && response.data) {
        const bookingId = response.data.bookingId;
        
        console.log('✅ Booking created successfully with ID:', bookingId);
        
        // Show success message and move to success step
        toast.success('Đặt lịch thành công!');
        
        // Update booking data with the created booking ID
        const finalBookingData = {
          ...data,
          customerInfo,
          notes,
          bookingId: bookingId,
          backendData: response.data,
          status: 'pending_payment'
        };
        
        // Pass to next step (BookingSuccess)
        onNext(finalBookingData);
      } else {
        // Check for specific error messages
        const errorMsg = response.error || 'Không thể tạo lịch hẹn';
        if (errorMsg.includes('already has a pending booking') || errorMsg.includes('already booked')) {
          toast.error('🚗 Xe này đã có lịch hẹn khác. Vui lòng hủy lịch cũ trước khi đặt lịch mới.');
        } else if (errorMsg.includes('currently in service') || errorMsg.includes('IN_SERVICE')) {
          toast.error('🔧 Xe này đang được bảo dưỡng/sửa chữa. Vui lòng chờ xe hoàn tất dịch vụ.');
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVehicleName = () => {
    // Use vehicleData if available (from MyVehicles), otherwise fall back to vinfastModels
    if (data.vehicleData) {
      return data.vehicleData.model || '';
    }
    const vehicle = vinfastModels.find(v => v.id === data.vehicle);
    return vehicle?.name || '';
  };

  const getServiceSummary = () => {
    if (data.service?.id === 'maintenance') {
      return `${data.service.name} - ${data.servicePackage?.name}`;
    } else if (data.service?.id === 'parts') {
      return `${data.service.name} (${data.parts.length} phụ tùng)`;
    } else if (data.service?.id === 'repair') {
      return data.service.name;
    }
    return '';
  };

  const calculateTotal = () => {
    if (data.service?.id === 'maintenance') {
      return data.servicePackage?.price || 0;
    } else if (data.service?.id === 'parts') {
      return data.parts.reduce((sum, part) => sum + part.price, 0);
    }
    return 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Xác nhận thông tin đặt lịch
        </h3>
        <p className="text-sm text-gray-600">
          Vui lòng kiểm tra và điền đầy đủ thông tin liên hệ
        </p>
      </div>
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Thông tin dịch vụ</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm gap-4">
            <span className="text-gray-600 flex-shrink-0">Trung tâm:</span>
            <span className="font-medium text-right">{data.center?.name}</span>
          </div>
          <div className="flex justify-between items-center text-sm gap-4">
            <span className="text-gray-600 flex-shrink-0">Địa chỉ:</span>
            <span className="font-medium text-right line-clamp-1">{data.center?.address}</span>
          </div>
          <div className="flex justify-between items-center text-sm gap-4">
            <span className="text-gray-600 flex-shrink-0">Ngày hẹn:</span>
            <span className="font-medium text-right">{formatDate(data.date)}</span>
          </div>
          <div className="flex justify-between items-center text-sm gap-4">
            <span className="text-gray-600 flex-shrink-0">Giờ hẹn:</span>
            <span className="font-medium text-right">{data.timeSlot}</span>
          </div>
          <div className="flex justify-between items-center text-sm gap-4">
            <span className="text-gray-600 flex-shrink-0">Xe:</span>
            <span className="font-medium text-right">VinFast {getVehicleName()}</span>
          </div>
          {data.vehicleData?.licensePlate && (
            <div className="flex justify-between items-center text-sm gap-4">
              <span className="text-gray-600 flex-shrink-0">Biển số:</span>
              <span className="font-medium text-right">{data.vehicleData.licensePlate}</span>
            </div>
          )}
          {data.vehicleData?.vin && (
            <div className="flex justify-between items-center text-sm gap-4">
              <span className="text-gray-600 flex-shrink-0">VIN:</span>
              <span className="font-medium text-right break-all">{data.vehicleData.vin}</span>
            </div>
          )}
          {data.service?.id === 'parts' && data.parts.length > 0 && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-sm text-gray-600 mb-1">Phụ tùng:</p>
              <ul className="space-y-1">
                {data.parts.map((part) => (
                  <li key={part.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">• {part.name}</span>
                    <span>{part.price.toLocaleString('vi-VN')}đ</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {data.service?.id === 'repair' && data.problemDescription && (
            <div className="mt-2 pt-2 border-t">
              <p className="text-sm text-gray-600">Mô tả vấn đề:</p>
              <p className="text-sm mt-1">{data.problemDescription}</p>
            </div>
          )}
          
          {calculateTotal() > 0 && (
            <div className="mt-3 pt-3 border-t flex justify-between">
              <span className="font-medium">Tạm tính:</span>
              <span className="font-bold text-blue-600">
                {calculateTotal().toLocaleString('vi-VN')}đ
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-4">Thông tin khách hàng</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              value={customerInfo.name}
              onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              error={errors.name}
              icon={<FiUser />}
              required
            />
          </div>
          
          <div>
            <Input
              label="Số điện thoại"
              placeholder="0912345678"
              value={customerInfo.phone}
              onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              error={errors.phone}
              icon={<FiPhone />}
              required
            />
          </div>
          
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="email@example.com"
              value={customerInfo.email}
              onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              error={errors.email}
              icon={<FiMail />}
            />
          </div>
          
          <div>
            <Input
              label="Địa chỉ"
              placeholder="123 Đường ABC, Quận XYZ"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
              error={errors.address}
              icon={<FiMapPin />}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ghi chú thêm (tùy chọn)
          </label>
          <textarea
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Thông tin thêm về xe, yêu cầu đặc biệt..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
      {/* Deposit Payment Info */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start">
          <FiAlertCircle className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-blue-900 mb-2">💳 Thanh toán đặt cọc</p>
            <p className="text-blue-800 mb-2">
              Sau khi tạo lịch hẹn, bạn cần thanh toán <strong className="text-blue-900">200,000đ</strong> tiền đặt cọc để giữ chỗ. Bạn có thể thanh toán ngay hoặc thanh toán sau từ trang "Lịch Hẹn Của Tôi".
            </p>
            <p className="text-red-600 font-medium">
              ⚠️ Lưu ý: Vui lòng thanh toán trong vòng <strong>15 phút</strong> để xác nhận lịch hẹn, nếu không lịch sẽ bị hủy tự động.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-amber-50 rounded-lg">
        <div className="flex items-start">
          <FiAlertCircle className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-amber-700">
            <p className="font-medium mb-1">Lưu ý quan trọng:</p>
            <ul className="space-y-1">
              <li>• Vui lòng đến đúng giờ đã hẹn</li>
              <li>• Mang theo giấy tờ xe khi đến</li>
              <li>• Chúng tôi sẽ liên hệ xác nhận trong vòng 30 phút</li>
              <li>• Nếu cần hủy/đổi lịch, vui lòng báo trước 4 giờ</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700 text-white px-8"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Đang xử lý...
            </>
          ) : (
            <>
              <FiCheck className="mr-2" />
              Xác nhận đặt lịch
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmBooking;
