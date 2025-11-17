import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiMapPin, FiUser, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatDate, formatCurrency } from '../utils/format';
import bookingService from '../services/bookingService';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [bookings, setBookings] = useState({
    pending_payment: [],
    upcoming: [],
    cancellation_requested: [],
    received: [],
    completed: [],
    cancelled: []
  });
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedBookingForCancel, setSelectedBookingForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  // Fetch bookings from backend
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching bookings...');
      const result = await bookingService.getMyBookings('all');
      
      console.log('📊 Booking result:', result);
      
      if (result.success && result.data) {
        console.log('✅ Data received:', result.data);
        
        // Categorize bookings by status
        const categorized = {
          pending_payment: [],
          upcoming: [],
          cancellation_requested: [],
          received: [],
          completed: [],
          cancelled: []
        };

        result.data.forEach(booking => {
          // Map backend status to our categories
          const status = booking.status?.toLowerCase();
          console.log(`🏷️ Booking ${booking.bookingId} status:`, status);
          
          if (status === 'pending_payment') {
            categorized.pending_payment.push(booking);
          } else if (status === 'upcoming') {
            categorized.upcoming.push(booking);
          } else if (status === 'cancellation_requested') {
            categorized.cancellation_requested.push(booking);
          } else if (status === 'received') {
            categorized.received.push(booking);
          } else if (status === 'completed') {
            categorized.completed.push(booking);
          } else if (status === 'cancelled') {
            categorized.cancelled.push(booking);
          } else {
            // Default to upcoming for unknown statuses
            categorized.upcoming.push(booking);
          }
        });

        console.log('📋 Categorized bookings:', categorized);
        setBookings(categorized);
      } else {
        console.error('❌ Failed to fetch bookings:', result.error);
        toast.error(result.error || 'Không thể tải danh sách lịch hẹn');
      }
    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      toast.error('Có lỗi xảy ra khi tải lịch hẹn');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending_payment: { label: 'Chờ thanh toán', color: 'bg-orange-100 text-orange-800', icon: <FiAlertCircle /> },
      upcoming: { label: 'Sắp tới', color: 'bg-blue-100 text-blue-800', icon: <FiClock /> },
      cancellation_requested: { label: 'Chờ duyệt hủy', color: 'bg-yellow-100 text-yellow-800', icon: <FiAlertCircle /> },
      received: { label: 'Đã tiếp nhận', color: 'bg-cyan-100 text-cyan-800', icon: <FiCheck /> },
      completed: { label: 'Hoàn thành', color: 'bg-green-100 text-green-800', icon: <FiCheck /> },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800', icon: <FiX /> }
    }[status] || { label: status || 'Không rõ', color: 'bg-gray-100 text-gray-800', icon: <FiAlertCircle /> };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.icon}{config.label}
      </span>
    );
  };

  const openCancelModal = (booking) => {
    setSelectedBookingForCancel(booking);
    setCancelReason('');
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedBookingForCancel(null);
    setCancelReason('');
  };

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy');
      return;
    }

    try {
      const status = selectedBookingForCancel.status?.toLowerCase();
      let result;
      
      // For UPCOMING bookings (paid), request cancellation (needs staff approval)
      if (status === 'upcoming') {
        result = await bookingService.requestCancellation(
          selectedBookingForCancel.bookingId, 
          cancelReason
        );
        
        if (result.success) {
          toast.success('Đã gửi yêu cầu hủy! Chờ nhân viên duyệt.');
          closeCancelModal();
          fetchBookings();
        } else {
          toast.error(result.error || 'Không thể gửi yêu cầu hủy');
        }
      } else {
        // For PENDING_PAYMENT, can cancel directly
        result = await bookingService.cancelBooking(
          selectedBookingForCancel.bookingId, 
          cancelReason
        );
        
        if (result.success) {
          toast.success('Đã hủy lịch hẹn thành công!');
          closeCancelModal();
          fetchBookings();
        } else {
          toast.error(result.error || 'Không thể hủy lịch hẹn');
        }
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Có lỗi xảy ra khi hủy lịch hẹn');
    }
  };

  const handleReschedule = (booking) => {
    window.dispatchEvent(new CustomEvent('openBookingModal', { 
      detail: { booking, isReschedule: true } 
    }));
  };

  const handlePayNow = async (booking) => {
    if (!booking.bookingId) {
      toast.error('Không tìm thấy mã đặt lịch');
      return;
    }

    try {
      console.log('💳 Creating deposit payment for booking:', booking.bookingId);
      const paymentResponse = await bookingService.createDepositPayment(booking.bookingId);
      
      if (paymentResponse.success && paymentResponse.paymentUrl) {
        toast.success('Đang chuyển đến trang thanh toán...');
        // Redirect to VNPay
        window.location.href = paymentResponse.paymentUrl;
      } else {
        toast.error(paymentResponse.error || 'Không thể tạo thanh toán');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Có lỗi xảy ra khi tạo thanh toán');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Dịch vụ của tôi
      </h1>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'pending_payment', label: 'Thanh toán' },
            { key: 'upcoming', label: 'Lịch hẹn' },
            { key: 'cancellation_requested', label: 'Chờ phản hồi' },
            { key: 'received', label: 'Đang xử lý' },
            { key: 'completed', label: 'Hoàn thành' },
            { key: 'cancelled', label: 'Đã hủy' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key ? 'border-teal-500 text-teal-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {bookings[tab.key].length}
              </span>
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-4">
        {loading ? (
          <Card className="text-center py-12">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            </div>
            <p className="text-gray-500 mt-4">Đang tải...</p>
          </Card>
        ) : bookings[activeTab].length === 0 ? (
          <Card className="text-center py-12">
            <FiCalendar className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không có lịch hẹn nào</p>
          </Card>
        ) : (
          bookings[activeTab].map(b => (
            <Card key={b.bookingId} className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between flex-col lg:flex-row lg:items-center">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{b.offerType || b.serviceName || 'Dịch vụ'}</h3>
                      <p className="text-sm text-gray-600">{b.eVModel || b.vehicleModel} - {b.licensePlate || b.vehiclePlate}</p>
                      {getStatusBadge(b.status?.toLowerCase())}
                    </div>
                  </div>

                  <div className="mt-3 text-sm space-y-1">
                    <p><FiCalendar className="inline mr-1" /> {b.date || formatDate(b.bookingDate)}</p>
                    <p><FiClock className="inline mr-1" /> {b.time || b.bookingTime}</p>
                    <p><FiMapPin className="inline mr-1" /> {b.center}</p>
                    {b.address && <p className="ml-5 text-gray-500">{b.address}</p>}
                    {b.assignedTechnicianName && <p><FiUser className="inline mr-1" /> {b.assignedTechnicianName}</p>}
                    {b.estimatedCost && <p>Chi phí dự kiến: {formatCurrency(b.estimatedCost)}</p>}
                    {b.totalCost && <p>Tổng chi phí: {formatCurrency(b.totalCost)}</p>}
                    {b.maintenancePackage && <p className="italic text-gray-600">Gói: {b.maintenancePackage}</p>}
                    {b.problemDescription && <p className="italic text-gray-600">Mô tả vấn đề: {b.problemDescription}</p>}
                    {b.notes && <p className="italic text-gray-600">Ghi chú: {b.notes}</p>}
                  </div>
                </div>

                <div className="mt-3 lg:mt-0 flex flex-col gap-2 min-w-[140px]">
                  {activeTab === 'pending_payment' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handlePayNow(b)}
                        className="w-full border border-emerald-500 text-emerald-600 bg-white hover:bg-emerald-50 focus:ring-emerald-400"
                      >
                        Thanh toán
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full border border-sky-500 text-sky-600 bg-white hover:bg-sky-50 focus:ring-sky-400"
                      >
                        Chi tiết
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openCancelModal(b)}
                        className="w-full border border-rose-500 text-rose-600 bg-white hover:bg-rose-50 focus:ring-rose-400"
                      >
                        Hủy lịch
                      </Button>
                    </>
                  )}
                  {activeTab === 'upcoming' && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleReschedule(b)}
                        className="w-full border border-cyan-500 text-cyan-600 bg-white hover:bg-cyan-50 focus:ring-cyan-400"
                      >
                        Cập nhật
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full border border-sky-500 text-sky-600 bg-white hover:bg-sky-50 focus:ring-sky-400"
                      >
                        Chi tiết
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => openCancelModal(b)}
                        className="w-full border border-rose-500 text-rose-600 bg-white hover:bg-rose-50 focus:ring-rose-400"
                      >
                        Hủy lịch
                      </Button>
                    </>
                  )}
                  {activeTab === 'received' && (
                    <>
                      <div className="text-sm text-cyan-600 bg-cyan-50 px-3 py-2 rounded border border-cyan-300 text-center font-medium">
                        ✅ Xe đang được xử lý
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full border border-sky-500 text-sky-600 bg-white hover:bg-sky-50 focus:ring-sky-400"
                      >
                        Chi tiết
                      </Button>
                    </>
                  )}
                  {activeTab === 'completed' && (
                    <>
                      {!b.rating && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="w-full border border-emerald-500 text-emerald-600 bg-white hover:bg-emerald-50 focus:ring-emerald-400"
                        >
                          Đánh giá
                        </Button>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full border border-sky-500 text-sky-600 bg-white hover:bg-sky-50 focus:ring-sky-400"
                      >
                        Chi tiết
                      </Button>
                    </>
                  )}
                  {activeTab === 'cancelled' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full border border-sky-500 text-sky-600 bg-white hover:bg-sky-50 focus:ring-sky-400"
                    >
                      Chi tiết
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Note for active bookings */}
      {(activeTab === 'pending_payment' || activeTab === 'upcoming' || activeTab === 'received') && (
        <div className="mt-8 p-4 bg-red-50 border border-red-300 rounded-lg flex items-start gap-3">
          <FiAlertCircle className="text-red-600 mt-0.5" />
          <p className="text-sm text-red-800">
            <strong>Lưu ý:</strong> Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục. 
            Nếu cần hủy hoặc dời lịch, vui lòng thông báo trước 24 giờ.
          </p>
        </div>
      )}

      {/* Modal hủy lịch */}
      {showCancelModal && selectedBookingForCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Xác nhận hủy lịch hẹn</h3>
                <button
                  onClick={closeCancelModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX className="text-xl text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Lịch hẹn:</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-semibold text-gray-900">{selectedBookingForCancel.offerType || selectedBookingForCancel.serviceName}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    <FiCalendar className="inline mr-1" />
                    {selectedBookingForCancel.date || selectedBookingForCancel.bookingDate} - {selectedBookingForCancel.time || selectedBookingForCancel.bookingTime}
                  </p>
                  <p className="text-sm text-gray-600">
                    <FiMapPin className="inline mr-1" />
                    {selectedBookingForCancel.center}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do hủy <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  placeholder="Vui lòng nhập lý do hủy lịch hẹn..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{cancelReason.length}/500 ký tự</p>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <div className="flex items-start gap-2">
                  <FiAlertCircle className="text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-800">
                    Lưu ý: Lịch hẹn sẽ bị hủy ngay lập tức. Hành động này không thể hoàn tác.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={closeCancelModal}
                  className="flex-1"
                >
                  Quay lại
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCancelBooking}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={!cancelReason.trim()}
                >
                  Xác nhận hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
