import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiMenu,
  FiBell,
  FiUser,
  FiLogOut,
  FiSettings,
  FiChevronDown,
} from "react-icons/fi";
import useAppStore from "../../store/appStore";
import useAuthStore from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { toggleSidebar, notifications } = useAppStore();
  const { user, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  // Đếm số thông báo chưa đọc
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý đăng xuất
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  // Hiển thị tên người dùng (lấy tên cuối)
  const userName = user?.fullName || user?.name || user?.email || "Người dùng";
  const displayName = userName.split(" ").slice(-1)[0] || "bạn";

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Bên trái: logo và nút mở sidebar */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-black hover:bg-[#B8ECFF] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#027C9D] lg:hidden"
            >
              <FiMenu className="h-6 w-6" />
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/images/Logo.png"
                alt="EV Service Logo"
                className="w-10 h-10 object-contain rounded-lg shadow"
              />
              <span className="text-xl font-semibold text-gray-900 hidden sm:block">
                EV Service
              </span>
            </Link>
          </div>

          {/* Bên phải: thông báo, lời chào, avatar + dropdown */}
          <div className="flex items-center space-x-3">
            <button
              className="relative p-2 text-black hover:bg-[#B8ECFF] rounded-full transition"
              onClick={() => navigate("/app/notifications")} // đến trang thông báo
              aria-label="Xem thông báo"
            >
              <FiBell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center h-4 w-4 text-[10px] font-bold text-white bg-red-500 rounded-full ring-2 ring-white">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Lời chào người dùng */}
            <span className="hidden md:inline-block text-sm font-medium text-black">
              Hi, {displayName} 👋
            </span>

            {/* Avatar + dropdown menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-[#B8ECFF] transition"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#027C9D] shadow-sm">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-[#B8ECFF] text-[#027C9D] font-semibold">
                      {userName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <FiChevronDown className="h-4 w-4 text-black" />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                  <div className="px-4 py-4 flex flex-col items-center text-center">
                    {/* Avatar lớn trong dropdown */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#027C9D] mb-3">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={userName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-[#B8ECFF] text-[#027C9D] font-semibold text-xl">
                          {userName?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}
                    </div>

                    {/* Tên và email người dùng */}
                    <p className="text-sm font-medium text-gray-900">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-500 mb-4">{user?.email}</p>

                    {/* Menu điều hướng */}
                    <div className="w-full space-y-1">
                      <Link
                        to="/app/profile"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-[#F0FAFF] rounded-lg transition"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiUser className="mr-2 h-4 w-4 text-[#027C9D]" />
                        Thông tin cá nhân
                      </Link>
                      <Link
                        to="/app/settings"
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-[#F0FAFF] rounded-lg transition"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FiSettings className="mr-2 h-4 w-4 text-[#027C9D]" />
                        Cài đặt
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <FiLogOut className="mr-2 h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
