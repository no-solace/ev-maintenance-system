import { FiBell, FiAlertCircle, FiCheckCircle, FiClock, FiTool, FiPackage } from 'react-icons/fi';
import Card from '../ui/Card';
// giao dien danh sach thong bao
const NotificationsList = ({ notifications = [] }) => {
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'new_assignment':
        return <FiTool className="text-blue-600" />;
      case 'urgent':
        return <FiAlertCircle className="text-red-600" />;
      case 'completed':
        return <FiCheckCircle className="text-green-600" />;
      case 'reminder':
        return <FiClock className="text-orange-600" />;
      case 'parts':
        return <FiPackage className="text-purple-600" />;
      default:
        return <FiBell className="text-gray-600" />;
    }
  };
  //  mau nen thong bao theo loai
  const getNotificationBgColor = (type) => {
    switch(type) {
      case 'new_assignment':
        return 'bg-blue-50 border-blue-200';
      case 'urgent':
        return 'bg-red-50 border-red-200';
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'reminder':
        return 'bg-orange-50 border-orange-200';
      case 'parts':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };
  // dinh dang thoi gian
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ngày trước`;
  };
  //  tra ve giao dien danh sach thong bao
  return (
    <div className="space-y-3">
      {notifications.length === 0 ? (
        <Card>
          <Card.Content className="p-8 text-center">
            <FiBell className="mx-auto text-4xl text-gray-300 mb-3" />
            <p className="text-gray-500">Không có thông báo mới</p>
          </Card.Content>
        </Card>
      ) : (
        notifications.map((notification) => (
          <Card 
            key={notification.id}
            className={`border-l-4 transition-all hover:shadow-md ${getNotificationBgColor(notification.type)} ${notification.unread ? 'shadow-sm' : 'opacity-75'}`}
          >
            <Card.Content className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {notification.title}
                      {notification.unread && (
                        <span className="ml-2 inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                      )}
                    </h4>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{notification.message}</p>
                </div>
              </div>
            </Card.Content>
          </Card>
        ))
      )}
    </div>
  );
};

export default NotificationsList;
