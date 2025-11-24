import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiTruck,
  FiCalendar,
  FiPackage,
  FiClipboard,
  FiUsers,
  FiBarChart2,
  FiX,
} from "react-icons/fi";
import useAppStore from "../../store/appStore";
import useAuthStore from "../../store/authStore";
import { cn } from "../../utils/cn";

const Sidebar = () => {
  // Lấy trạng thái sidebar 
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  // Lấy thông tin người dùng từ store
  const { user } = useAuthStore();
  // Kiểm tra user có phải admin không
  const isAdmin = user?.role === "admin";

  // user
  const navigation = [
    { name: "Tổng quan", href: "/app/dashboard", icon: FiHome },
    { name: "Xe của tôi", href: "/app/vehicles", icon: FiTruck },
    { name: "Dịch vụ của tôi", href: "/app/my-bookings", icon: FiCalendar },
    { name: "Lịch sử bảo dưỡng", href: "/app/vehicle-history", icon: FiClipboard },
    { name: "Dịch vụ", href: "/app/services", icon: FiPackage },
  ];

  //  admin
  const adminNavigation = [
    { name: "Quản lý người dùng", href: "/app/admin/users", icon: FiUsers },
    { name: "Quản lý dịch vụ", href: "/app/admin/services", icon: FiPackage },
    { name: "Báo cáo", href: "/app/admin/reports", icon: FiBarChart2 },
  ];

  return (
    <>
  
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Thanh sidebar chính */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 border-r border-gray-200 shadow-md transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: "#D9EDF6" }}
      >
        <div className="h-full flex flex-col">
          
          <div className="lg:hidden flex justify-end p-3">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              aria-label="Close sidebar"
            >
              {/* Icon đóng (X) */}
              <FiX className="h-5 w-5" />
            </button>
          </div>

          {/* Header */}
          <div className="px-4 py-5 text-center bg-gradient-to-r from-[#027C9D] to-[#015C7A] shadow-sm">
            <p className="text-sm font-semibold text-white uppercase tracking-wide">
              Trang khách hàng
            </p>
          </div>

          {/* Danh sách menu */}
          <nav className="flex-1 px-3 pt-5 pb-4 space-y-1 overflow-y-auto">
            {/* Tiêu đề menu chính */}
            <h3 className="px-2 mb-3 text-center text-sm font-bold text-black uppercase tracking-wide">
              Menu chính
            </h3>

            {/* Các mục menu chính */}
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-gray-300 text-black shadow-inner"
                      : "text-black hover:bg-gray-100 hover:text-gray-900"
                  )
                }
                onClick={() => setSidebarOpen(false)} // đóng sidebar khi click menu trên mobile
              >
                {/* Icon */}
                <item.icon
                  className="mr-3 h-5 w-5 flex-shrink-0 group-hover:text-gray-900"
                  aria-hidden="true"
                />
                {/* Tên mục */}
                {item.name}
              </NavLink>
            ))}

            {/* Menu admin */}
            {isAdmin && (
              <>
                <h3 className="px-2 mt-6 mb-3 text-center text-sm font-bold text-black uppercase tracking-wide">
                  Quản trị
                </h3>
                {adminNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-gray-300 text-black shadow-inner"
                          : "text-black hover:bg-gray-100 hover:text-gray-900"
                      )
                    }
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon
                      className="mr-3 h-5 w-5 flex-shrink-0 group-hover:text-gray-900"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
