import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  FiGrid, FiUsers, FiCalendar, FiMenu, FiX, 
  FiLogOut, FiBell, FiTruck, FiPackage, FiDollarSign, FiClock
} from 'react-icons/fi';
import useAuthStore from '../store/authStore';

const StaffLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [centerName, setCenterName] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  // Fetch center name when component mounts
  React.useEffect(() => {
    const fetchCenterInfo = async () => {
      if (user?.userId) {
        try {
          const response = await fetch(`http://localhost:8080/api/employees/${user.userId}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('ev_auth_token')}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            if (data.centerName) {
              setCenterName(data.centerName);
            }
          }
        } catch (error) {
          console.error('Error fetching center info:', error);
        }
      }
    };
    fetchCenterInfo();
  }, [user?.userId]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/staff/dashboard', label: 'Tổng quan', icon: FiGrid },
    { path: '/staff/customers', label: 'Khách hàng', icon: FiUsers },
    { path: '/staff/appointments', label: 'Lịch hẹn', icon: FiCalendar },
    { path: '/staff/vehicle-reception', label: 'Tiếp nhận xe', icon: FiTruck },
    { path: '/staff/reception-tracking', label: 'Theo dõi tiếp nhận', icon: FiClock },
    { path: '/staff/spare-parts', label: 'Quản lý phụ tùng', icon: FiPackage },
    { path: '/staff/payments', label: 'Thanh toán', icon: FiDollarSign },
  ];

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <aside className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } transition-all duration-300 bg-white border-r border-gray-200 flex flex-col`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold">
              EV
            </div>
            {isSidebarOpen && (
              <div>
                <h2 className="font-bold text-gray-900">EV Service</h2>
                <p className="text-xs text-gray-500">Staff Portal</p>
              </div>
            )}
          </div>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-green-50 text-green-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="text-xl flex-shrink-0" />
                  {isSidebarOpen && <span className="font-medium">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.fullName?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'S'}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName || user?.name || 'Nhân viên'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role === 'STAFF' ? 'Nhân viên' : user?.role || 'Staff'}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiLogOut className="text-xl" />
            {isSidebarOpen && <span className="font-medium">Đăng xuất</span>}
          </button>
        </div>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {isSidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
          </button>

          <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
            <p className="text-base font-bold text-gray-900">
              {centerName || 'Trung tâm Dịch vụ'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg">
              <FiBell className="text-xl text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;