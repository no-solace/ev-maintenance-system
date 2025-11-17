import React, { useState, useEffect } from 'react';
import { 
  FiDollarSign, FiUsers, FiTrendingUp, FiUserCheck,
  FiActivity, FiPackage, FiShoppingCart, FiBarChart2,
  FiArrowUp, FiArrowDown, FiMoreVertical
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState('month');
  
  // fake mock data
  const stats = {
    revenue: {
      value: 0,
      change: 12.5,
      trend: 'up'
    },
    customers: {
      value: 1,
      change: 8.2,
      trend: 'up'
    },
    efficiency: {
      value: 94.2,
      change: 2.1,
      trend: 'up'
    },
    utilization: {
      value: 87.5,
      change: -1.3,
      trend: 'down'
    }
  };

  const serviceDistribution = [
    { name: 'Battery Service', value: 45, color: '#10b981' },
    { name: 'Software Update', value: 30, color: '#3b82f6' },
    { name: 'General Maintenance', value: 25, color: '#f59e0b' }
  ];

  const recentActivities = [
    { id: 1, type: 'booking', message: 'New service booking from John Doe', time: '2 hours ago' },
    { id: 2, type: 'payment', message: 'Payment received - $1,250', time: '4 hours ago' },
    { id: 3, type: 'review', message: 'New 5-star review from Sarah Smith', time: '6 hours ago' },
    { id: 4, type: 'inventory', message: 'Low stock alert: Battery Pack Model S', time: '8 hours ago' },
    { id: 5, type: 'user', message: 'New customer registration', time: '1 day ago' }
  ];

  const quickActions = [
    { label: 'Analytics', icon: FiBarChart2, path: '/admin/analytics' },
    { label: 'Inventory', icon: FiPackage, path: '/admin/inventory' },
    { label: 'User Management', icon: FiUsers, path: '/admin/users' },
    { label: 'System Settings', icon: FiActivity, path: '/admin/settings' }
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, DINH! Here's your business overview.</p>
        </div>
        <Button 
          variant="primary"
          icon={<FiBarChart2 />}
          className="bg-gradient-to-r from-green-500 to-teal-600"
        >
          Generate Report
        </Button>
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
                <p className="text-3xl font-bold text-gray-900">${stats.revenue.value.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  {stats.revenue.trend === 'up' ? (
                    <FiArrowUp className="text-green-500" />
                  ) : (
                    <FiArrowDown className="text-red-500" />
                  )}
                  <span className={`text-sm ${stats.revenue.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.revenue.change}%
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
                <p className="text-3xl font-bold text-gray-900">{stats.customers.value}</p>
                <div className="flex items-center gap-1 mt-2">
                  <FiArrowUp className="text-green-500" />
                  <span className="text-sm text-green-500">+{stats.customers.change}%</span>
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
                <p className="text-3xl font-bold text-gray-900">{stats.efficiency.value}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <FiArrowUp className="text-green-500" />
                  <span className="text-sm text-green-500">+{stats.efficiency.change}%</span>
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
                <p className="text-3xl font-bold text-gray-900">{stats.utilization.value}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <FiArrowDown className="text-red-500" />
                  <span className="text-sm text-red-500">{stats.utilization.change}%</span>
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
                    <span className="text-sm font-medium text-gray-900">{service.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${service.value}%`,
                        backgroundColor: service.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
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