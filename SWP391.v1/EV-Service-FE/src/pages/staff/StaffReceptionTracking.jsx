import React, { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiEdit, FiPackage, FiCheck, FiClock, FiAlertCircle, FiDollarSign } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import vehicleReceptionService from '../../services/vehicleReceptionService';
import { sparePartService } from '../../services/sparePartService';
import paymentService from '../../services/paymentService';

const StaffReceptionTracking = () => {
  const [receptions, setReceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReception, setSelectedReception] = useState(null);
  const [showAddPartsModal, setShowAddPartsModal] = useState(false);
  const [spareParts, setSpareParts] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);

  useEffect(() => {
    fetchReceptions();
    loadSpareParts();
  }, [statusFilter]);

  const fetchReceptions = async () => {
    setLoading(true);
    try {
      let result;
      if (statusFilter === 'all') {
        result = await vehicleReceptionService.getAllReceptions();
      } else {
        result = await vehicleReceptionService.getReceptionsByStatus(statusFilter);
      }

      if (result.success) {
        // Sort by receptionId descending (newest first)
        const sortedData = result.data.sort((a, b) => b.receptionId - a.receptionId);
        setReceptions(sortedData);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error fetching receptions:', error);
      toast.error('Không thể tải danh sách tiếp nhận');
    } finally {
      setLoading(false);
    }
  };

  const loadSpareParts = async () => {
    try {
      const response = await sparePartService.getInStockParts();
      setSpareParts(response || []);
    } catch (error) {
      console.error('Error loading spare parts:', error);
    }
  };

  const filteredReceptions = receptions.filter(reception => {
    const searchLower = searchQuery.toLowerCase();
    return (
      reception.customerName?.toLowerCase().includes(searchLower) ||
      reception.customerPhone?.includes(searchLower) ||
      reception.licensePlate?.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      'RECEIVED': { label: 'Đã tiếp nhận', color: 'bg-blue-100 text-blue-700' },
      'IN_PROGRESS': { label: 'Đang xử lý', color: 'bg-yellow-100 text-yellow-700' },
      'COMPLETED': { label: 'Hoàn thành', color: 'bg-green-100 text-green-700' },
      'CANCELLED': { label: 'Đã hủy', color: 'bg-red-100 text-red-700' }
    };
    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatServices = (services) => {
    if (!services || services.length === 0) return 'Không có dịch vụ';
    
    const serviceMap = {
      'regularMaintenance': { label: 'Bảo dưỡng định kỳ', icon: '🔧', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      'componentReplacement': { label: 'Thay thế phụ tùng', icon: '🔩', color: 'bg-green-50 text-green-700 border-green-200' },
      'technicalRepair': { label: 'Sửa chữa kỹ thuật', icon: '⚙️', color: 'bg-orange-50 text-orange-700 border-orange-200' }
    };

    // Handle if services is a string (comma-separated)
    const serviceArray = typeof services === 'string' ? services.split(',') : services;
    
    return serviceArray.map((service, index) => {
      const serviceInfo = serviceMap[service.trim()] || { label: service, icon: '📋', color: 'bg-gray-50 text-gray-700 border-gray-200' };
      return (
        <span
          key={index}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${serviceInfo.color} mr-2 mb-1`}
        >
          <span>{serviceInfo.icon}</span>
          <span>{serviceInfo.label}</span>
        </span>
      );
    });
  };

  const handleAddParts = (reception) => {
    setSelectedReception(reception);
    setSelectedParts([]);
    setShowAddPartsModal(true);
  };

  const togglePartSelection = (partId) => {
    setSelectedParts(prev =>
      prev.includes(partId) ? prev.filter(id => id !== partId) : [...prev, partId]
    );
  };

  const handleSaveAdditionalParts = async () => {
    if (selectedParts.length === 0) {
      toast.error('Vui lòng chọn ít nhất một phụ tùng');
      return;
    }

    try {
      // Calculate additional cost for display
      const additionalCost = selectedParts.reduce((sum, partId) => {
        const part = spareParts.find(p => (p.sparePartId || p.partId) === partId);
        return sum + (part?.price || 0);
      }, 0);

      // Call backend API to add parts
      const result = await vehicleReceptionService.addSpareParts(
        selectedReception.receptionId,
        selectedParts
      );

      if (result.success) {
        toast.success(`Đã thêm ${selectedParts.length} phụ tùng - Chi phí: ${additionalCost.toLocaleString('vi-VN')}₫`);
        setShowAddPartsModal(false);
        fetchReceptions();
        loadSpareParts(); // Reload spare parts to show updated quantities
      } else {
        toast.error(result.error || 'Không thể thêm phụ tùng');
      }
    } catch (error) {
      console.error('Error adding parts:', error);
      toast.error('Không thể thêm phụ tùng');
    }
  };

  const handleUpdateStatus = async (receptionId, newStatus) => {
    try {
      const result = await vehicleReceptionService.updateReceptionStatus(receptionId, newStatus);
      if (result.success) {
        toast.success('Đã cập nhật trạng thái');
        fetchReceptions();
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const handleCreatePayment = async (receptionId) => {
    try {
      const paymentResult = await paymentService.createPaymentFromReception(receptionId);
      if (paymentResult.success) {
        toast.success(`Đã tạo hóa đơn ${paymentResult.data.invoiceNumber}!`);
        fetchReceptions();
      } else {
        toast.error('Không thể tạo hóa đơn: ' + paymentResult.error);
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Không thể tạo hóa đơn thanh toán');
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Theo dõi tiếp nhận xe
        </h1>
        <p className="text-gray-600 mt-1">Quản lý và cập nhật trạng thái xe đang sửa chữa</p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <Card.Content className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên khách, SĐT, biển số..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="RECEIVED">Đã tiếp nhận</option>
              <option value="IN_PROGRESS">Đang xử lý</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
            </select>
          </div>
        </Card.Content>
      </Card>

      {/* Receptions List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <Card>
            <Card.Content className="p-12 text-center">
              <div className="animate-spin mx-auto h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách...</p>
            </Card.Content>
          </Card>
        ) : filteredReceptions.length === 0 ? (
          <Card>
            <Card.Content className="p-12 text-center">
              <FiAlertCircle className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có dữ liệu</h3>
              <p className="text-gray-500">Chưa có xe nào được tiếp nhận</p>
            </Card.Content>
          </Card>
        ) : (
          filteredReceptions.map((reception) => (
            <Card key={reception.receptionId} className="hover:shadow-lg transition-shadow">
              <Card.Content className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {reception.vehicleModel} - {reception.licensePlate}
                      </h3>
                      {getStatusBadge(reception.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Khách hàng:</p>
                        <p className="font-medium text-gray-900">{reception.customerName}</p>
                        <p className="text-gray-600">{reception.customerPhone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Kỹ thuật viên:</p>
                        <p className="font-medium text-gray-900">{reception.technicianName || 'Chưa phân công'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {(reception.totalCost || 0).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Dịch vụ:</p>
                  <div className="flex flex-wrap">
                    {formatServices(reception.services)}
                  </div>
                </div>

                {reception.notes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Ghi chú:</p>
                    <p className="text-sm text-gray-700 whitespace-pre-line">{reception.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 mt-4 pt-4 border-t">
                  {reception.status === 'RECEIVED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus(reception.receptionId, 'IN_PROGRESS')}
                      className="bg-yellow-600 hover:bg-yellow-700"
                    >
                      Bắt đầu xử lý
                    </Button>
                  )}
                  {reception.status === 'IN_PROGRESS' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddParts(reception)}
                        className="border-green-600 text-green-600 hover:bg-green-50"
                      >
                        <FiPackage className="mr-1" />
                        Thêm phụ tùng
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateStatus(reception.receptionId, 'COMPLETED')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <FiCheck className="mr-1" />
                        Hoàn thành
                      </Button>
                    </>
                  )}
                  {reception.status === 'COMPLETED' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleCreatePayment(reception.receptionId)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <FiDollarSign className="mr-1" />
                      Tạo hóa đơn
                    </Button>
                  )}
                </div>
              </Card.Content>
            </Card>
          ))
        )}
      </div>

      {/* Add Parts Modal */}
      {showAddPartsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-auto">
            <Card.Content className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Thêm phụ tùng - {selectedReception?.licensePlate}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-6 max-h-96 overflow-y-auto">
                {spareParts.map((part) => {
                  const partId = part.sparePartId || part.partId;
                  const partName = part.sparePartName || part.partName;
                  const partPrice = part.price || 0;
                  const stockQty = part.quantity || 0;

                  return (
                    <label
                      key={partId}
                      className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-green-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedParts.includes(partId)}
                        onChange={() => togglePartSelection(partId)}
                        className="w-4 h-4 text-green-600"
                        disabled={stockQty === 0}
                      />
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-900">{partName}</span>
                          <span className="text-sm font-bold text-green-600">
                            {partPrice.toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">Kho: {stockQty}</span>
                      </div>
                    </label>
                  );
                })}
              </div>

              <div className="flex justify-between items-center mb-4 p-4 bg-green-50 rounded-lg">
                <span className="font-semibold text-gray-900">Chi phí thêm:</span>
                <span className="text-2xl font-bold text-green-600">
                  {selectedParts.reduce((sum, partId) => {
                    const part = spareParts.find(p => (p.sparePartId || p.partId) === partId);
                    return sum + (part?.price || 0);
                  }, 0).toLocaleString('vi-VN')}₫
                </span>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddPartsModal(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveAdditionalParts}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Xác nhận thêm
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StaffReceptionTracking;
