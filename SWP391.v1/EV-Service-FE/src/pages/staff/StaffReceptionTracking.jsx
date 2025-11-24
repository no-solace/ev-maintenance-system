import React, { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiEdit, FiPackage, FiCheck, FiClock, FiAlertCircle, FiDollarSign, FiUserPlus, FiX } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import receptionService from '../../services/receptionService';
import { sparePartService } from '../../services/sparePartService';
import paymentService from '../../services/paymentService';
import bookingService from '../../services/bookingService';
import { getReceptionStatusConfig, getReceptionStatusOptions } from '../../utils/statusUtils';

const StaffReceptionTracking = () => {
  const [receptions, setReceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReception, setSelectedReception] = useState(null);
  const [showAddPartsModal, setShowAddPartsModal] = useState(false);
  const [spareParts, setSpareParts] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedReceptionForAssign, setSelectedReceptionForAssign] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(null);
  const [loadingTechnicians, setLoadingTechnicians] = useState(false);

  useEffect(() => {
    fetchReceptions();
    loadSpareParts();
    loadTechnicians();
  }, [statusFilter]);

  const fetchReceptions = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching receptions with filter:', statusFilter);
      let result;
      if (statusFilter === 'all') {
        result = await receptionService.getAllReceptions();
      } else {
        result = await receptionService.getReceptionsByStatus(statusFilter);
      }
      
      console.log('📦 Reception result:', result);

      if (result.success) {
        console.log('✅ Receptions loaded:', result.data.length, 'items');
        // Sort by receptionId descending (newest first)
        const sortedData = result.data.sort((a, b) => b.receptionId - a.receptionId);
        setReceptions(sortedData);
      } else {
        console.error('❌ Failed to load receptions:', result.error);
        toast.error(result.error);
      }
    } catch (error) {
      console.error('❌ Error fetching receptions:', error);
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

  const loadTechnicians = async () => {
    setLoadingTechnicians(true);
    try {
      const result = await bookingService.getMyTechnicians();
      console.log('\ud83d\udc65 Full technicians API response:', result);
      if (result.success) {
        console.log('\ud83d\udc65 Technicians data:', result.data);
        if (result.data && result.data.length > 0) {
          console.log('\ud83d\udc65 First technician object:', result.data[0]);
          console.log('\ud83d\udd11 Available keys:', Object.keys(result.data[0]));
        }
        setTechnicians(result.data || []);
      } else {
        console.error('Failed to load technicians:', result.error);
      }
    } catch (error) {
      console.error('Error loading technicians:', error);
    } finally {
      setLoadingTechnicians(false);
    }
  };

  /**
   * Sort receptions with priority logic:
   * - For RECEIVED status: Bookings first, then walk-ins, ordered by createdAt
   * - For other statuses: Default order (receptionId descending)
   */
  const sortReceptions = (receptionsToSort) => {
    return [...receptionsToSort].sort((a, b) => {
      // Only apply priority sorting for RECEIVED status
      if (a.status === 'RECEIVED' && b.status === 'RECEIVED') {
        // Priority 1: Bookings before walk-ins
        const aHasBooking = !!a.bookingId;
        const bHasBooking = !!b.bookingId;
        
        if (aHasBooking !== bHasBooking) {
          return bHasBooking ? 1 : -1; // bookings first
        }
        
        // Priority 2: Earlier arrival time (createdAt) first
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return aTime - bTime; // ascending (earlier first)
      }
      
      // For non-RECEIVED status, maintain default order (newest first)
      return b.receptionId - a.receptionId;
    });
  };

  const filteredReceptions = sortReceptions(
    receptions.filter(reception => {
      const searchLower = searchQuery.toLowerCase();
      return (
        reception.customerName?.toLowerCase().includes(searchLower) ||
        reception.customerPhone?.includes(searchLower) ||
        reception.licensePlate?.toLowerCase().includes(searchLower)
      );
    })
  );
  
  console.log('📋 Rendering with:', {
    totalReceptions: receptions.length,
    filteredReceptions: filteredReceptions.length,
    statusFilter,
    loading
  });

  const getStatusBadge = (status) => {
    const { label, color } = getReceptionStatusConfig(status);
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
        {label}
      </span>
    );
  };

  const formatServices = (services) => {
    if (!services || services.length === 0) return 'Không có dịch vụ';
    
    // Handle if services is a string (comma-separated)
    const serviceArray = typeof services === 'string' ? services.split(',') : services;
    
    return serviceArray.map((service, index) => {
      const serviceName = service.trim();
      
      // Determine icon and color based on service name keywords
      let icon = '📋';
      let color = 'bg-gray-50 text-gray-700 border-gray-200';
      
      const lowerService = serviceName.toLowerCase();
      if (lowerService.includes('bảo dưỡng') || lowerService.includes('maintenance')) {
        icon = '🔧';
        color = 'bg-blue-50 text-blue-700 border-blue-200';
      } else if (lowerService.includes('thay') || lowerService.includes('replacement')) {
        icon = '🔩';
        color = 'bg-green-50 text-green-700 border-green-200';
      } else if (lowerService.includes('sửa') || lowerService.includes('repair')) {
        icon = '⚙️';
        color = 'bg-orange-50 text-orange-700 border-orange-200';
      }
      
      return (
        <span
          key={index}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${color} mr-2 mb-1`}
        >
          <span>{icon}</span>
          <span>{serviceName}</span>
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
      const result = await receptionService.addSpareParts(
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
      const result = await receptionService.updateReceptionStatus(receptionId, newStatus);
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

  const handleAssignTechnician = (reception) => {
    setSelectedReceptionForAssign(reception);
    setSelectedTechnicianId(null);
    setShowAssignModal(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedTechnicianId) {
      toast.error('Vui lòng chọn kỹ thuật viên');
      return;
    }

    try {
      const result = await receptionService.assignTechnician(
        selectedReceptionForAssign.receptionId,
        selectedTechnicianId
      );

      if (result.success) {
        // Update status to ASSIGNED
        const statusResult = await receptionService.updateReceptionStatus(
          selectedReceptionForAssign.receptionId,
          'ASSIGNED'
        );
        
        if (!statusResult.success) {
          console.warn('Failed to update status to ASSIGNED:', statusResult.error);
        }
        
        const selectedTech = technicians.find(t => {
          const techId = t.id || t.technicianId || t.userId || t.employeeId;
          return techId === selectedTechnicianId;
        });
        const techName = selectedTech?.fullName || selectedTech?.name || selectedTech?.employeeName || 'k\u1ef9 thu\u1eadt vi\u00ean';
        toast.success(`\u0110\u00e3 giao vi\u1ec7c cho ${techName}`);
        setShowAssignModal(false);
        setSelectedReceptionForAssign(null);
        setSelectedTechnicianId(null);
        fetchReceptions();
      } else {
        toast.error(result.error || 'Không thể giao việc');
      }
    } catch (error) {
      console.error('Error assigning technician:', error);
      toast.error('Không thể giao việc cho kỹ thuật viên');
    }
  };

  /**
   * Group receptions by hour for time-slot view
   */
  const groupReceptionsByHour = (receptionsToGroup) => {
    const grouped = {};
    
    receptionsToGroup.forEach(reception => {
      const createdDate = new Date(reception.createdAt);
      const hour = createdDate.getHours();
      const hourKey = `${hour}:00`;
      
      if (!grouped[hourKey]) {
        grouped[hourKey] = [];
      }
      grouped[hourKey].push(reception);
    });
    
    return grouped;
  };

  /**
   * Render time-slot table for RECEIVED status
   */
  const renderTimeSlotTable = () => {
    const groupedReceptions = groupReceptionsByHour(filteredReceptions);
    const hours = Object.keys(groupedReceptions).sort();
    
    if (hours.length === 0) {
      return (
        <Card>
          <Card.Content className="p-12 text-center">
            <FiClock className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có đơn chờ giao việc</h3>
            <p className="text-gray-500">Chưa có xe nào ở trạng thái chờ giao việc</p>
          </Card.Content>
        </Card>
      );
    }
    
    return (
      <div className="space-y-6">
        {hours.map(hour => (
          <Card key={hour} className="border-l-4 border-blue-500">
            <Card.Content className="p-0">
              {/* Time slot header */}
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiClock className="text-blue-600" />
                    <h3 className="font-semibold text-blue-900">{hour} - {parseInt(hour) + 1}:00</h3>
                  </div>
                  <span className="text-sm font-medium text-blue-700">
                    {groupedReceptions[hour].length} đơn
                  </span>
                </div>
              </div>
              
              {/* Receptions in this time slot */}
              <div className="divide-y divide-gray-200">
                {groupedReceptions[hour].map(reception => (
                  <div key={reception.receptionId} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Reception info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">#{reception.receptionId}</span>
                          {reception.bookingId ? (
                            <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                              Đã hẹn trước
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                              Vãng lai
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {new Date(reception.createdAt).toLocaleTimeString('vi-VN', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Khách hàng</p>
                            <p className="font-medium text-gray-900">{reception.customerName}</p>
                            <p className="text-gray-600">{reception.customerPhone}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Xe</p>
                            <p className="font-medium text-gray-900">{reception.vehicleModel}</p>
                            <p className="text-gray-600">{reception.licensePlate}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Gói dịch vụ</p>
                            <p className="font-medium text-gray-900">{reception.packageName || 'Sửa chữa'}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right: Assign button */}
                      <div className="flex-shrink-0">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAssignTechnician(reception)}
                        >
                          <FiUserPlus className="mr-2" />
                          Giao việc
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    );
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

      {/* Search */}
      <Card className="mb-4">
        <Card.Content className="p-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên khách, SĐT, biển số..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card.Content>
      </Card>

      {/* Status Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
              statusFilter === 'all'
                ? 'text-green-600 border-green-600'
                : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
            }`}
          >
            Tất cả
            {statusFilter === 'all' && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                {receptions.length}
              </span>
            )}
          </button>
          {getReceptionStatusOptions().map(option => {
            const count = receptions.filter(r => r.status === option.value).length;
            return (
              <button
                key={option.value}
                onClick={() => setStatusFilter(option.value)}
                className={`px-4 py-3 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                  statusFilter === option.value
                    ? 'text-green-600 border-green-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {option.label}
                {count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                    statusFilter === option.value
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Receptions List - Different layout for RECEIVED status */}
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
            <p className="text-gray-500">Chưa có xe nào ở trạng thái này</p>
          </Card.Content>
        </Card>
      ) : statusFilter === 'RECEIVED' ? (
        // Time-slot table for RECEIVED status
        renderTimeSlotTable()
      ) : (
        // Card list for other statuses
        <div className="grid grid-cols-1 gap-4">
          {filteredReceptions.map((reception) => (
            <Card key={reception.receptionId} className="hover:shadow-lg transition-shadow">
              <Card.Content className="p-6">
                {/* Header with Reception ID */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Phiếu tiếp nhận #{reception.receptionId}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(reception.status)}
                        {reception.bookingId ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                            Đã hẹn trước
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            Khách vãng lai
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {reception.vehicleModel} - {reception.licensePlate}
                    </p>
                  </div>
                  
                  {/* Customer and Technician Info */}
                  <div className="flex gap-8 text-sm ml-4">
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Khách hàng</p>
                      <p className="font-medium text-gray-900">{reception.customerName}</p>
                      <p className="text-gray-600">{reception.customerPhone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs mb-1">Kỹ thuật viên</p>
                      <p className="font-medium text-gray-900">{reception.technicianName || 'Chưa phân công'}</p>
                    </div>
                  </div>
                </div>

                {/* Details Section - Package and Spare Parts */}
                {((reception.packageName && reception.packagePrice) || (reception.spareParts && reception.spareParts.length > 0)) && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Chi tiết dịch vụ:</p>
                    
                    {/* Package Table */}
                    {reception.packageName && reception.packagePrice && (
                      <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
                        <table className="w-full text-sm">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="px-3 py-2.5 text-left text-blue-900 font-medium">Gói bảo dưỡng</th>
                              <th className="px-3 py-2.5 text-right text-blue-900 font-medium w-32">Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-gray-200 bg-blue-50">
                              <td className="px-3 py-2.5 text-gray-900">{reception.packageName}</td>
                              <td className="px-3 py-2.5 text-right font-semibold text-gray-900">
                                {(reception.packagePrice || 0).toLocaleString('vi-VN')}₫
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Spare Parts Table */}
                    {reception.spareParts && reception.spareParts.length > 0 && (
                      <div className="border border-gray-200 rounded-lg overflow-hidden mb-3">
                        <table className="w-full text-sm">
                          <thead className="bg-green-100">
                            <tr>
                              <th className="px-3 py-2.5 text-left text-green-900 font-medium">Phụ tùng sử dụng</th>
                              <th className="px-2 py-2.5 text-center text-green-900 font-medium w-36">Loại</th>
                              <th className="px-3 py-2.5 text-center text-green-900 font-medium w-16">SL</th>
                              <th className="px-3 py-2.5 text-right text-green-900 font-medium w-28">Đơn giá</th>
                              <th className="px-3 py-2.5 text-right text-green-900 font-medium w-32">Thành tiền</th>
                            </tr>
                          </thead>
                          <tbody>
                            {reception.spareParts.map((part, index) => {
                              // Determine if part was added initially or later
                              const receptionTime = new Date(reception.createdAt).getTime();
                              const partRequestTime = new Date(part.requestedAt).getTime();
                              const timeDiff = Math.abs(partRequestTime - receptionTime) / 1000 / 60;
                              const isInitial = timeDiff <= 5;
                              
                              return (
                                <tr key={index} className="border-t border-gray-200 bg-green-50">
                                  <td className="px-3 py-2.5 text-gray-900">{part.sparePartName}</td>
                                  <td className="px-2 py-2.5 text-center">
                                    {isInitial ? (
                                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700 whitespace-nowrap">
                                        Khách hàng yêu cầu
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-orange-100 text-orange-700 whitespace-nowrap">
                                        Gợi ý thay thế
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2.5 text-center text-gray-900 font-medium">{part.quantity}</td>
                                  <td className="px-3 py-2.5 text-right text-gray-900">
                                    {(part.unitPrice || 0).toLocaleString('vi-VN')}₫
                                  </td>
                                  <td className="px-3 py-2.5 text-right font-semibold text-gray-900">
                                    {((part.unitPrice || 0) * (part.quantity || 1)).toLocaleString('vi-VN')}₫
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Total Row */}
                    <div className="flex justify-between items-center p-3 bg-gray-100 border border-gray-300 rounded-lg">
                      <span className="text-base font-semibold text-gray-900">Tổng cộng:</span>
                      <span className="text-xl font-bold text-gray-900">
                        {(() => {
                          const packageTotal = reception.packagePrice || 0;
                          const partsTotal = reception.spareParts?.reduce((sum, part) => 
                            sum + ((part.unitPrice || 0) * (part.quantity || 1)), 0) || 0;
                          return (packageTotal + partsTotal).toLocaleString('vi-VN');
                        })()}₫
                      </span>
                    </div>
                  </div>
                )}

                {reception.notes && reception.notes.trim() !== '' && (
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
          ))}
        </div>
      )}

      {/* Assign Technician Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full">
            <Card.Content className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Giao việc - Phiếu #{selectedReceptionForAssign?.receptionId}
                </h2>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Reception Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Khách hàng</p>
                    <p className="font-medium text-gray-900">{selectedReceptionForAssign?.customerName}</p>
                    <p className="text-gray-600">{selectedReceptionForAssign?.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Xe</p>
                    <p className="font-medium text-gray-900">{selectedReceptionForAssign?.vehicleModel}</p>
                    <p className="text-gray-600">{selectedReceptionForAssign?.licensePlate}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Dịch vụ</p>
                  <p className="font-medium text-gray-900">{selectedReceptionForAssign?.packageName || 'Sửa chữa'}</p>
                </div>
              </div>

              {/* Technician Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Chọn kỹ thuật viên <span className="text-red-500">*</span>
                </label>
                {loadingTechnicians ? (
                  <div className="text-center py-8">
                    <div className="animate-spin mx-auto h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
                    <p className="text-gray-600 mt-2">Đang tải...</p>
                  </div>
                ) : technicians.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FiAlertCircle className="mx-auto text-4xl text-gray-300 mb-2" />
                    <p className="text-gray-600">Không có kỹ thuật viên khả dụng</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {technicians.map((tech) => {
                      // Try multiple possible ID field names
                      const techId = tech.id || tech.technicianId || tech.userId || tech.employeeId;
                      // Try multiple possible name field names
                      const techName = tech.fullName || tech.name || tech.employeeName || tech.username || 'K\u1ef9 thu\u1eadt vi\u00ean';
                      const isAvailable = tech.workingStatus === 'AVAILABLE';
                      const isSelected = selectedTechnicianId === techId;
                      
                      console.log('\ud83d\udd27 Tech:', techName, '| ID:', techId, '| Status:', tech.workingStatus, '| Selected:', isSelected, '| Full object:', tech);
                      
                      return (
                        <div
                          key={techId}
                          onClick={() => {
                            console.log('🖱️ Clicked:', techName, '| Available:', isAvailable, '| Tech ID:', techId);
                            if (isAvailable) {
                              console.log('✅ Setting selectedTechnicianId to:', techId);
                              setSelectedTechnicianId(techId);
                              console.log('✅ State should now be:', techId);
                            } else {
                              console.log('❌ Tech not available');
                            }
                          }}
                          className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all cursor-pointer ${
                            isSelected
                              ? 'border-green-500 bg-green-50 shadow-md'
                              : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                          } ${
                            !isAvailable
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                        >
                          <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 border-2 rounded-full transition-all"
                            style={{
                              borderColor: isSelected ? '#10b981' : '#d1d5db',
                              backgroundColor: isSelected ? '#10b981' : 'transparent'
                            }}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-gray-900">{techName}</p>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                tech.workingStatus === 'AVAILABLE'
                                  ? 'bg-green-100 text-green-700'
                                  : tech.workingStatus === 'ON_WORKING'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-700'
                              }`}>
                                {tech.workingStatus === 'AVAILABLE' ? 'Sẵn sàng' : 
                                 tech.workingStatus === 'ON_WORKING' ? 'Đang làm việc' : 'Không khả dụng'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  variant="primary"
                  onClick={handleConfirmAssign}
                  disabled={!selectedTechnicianId || loadingTechnicians}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <FiUserPlus className="mr-2" />
                  Xác nhận giao việc
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}

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
