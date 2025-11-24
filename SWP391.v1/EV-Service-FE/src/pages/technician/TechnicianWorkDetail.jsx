import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckSquare, FiArrowLeft, FiPackage, FiTool, FiTruck, FiUser } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { getInspectionDetailsForReception, updateInspectionRecordStatus } from '../../services/inspectionService';
import technicianService from '../../services/technicianService';

const TechnicianWorkDetail = () => {
  const { receptionId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('checklist'); // 'checklist' or 'spare-parts'
  const [loading, setLoading] = useState(true);
  const [inspectionData, setInspectionData] = useState(null);
  const [spareParts, setSpareParts] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [localChanges, setLocalChanges] = useState({});

  useEffect(() => {
    if (receptionId) {
      fetchWorkDetails();
    }
  }, [receptionId]);

  const fetchWorkDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch inspection details
      const inspectionResponse = await getInspectionDetailsForReception(receptionId);
      setInspectionData(inspectionResponse);
      
      // Fetch spare parts for this reception
      const sparePartsResult = await technicianService.getSpareParts(receptionId);
      
      if (sparePartsResult.success) {
        setSpareParts(sparePartsResult.data || []);
      }
      
    } catch (error) {
      console.error('Error fetching work details:', error);
      if (error.response?.status === 404) {
        toast.error('Không tìm thấy thông tin công việc');
      } else {
        toast.error('Lỗi khi tải thông tin công việc');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = (recordId, newStatus) => {
    setLocalChanges(prev => ({
      ...prev,
      [recordId]: newStatus
    }));
  };

  const handleSubmitChecklist = async () => {
    const totalTasks = inspectionData?.records.length || 0;
    const selectedTasks = Object.keys(localChanges).length;
    const alreadyCompleted = inspectionData?.records.filter(r => r.actualStatus !== 'PENDING').length || 0;
    const totalSelected = selectedTasks + alreadyCompleted;
    
    if (totalSelected < totalTasks) {
      toast.error(`Vui lòng chọn action cho tất cả ${totalTasks} hạng mục`);
      return;
    }

    if (selectedTasks === 0) {
      toast.info('Không có thay đổi mới');
      return;
    }

    try {
      setUpdating(true);
      
      for (const [recordId, status] of Object.entries(localChanges)) {
        await updateInspectionRecordStatus(parseInt(recordId), status);
      }
      
      toast.success('Đã cập nhật checklist thành công!');
      setLocalChanges({});
      await fetchWorkDetails();
      
    } catch (error) {
      console.error('Error updating checklist:', error);
      toast.error('Lỗi khi cập nhật checklist');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'COMPLETED': { label: 'Hoàn thành', color: 'bg-green-100 text-green-800' },
      'SKIPPED': { label: 'Bỏ qua', color: 'bg-gray-100 text-gray-800' },
      'PENDING': { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' }
    };
    const config = statusMap[status] || statusMap['PENDING'];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/technician/work-orders')}
            className="border-gray-300"
          >
            <FiArrowLeft className="mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chi tiết công việc</h1>
            <p className="text-gray-600">Reception #{receptionId}</p>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      {inspectionData?.reception && (
        <Card className="mb-6">
          <Card.Content className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <FiUser className="text-blue-600 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Khách hàng</p>
                  <p className="font-semibold">{inspectionData.reception.customerName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiTruck className="text-blue-600 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Xe</p>
                  <p className="font-semibold">
                    {inspectionData.reception.vehicleModel} - {inspectionData.reception.licensePlate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiPackage className="text-blue-600 text-xl" />
                <div>
                  <p className="text-sm text-gray-600">Gói bảo dưỡng</p>
                  <p className="font-semibold">{inspectionData.reception.packageName || 'Không có'}</p>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('checklist')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'checklist'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiCheckSquare className="inline mr-2" />
            Checklist
            {inspectionData?.records && (
              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {inspectionData.records.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('spare-parts')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'spare-parts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiTool className="inline mr-2" />
            Phụ tùng
            {spareParts.length > 0 && (
              <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                {spareParts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'checklist' && (
        <div>
          {inspectionData?.records && inspectionData.records.length > 0 ? (
            <>
              <Card>
                <Card.Content className="p-6">
                  <div className="space-y-4">
                    {inspectionData.records.map((record) => {
                      const currentStatus = localChanges[record.recordId] || record.actualStatus;
                      
                      return (
                        <div
                          key={record.recordId}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {record.taskName}
                              </h3>
                              {record.taskDescription && (
                                <p className="text-sm text-gray-600 mb-3">{record.taskDescription}</p>
                              )}
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleToggleTask(record.recordId, 'COMPLETED')}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    currentStatus === 'COMPLETED'
                                      ? 'bg-green-600 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  ✓ Hoàn thành
                                </button>
                                <button
                                  onClick={() => handleToggleTask(record.recordId, 'SKIPPED')}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    currentStatus === 'SKIPPED'
                                      ? 'bg-gray-600 text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  ⊘ Bỏ qua
                                </button>
                              </div>
                            </div>
                            <div className="ml-4">
                              {getStatusBadge(currentStatus)}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card.Content>
              </Card>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSubmitChecklist}
                  disabled={updating || Object.keys(localChanges).length === 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updating ? 'Đang lưu...' : 'Lưu checklist'}
                </Button>
              </div>
            </>
          ) : (
            <Card>
              <Card.Content className="p-8 text-center">
                <FiCheckSquare className="mx-auto text-gray-400 text-5xl mb-4" />
                <p className="text-gray-600">Không có checklist cho công việc này</p>
              </Card.Content>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'spare-parts' && (
        <div>
          {spareParts.length > 0 ? (
            <Card>
              <Card.Content className="p-6">
                <div className="space-y-3">
                  {spareParts.map((part, index) => (
                    <div
                      key={part.sparePartId || index}
                      className="p-4 border border-gray-200 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{part.partName || part.sparePartName}</h3>
                        {part.partNumber && (
                          <p className="text-sm text-gray-600">Mã: {part.partNumber}</p>
                        )}
                        {part.category && (
                          <span className="inline-block mt-1 text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                            {part.category}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-600">
                          {(part.price || part.unitPrice)?.toLocaleString('vi-VN')} ₫
                        </p>
                        <p className="text-sm text-gray-600">Số lượng: 1</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-orange-600">
                      {spareParts
                        .reduce((sum, part) => sum + (part.price || part.unitPrice || 0), 0)
                        .toLocaleString('vi-VN')} ₫
                    </span>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ) : (
            <Card>
              <Card.Content className="p-8 text-center">
                <FiTool className="mx-auto text-gray-400 text-5xl mb-4" />
                <p className="text-gray-600">Không có phụ tùng cần thay thế</p>
              </Card.Content>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default TechnicianWorkDetail;
