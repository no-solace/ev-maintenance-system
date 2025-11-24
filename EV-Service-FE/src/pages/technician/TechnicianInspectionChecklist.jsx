import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiCheckSquare, FiArrowLeft, FiClock, FiUser, FiTruck, FiPackage } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';
import { getInspectionDetailsForReception, updateInspectionRecordStatus } from '../../services/inspectionService';

const TechnicianInspectionChecklist = () => {
  const { receptionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [inspectionData, setInspectionData] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [localChanges, setLocalChanges] = useState({}); // Store local changes before submit

  useEffect(() => {
    if (receptionId) {
      fetchInspectionDetails();
    }
  }, [receptionId]);

  const fetchInspectionDetails = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching inspection details for reception:', receptionId);
      
      const data = await getInspectionDetailsForReception(receptionId);
      console.log('✅ Inspection data:', data);
      setInspectionData(data);
    } catch (error) {
      console.error('❌ Error fetching inspection details:', error);
      
      if (error.response?.status === 404) {
        toast.error('Không tìm thấy danh sách kiểm tra. Có thể reception chưa có gói bảo dưỡng.');
      } else {
        toast.error('Lỗi khi tải danh sách kiểm tra');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = (recordId, newStatus) => {
    // Store changes locally, don't call API yet
    setLocalChanges(prev => ({
      ...prev,
      [recordId]: newStatus
    }));
  };

  const handleSubmitAll = async () => {
    // Check if all tasks have been selected
    const totalTasks = inspectionData?.records.length || 0;
    const selectedTasks = Object.keys(localChanges).length;
    
    // Count tasks that already have status (not PENDING)
    const alreadyCompleted = inspectionData?.records.filter(r => r.actualStatus !== 'PENDING').length || 0;
    
    // Total selected = new selections + already completed
    const totalSelected = selectedTasks + alreadyCompleted;
    
    if (totalSelected < totalTasks) {
      toast.error(`Vui lòng chọn action cho tất cả ${totalTasks} hạng mục (đã chọn: ${totalSelected})`);
      return;
    }

    if (selectedTasks === 0) {
      toast.info('Không có thay đổi mới để lưu');
      return;
    }

    try {
      setUpdating(true);
      
      // Update all changed records
      for (const [recordId, status] of Object.entries(localChanges)) {
        await updateInspectionRecordStatus(parseInt(recordId), status);
      }

      // Clear local changes and refresh
      setLocalChanges({});
      await fetchInspectionDetails();
      toast.success(`Đã cập nhật ${selectedTasks} hạng mục!`);
    } catch (error) {
      console.error('Error updating records:', error);
      toast.error('Lỗi khi cập nhật');
    } finally {
      setUpdating(false);
    }
  };



  // Group records by category
  const groupedRecords = inspectionData?.records.reduce((acc, record) => {
    const category = record.task.categoryDisplayName || record.task.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(record);
    return acc;
  }, {}) || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải danh sách kiểm tra...</p>
        </div>
      </div>
    );
  }

  const handleCreateRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/inspection-records/reception/${receptionId}/create`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('ev_auth_token')}`
          }
        }
      );

      if (response.ok) {
        toast.success('Đã tạo danh sách kiểm tra!');
        await fetchInspectionDetails();
      } else {
        const errorText = await response.text();
        toast.error(errorText || 'Không thể tạo danh sách kiểm tra');
      }
    } catch (error) {
      console.error('Error creating records:', error);
      toast.error('Lỗi khi tạo danh sách kiểm tra');
    } finally {
      setLoading(false);
    }
  };

  if (!inspectionData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card>
          <Card.Content className="p-12 text-center">
            <FiPackage className="mx-auto text-5xl text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không tìm thấy danh sách kiểm tra
            </h3>
            <p className="text-gray-500 mb-4">
              Reception này chưa có danh sách kiểm tra. Có thể do:
            </p>
            <ul className="text-sm text-gray-600 mb-6 text-left max-w-md mx-auto">
              <li>• Reception chưa có gói bảo dưỡng</li>
              <li>• Reception được tạo trước khi có tính năng này</li>
            </ul>
            <div className="flex gap-3 justify-center">
              <Button onClick={handleCreateRecords} variant="primary">
                Tạo danh sách kiểm tra
              </Button>
              <Button onClick={() => navigate(-1)} variant="outline">
                <FiArrowLeft className="mr-2" />
                Quay lại
              </Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  }

  // Calculate completed tasks (not PENDING)
  const completedTasksCount = inspectionData?.records.filter(r => r.actualStatus !== 'PENDING').length || 0;
  const progressPercentage = inspectionData && inspectionData.totalTasks > 0
    ? Math.round((completedTasksCount / inspectionData.totalTasks) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            size="sm"
          >
            <FiArrowLeft />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Danh sách kiểm tra</h1>
            <p className="text-gray-600 mt-1">Đơn tiếp nhận #{inspectionData.receptionId}</p>
          </div>
        </div>
      </div>

      {/* Reception Info - Compact */}
      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500">Khách hàng</p>
              <p className="text-sm font-medium">{inspectionData.customerName}</p>
            </div>
            <div className="border-l pl-4">
              <p className="text-xs text-gray-500">Xe</p>
              <p className="text-sm font-medium">{inspectionData.vehicleModel} - {inspectionData.licensePlate}</p>
            </div>
            <div className="border-l pl-4">
              <p className="text-xs text-gray-500">Gói</p>
              <p className="text-sm font-medium">{inspectionData.packageName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Tiến độ</p>
            <p className="text-sm font-semibold text-green-600">{completedTasksCount}/{inspectionData.totalTasks}</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Checklist Table by Category */}
      <div className="space-y-6 mb-6">
        {Object.entries(groupedRecords).map(([category, records]) => (
          <Card key={category}>
            <Card.Content className="p-0">
              <div className="p-4 bg-gray-50 border-b">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FiCheckSquare className="text-blue-600" />
                  {category}
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hạng mục
                      </th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Kiểm tra
                      </th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Vệ sinh
                      </th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Thay thế
                      </th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        Bôi trơn
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {records.map((record) => (
                      <tr key={record.recordId} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <p className="text-sm text-gray-900">{record.task.description}</p>
                        </td>
                        <td className="px-2 py-4 text-center">
                          <input
                            type="radio"
                            name={`action-${record.recordId}`}
                            checked={(localChanges[record.recordId] || record.actualStatus) === 'INSPECT'}
                            onChange={() => handleToggleTask(record.recordId, 'INSPECT')}
                            disabled={updating}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-2 py-4 text-center">
                          <input
                            type="radio"
                            name={`action-${record.recordId}`}
                            checked={(localChanges[record.recordId] || record.actualStatus) === 'CLEAN'}
                            onChange={() => handleToggleTask(record.recordId, 'CLEAN')}
                            disabled={updating}
                            className="w-4 h-4 text-green-600 focus:ring-green-500"
                          />
                        </td>
                        <td className="px-2 py-4 text-center">
                          <input
                            type="radio"
                            name={`action-${record.recordId}`}
                            checked={(localChanges[record.recordId] || record.actualStatus) === 'REPLACE'}
                            onChange={() => handleToggleTask(record.recordId, 'REPLACE')}
                            disabled={updating}
                            className="w-4 h-4 text-red-600 focus:ring-red-500"
                          />
                        </td>
                        <td className="px-2 py-4 text-center">
                          <input
                            type="radio"
                            name={`action-${record.recordId}`}
                            checked={(localChanges[record.recordId] || record.actualStatus) === 'LUBRICATE'}
                            onChange={() => handleToggleTask(record.recordId, 'LUBRICATE')}
                            disabled={updating}
                            className="w-4 h-4 text-yellow-600 focus:ring-yellow-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        <Button
          onClick={handleSubmitAll}
          disabled={updating}
          variant="primary"
          className="flex-1"
        >
          <FiCheckSquare className="mr-2" />
          Hoàn thành kiểm tra
        </Button>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
        >
          Hủy
        </Button>
      </div>
    </div>
  );
};

export default TechnicianInspectionChecklist;
