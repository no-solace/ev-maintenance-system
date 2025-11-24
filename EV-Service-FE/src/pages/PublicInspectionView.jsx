import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Car, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const PublicInspectionView = () => {
  const { receptionId } = useParams();
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadInspection();
  }, [receptionId]);

  const loadInspection = async () => {
    try {
      const response = await api.get(`/inspections/reception/${receptionId}`);
      setInspection(response);
    } catch (error) {
      console.error('Load inspection error:', error);
      toast.error('Không thể tải báo cáo kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId) => {
    setProcessing(true);
    try {
      await api.post(`/inspections/items/${itemId}/approve`);
      toast.success('Đã chấp nhận thay thế');
      loadInspection(); // Reload to get updated data
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Không thể chấp nhận');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (itemId) => {
    setProcessing(true);
    try {
      await api.post(`/inspections/items/${itemId}/reject`);
      toast.success('Đã từ chối thay thế');
      loadInspection(); // Reload to get updated data
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Không thể từ chối');
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    const labels = {
      PENDING: 'Chờ duyệt',
      APPROVED: 'Đã chấp nhận',
      REJECTED: 'Đã từ chối'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'GOOD': return 'text-green-600';
      case 'FAIR': return 'text-yellow-600';
      case 'POOR': return 'text-orange-600';
      case 'CRITICAL': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getConditionLabel = (condition) => {
    const labels = {
      GOOD: 'Tốt',
      FAIR: 'Trung bình',
      POOR: 'Kém',
      CRITICAL: 'Nguy hiểm'
    };
    return labels[condition] || condition;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải báo cáo...</p>
        </div>
      </div>
    );
  }

  if (!inspection) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="mx-auto text-yellow-500" size={48} />
          <p className="mt-4 text-gray-600">Không tìm thấy báo cáo kiểm tra</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Car className="text-blue-600" size={32} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Báo cáo kiểm tra xe
              </h1>
              <p className="text-gray-600">
                Reception #{inspection.receptionId}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-600">Xe</p>
              <p className="font-semibold">{inspection.vehicleModel}</p>
              <p className="text-gray-700">{inspection.licensePlate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Thời gian dự kiến</p>
              <p className="font-semibold">{inspection.estimatedTimeHours} giờ</p>
            </div>
          </div>
        </div>

        {/* Vehicle Condition */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tình trạng xe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Pin</span>
              <span className={`font-semibold ${getConditionColor(inspection.batteryHealth)}`}>
                {getConditionLabel(inspection.batteryHealth)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Động cơ</span>
              <span className={`font-semibold ${getConditionColor(inspection.motorCondition)}`}>
                {getConditionLabel(inspection.motorCondition)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Phanh</span>
              <span className={`font-semibold ${getConditionColor(inspection.brakeCondition)}`}>
                {getConditionLabel(inspection.brakeCondition)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Lốp</span>
              <span className={`font-semibold ${getConditionColor(inspection.tireCondition)}`}>
                {getConditionLabel(inspection.tireCondition)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg md:col-span-2">
              <span className="text-gray-700">Hệ thống điện</span>
              <span className={`font-semibold ${getConditionColor(inspection.electricalSystem)}`}>
                {getConditionLabel(inspection.electricalSystem)}
              </span>
            </div>
          </div>

          {inspection.generalNotes && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Ghi chú</p>
              <p className="text-gray-800">{inspection.generalNotes}</p>
            </div>
          )}
        </div>

        {/* Inspection Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Chi tiết kiểm tra và thay thế
          </h2>

          {inspection.items && inspection.items.length > 0 ? (
            <div className="space-y-4">
              {inspection.items.map((item) => (
                <div
                  key={item.itemId}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.sparePartName}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.issueDescription}
                      </p>
                      {item.isCritical && (
                        <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-red-600">
                          <AlertTriangle size={14} />
                          Quan trọng
                        </span>
                      )}
                    </div>
                    <div className="ml-4">
                      {getStatusBadge(item.approvalStatus)}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">
                      Số lượng: {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      {(item.unitPrice * item.quantity).toLocaleString('vi-VN')} ₫
                    </span>
                  </div>

                  {item.approvalStatus === 'PENDING' && (
                    <div className="flex gap-3 pt-3 border-t">
                      <button
                        onClick={() => handleApprove(item.itemId)}
                        disabled={processing}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle size={18} />
                        Chấp nhận
                      </button>
                      <button
                        onClick={() => handleReject(item.itemId)}
                        disabled={processing}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                      >
                        <XCircle size={18} />
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Không có chi tiết thay thế
            </p>
          )}

          {/* Total Cost */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                Tổng chi phí dự kiến
              </span>
              <span className="text-2xl font-bold text-blue-600">
                {inspection.estimatedCost.toLocaleString('vi-VN')} ₫
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicInspectionView;
