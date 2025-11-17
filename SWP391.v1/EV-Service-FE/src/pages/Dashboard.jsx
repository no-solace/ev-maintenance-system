import React, { useState, useEffect } from "react";
import { FiTruck, FiCalendar, FiDollarSign } from "react-icons/fi";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { formatCurrency, formatDate } from "../utils/format";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import vehicleService from "../services/vehicleService";
import bookingService from "../services/bookingService";
import toast from "react-hot-toast";

const iconMap = {
  truck: FiTruck,
  calendar: FiCalendar,
  dollar: FiDollarSign,
};

const Dashboard = () => {
  const { user } = useAuthStore();
  const [stats, setStats] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get user name from authStore
  const userName = user?.fullName || user?.name || user?.email || "Người dùng";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch vehicles
      const vehiclesResult = await vehicleService.getMyVehicles();
      const vehicleCount = vehiclesResult?.length || 0;
      
      // Fetch bookings
      const bookingsResult = await bookingService.getMyBookings('all');
      const allBookings = bookingsResult.data || [];
      
      console.log('📊 Dashboard - All bookings:', allBookings);
      console.log('📊 Dashboard - Bookings count:', allBookings.length);
      
      // Count upcoming bookings (including all non-completed/cancelled statuses)
      const upcomingBookings = allBookings.filter(b => {
        const isUpcoming = b.status === 'PENDING' || 
                          b.status === 'APPROVED' || 
                          b.status === 'ASSIGNED' ||
                          b.status === 'IN_PROGRESS' ||
                          b.status === 'DEPOSIT_PAID' ||
                          b.status === 'UPCOMING'; // Add UPCOMING status
        console.log(`📊 Booking ${b.bookingId} - Status: ${b.status}, IsUpcoming: ${isUpcoming}`);
        return isUpcoming;
      }).length;
      
      console.log('📊 Dashboard - Upcoming bookings count:', upcomingBookings);
      
      // Calculate total spent this month
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      
      const monthlySpent = allBookings
        .filter(b => {
          if (!b.bookingDate) return false;
          const bookingDate = new Date(b.bookingDate);
          return bookingDate.getMonth() === currentMonth && 
                 bookingDate.getFullYear() === currentYear &&
                 b.status === 'COMPLETED';
        })
        .reduce((sum, b) => sum + (b.totalCost || 0), 0);
      
      // Set stats (removed battery/energy card)
      setStats([
        { 
          title: "Xe của bạn", 
          value: vehicleCount.toString(), 
          iconKey: "truck",
          change: vehicleCount > 0 ? `${vehicleCount} xe đang hoạt động` : "Chưa có xe"
        },
        { 
          title: "Lịch hẹn", 
          value: upcomingBookings.toString(), 
          iconKey: "calendar",
          change: upcomingBookings > 0 ? `${upcomingBookings} lịch sắp tới` : "Không có lịch"
        },
        {
          title: "Chi phí tháng này",
          value: formatCurrency(monthlySpent),
          iconKey: "dollar",
          change: monthlySpent > 0 ? `Đã thanh toán` : "Chưa có chi phí"
        },
      ]);
      
      // Get upcoming bookings only (sorted by date, earliest first)
      const upcomingBookingsList = allBookings
        .filter(b => {
          const isUpcoming = b.status === 'PENDING' || 
                            b.status === 'APPROVED' || 
                            b.status === 'ASSIGNED' ||
                            b.status === 'IN_PROGRESS' ||
                            b.status === 'DEPOSIT_PAID' ||
                            b.status === 'UPCOMING';
          return isUpcoming;
        })
        .sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate)) // Earliest first
        .slice(0, 5)
        .map(booking => ({
          id: booking.bookingId,
          vehicle: booking.licensePlate || 'N/A',
          center: booking.centerName || 'Trung tâm',
          date: booking.bookingDate,
          time: booking.bookingTime || '',
          status: mapBookingStatus(booking.status)
        }));
      
      setRecentBookings(upcomingBookingsList);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Không thể tải dữ liệu dashboard');
      // Set empty stats on error
      setStats([
        { title: "Xe của bạn", value: "0", iconKey: "truck", change: "Chưa có xe" },
        { title: "Lịch hẹn", value: "0", iconKey: "calendar", change: "Không có lịch" },
        { title: "Chi phí tháng này", value: formatCurrency(0), iconKey: "dollar", change: "Chưa có chi phí" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const mapBookingStatus = (status) => {
    const statusMap = {
      'PENDING': 'upcoming',
      'APPROVED': 'upcoming',
      'ASSIGNED': 'upcoming',
      'IN_PROGRESS': 'upcoming',
      'DEPOSIT_PAID': 'upcoming',
      'UPCOMING': 'upcoming', // Add UPCOMING status
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled',
      'REJECTED': 'cancelled'
    };
    return statusMap[status] || 'upcoming';
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: "bg-green-400 text-white",
      upcoming: "bg-blue-400 text-white",
      cancelled: "bg-red-400 text-white",
    };
    const labels = {
      completed: "Hoàn thành",
      upcoming: "Sắp tới",
      cancelled: "Đã hủy",
    };
    return (
      <span
        className={`inline-flex items-center justify-center px-4 py-1 rounded-md text-xs font-semibold ${badges[status]}`}
        style={{ whiteSpace: "nowrap", minWidth: "100px" }}
      >
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-[#B8ECFF] via-[#80D3EF] to-[#027C9D] rounded-xl text-gray-900">
      <div className="mb-8 text-white animate-fade-in">
        <p className="text-lg mb-1 font-semibold drop-shadow-md">Xin chào,</p>
        <h1 className="text-5xl font-extrabold mb-1 uppercase drop-shadow-xl tracking-tight">
          {userName} 👋
        </h1>
        <p className="text-lg opacity-90 font-light drop-shadow-md">
          Chào mừng bạn quay trở lại với EV Service
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mb-9">
        {loading ? (
          <div className="col-span-3 text-center text-white">Đang tải...</div>
        ) : (
          stats.map(({ title, value, iconKey, change }, idx) => {
            // Color scheme for 3 cards - lighter and more cohesive
            const cardStyles = [
              {
                bgClass: "bg-white",
                textColor: "text-[#027C9D]",
                iconColor: "text-[#027C9D]"
              },
              {
                bgClass: "bg-gradient-to-br from-[#0891B2] to-[#0E7490]",
                textColor: "text-white",
                iconColor: "text-white"
              },
              {
                bgClass: "bg-gradient-to-br from-[#0D9488] to-[#0F766E]",
                textColor: "text-white",
                iconColor: "text-white"
              }
            ];

            const { bgClass, textColor, iconColor } = cardStyles[idx] || cardStyles[0];
            const IconComponent = iconKey ? iconMap[iconKey] : null;

            return (
              <Card
                key={idx}
                hoverable
                className={`p-7 flex flex-col sm:flex-row items-center justify-between rounded-xl shadow-md ${bgClass}
                  transition duration-200 transform
                  hover:scale-105 hover:shadow-2xl hover:z-10
                  hover:border-2 hover:border-blue-400`}
              >
                <div>
                  <p className={`text-sm font-medium ${textColor}`}>{title}</p>
                  <p className={`text-3xl font-extrabold mt-2 ${textColor}`}>
                    {value}
                  </p>
                  <p className={`text-xs mt-1 ${textColor} opacity-80`}>
                    {change}
                  </p>
                </div>
                <div className="p-4 rounded-md bg-white/20 drop-shadow-md">
                  {IconComponent && (
                    <IconComponent className={`h-10 w-10 ${iconColor}`} />
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 text-white">
        <Card className="bg-white rounded-2xl shadow-lg text-gray-900">
          <Card.Header>
            <Card.Title className="text-lg text-[#027C9D] font-bold drop-shadow">
              Lịch hẹn sắp tới
            </Card.Title>
          </Card.Header>
          <Card.Content className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-300">
                <tr>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">
                    Xe
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">
                    Trung tâm
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">
                    Ngày
                  </th>
                  <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wide">
                    Trạng thái
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      Đang tải...
                    </td>
                  </tr>
                ) : recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                      Chưa có lịch hẹn sắp tới
                    </td>
                  </tr>
                ) : (
                  recentBookings.map(
                    ({ id, vehicle, center, date, time, status }) => (
                      <tr
                        key={id}
                        className="hover:bg-blue-50/40 cursor-pointer transition"
                        onClick={() => navigate('/app/bookings')}
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {vehicle}
                        </td>
                        <td className="px-6 py-4 text-sm text-teal-700">
                          {center}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {formatDate(date)}
                          {time && <span className="block text-xs text-gray-500">{time}</span>}
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(status)}</td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </Card.Content>
          <Button
            variant="outline"
            size="sm"
            className="w-full font-semibold text-[#027C9D] hover:bg-[#80D3EF]"
            onClick={() => navigate("/app/bookings")}
          >
            Xem tất cả lịch hẹn
          </Button>
        </Card>

        <Card className="bg-white rounded-2xl shadow-lg text-gray-900">
          <Card.Header>
            <Card.Title className="text-lg text-[#027C9D] font-bold drop-shadow">
              Thông báo
            </Card.Title>
          </Card.Header>
          <Card.Content className="text-gray-900">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Chưa có thông báo mới</p>
            </div>
          </Card.Content>
          <Card.Footer>
            <Button
              variant="outline"
              size="sm"
              className="w-full font-semibold text-[#027C9D] hover:bg-[#80D3EF]"
              onClick={() => navigate("/app/notifications")}
            >
              Xem tất cả thông báo
            </Button>
          </Card.Footer>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
