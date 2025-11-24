import React, { useState, useEffect } from "react";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiTruck,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import Card from "../components/ui/Card";
import { formatDate, formatCurrency } from "../utils/format";
import customerService from "../services/customerService";
import toast from "react-hot-toast";

const MaintenanceHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedInspections, setExpandedInspections] = useState(new Set());

  // Fetch maintenance history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      console.log('🔄 Fetching maintenance history...');
      setLoading(true);
      try {
        const result = await customerService.getMyReceptions();
        console.log('📦 API Response:', result);
        if (result.success) {
          console.log('✅ History data:', result.data);
          setHistory(result.data);
        } else {
          console.error('❌ API Error:', result.error);
          toast.error(result.error || "Không thể tải lịch sử bảo dưỡng");
        }
      } catch (error) {
        console.error('❌ Failed to fetch maintenance history:', error);
        toast.error("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleInspectionDetails = (receptionId) => {
    setExpandedInspections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(receptionId)) {
        newSet.delete(receptionId);
      } else {
        newSet.add(receptionId);
      }
      return newSet;
    });
  };

  const getInspectionStatusLabel = (status) => {
    const statusMap = {
      PENDING: "Chờ xử lý",
      INSPECT: "Kiểm tra",
      CLEAN: "Vệ sinh",
      REPLACE: "Thay thế",
      LUBRICATE: "Bôi trơn",
    };
    return statusMap[status] || status;
  };

  const getStatusBadge = (status) => {
    const config = {
      RECEIVED: {
        label: "Đã tiếp nhận",
        color: "bg-blue-100 text-blue-800",
        icon: <FiFileText />,
      },
      ASSIGNED: {
        label: "Đã phân công",
        color: "bg-purple-100 text-purple-800",
        icon: <FiUser />,
      },
      IN_PROGRESS: {
        label: "Đang xử lý",
        color: "bg-yellow-100 text-yellow-800",
        icon: <FiClock />,
      },
      COMPLETED: {
        label: "Hoàn thành",
        color: "bg-green-100 text-green-800",
        icon: <FiCheckCircle />,
      },
      PAID: {
        label: "Đã thanh toán",
        color: "bg-emerald-100 text-emerald-800",
        icon: <FiCheckCircle />,
      },
      CANCELLED: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800",
        icon: <FiXCircle />,
      },
    }[status] || {
      label: status,
      color: "bg-gray-100 text-gray-600",
      icon: null,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };


  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-3">
        Lịch Sử Bảo Dưỡng
      </h1>

      {loading ? (
        <Card className="text-center py-20">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          </div>
          <p className="text-gray-500 text-lg mt-4">Đang tải dữ liệu...</p>
        </Card>
      ) : history.length === 0 ? (
        <Card className="text-center py-20">
          <p className="text-gray-500 text-lg">
            Bạn chưa có lịch sử bảo dưỡng nào
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Xe</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ngày</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kỹ thuật viên</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Chi phí</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Trạng thái</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-32">Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <React.Fragment key={item.receptionId}>
                    <tr className="border-b border-gray-100 hover:bg-gray-50">
                      {/* Cột Xe */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-800">{item.vehicleModel}</span>
                          <span className="text-sm text-gray-500 font-mono">{item.licensePlate}</span>
                        </div>
                      </td>
                      
                      {/* Cột Ngày */}
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-800">{formatDate(item.createdAt)}</span>
                          {item.completedAt && (
                            <span className="text-xs text-green-600">Hoàn thành: {formatDate(item.completedAt)}</span>
                          )}
                        </div>
                      </td>
                      
                      {/* Cột Kỹ thuật viên */}
                      <td className="px-4 py-4 text-sm text-gray-700">
                        {item.technicianName || "Chưa phân công"}
                      </td>
                      
                      {/* Cột Chi phí */}
                      <td className="px-4 py-4 text-right">
                        <span className="font-bold text-teal-700">
                          {formatCurrency(item.totalCost || 0)}
                        </span>
                      </td>
                      
                      {/* Cột Trạng thái */}
                      <td className="px-4 py-4 text-center">
                        {getStatusBadge(item.status)}
                      </td>
                      
                      {/* Cột Chi tiết */}
                      <td className="px-4 py-4 text-center">
                        {((item.spareParts && item.spareParts.length > 0) || 
                          (item.inspectionRecords && item.inspectionRecords.length > 0)) && (
                          <button
                            onClick={() => toggleInspectionDetails(item.receptionId)}
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 whitespace-nowrap ${
                              expandedInspections.has(item.receptionId)
                                ? 'bg-teal-600 text-white hover:bg-teal-700'
                                : 'bg-white text-teal-600 border border-teal-600 hover:bg-teal-50'
                            }`}
                          >
                            {expandedInspections.has(item.receptionId) ? (
                              <>
                                <FiChevronUp size={14} />
                                <span>Chi tiết</span>
                              </>
                            ) : (
                              <>
                                <FiChevronDown size={14} />
                                <span>Chi tiết</span>
                              </>
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                    
                    {/* Expandable detail row */}
                    {expandedInspections.has(item.receptionId) && (
                      <tr>
                        <td colSpan="6" className="px-4 py-4 bg-gray-50">
                          <div className="space-y-4">
                            {/* Bảng phụ tùng */}
                            {item.spareParts && item.spareParts.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Phụ tùng đã thay thế</h4>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-sm bg-white rounded">
                                    <thead>
                                      <tr className="bg-gray-100 border-b border-gray-200">
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700 w-12">STT</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Tên phụ tùng</th>
                                        <th className="px-4 py-2 text-center font-semibold text-gray-700 w-24">Số lượng</th>
                                        <th className="px-4 py-2 text-right font-semibold text-gray-700 w-32">Đơn giá</th>
                                        <th className="px-4 py-2 text-right font-semibold text-gray-700 w-32">Thành tiền</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {item.spareParts.map((part, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                          <td className="px-4 py-3 text-gray-600">{idx + 1}</td>
                                          <td className="px-4 py-3 text-gray-800 font-medium">{part.sparePartName}</td>
                                          <td className="px-4 py-3 text-center text-gray-600">x{part.quantity}</td>
                                          <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(part.unitPrice)}</td>
                                          <td className="px-4 py-3 text-right text-gray-800 font-semibold">
                                            {formatCurrency(part.unitPrice * part.quantity)}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {/* Bảng hạng mục kiểm tra */}
                            {item.inspectionRecords && item.inspectionRecords.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Hạng mục đã kiểm tra</h4>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full text-sm bg-white rounded">
                                    <thead>
                                      <tr className="bg-gray-100 border-b border-gray-200">
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700 w-12">STT</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700">Hạng mục kiểm tra</th>
                                        <th className="px-4 py-2 text-left font-semibold text-gray-700 w-32">Danh mục</th>
                                        <th className="px-4 py-2 text-center font-semibold text-gray-700 w-32">Trạng thái</th>
                                        <th className="px-4 py-2 text-center font-semibold text-gray-700 w-40">Thời gian</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {item.inspectionRecords.map((record, index) => (
                                        <tr key={record.recordId} className="border-b border-gray-100 hover:bg-gray-50">
                                          <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                                          <td className="px-4 py-3 text-gray-800 font-medium">{record.taskDescription}</td>
                                          <td className="px-4 py-3 text-gray-600 text-sm">{record.taskCategory || '-'}</td>
                                          <td className="px-4 py-3 text-center">
                                            <span className="inline-block px-2 py-1 text-xs rounded bg-blue-100 text-blue-800 font-semibold">
                                              {getInspectionStatusLabel(record.actualStatus)}
                                            </span>
                                          </td>
                                          <td className="px-4 py-3 text-center text-gray-600 text-xs">
                                            {record.checkedAt ? new Date(record.checkedAt).toLocaleString('vi-VN') : '-'}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MaintenanceHistory;
