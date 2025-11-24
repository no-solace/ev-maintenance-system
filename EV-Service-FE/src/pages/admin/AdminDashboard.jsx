import React, { useState, useEffect } from 'react';
import { 
  FiDollarSign, FiUsers, FiTrendingUp, FiUserCheck,
  FiActivity, FiPackage, FiShoppingCart, FiBarChart2,
  FiArrowUp, FiArrowDown, FiMoreVertical, FiPieChart
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState({
    revenue: { value: 0, change: 0, trend: 'up' },
    customers: { value: 0, change: 0, trend: 'up' },
    efficiency: { value: 0, change: 0, trend: 'up' },
    utilization: { value: 0, change: 0, trend: 'up' }
  });
  const [serviceDistribution, setServiceDistribution] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleImportSampleData = async () => {
    if (!window.confirm('Bạn có chắc muốn import 250 bookings mẫu? Hành động này không thể hoàn tác.')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/data-import/sample-bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(`Đã import ${result.data} bookings thành công!`);
        // Refresh dashboard data
        fetchDashboardStats();
      } else {
        toast.error(result.message || 'Import thất bại');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      toast.error('Có lỗi xảy ra khi import data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const result = await adminService.getDashboardStats();
      
      console.log('📊 Dashboard result:', result);
      
      if (result.success && result.data) {
        const data = result.data;
        
        console.log('📊 Dashboard data:', data);
        
        // Format revenue - convert to millions for better readability
        const revenueValue = Math.round((data.monthlyRevenue || 0) / 1000000 * 10) / 10; // Convert to millions with 1 decimal
        
        setStats({
          revenue: { 
            value: revenueValue,
            change: Math.round(data.revenueChangePercent || 0), 
            trend: (data.revenueChangePercent || 0) >= 0 ? 'up' : 'down'
          },
          customers: { 
            value: data.totalCustomers || 0,
            change: Math.round(data.customerChangePercent || 0), 
            trend: (data.customerChangePercent || 0) >= 0 ? 'up' : 'down'
          },
          efficiency: { 
            value: Math.round(data.serviceEfficiency || 0),
            change: Math.round(data.efficiencyChangePercent || 0), 
            trend: (data.efficiencyChangePercent || 0) >= 0 ? 'up' : 'down'
          },
          utilization: { 
            value: Math.round(data.staffUtilization || 0),
            change: Math.round(data.utilizationChangePercent || 0), 
            trend: (data.utilizationChangePercent || 0) >= 0 ? 'up' : 'down'
          }
        });
        
        // Set service distribution and activities
        setServiceDistribution(data.serviceDistribution || []);
        setRecentActivities(data.recentActivities || []);
      } else {
        console.error('❌ Dashboard API failed:', result.error);
        toast.error(result.error || 'Không thể tải dữ liệu dashboard');
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      console.error('Error stack:', error.stack);
      toast.error('Có lỗi xảy ra khi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: 'Analytics', icon: FiBarChart2, path: '/admin/analytics' },
    { label: 'Inventory', icon: FiPackage, path: '/admin/inventory' },
    { label: 'User Management', icon: FiUsers, path: '/admin/users' },
    { label: 'System Settings', icon: FiActivity, path: '/admin/settings' }
  ];

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
            <p className="text-gray-600 mt-1">Xem tổng quan hoạt động kinh doanh</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleImportSampleData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              📦 Import Sample Data
            </button>
            {loading && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                <span className="text-sm">Đang tải...</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Monthly Revenue</span>
              <div className="p-2 bg-green-100 rounded-lg">
                <FiDollarSign className="text-green-600 text-xl" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{loading ? '...' : `${stats.revenue.value.toLocaleString()} triệu VNĐ`}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stats.revenue.trend === 'up' ? (
                    <FiArrowUp className="text-green-500" />
                  ) : (
                    <FiArrowDown className="text-red-500" />
                  )}
                  <span className={`text-sm ${stats.revenue.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.revenue.trend === 'up' ? '+' : ''}{stats.revenue.change}%
                  </span>
                  <span className="text-sm text-gray-500">from last month</span>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Total Customers</span>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiUsers className="text-blue-600 text-xl" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.customers.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stats.customers.trend === 'up' ? (
                    <FiArrowUp className="text-green-500" />
                  ) : (
                    <FiArrowDown className="text-red-500" />
                  )}
                  <span className={`text-sm ${stats.customers.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.customers.trend === 'up' ? '+' : ''}{stats.customers.change}%
                  </span>
                  <span className="text-sm text-gray-500">from last month</span>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Service Efficiency</span>
              <div className="p-2 bg-teal-100 rounded-lg">
                <FiTrendingUp className="text-teal-600 text-xl" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{loading ? '...' : `${stats.efficiency.value}%`}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stats.efficiency.trend === 'up' ? (
                    <FiArrowUp className="text-green-500" />
                  ) : (
                    <FiArrowDown className="text-red-500" />
                  )}
                  <span className={`text-sm ${stats.efficiency.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.efficiency.trend === 'up' ? '+' : ''}{stats.efficiency.change}%
                  </span>
                  <span className="text-sm text-gray-500">from last month</span>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Staff Utilization</span>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiUserCheck className="text-yellow-600 text-xl" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{loading ? '...' : `${stats.utilization.value}%`}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stats.utilization.trend === 'up' ? (
                    <FiArrowUp className="text-green-500" />
                  ) : (
                    <FiArrowDown className="text-red-500" />
                  )}
                  <span className={`text-sm ${stats.utilization.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.utilization.trend === 'up' ? '+' : ''}{stats.utilization.change}%
                  </span>
                  <span className="text-sm text-gray-500">from last month</span>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiPackage className="text-gray-600" />
                Service Types Distribution
              </h3>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <FiMoreVertical className="text-gray-600" />
              </button>
            </div>
          </Card.Header>
          <Card.Content className="p-6">
            {serviceDistribution.length === 0 ? (
              <div className="text-center py-8">
                <FiPieChart className="mx-auto text-4xl text-gray-400 mb-3" />
                <p className="text-gray-500">Chưa có dữ liệu dịch vụ</p>
              </div>
            ) : (
              <div className="space-y-4">
                {serviceDistribution.map((service, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: service.color }}
                        />
                        <span className="text-sm text-gray-700">{service.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{service.count} lượt</span>
                        <span className="text-sm font-medium text-gray-900">{service.percentage}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${service.percentage}%`,
                          backgroundColor: service.color 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">
                View Detailed Analytics
              </button>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiActivity className="text-gray-600" />
              Recent Activity
            </h3>
          </Card.Header>
          <Card.Content className="p-6">
            {recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <FiActivity className="mx-auto text-4xl text-gray-400 mb-3" />
                <p className="text-gray-500">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'booking' ? 'bg-blue-100' :
                      activity.type === 'payment' ? 'bg-green-100' :
                      activity.type === 'review' ? 'bg-yellow-100' :
                      activity.type === 'inventory' ? 'bg-red-100' :
                      'bg-gray-100'
                    }`}>
                      {activity.type === 'booking' && <FiShoppingCart className="text-blue-600" />}
                      {activity.type === 'payment' && <FiDollarSign className="text-green-600" />}
                      {activity.type === 'review' && <FiTrendingUp className="text-yellow-600" />}
                      {activity.type === 'inventory' && <FiPackage className="text-red-600" />}
                      {activity.type === 'user' && <FiUsers className="text-gray-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => window.location.href = action.path}
                className="p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
              >
                <action.icon className="text-3xl text-gray-600 group-hover:text-teal-600 mb-3 mx-auto" />
                <p className="text-sm font-medium text-gray-700">{action.label}</p>
              </button>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default AdminDashboard;