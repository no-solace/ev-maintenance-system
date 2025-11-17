import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiTool, FiClock, FiCheckCircle, FiAlertTriangle,
  FiTrendingUp, FiUser, FiCalendar, FiBattery,
  FiSettings, FiChevronRight, FiRefreshCw
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { formatDate, formatCurrency } from '../../utils/format';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [workOrders, setWorkOrders] = useState([]);
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedToday: 0,
    urgentItems: 0,
    avgCompletionTime: '0h'
  });

  // mock data gia
  useEffect(() => {
    // fake data appionments
    const mockWorkOrders = [
      {
        id: 'WO-001',
        customerName: 'Nguyễn Văn A',
        vehicle: 'VinFast VF8 - 30A-12345',
        service: 'Bảo dưỡng định kỳ',
        priority: 'normal',
        status: 'pending',
        scheduledTime: '09:00',
        estimatedDuration: 60,
        location: 'Bay 3',
        notes: 'Kiểm tra hệ thống phanh và pin'
      },
      {
        id: 'WO-002',
        customerName: 'Trần Thị B',
        vehicle: 'Tesla Model 3 - 51G-67890',
        service: 'Kiểm tra pin',
        priority: 'urgent',
        status: 'in-progress',
        scheduledTime: '10:30',
        estimatedDuration: 45,
        location: 'Bay 1',
        notes: 'Khách hàng báo pin sụt nhanh'
      },
      {
        id: 'WO-003',
        customerName: 'Lê Văn C',
        vehicle: 'BMW iX3 - 92H-11111',
        service: 'Sửa chữa hệ thống sạc',
        priority: 'high',
        status: 'pending',
        scheduledTime: '14:00',
        estimatedDuration: 120,
        location: 'Bay 2',
        notes: 'Không sạc được bằng sạc nhanh DC'
      }
    ];

    setWorkOrders(mockWorkOrders);
    
    // fake stats
    setStats({
      activeOrders: mockWorkOrders.filter(wo => wo.status !== 'completed').length,
      completedToday: 5, 
      urgentItems: mockWorkOrders.filter(wo => wo.priority === 'urgent').length,
      avgCompletionTime: '1.5h'
    });
  }, []);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'normal': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleStartWork = (orderId) => {
    setWorkOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'in-progress', startTime: new Date().toISOString() } : order
    ));
  };

  const handleCompleteWork = (orderId) => {
    setWorkOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'completed', endTime: new Date().toISOString() } : order
    ));
    setStats(prev => ({ ...prev, completedToday: prev.completedToday + 1 }));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Technician Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, DINH! Here are your active work orders.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Work Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeOrders}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiTool className="text-blue-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completedToday}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="text-green-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Urgent Items</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.urgentItems}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FiAlertTriangle className="text-red-600" />
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Completion</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgCompletionTime}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiClock className="text-purple-600" />
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Active Work Orders</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/technician/work-orders')}
          >
            View All
            <FiChevronRight className="ml-1" />
          </Button>
        </div>

        {workOrders.length === 0 ? (
          <Card>
            <Card.Content className="p-12 text-center">
              <FiTool className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No active work orders</h3>
              <p className="text-gray-500">
                You don't have any active work orders at the moment. Check back later or contact your supervisor for new assignments.
              </p>
            </Card.Content>
          </Card>
        ) : (
          <div className="grid gap-4">
            {workOrders.filter(wo => wo.status !== 'completed').map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <Card.Content className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(order.priority)}`}>
                          {order.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{order.service}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{order.scheduledTime}</p>
                      <p className="text-xs text-gray-500">{order.estimatedDuration} min</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Customer</p>
                      <p className="text-sm font-medium text-gray-900 flex items-center mt-1">
                        <FiUser className="mr-1 text-gray-400" />
                        {order.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Vehicle</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{order.vehicle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{order.location}</p>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-700">{order.notes}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStartWork(order.id)}
                      >
                        <FiTool className="mr-1" />
                        Start Work
                      </Button>
                    )}
                    {order.status === 'in-progress' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleCompleteWork(order.id)}
                        >
                          <FiCheckCircle className="mr-1" />
                          Mark Complete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <FiRefreshCw className="mr-1" />
                          Request Parts
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/technician/work-orders/${order.id}`)}
                    >
                      View Details
                      <FiChevronRight className="ml-1" />
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Card.Content className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiSettings className="text-blue-600 text-xl" />
            </div>
            <p className="text-sm font-medium text-gray-900">Scan Part</p>
          </Card.Content>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Card.Content className="p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiBattery className="text-green-600 text-xl" />
            </div>
            <p className="text-sm font-medium text-gray-900">Inventory</p>
          </Card.Content>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Card.Content className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiCalendar className="text-yellow-600 text-xl" />
            </div>
            <p className="text-sm font-medium text-gray-900">Manuals</p>
          </Card.Content>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <Card.Content className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <FiTrendingUp className="text-purple-600 text-xl" />
            </div>
            <p className="text-sm font-medium text-gray-900">Camera</p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianDashboard;







