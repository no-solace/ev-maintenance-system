import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertTriangle, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

const CustomerInspectionApproval = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  
  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookingId) {
      loadInspection();
    }
  }, [bookingId]);

  const loadInspection = async () => {
    try {
      const response = await api.get(`/inspections/booking/${bookingId}`);
      setInspection(response);
    } catch (error) {
      console.error('Load inspection error:', error);
      toast.error('Không tìm thấy báo cáo kiểm tra');
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Bạn đồng ý với báo cáo kiểm tra và chi phí sửa chữa?')) {
      return;
    }

    setLoading(true);
    try {
      await api.post(`/inspections/${inspection.inspectionId}/approve`);
      toast.success('Đã xác nhận báo cáo!');
      loadInspection();
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Không thể xác nhận');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Bạn từ chối báo cáo này? Kỹ thuật viên sẽ phải kiểm tra lại.')) {
      return;
    }

    setLoading(true);
    try {
      await api.post(`/inspections/${inspection.inspectionId}/reject`);
      toast.success('Đã từ chối báo cáo');
      navigate('/app/my-bookings');
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Không thể từ chối');
    } finally {
      setLoading(false);
    }
  };

  if (!inspection) {
    return <div className="p-6"><div className="text-center">Đang tải...</div></div>;
  }

  const getConditionBadge = (condition) => {
    const colors = {
      GOOD: 'bg-green-100 text-green-800',
      FAIR: 'bg-yellow-100 text-yellow-800',
      POOR: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800'
    };
    return colors[condition] || 'bg-gray-100 text-gray-800';
  };

  const getConditionText = (condition) => {
    const texts = { GOOD: 'Tốt', FAIR: 'Trung bình', POOR: 'Kém', CRITICAL: 'Nguy hiểm' };
    return texts[condition] || condition;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Báo cáo kiểm tra xe
          </h1>
          <p className="text-gray-600">
            Booking #{inspection.bookingId} - {inspection.vehicleModel} ({inspection.licensePlate})
          </p>
          <div className="mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              inspection.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
              inspection.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
              inspection.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {inspection.status}
            </span>
          </div>
        </div>

        {/* Vehicle Condition */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tình trạng xe</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Pin', value: inspection.batteryHealth },
              { label: 'Động cơ', value: inspection.motorCondition },
              { label: 'Phanh', value: inspection.brakeCondition },
              { label: 'Lốp', value: inspection.tireCondition },
              { label: 'Hệ thống điện', value: inspection.electricalSystem }
            ].map(item => (
              <div key={item.label} className="border rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">{item.label}</div>
                <span className={`px-2 py-1 rounded text-sm font-medium ${getConditionBadge(item.value)}`}>
                  {getConditionText(item.value)}
                </span>
              </div>
            ))}
          </div>
          {inspection.generalNotes && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <strong>Ghi chú:</strong> {inspection.generalNotes}
            </div>
          )}
        </div>

        {/* Spare Parts Needed */}
        {inspection.items && inspection.items.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Phụ tùng cần thay</h2>
            <div className="space-y-3">
              {inspection.items.map((item, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.sparePartName}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.issueDescription}</p>
                    </div>
                    {item.isCritical && (
                      <span className="flex items-center gap-1 text-red-600 text-sm">
                        <AlertTriangle size={16} />
                        Quan trọng
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Số lượng: {item.quantity}</span>
                    <span className="font-medium">{item.totalPrice.toLocaleString()}đ</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="text-blue-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">Tóm tắt chi phí</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Thời gian dự kiến:</span>
              <span className="font-medium">{inspection.estimatedTimeHours} giờ</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Tổng chi phí:</span>
              <span className="font-bold text-blue-600">
                {inspection.estimatedCost.toLocaleString()}đ
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {inspection.status === 'PENDING' && (
          <div className="flex gap-4">
            <button
              onClick={handleReject}
              disabled={loading}
              className="flex-1 px-6 py-3 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              <XCircle size={20} />
              Từ chối
            </button>
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium flex items-center justify-center gap-2"
            >
              <CheckCircle size={20} />
              {loading ? 'Đang xử lý...' : 'Đồng ý sửa chữa'}
            </button>
          </div>
        )}

        {inspection.status === 'APPROVED' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <CheckCircle className="mx-auto text-green-600 mb-2" size={48} />
            <p className="text-green-800 font-medium">
              Bạn đã xác nhận báo cáo. Kỹ thuật viên đang thực hiện sửa chữa.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerInspectionApproval;
