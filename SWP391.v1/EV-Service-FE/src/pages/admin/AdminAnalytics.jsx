import React, { useState, useEffect } from 'react';
import { 
  FiDollarSign, FiTool, FiUsers, FiBarChart2,
  FiTrendingUp, FiDownload, FiCalendar, FiFilter,
  FiPieChart, FiActivity, FiTarget, FiClock, FiArrowUp, FiArrowDown
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('6MONTHS');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const result = await adminService.getAnalyticsByTimeRange(timeRange);
      
      if (result.success && result.data) {
        setAnalyticsData(result.data);
      } else {
        toast.error(result.error || 'Không thể tải dữ liệu phân tích');
      }
    } catch (error) {
      console.error('❌ Error fetching analytics:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Get data from API or default values
  const overview = analyticsData?.overview || {};
  const revenueTrends = analyticsData?.revenueTrends || [];
  const serviceTrends = analyticsData?.serviceTrends || [];
  const servicePerformance = analyticsData?.servicePerformance || {};

  // Current metric data for charts
  const chartData = selectedMetric === 'revenue' ? revenueTrends : serviceTrends;

  // Loại dịch vụ từ API
  const serviceTypeData = (analyticsData?.serviceTypeDistribution || []).map((s, idx) => ({
    name: s.name,
    value: s.percentage,
    count: s.count,
    color: s.color
  }));

  // Thông tin khách hàng từ API
  const customerData = analyticsData?.customerInsights || {
    totalCustomers: 0,
    repeatCustomers: 0,
    retentionRate: 0,
    newCustomers30Days: 0,
    avgServicePerCustomer: 0
  };

  // Dịch vụ hàng đầu từ API
  const topServices = analyticsData?.topPerformingServices || [];

  const getMaxValue = () => {
    if (chartData.length === 0) return 100;
    return Math.max(...chartData.map(d => d.value), 100);
  };

  const formatCurrency = (value) => {
    if (!value) return '0';
    // Format in millions if > 1M, otherwise thousands
    if (value >= 1000000) {
      const millions = Math.round(value / 100000) / 10; // 1 decimal
      return `${millions}M`;
    }
    const thousands = Math.round(value / 1000);
    return `${thousands}k`;
  };

  const formatNumber = (value) => {
    if (!value) return '0';
    return value.toLocaleString();
  };

  const getTrendIcon = (change) => {
    if (!change) return null;
    return change >= 0 ? <FiArrowUp className="text-green-500" /> : <FiArrowDown className="text-red-500" />;
  };

  const getTrendColor = (change) => {
    if (!change) return 'text-gray-500';
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Phân tích dữ liệu</h1>
        <p className="text-gray-600 mt-1">Báo cáo và phân tích kinh doanh toàn diện</p>
      </div>

      <div className="mb-6 flex items-center gap-3">
        <select 
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          disabled={loading}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          <option value="30DAYS">30 ngày qua</option>
          <option value="3MONTHS">3 tháng qua</option>
          <option value="6MONTHS">6 tháng qua</option>
          <option value="1YEAR">1 năm qua</option>
        </select>
        {loading && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
            <span className="text-sm">Đang tải...</span>
          </div>
        )}
        <Button 
          variant="outline"
          icon={<FiDownload />}
        >
          Xuất báo cáo
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <FiDollarSign className="text-green-600 text-xl" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {loading ? '...' : `${Math.round((overview.totalRevenue || 0) / 1000000 * 10) / 10} triệu VNĐ`}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(overview.revenueChangePercent)}
              <span className={`text-sm ${getTrendColor(overview.revenueChangePercent)}`}>
                {overview.revenueChangePercent >= 0 ? '+' : ''}{overview.revenueChangePercent?.toFixed(1) || 0}%
              </span>
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
            <p className="text-3xl font-bold text-gray-900">
              {loading ? '...' : formatNumber(overview.totalServices || 0)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(overview.servicesChangePercent)}
              <span className={`text-sm ${getTrendColor(overview.servicesChangePercent)}`}>
                {overview.servicesChangePercent >= 0 ? '+' : ''}{overview.servicesChangePercent?.toFixed(1) || 0}%
              </span>
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
            <p className="text-3xl font-bold text-gray-900">
              {loading ? '...' : formatNumber(overview.activeCustomers)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(overview.customersChangePercent)}
              <span className={`text-sm ${getTrendColor(overview.customersChangePercent)}`}>
                {overview.customersChangePercent >= 0 ? '+' : ''}{overview.customersChangePercent?.toFixed(1) || 0}%
              </span>
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
            <p className="text-3xl font-bold text-gray-900">
              {loading ? '...' : `${Math.round((overview.avgServiceValue || 0) / 1000)}k VNĐ`}
            </p>
            <div className="flex items-center gap-2 mt-2">
              {getTrendIcon(overview.avgValueChangePercent)}
              <span className={`text-sm ${getTrendColor(overview.avgValueChangePercent)}`}>
                {overview.avgValueChangePercent >= 0 ? '+' : ''}{overview.avgValueChangePercent?.toFixed(1) || 0}%
              </span>
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
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
                </div>
              ) : chartData.length === 0 ? (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-gray-500">Không có dữ liệu</p>
                </div>
              ) : (
                <div className="h-64 flex items-end justify-between gap-2 px-2">
                  {chartData.map((item, index) => {
                    const heightPercent = getMaxValue() > 0 ? (item.value / getMaxValue()) * 100 : 0;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center group">
                        <div className="relative w-full flex flex-col items-center">
                          {/* Tooltip on hover */}
                          <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                            {selectedMetric === 'revenue' 
                              ? `${(item.value / 1000000).toFixed(1)}M VNĐ` 
                              : `${item.value} dịch vụ`}
                          </div>
                          {/* Bar */}
                          <div 
                            className={`w-full rounded-t-lg transition-all duration-500 hover:opacity-80 cursor-pointer ${
                              selectedMetric === 'revenue' 
                                ? 'bg-gradient-to-t from-green-500 to-teal-400'
                                : 'bg-gradient-to-t from-blue-500 to-indigo-400'
                            }`}
                            style={{ 
                              height: `${Math.max(heightPercent, 2)}%`,
                              minHeight: item.value > 0 ? '8px' : '2px'
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-2 font-medium">{item.label || item.period}</p>
                        <p className="text-xs font-semibold text-gray-900">
                          {selectedMetric === 'revenue' ? formatCurrency(item.value) : item.value}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  {selectedMetric === 'revenue' ? 'Revenue' : 'Services'} Chart - Showing {timeRange.replace('MONTHS', ' months').replace('DAYS', ' days').replace('YEAR', ' year').toLowerCase()} of data
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
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                </div>
              ) : (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="text-sm font-medium">{servicePerformance.completionRate?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: `${servicePerformance.completionRate || 0}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Avg Jobs/Customer</span>
                      <span className="text-sm font-medium">{servicePerformance.avgJobsPerCustomer?.toFixed(1) || 0}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">Customer Satisfaction</span>
                      <span className="text-sm font-medium bg-green-100 text-green-700 px-2 py-1 rounded">
                        {servicePerformance.customerSatisfaction?.toFixed(1) || 0}/5.0
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">On-time Completion</span>
                      <span className="text-sm font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {servicePerformance.onTimeCompletion?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-600">First-time Fix Rate</span>
                      <span className="text-sm font-medium bg-teal-100 text-teal-700 px-2 py-1 rounded">
                        {servicePerformance.firstTimeFixRate?.toFixed(1) || 0}%
                      </span>
                    </div>
                  </div>
                </>
              )}
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
                          backgroundColor: service.color || (index === 0 ? '#10b981' : 
                                         index === 1 ? '#3b82f6' : 
                                         index === 2 ? '#f59e0b' : 
                                         index === 3 ? '#8b5cf6' : '#ef4444')
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
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">
                      {service.revenue?.toLocaleString?.() || service.revenue} VNĐ
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">{service.count}</td>
                    <td className="py-3 px-4 text-sm text-gray-900 text-right">
                      {service.count > 0 ? Math.round(service.revenue / service.count).toLocaleString() : '0'} VNĐ
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