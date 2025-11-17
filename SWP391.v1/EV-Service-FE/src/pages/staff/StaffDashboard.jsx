import React, { useState } from 'react';
import { 
  FiCalendar, FiUsers, FiClock, FiDollarSign,
  FiCheckCircle, FiClock as FiProgress, FiAlertTriangle,
  FiFileText, FiUser, FiTruck, FiMessageSquare,
  FiChevronRight, FiPlus
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const StaffDashboard = () => {
  const navigate = useNavigate();
  
  //fake data
  const stats = {
    todayAppointments: 0,
    activeCustomers: 0,
    pendingServices: 0,
    todayRevenue: 0
  };
//fake data
  const todaySchedule = [
  ];
  const recentCustomers = [
  ];

  const completedToday = 0;
  const inProgress = 0;
  const urgentItems = 0;

  const quickActions = [
    { 
      icon: FiFileText, 
      label: 'Quản lý lịch hẹn',
      path: '/staff/appointments'
    },
    { 
      icon: FiUser, 
      label: 'Danh sách khách hàng',
      path: '/staff/customers'
    },
    { 
      icon: FiTruck, 
      label: 'Tra cứu xe',
      path: '/staff/vehicles'
    },
    { 
      icon: FiMessageSquare, 
      label: 'Gửi tin nhắn',
      path: '/staff/messages'
    }
  ];

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-600 mt-1">Xem tổng quan hoạt động và thống kê hôm nay</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Lịch hẹn hôm nay</span>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiCalendar className="text-blue-600 text-xl" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.todayAppointments}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Khách hàng hoạt động</span>
              <div className="p-2 bg-green-100 rounded-lg">
                <FiUsers className="text-green-600 text-xl" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.activeCustomers}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Dịch vụ chờ xử lý</span>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiClock className="text-yellow-600 text-xl" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingServices}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Doanh thu hôm nay</span>
              <div className="p-2 bg-teal-100 rounded-lg">
                <FiDollarSign className="text-teal-600 text-xl" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.todayRevenue.toLocaleString('vi-VN')} ₫</p>
          </Card.Content>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiCalendar className="text-gray-600" />
                Lịch hôm nay
              </h3>
              <button 
                onClick={() => navigate('/staff/appointments')}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Xem tất cả
              </button>
            </div>
          </Card.Header>
          <Card.Content className="p-6">
            {todaySchedule.length === 0 ? (
              <div className="text-center py-8">
                <FiCalendar className="mx-auto text-4xl text-gray-300 mb-3" />
                <p className="text-gray-500">Không có lịch hẹn hôm nay</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaySchedule.map((appointment) => (
                  <div key={appointment.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FiClock className="text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{appointment.customerName}</p>
                          <p className="text-sm text-gray-600">{appointment.service}</p>
                        </div>
                        <span className="text-sm font-medium text-gray-700">{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">{appointment.vehicle}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>
        <Card>
          <Card.Header>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FiUsers className="text-gray-600" />
                Khách hàng gần đây
              </h3>
              <button 
                onClick={() => navigate('/staff/customers')}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                Xem tất cả
              </button>
            </div>
          </Card.Header>
          <Card.Content className="p-6">
            {recentCustomers.length === 0 ? (
              <div className="text-center py-8">
                <FiUsers className="mx-auto text-4xl text-gray-300 mb-3" />
                <p className="text-gray-500">Chưa có khách hàng</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FiUser className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <FiChevronRight className="text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card.Content>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Hoàn thành hôm nay</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{completedToday}</p>
            <p className="text-sm text-gray-500 mt-1">Dịch vụ đã hoàn thành</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiProgress className="text-yellow-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Đang xử lý</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{inProgress}</p>
            <p className="text-sm text-gray-500 mt-1">Đang thực hiện dịch vụ</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <FiAlertTriangle className="text-red-600 text-xl" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cần xử lý gấp</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">{urgentItems}</p>
            <p className="text-sm text-gray-500 mt-1">Cần chú ý</p>
          </Card.Content>
        </Card>
      </div>
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Thao tác nhanh</h3>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="p-6 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group flex flex-col items-center"
              >
                <action.icon className="text-3xl text-gray-600 group-hover:text-teal-600 mb-3" />
                <p className="text-sm font-medium text-gray-700 text-center">{action.label}</p>
              </button>
            ))}
          </div>
        </Card.Content>
      </Card>
    </div>
  );
};

export default StaffDashboard;