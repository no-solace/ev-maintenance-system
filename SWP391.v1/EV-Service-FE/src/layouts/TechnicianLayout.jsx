import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  FiHome, FiTool, FiClipboard, FiPackage, FiSettings,
  FiLogOut, FiMenu, FiX, FiBell, FiUser, FiCheckCircle,
  FiClock, FiAlertTriangle, FiCamera, FiBarChart
} from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import { cn } from '../utils/cn';

const TechnicianLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/technician/dashboard', icon: FiHome },
    { name: 'Work Orders', href: '/technician/work-orders', icon: FiClipboard },
    { name: 'Inventory', href: '/technician/inventory', icon: FiPackage },
    { name: 'Service History', href: '/technician/history', icon: FiBarChart },
    { name: 'Tools & Manuals', href: '/technician/resources', icon: FiTool },
  ];

  const quickActions = [
    { icon: FiCamera, label: 'Scan Part', color: 'bg-blue-500' },
    { icon: FiPackage, label: 'Inventory', color: 'bg-green-500' },
    { icon: FiTool, label: 'Manuals', color: 'bg-yellow-500' },
    { icon: FiCamera, label: 'Camera', color: 'bg-purple-500' },
  ];

  const notifications = [
    { id: 1, type: 'new', message: 'New work order assigned: Tesla Model 3 - Battery Check', time: '5 min ago' },
    { id: 2, type: 'urgent', message: 'Urgent: VinFast VF8 brake inspection needed', time: '30 min ago' },
    { id: 3, type: 'reminder', message: 'Reminder: Complete safety checklist for today', time: '1 hour ago' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b bg-gradient-to-r from-green-500 to-teal-600">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <FiTool className="text-green-600 text-xl" />
              </div>
              <span className="ml-2 text-white font-bold text-lg">EV Service</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-white/20 p-1 rounded"
            >
              <FiX className="text-xl" />
            </button>
          </div>
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FiUser className="text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-gray-900">{user?.name || 'Technician'}</p>
                <p className="text-xs text-gray-500">Technician Portal</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Quick Actions
            </p>
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", action.color)}>
                    <action.icon className="text-sm" />
                  </div>
                  <span className="text-xs text-gray-600 mt-1">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <FiLogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b sticky top-0 z-40">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <FiMenu className="text-xl" />
            </button>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="relative p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiBell className="text-xl text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border">
                    <div className="p-4 border-b">
                      <h3 className="font-semibold text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="p-4 hover:bg-gray-50 border-b last:border-0">
                          <div className="flex items-start">
                            <div className={cn(
                              "w-2 h-2 rounded-full mt-2 mr-3",
                              notification.type === 'urgent' ? 'bg-red-500' :
                              notification.type === 'new' ? 'bg-blue-500' : 'bg-gray-400'
                            )} />
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-700 font-medium text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'T'}
                  </span>
                </div>
                <div className="ml-2 hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Technician'}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TechnicianLayout;


