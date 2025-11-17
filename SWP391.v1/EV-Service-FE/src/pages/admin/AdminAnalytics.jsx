import React, { useState } from 'react';
import { 
  FiDollarSign, FiTool, FiUsers, FiBarChart2,
  FiTrendingUp, FiDownload, FiCalendar, FiFilter,
  FiPieChart, FiActivity, FiTarget, FiClock
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // fake data
  const analyticsData = {
    revenue: {
      total: 0,
      change: 15.3,
      previousPeriod: 0
    },
    services: {
      total: 0,
      change: 8.7,
      previousPeriod: 0
    },
    customers: {
      active: 0,
      change: 12.1,
      previousPeriod: 0
    },
    avgServiceValue: {
      value: 0,
      change: -2.4,
      previousPeriod: 0
    }
  };

  // fake date chart data
  const revenueData = [
    { month: 'Apr', value: 100 },
    { month: 'May', value: 150 },
    { month: 'Jun', value: 200 },
    { month: 'Jul', value:  250 },
    { month: 'Aug', value: 300 },
    { month: 'Sep', value: 350 }
  ];

  // cong suat dich vu
  const serviceMetrics = {
    completionRate: 0,
    avgJobsPerCustomer: 0,
    satisfaction: 4.8,
    onTimeCompletion: 94.2,
    firstTimeFixRate: 87.5
  };

  // Loai dich vu
  const serviceTypeData = [
    { name: 'Battery Service', value: 35, count: 0 },
    { name: 'Software Update', value: 25, count: 0 },
    { name: 'General Maintenance', value: 20, count: 0 },
    { name: 'Charging System', value: 12, count: 0 },
    { name: 'Diagnostics', value: 8, count: 0 }
  ];

  // Thong tin khach hang
  const customerData = {
    totalCustomers: 0,
    repeatCustomers: 0,
    retentionRate: 0,
    newCustomers30Days: 0,
    avgServicePerCustomer: 0
  };

  // Dich vu hang dau
  const topServices = [
    { name: 'Battery Replacement', revenue: 0, count: 0 },
    { name: 'Software Update', revenue: 0, count: 0 },
    { name: 'AC System Service', revenue: 0, count: 0 },
    { name: 'Tire Rotation', revenue: 0, count: 0 },
    { name: 'Brake Service', revenue: 0, count: 0 }
  ];

  const getMaxRevenue = () => {
    return Math.max(...revenueData.map(d => d.value), 100);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Comprehensive business intelligence and reporting</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="30days">Last 30 Days</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <Button 
            variant="outline"
            icon={<FiDownload />}
          >
            Export Report
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <FiDollarSign className="text-green-600 text-xl" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${analyticsData.revenue.total}</p>
            <div className="flex items-center gap-2 mt-2">
              <FiTrendingUp className="text-green-500 text-sm" />
              <span className="text-sm text-green-500">+{analyticsData.revenue.change}%</span>
              <span className="text-sm text-gray-500">vs prev period</span>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Total Services</span>
              <FiTool className="text-blue-600 text-xl" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analyticsData.services.total}</p>
            <div className="flex items-center gap-2 mt-2">
              <FiTrendingUp className="text-green-500 text-sm" />
              <span className="text-sm text-green-500">+{analyticsData.services.change}%</span>
              <span className="text-sm text-gray-500">vs prev period</span>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Active Customers</span>
              <FiUsers className="text-teal-600 text-xl" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{analyticsData.customers.active}</p>
            <div className="flex items-center gap-2 mt-2">
              <FiTrendingUp className="text-green-500 text-sm" />
              <span className="text-sm text-green-500">+{analyticsData.customers.change}%</span>
              <span className="text-sm text-gray-500">vs prev period</span>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Avg Service Value</span>
              <FiBarChart2 className="text-yellow-600 text-xl" />
            </div>
            <p className="text-3xl font-bold text-gray-900">${analyticsData.avgServiceValue.value}</p>
            <div className="flex items-center gap-2 mt-2">
              <FiTrendingUp className="text-red-500 text-sm rotate-180" />
              <span className="text-sm text-red-500">{analyticsData.avgServiceValue.change}%</span>
              <span className="text-sm text-gray-500">vs prev period</span>
            </div>
          </Card.Content>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <Card>
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <FiBarChart2 className="text-gray-600" />
                  Revenue Trends
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedMetric('revenue')}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      selectedMetric === 'revenue' 
                        ? 'bg-green-100 text-green-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Revenue
                  </button>
                  <button 
                    onClick={() => setSelectedMetric('services')}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      selectedMetric === 'services' 
                        ? 'bg-green-100 text-green-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Services
                  </button>
                </div>
              </div>
            </Card.Header>
            <Card.Content className="p-6">
              <div className="h-64 flex items-end justify-between gap-2">
                {revenueData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-green-500 to-teal-400 rounded-t-lg transition-all duration-500 hover:opacity-80"
                      style={{ 
                        height: `${(item.value / getMaxRevenue()) * 100}%`,
                        minHeight: '4px'
                      }}
                    />
                    <p className="text-xs text-gray-600 mt-2">{item.month}</p>
                    <p className="text-xs font-medium text-gray-900">${item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Revenue Chart - Showing {timeRange === '6months' ? '6 months' : timeRange} of data
                </p>
              </div>
            </Card.Content>
          </Card>
        </div>
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiActivity className="text-gray-600" />
              Service Performance
            </h3>
          </Card.Header>
          <Card.Content className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-medium">{serviceMetrics.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${serviceMetrics.completionRate}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Avg Jobs/Customer</span>
                  <span className="text-sm font-medium">{serviceMetrics.avgJobsPerCustomer}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Customer Satisfaction</span>
                  <span className="text-sm font-medium bg-green-100 text-green-700 px-2 py-1 rounded">
                    {serviceMetrics.satisfaction}/5.0
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">On-time Completion</span>
                  <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {serviceMetrics.onTimeCompletion}%
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">First-time Fix Rate</span>
                  <span className="text-sm font-medium bg-teal-100 text-teal-700 px-2 py-1 rounded">
                    {serviceMetrics.firstTimeFixRate}%
                  </span>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiPieChart className="text-gray-600" />
              Service Types Distribution
            </h3>
          </Card.Header>
          <Card.Content className="p-6">
            {serviceTypeData.length === 0 ? (
              <div className="text-center py-8">
                <FiPieChart className="mx-auto text-4xl text-gray-400 mb-3" />
                <p className="text-gray-500">No service data available</p>
              </div>
            ) : (
              <div className="space-y-3">
                {serviceTypeData.map((service, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-700">{service.name}</span>
                      <span className="text-sm font-medium">{service.value}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${service.value}%`,
                          backgroundColor: index === 0 ? '#10b981' : 
                                         index === 1 ? '#3b82f6' : 
                                         index === 2 ? '#f59e0b' : 
                                         index === 3 ? '#8b5cf6' : '#ef4444'
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{service.count} services</p>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FiUsers className="text-gray-600" />
              Customer Insights
            </h3>
          </Card.Header>
          <Card.Content className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{customerData.totalCustomers}</p>
                <p className="text-xs text-gray-600 mt-1">Total Customers</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-gray-900">{customerData.repeatCustomers}</p>
                <p className="text-xs text-gray-600 mt-1">Repeat Customers</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Customer Retention</span>
                <span className="text-sm font-medium bg-green-100 text-green-700 px-2 py-1 rounded">
                  {customerData.retentionRate}%
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">New Customers (30 days)</span>
                <span className="text-sm font-medium">{customerData.newCustomers30Days}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-gray-600">Avg Services per Customer</span>
                <span className="text-sm font-medium">{customerData.avgServicePerCustomer}</span>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Services</h3>
        </Card.Header>
        <Card.Content>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Service Name</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Revenue</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Count</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">Avg Price</th>
                </tr>
              </thead>
              <tbody>
                {topServices.map((service, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-900">{service.name}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">${service.revenue}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{service.count}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">
                      ${service.count > 0 ? (service.revenue / service.count).toFixed(2) : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default AdminAnalytics;