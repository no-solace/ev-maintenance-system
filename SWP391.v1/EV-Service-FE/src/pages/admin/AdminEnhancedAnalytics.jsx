import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  FiDollarSign, FiCalendar, FiUsers, FiTrendingUp, 
  FiActivity, FiAward, FiClock, FiCheckCircle 
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminEnhancedAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filter state
  const [periodType, setPeriodType] = useState('MONTH'); // MONTH, QUARTER, YEAR
  const [year, setYear] = useState(new Date().getFullYear());
  const [period, setPeriod] = useState(new Date().getMonth() + 1);

  useEffect(() => {
    loadAnalytics();
  }, [periodType, year, period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const params = {
        periodType,
        year,
        ...(periodType !== 'YEAR' && { period })
      };
      
      const response = await api.get('/admin/analytics', { params });
      setAnalytics(response);
      console.log('Analytics loaded:', response);
    } catch (error) {
      console.error('Load analytics error:', error);
      toast.error('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value || 0);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-6">
        <p className="text-center text-gray-500">Không có dữ liệu</p>
      </div>
    );
  }

  const { overview, revenueByPeriod, bookingAnalytics, employeePerformance } = analytics;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phân tích & Báo cáo</h1>
          <p className="text-gray-600 mt-1">Tổng quan hiệu suất kinh doanh</p>
        </div>
        
        {/* Period Filter */}
        <div className="flex gap-3">
          <select
            value={periodType}
            onChange={(e) => {
              setPeriodType(e.target.value);
              if (e.target.value === 'YEAR') setPeriod(null);
              else if (e.target.value === 'QUARTER') setPeriod(Math.floor((new Date().getMonth()) / 3) + 1);
              else setPeriod(new Date().getMonth() + 1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="MONTH">Theo tháng</option>
            <option value="QUARTER">Theo quý</option>
            <option value="YEAR">Theo năm</option>
          </select>
          
          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {[2024, 2023, 2022, 2021, 2020].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          
          {periodType === 'MONTH' && (
            <select
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>Tháng {m}</option>
              ))}
            </select>
          )}
          
          {periodType === 'QUARTER' && (
            <select
              value={period}
              onChange={(e) => setPeriod(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4].map(q => (
                <option key={q} value={q}>Quý {q}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiDollarSign size={32} />
            <span className="text-blue-100 text-sm font-medium">Doanh thu</span>
          </div>
          <h3 className="text-3xl font-bold">{formatCurrency(overview.totalRevenue)}</h3>
          <p className="text-blue-100 text-sm mt-2">
            Trung bình: {formatCurrency(overview.averageRevenuePerBooking)}/booking
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiCalendar size={32} />
            <span className="text-green-100 text-sm font-medium">Bookings</span>
          </div>
          <h3 className="text-3xl font-bold">{overview.totalBookings}</h3>
          <p className="text-green-100 text-sm mt-2">
            Receptions: {overview.totalReceptions}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiCheckCircle size={32} />
            <span className="text-purple-100 text-sm font-medium">Thanh toán</span>
          </div>
          <h3 className="text-3xl font-bold">{overview.totalPayments}</h3>
          <p className="text-purple-100 text-sm mt-2">
            Hoàn tất
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <FiUsers size={32} />
            <span className="text-orange-100 text-sm font-medium">Nhân viên</span>
          </div>
          <h3 className="text-3xl font-bold">{overview.activeEmployees}</h3>
          <p className="text-orange-100 text-sm mt-2">
            Đang hoạt động
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-blue-600" />
          Biểu đồ doanh thu
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueByPeriod}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip 
              formatter={(value) => formatCurrency(value)}
              labelStyle={{ color: '#000' }}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#3B82F6" name="Doanh thu" />
            <Bar dataKey="bookingCount" fill="#10B981" name="Số booking" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Booking Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiActivity className="text-green-600" />
            Thống kê Booking
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Tổng số booking</span>
              <span className="text-2xl font-bold text-blue-600">{bookingAnalytics.totalBookings}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Đã hoàn thành</span>
              <span className="text-2xl font-bold text-green-600">{bookingAnalytics.completedBookings}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-gray-700">Đã xác nhận</span>
              <span className="text-2xl font-bold text-yellow-600">{bookingAnalytics.confirmedBookings}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-gray-700">Đã hủy</span>
              <span className="text-2xl font-bold text-red-600">{bookingAnalytics.cancelledBookings}</span>
            </div>
          </div>
        </div>

        {/* Completion Rate Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tỷ lệ hoàn thành</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Hoàn thành', value: bookingAnalytics.completedBookings },
                  { name: 'Xác nhận', value: bookingAnalytics.confirmedBookings },
                  { name: 'Hủy', value: bookingAnalytics.cancelledBookings }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {[COLORS[1], COLORS[2], COLORS[3]].map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Tỷ lệ hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">
                {bookingAnalytics.completionRate.toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Tỷ lệ hủy</p>
              <p className="text-2xl font-bold text-red-600">
                {bookingAnalytics.cancellationRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Performance Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FiAward className="text-yellow-600" />
            Hiệu suất nhân viên
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nhân viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Công việc hoàn thành
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doanh thu tạo ra
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giờ làm việc
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hiệu suất
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employeePerformance && employeePerformance.length > 0 ? (
                employeePerformance.map((employee, index) => (
                  <tr key={employee.employeeId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {employee.employeeName.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.employeeName}</div>
                          <div className="text-sm text-gray-500">ID: {employee.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.role === 'TECHNICIAN' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {employee.role === 'TECHNICIAN' ? 'Kỹ thuật viên' : 'Nhân viên'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-semibold text-gray-900">{employee.tasksCompleted}</div>
                      <div className="text-xs text-gray-500">công việc</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-semibold text-green-600">
                        {formatCurrency(employee.revenueGenerated)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <FiClock className="text-gray-400" size={14} />
                        <span className="text-sm text-gray-900">{employee.totalWorkHours}h</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm font-semibold text-blue-600">
                        {(employee.efficiency * 100).toFixed(1)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {employee.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    Không có dữ liệu nhân viên
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminEnhancedAnalytics;
