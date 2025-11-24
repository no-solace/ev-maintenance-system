import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiTool, FiClock, FiCheckCircle, FiChevronRight
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import NotificationsList from '../../components/technician/NotificationsList';
import toast from 'react-hot-toast';
import technicianService from '../../services/technicianService';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingOrders: 0,
    inProgressOrders: 0,
    completedToday: 0,
    avgCompletionTime: '0h'
  });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    try {
      console.log('📊 Fetching my receptions...');
      // Simply get all receptions for this technician
      const result = await technicianService.getMyReceptions();
      
      console.log('📊 My receptions result:', result);
      
      if (result.success) {
        const allReceptions = result.data || [];
        
        console.log('📊 All receptions:', allReceptions);
        
        // Filter active work orders (RECEIVED, ASSIGNED, or IN_PROGRESS)
        const activeWorkOrders = allReceptions.filter(r => 
          r.status === 'RECEIVED' || r.status === 'ASSIGNED' || r.status === 'IN_PROGRESS'
        );
        
        // Calculate pending count (RECEIVED + ASSIGNED)
        const pendingCount = allReceptions.filter(r => 
          r.status === 'RECEIVED' || r.status === 'ASSIGNED'
        ).length;
        
        // Calculate in-progress count
        const inProgressCount = allReceptions.filter(r => 
          r.status === 'IN_PROGRESS'
        ).length;
        
        // Calculate completed today
        const today = new Date().toISOString().split('T')[0];
        const completedToday = allReceptions.filter(r => {
          if (r.status !== 'COMPLETED' || !r.completedAt) return false;
          const completedDate = new Date(r.completedAt).toISOString().split('T')[0];
          return completedDate === today;
        }).length;
        
        // Calculate average completion time
        const completedReceptions = allReceptions.filter(r => 
          r.status === 'COMPLETED' && r.createdAt && r.completedAt
        );
        
        let avgCompletionTime = '0h';
        if (completedReceptions.length > 0) {
          const totalMinutes = completedReceptions.reduce((sum, r) => {
            const start = new Date(r.createdAt);
            const end = new Date(r.completedAt);
            const diffMinutes = Math.floor((end - start) / 60000);
            return sum + diffMinutes;
          }, 0);
          
          const avgMinutes = Math.floor(totalMinutes / completedReceptions.length);
          const hours = Math.floor(avgMinutes / 60);
          const minutes = avgMinutes % 60;
          
          if (hours > 0 && minutes > 0) {
            avgCompletionTime = `${hours}h ${minutes}m`;
          } else if (hours > 0) {
            avgCompletionTime = `${hours}h`;
          } else if (minutes > 0) {
            avgCompletionTime = `${minutes}m`;
          }
        }
        
        // Update stats
        setStats({
          pendingOrders: pendingCount,
          inProgressOrders: inProgressCount,
          completedToday: completedToday,
          avgCompletionTime: avgCompletionTime
        });
        
        // Generate notifications from active work orders
        const generatedNotifications = generateNotifications(activeWorkOrders);
        setNotifications(generatedNotifications);
        
      } else {
        toast.error(result.error || 'Không thể tải dữ liệu');
      }
    } catch (error) {
      console.error('❌ Error fetching dashboard:', error);
      toast.error('Lỗi khi tải dashboard');
    }
  };
  
  /**
   * Generate notifications from active receptions
   * @param {Array} receptions - Active receptions from dashboard API
   * @returns {Array} Notifications array
   */
  const generateNotifications = (receptions) => {
    const notifs = [];
    const now = new Date();
    
    receptions.forEach((reception, index) => {
      const createdAt = new Date(reception.createdAt);
      const waitingTimeMinutes = Math.floor((now - createdAt) / 60000);
      
      // Notification for new assignment (RECEIVED status)
      if (reception.status === 'RECEIVED') {
        notifs.push({
          id: `new-${reception.receptionId}`,
          type: 'new_assignment',
          title: 'Công việc mới được giao',
          message: `Bạn có 1 công việc mới: ${reception.services?.join(', ') || 'Dịch vụ'} - ${reception.vehicleModel} (${reception.licensePlate})`,
          timestamp: reception.createdAt,
          unread: true
        });
      }
      
      // Urgent notification if waiting time > 30 minutes and still RECEIVED
      if (reception.status === 'RECEIVED' && waitingTimeMinutes > 30) {
        notifs.push({
          id: `urgent-${reception.receptionId}`,
          type: 'urgent',
          title: 'Công việc cần xử lý gấp',
          message: `Xe ${reception.vehicleModel} (${reception.licensePlate}) đang chờ ${waitingTimeMinutes} phút, khách hàng yêu cầu ưu tiên`,
          timestamp: reception.createdAt,
          unread: true
        });
      }
      
      // Reminder for IN_PROGRESS work (work in progress for more than 2 hours)
      if (reception.status === 'IN_PROGRESS' && waitingTimeMinutes > 120) {
        notifs.push({
          id: `reminder-${reception.receptionId}`,
          type: 'reminder',
          title: 'Nhắc nhở công việc',
          message: `Công việc #${reception.receptionId} đang dở, vui lòng hoàn thành trong hôm nay`,
          timestamp: reception.createdAt,
          unread: false
        });
      }
    });
    
    // Sort by timestamp (newest first)
    return notifs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };


  return (
    <div>
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-600 mt-1">Xem công việc được giao và tiến độ hôm nay</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Công việc đang chờ</span>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiClock className="text-blue-600 text-xl" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Đang tiến hành</span>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiTool className="text-yellow-600 text-xl" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.inProgressOrders}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Hoàn thành hôm nay</span>
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.completedToday}</p>
          </Card.Content>
        </Card>

        <Card>
          <Card.Content className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-600">Thời gian TB</span>
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiClock className="text-purple-600 text-xl" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.avgCompletionTime}</p>
          </Card.Content>
        </Card>
      </div>
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Thông báo</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/technician/work-orders')}
          >
            Xem công việc
            <FiChevronRight className="ml-1" />
          </Button>
        </div>

        <NotificationsList notifications={notifications} />
      </div>

    </div>
  );
};

export default TechnicianDashboard;







