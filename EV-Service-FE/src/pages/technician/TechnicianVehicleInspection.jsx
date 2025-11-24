import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Car, AlertCircle, Plus, Trash2, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const TechnicianVehicleInspection = () => {
  const { bookingId, receptionId } = useParams();
  const navigate = useNavigate();
  const isReception = window.location.pathname.includes('/reception/');
  const id = isReception ? receptionId : bookingId;
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [spareParts, setSpareParts] = useState([]);
  
  const [inspection, setInspection] = useState({
    bookingId: id || '',
    generalNotes: '',
    batteryHealth: 'GOOD',
    motorCondition: 'GOOD',
    brakeCondition: 'GOOD',
    tireCondition: 'GOOD',
    electricalSystem: 'GOOD',
    estimatedCost: 0,
    estimatedTimeHours: 1,
    items: []
  });

  useEffect(() => {
    if (id) {
      loadBooking(id);
      loadSpareParts();
    }
  }, [id]);

  const loadBooking = async (id) => {
    try {
      // Load reception or booking based on type
      const endpoint = isReception ? `/vehicle-receptions/${id}` : `/bookings/${id}`;
      const response = await api.get(endpoint);
      setBooking(response);
      setInspection(prev => ({ ...prev, bookingId: parseInt(id) }));
    } catch (error) {
      console.error('Load error:', error);
      toast.error('Không thể tải thông tin');
    }
  };

  const loadSpareParts = async () => {
    try {
      const response = await api.get('/spare-parts');
      setSpareParts(response);
    } catch (error) {
      console.error('Load spare parts error:', error);
    }
  };

  const addItem = () => {
    setInspection(prev => ({
      ...prev,
      items: [...prev.items, {
        sparePartId: null,
        quantity: 1,
        unitPrice: 0,
        issueDescription: '',
        isCritical: false
      }]
    }));
  };

  const removeItem = (index) => {
    setInspection(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index, field, value) => {
    setInspection(prev => ({
      ...prev,
      items: prev.items.map((item, i) => {
        if (i === index) {
          const updated = { ...item, [field]: value };
          
          // Auto-calculate unit price when spare part is selected
          if (field === 'sparePartId') {
            const part = spareParts.find(p => p.partId === parseInt(value));
            if (part) {
              updated.unitPrice = part.unitPrice;
            }
          }
          
          return updated;
        }
        return item;
      })
    }));
  };

  const calculateTotalCost = () => {
    const itemsCost = inspection.items.reduce((sum, item) => {
      return sum + (item.unitPrice * item.quantity);
    }, 0);
    return itemsCost;
  };

  const handleSubmit = async () => {
    if (!inspection.bookingId) {
      toast.error('Thiếu thông tin booking ID');
      return;
    }

    const totalCost = calculateTotalCost();
    const payload = {
      ...inspection,
      estimatedCost: totalCost
    };

    setLoading(true);
    try {
      // Use different endpoint for reception vs booking
      const endpoint = isReception ? '/inspections/reception' : '/inspections';
      const response = await api.post(endpoint, payload);
      console.log('✅ Inspection created:', response);
      toast.success('Đã tạo báo cáo kiểm tra!');
      
      // Navigate back to work orders
      setTimeout(() => {
        navigate('/technician/work-orders');
      }, 1500);
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Không thể tạo báo cáo: ' + (error.response?.data || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (!booking) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Car size={28} />
            {isReception ? `Kiểm tra xe - Reception #${booking.receptionId}` : `Kiểm tra xe - Booking #${booking.bookingId}`}
          </h1>
          <p className="text-gray-600 mt-1">
            {booking.vehicleModel} - {booking.licensePlate}
          </p>
        </div>

        {/* Vehicle Condition Assessment */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Đánh giá tình trạng xe</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {['batteryHealth', 'motorCondition', 'brakeCondition', 'tireCondition', 'electricalSystem'].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {field === 'batteryHealth' ? 'Pin' :
                   field === 'motorCondition' ? 'Động cơ' :
                   field === 'brakeCondition' ? 'Phanh' :
                   field === 'tireCondition' ? 'Lốp' : 'Hệ thống điện'}
                </label>
                <select
                  value={inspection[field]}
                  onChange={(e) => setInspection({...inspection, [field]: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="GOOD">Tốt</option>
                  <option value="FAIR">Trung bình</option>
                  <option value="POOR">Kém</option>
                  <option value="CRITICAL">Nguy hiểm</option>
                </select>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời gian dự kiến (giờ)
            </label>
            <input
              type="number"
              value={inspection.estimatedTimeHours}
              onChange={(e) => setInspection({...inspection, estimatedTimeHours: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú chung
            </label>
            <textarea
              value={inspection.generalNotes}
              onChange={(e) => setInspection({...inspection, generalNotes: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập ghi chú về tình trạng tổng thể..."
            />
          </div>
        </div>

        {/* Spare Parts Needed */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Phụ tùng cần thay</h2>
            <button
              onClick={addItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Plus size={18} />
              Thêm phụ tùng
            </button>
          </div>

          <div className="space-y-4">
            {inspection.items.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 relative">
                <button
                  onClick={() => removeItem(index)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phụ tùng</label>
                    <select
                      value={item.sparePartId || ''}
                      onChange={(e) => updateItem(index, 'sparePartId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">Chọn phụ tùng...</option>
                      {spareParts.map(part => (
                        <option key={part.partId} value={part.partId}>
                          {part.partName} - {part.unitPrice.toLocaleString()}đ
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      min="1"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả vấn đề</label>
                  <textarea
                    value={item.issueDescription}
                    onChange={(e) => updateItem(index, 'issueDescription', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Mô tả vấn đề cần sửa..."
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={item.isCritical}
                    onChange={(e) => updateItem(index, 'isCritical', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={16} />
                    Cần sửa ngay (Quan trọng)
                  </label>
                </div>

                {item.sparePartId && (
                  <div className="mt-2 text-sm text-gray-600">
                    Thành tiền: <strong>{(item.unitPrice * item.quantity).toLocaleString()}đ</strong>
                  </div>
                )}
              </div>
            ))}

            {inspection.items.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Chưa có phụ tùng cần thay. Click "Thêm phụ tùng" để thêm.
              </div>
            )}
          </div>

          {inspection.items.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-right">
                <span className="text-lg font-semibold text-gray-900">
                  Tổng chi phí dự kiến: {calculateTotalCost().toLocaleString()}đ
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate('/technician/work-orders')}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Send size={18} />
            {loading ? 'Đang gửi...' : 'Gửi báo cáo cho khách hàng'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianVehicleInspection;
