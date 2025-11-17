import React, { useState, useEffect } from 'react';
import { 
  FiSearch, FiFileText, FiDollarSign, FiCheck, FiChevronDown, FiChevronUp, FiCreditCard
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import paymentService from '../../services/paymentService';
import vnpayService from '../../services/vnpayService';

const StaffPayments = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedInvoice, setExpandedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  useEffect(() => {
    fetchPayments();
  }, []);

  const formatPaymentMethod = (method) => {
    if (!method) return 'Chưa xác định';
    if (method === 'CASH') return 'Tiền mặt';
    if (method === 'VNPAY') return 'VNPay';
    return method;
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const result = await paymentService.getAllPayments();
      if (result.success && result.data) {
        // Filter: Only show service payments (from reception), not booking deposits
        // Booking deposits have bookingId but no receptionId
        const servicePayments = result.data.filter(payment => 
          payment.receptionId != null // Only payments linked to vehicle reception
        );
        
        // Transform payment data to match UI format
        const transformedInvoices = servicePayments.map(payment => ({
          id: payment.paymentId,
          invoiceNumber: payment.invoiceNumber,
          customerName: payment.customerName,
          customerPhone: payment.customerPhone,
          vehicle: payment.vehicleInfo,
          licensePlate: payment.licensePlate,
          serviceName: payment.serviceName,
          serviceDate: payment.serviceDate ? new Date(payment.serviceDate).toLocaleDateString('vi-VN') : '',
          totalAmount: payment.totalAmount || 0,
          discountAmount: payment.discountAmount || 0,
          finalAmount: payment.finalAmount || payment.totalAmount,
          paymentStatus: payment.paymentStatus.toLowerCase(),
          paymentMethod: formatPaymentMethod(payment.paymentMethod),
          createdAt: payment.createdAt
        }));
        setInvoices(transformedInvoices);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Không thể tải danh sách hóa đơn');
    } finally {
      setLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      (invoice.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (invoice.invoiceNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (invoice.licensePlate || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.paymentStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const openPaymentModal = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentMethod('CASH');
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedInvoice) return;

    try {
      // Handle VNPay e-transfer
      if (paymentMethod === 'VNPAY') {
        console.log('🔵 Starting VNPay payment for invoice:', selectedInvoice.invoiceNumber);
        console.log('💰 Total amount:', selectedInvoice.totalAmount);
        console.log('💰 Deposit deducted:', selectedInvoice.discountAmount);
        console.log('💰 Final amount to pay:', selectedInvoice.finalAmount);
        
        toast.loading('Đang tạo liên kết thanh toán...');
        
        const vnpayResult = await vnpayService.createPaymentUrl({
          amount: selectedInvoice.finalAmount, // Use finalAmount (after deposit deduction)
          invoiceNumber: selectedInvoice.invoiceNumber,
          paymentId: selectedInvoice.id,
          orderInfo: `Thanh toan hoa don ${selectedInvoice.invoiceNumber}`
        });

        console.log('📥 VNPay result:', vnpayResult);

        if (vnpayResult.success && vnpayResult.data?.paymentUrl) {
          toast.dismiss();
          toast.success('Đang chuyển đến cổng thanh toán VNPay...');
          console.log('✅ Redirecting to:', vnpayResult.data.paymentUrl);
          
          // Small delay to show the success message
          setTimeout(() => {
            window.location.href = vnpayResult.data.paymentUrl;
          }, 500);
        } else {
          toast.dismiss();
          const errorMsg = vnpayResult.error || vnpayResult.message || 'Không thể tạo liên kết thanh toán VNPay';
          console.error('❌ VNPay error:', errorMsg);
          toast.error(errorMsg);
        }
        return;
      }

      // Handle cash payment
      const result = await paymentService.markAsPaid(selectedInvoice.id, paymentMethod);
      if (result.success) {
        // Update local state
        setInvoices(invoices.map(inv => 
          inv.id === selectedInvoice.id ? { ...inv, paymentStatus: 'paid', paymentMethod: formatPaymentMethod(paymentMethod) } : inv
        ));
        toast.success('Đã xác nhận thanh toán thành công!');
        setShowPaymentModal(false);
        fetchPayments(); // Refresh to get updated data from backend
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.dismiss();
      console.error('❌ Error in handlePayment:', error);
      
      let errorMessage = 'Không thể xác nhận thanh toán';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        console.error('Server error:', error.response.status, error.response.data);
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra backend có đang chạy không.';
        console.error('No response from server:', error.request);
      } else {
        // Other errors
        errorMessage = error.message || errorMessage;
        console.error('Request error:', error.message);
      }
      
      toast.error(errorMessage, { duration: 5000 });
    }
  };

  const handleCompletePayment = async (invoiceId) => {
    if (!window.confirm('Xác nhận hoàn tất thanh toán?')) {
      return;
    }

    try {
      const result = await paymentService.markAsCompleted(invoiceId);
      if (result.success) {
        // Update local state
        setInvoices(invoices.map(inv => 
          inv.id === invoiceId ? { ...inv, paymentStatus: 'completed' } : inv
        ));
        toast.success('Đã hoàn tất thanh toán và ghi nhận chuyển khoản!');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error marking payment as completed:', error);
      toast.error('Không thể hoàn tất thanh toán');
    }
  };

  const formatServices = (services) => {
    if (!services) return 'Không có dịch vụ';
    
    const serviceMap = {
      'regularMaintenance': 'Bảo dưỡng định kỳ',
      'componentReplacement': 'Thay thế phụ tùng',
      'technicalRepair': 'Sửa chữa kỹ thuật'
    };

    // Handle if services is a string (comma-separated)
    const serviceArray = typeof services === 'string' ? services.split(',') : [services];
    
    return serviceArray.map(service => {
      const trimmed = service.trim();
      return serviceMap[trimmed] || trimmed;
    }).join(', ');
  };

  const getStatusBadge = (status, paymentMethod) => {
    if (status === 'paid') {
      return <span className="text-sm text-green-600 font-medium">Đã thanh toán</span>;
    } else if (status === 'pending') {
      return <span className="text-sm text-orange-600 font-medium">Chờ thanh toán</span>;
    } else if (status === 'completed') {
      return <span className="text-sm text-blue-600 font-medium">Hoàn tất</span>;
    }
    return <span className="text-sm text-gray-600">N/A</span>;
  };

  const toggleExpand = (invoiceId) => {
    setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý thanh toán Dịch vụ
        </h1>
        <p className="text-gray-600 mt-1">Theo dõi, cập nhật và xem chi tiết các hóa đơn sửa chữa.</p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <Card.Content className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm khách, xe, biển số, mã HD..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer hover:border-gray-400 transition-colors"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả hóa đơn</option>
              <option value="pending">Chờ thanh toán</option>
              <option value="paid">Đã thanh toán</option>
              <option value="completed">Hoàn tất</option>
            </select>
          </div>
        </Card.Content>
      </Card>

      {/* Invoice Table */}
      <Card>
        <Card.Content className="p-0">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin mx-auto h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách hóa đơn...</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-12 text-center">
              <FiFileText className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có hóa đơn</h3>
              <p className="text-gray-500">Chưa có hóa đơn nào được tạo</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium">Mã HĐ</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Khách hàng</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Xe</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Tổng tiền</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Trạng thái</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Thao tác</th>
                    <th className="px-4 py-3 text-left text-sm font-medium">Chi tiết</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => (
                    <React.Fragment key={invoice.id}>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm font-semibold text-gray-900">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{invoice.customerName}</p>
                            <p className="text-gray-600">{invoice.customerPhone}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <p className="font-medium text-gray-900">{invoice.vehicle}</p>
                            <p className="text-gray-600">{invoice.licensePlate}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm">
                            <p className="font-bold text-gray-900">
                              {invoice.finalAmount.toLocaleString('vi-VN')} ₫
                            </p>
                            {invoice.discountAmount > 0 && (
                              <p className="text-xs text-green-600">
                                (Đã trừ cọc: {invoice.discountAmount.toLocaleString('vi-VN')} ₫)
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(invoice.paymentStatus, invoice.paymentMethod)}
                        </td>
                        <td className="px-4 py-4">
                          {invoice.paymentStatus === 'pending' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => openPaymentModal(invoice)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <FiCheck className="mr-1" />
                              Xác nhận thu tiền
                            </Button>
                          )}
                          {invoice.paymentStatus === 'paid' && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleCompletePayment(invoice.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Hoàn tất
                            </Button>
                          )}
                          {invoice.paymentStatus === 'completed' && (
                            <span className="text-sm text-gray-500">Đã hoàn tất</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => toggleExpand(invoice.id)}
                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                          >
                            {expandedInvoice === invoice.id ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                        </td>
                      </tr>
                      {expandedInvoice === invoice.id && (
                        <tr>
                          <td colSpan="7" className="px-4 py-4 bg-gray-50">
                            <div className="p-4 border border-gray-200 rounded-lg bg-white">
                              <h4 className="font-semibold text-gray-900 mb-3">Chi tiết hóa đơn {invoice.invoiceNumber}</h4>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <p className="text-sm text-gray-600">Dịch vụ</p>
                                  <p className="font-medium text-gray-900">{formatServices(invoice.serviceName)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Ngày thực hiện</p>
                                  <p className="font-medium text-gray-900">{invoice.serviceDate}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Phương thức thanh toán</p>
                                  <p className="font-medium text-gray-900">{invoice.paymentMethod}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-600">Ngày tạo hóa đơn</p>
                                  <p className="font-medium text-gray-900">
                                    {new Date(invoice.createdAt).toLocaleDateString('vi-VN')}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="border-t pt-3">
                                {/* Show deposit deduction if exists */}
                                {invoice.discountAmount > 0 && (
                                  <div className="mb-3 space-y-2">
                                    <div className="flex justify-between items-center text-gray-700">
                                      <span>Tổng chi phí dịch vụ:</span>
                                      <span className="font-semibold">{invoice.totalAmount.toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                    <div className="flex justify-between items-center text-green-700">
                                      <span>Đã đặt cọc (trừ):</span>
                                      <span className="font-semibold">- {invoice.discountAmount.toLocaleString('vi-VN')} ₫</span>
                                    </div>
                                    <div className="border-t pt-2"></div>
                                  </div>
                                )}
                                
                                <div className="flex justify-between items-center">
                                  <span className="text-lg font-semibold text-gray-900">
                                    {invoice.discountAmount > 0 ? 'Còn phải thanh toán:' : 'Tổng cộng:'}
                                  </span>
                                  <span className="text-2xl font-bold text-purple-600">
                                    {(invoice.totalAmount - (invoice.discountAmount || 0)).toLocaleString('vi-VN')} ₫
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Payment Method Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full">
            <Card.Content className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Xác nhận thanh toán
              </h2>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Hóa đơn:</p>
                <p className="font-semibold text-gray-900">{selectedInvoice.invoiceNumber}</p>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Khách hàng:</p>
                <p className="font-semibold text-gray-900">{selectedInvoice.customerName}</p>
              </div>

              <div className="mb-4">
                {selectedInvoice.discountAmount > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 mb-2">Chi tiết thanh toán:</p>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700">Tổng chi phí dịch vụ:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedInvoice.totalAmount.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-700">Đã đặt cọc (trừ):</span>
                        <span className="font-semibold text-green-700">
                          - {selectedInvoice.discountAmount.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                      <div className="border-t pt-2 flex justify-between">
                        <span className="font-semibold text-gray-900">Còn phải thanh toán:</span>
                        <span className="text-xl font-bold text-purple-600">
                          {selectedInvoice.finalAmount.toLocaleString('vi-VN')} ₫
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-2">Số tiền:</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {selectedInvoice.finalAmount.toLocaleString('vi-VN')} ₫
                    </p>
                  </>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phương thức thanh toán <span className="text-red-500">*</span>
                </label>
                <div className="space-y-3">
                  {/* Cash Payment Option */}
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: paymentMethod === 'CASH' ? '#9333ea' : '#d1d5db' }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CASH"
                      checked={paymentMethod === 'CASH'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">💵</span>
                        <span className="font-semibold text-gray-900">Tiền mặt</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Thanh toán trực tiếp bằng tiền mặt</p>
                    </div>
                  </label>

                  {/* VNPay E-Transfer Option */}
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{ borderColor: paymentMethod === 'VNPAY' ? '#9333ea' : '#d1d5db' }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={paymentMethod === 'VNPAY'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3 text-purple-600 focus:ring-purple-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FiCreditCard className="text-xl text-blue-600" />
                        <span className="font-semibold text-gray-900">VNPay E-Transfer</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Recommended</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Chuyển khoản qua cổng thanh toán VNPay</p>
                    </div>
                  </label>
                </div>

                {/* Payment Method Info */}
                {paymentMethod === 'VNPAY' && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                      ℹ️ Bạn sẽ được chuyển đến trang thanh toán VNPay để hoàn tất giao dịch.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  onClick={handlePayment}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {paymentMethod === 'VNPAY' ? (
                    <>
                      <FiCreditCard className="mr-1" />
                      Thanh toán VNPay
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-1" />
                      Xác nhận
                    </>
                  )}
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StaffPayments;
