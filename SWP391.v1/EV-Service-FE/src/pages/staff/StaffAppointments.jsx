import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiClock,
  FiUser,
  FiTruck,
  FiTool,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiCheck,
  FiMapPin,
} from "react-icons/fi";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import toast from "react-hot-toast";
import bookingService from "../../services/bookingService";

const StaffAppointments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [expandedNotes, setExpandedNotes] = useState({}); // Track which rows have expanded notes
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    vehicleMake: "",
    vehicleModel: "",
    vehiclePlate: "",
    service: "",
    date: "",
    time: "",
    duration: "60",
    technician: "",
    notes: "",
    price: "",
  });

  // appointments from backend
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState([]);



  // Fetch bookings when component mounts or status filter changes
  useEffect(() => {
    fetchBookings();
    fetchTechnicians();
  }, [statusFilter]);

  // Refresh technicians when page becomes visible (user returns from another page)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('📱 Page visible again, refreshing technicians...');
        fetchTechnicians();
      }
    };

    const handleFocus = () => {
      console.log('📱 Window focused, refreshing technicians...');
      fetchTechnicians();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Fetch technicians from the authenticated staff's service center
  const fetchTechnicians = async () => {
    try {
      const result = await bookingService.getMyTechnicians();
      if (result.success && result.data) {
        // Use the workingStatus from backend directly
        // Backend should already provide accurate working status
        console.log('📋 Technicians loaded:', result.data);
        result.data.forEach(tech => {
          console.log(`  - ${tech.name}: ${tech.workingStatus || 'NO STATUS'}`);
        });
        setTechnicians(result.data);
      } else {
        console.error("Error fetching technicians:", result.error);
        setTechnicians([]);
      }
    } catch (error) {
      console.error("Error fetching technicians:", error);
      setTechnicians([]);
    }
  };



  const fetchBookings = async () => {
    setLoading(true);
    try {
      let result;
      // Fetch by status or all bookings
      if (statusFilter !== "all") {
        // Map frontend status to backend status enum
        const statusMap = {
          "payment-pending": "PENDING_PAYMENT",
          upcoming: "UPCOMING",
          "cancellation-requested": "CANCELLATION_REQUESTED",
          received: "RECEIVED",
          completed: "COMPLETED",
          cancelled: "CANCELLED",
        };
        result = await bookingService.getBookingsByStatus(
          statusMap[statusFilter]
        );
      } else {
        // For staff, show all bookings (PENDING + APPROVED + ASSIGNED)
        result = await bookingService.getAllBookings();
      }

      if (result.success && result.data) {
        // Handle case when data is an array
        const bookingsList = Array.isArray(result.data) ? result.data : [];

        if (bookingsList.length === 0) {
          console.log("No bookings found");
          setAppointments([]);
        } else {
          // Transform backend data to match frontend format
          const transformedAppointments = bookingsList.map((booking) => ({
            id: booking.bookingId,
            customerName: booking.customerName || "N/A",
            customerEmail: booking.customerEmail || null,
            customerPhone: booking.customerPhone || "",
            customerAddress: booking.customerAddress || null,
            vehicleMake: booking.vehicleMake || "EV",
            vehicleModel: booking.vehicleModel || "",
            vehiclePlate: booking.vehiclePlate || booking.licensePlate || "N/A",
            service: booking.serviceName || booking.offerType || "Service",
            date: booking.bookingDate,
            time: booking.bookingTime,
            duration: 60,
            technician: booking.assignedTechnicianName || "",
            notes: booking.notes || booking.problemDescription || "",
            price: 0,
            status: mapBackendStatus(booking.status),
            createdAt: booking.createdAt,
          }));
          setAppointments(transformedAppointments);
          console.log("Loaded bookings:", transformedAppointments.length);
        }
      } else {
        console.log("API returned error:", result.error);
        setAppointments([]);
        // Don't show error toast if it's just empty data
        if (result.error && !result.error.includes("404")) {
          toast.error(result.error || "Không thể tải danh sách booking");
        }
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setAppointments([]);
      // Only show error for non-404 errors
      if (error.response && error.response.status !== 404) {
        toast.error("Lỗi khi tải danh sách booking");
      }
    } finally {
      setLoading(false);
    }
  };

  // Map backend status to frontend status
  const mapBackendStatus = (backendStatus) => {
    const statusMap = {
      PENDING_PAYMENT: "payment-pending",
      UPCOMING: "upcoming",
      CANCELLATION_REQUESTED: "cancellation-requested",
      RECEIVED: "received",
      COMPLETED: "completed",
      CANCELLED: "cancelled",
    };
    return statusMap[backendStatus] || "pending";
  };

  // dich vu
  const services = [
    "Battery Check & Replacement",
    "Software Update",
    "General Maintenance",
    "Charging System Service",
    "AC System Service",
    "Brake Service",
    "Tire Rotation & Balance",
    "Diagnostic Check",
  ];

  // thoi gian
  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
  ];

  const stats = {
    paymentPending: appointments.filter((a) => a.status === "payment-pending").length || 0,
    upcoming: appointments.filter((a) => a.status === "upcoming").length || 0,
    cancellationRequested: appointments.filter((a) => a.status === "cancellation-requested").length || 0,
    received: appointments.filter((a) => a.status === "received").length || 0,
    completed: appointments.filter((a) => a.status === "completed").length || 0,
    cancelled: appointments.filter((a) => a.status === "cancelled").length || 0,
  };

  // appointment
  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.customerName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.vehiclePlate
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      appointment.service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;

    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" && isToday(appointment.date)) ||
      (dateFilter === "week" && isThisWeek(appointment.date));

    return matchesSearch && matchesStatus && matchesDate;
  });

  // appointment sap xep theo thoi gian
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
  });

  // check ngay hom nay va tuan nay
  const isToday = (date) => {
    const today = new Date();
    const appointmentDate = new Date(date);
    return today.toDateString() === appointmentDate.toDateString();
  };

  const isThisWeek = (date) => {
    const today = new Date();
    const appointmentDate = new Date(date);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    return appointmentDate >= weekStart && appointmentDate <= weekEnd;
  };

  // mau sac trang thai sau khi chon
  const getStatusColor = (status) => {
    switch (status) {
      case "payment-pending":
        return "bg-orange-100 text-orange-700"; // Waiting for payment
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "cancellation-requested":
        return "bg-yellow-100 text-yellow-700"; // Cancellation request
      case "received":
        return "bg-cyan-100 text-cyan-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // them appinement
  const handleAddAppointment = (e) => {
    e.preventDefault();

    const newAppointment = {
      id: appointments.length + 1,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      vehicleMake: formData.vehicleMake,
      vehicleModel: formData.vehicleModel,
      vehiclePlate: formData.vehiclePlate,
      service: formData.service,
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration),
      technician: formData.technician,
      notes: formData.notes,
      price: parseFloat(formData.price) || 0,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    };

    setAppointments([...appointments, newAppointment]);
    setShowAddModal(false);
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      vehicleMake: "",
      vehicleModel: "",
      vehiclePlate: "",
      service: "",
      date: "",
      time: "",
      duration: "60",
      technician: "",
      notes: "",
      price: "",
    });
    toast.success("Appointment created successfully");
  };

  // cap nhat trang thai
  const handleStatusChange = (id, newStatus) => {
    setAppointments(
      appointments.map((apt) =>
        apt.id === id ? { ...apt, status: newStatus } : apt
      )
    );
    toast.success(`Appointment status updated to ${newStatus}`);
  };

  // xoa appointment
  const handleDeleteAppointment = (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      setAppointments(
        appointments.map((apt) =>
          apt.id === id ? { ...apt, status: "cancelled" } : apt
        )
      );
      toast.success("Appointment cancelled");
    }
  };

  // Show detail modal
  const handleShowDetail = (appointment) => {
    console.log('📋 Booking detail:', appointment);
    console.log('📍 Customer address:', appointment.customerAddress);
    setSelectedBooking(appointment);
    setShowDetailModal(true);
  };



  // Navigate to vehicle reception page with booking data
  const handleNavigateToReception = (booking) => {
    console.log("Navigating to reception with booking:", booking);

    // Store booking data in sessionStorage to pass to reception page
    // Only include email and address if they exist in the booking
    const receptionData = {
      bookingId: booking.id,
      customerName: booking.customerName || "",
      customerPhone: booking.customerPhone || "",
      vehicleModel: booking.vehicleModel || booking.vehicleMake || "",
      licensePlate: booking.vehiclePlate || "",
      mileage: booking.mileage || "",
      service: booking.service || "",
      notes: booking.notes || "",
    };

    // Only add email if it exists
    if (booking.customerEmail) {
      receptionData.customerEmail = booking.customerEmail;
    }

    // Only add address if it exists
    if (booking.customerAddress) {
      receptionData.customerAddress = booking.customerAddress;
    }

    console.log("Storing reception data:", receptionData);
    sessionStorage.setItem(
      "bookingForReception",
      JSON.stringify(receptionData)
    );

    // Navigate to vehicle reception page where technician will be assigned
    navigate("/staff/vehicle-reception");
  };

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          Lịch hẹn chăm sóc, bảo dưỡng xe
        </h1>
        <p className="text-gray-600 mt-1">
          Quản ly lịch hẹn - theo dõi tiến trình
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6">
        <Card.Content className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm khách, xe..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="payment-pending">Chờ thanh toán</option>
              <option value="upcoming">Đã thanh toán</option>
              <option value="update-requested">Yêu cầu cập nhật</option>
              <option value="cancellation-requested">Yêu cầu hủy</option>
              <option value="received">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </Card.Content>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <Card className="border border-gray-200">
          <Card.Content className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Chờ thanh toán</p>
            <p className="text-3xl font-bold text-orange-600">
              {stats.paymentPending}
            </p>
          </Card.Content>
        </Card>

        <Card className="border border-gray-200">
          <Card.Content className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Đã thanh toán</p>
            <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
          </Card.Content>
        </Card>

        <Card className="border border-gray-200">
          <Card.Content className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Yêu cầu hủy</p>
            <p className="text-3xl font-bold text-yellow-600">
              {stats.cancellationRequested}
            </p>
          </Card.Content>
        </Card>

        <Card className="border border-gray-200">
          <Card.Content className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Đang xử lý</p>
            <p className="text-3xl font-bold text-cyan-600">
              {stats.received}
            </p>
          </Card.Content>
        </Card>

        <Card className="border border-gray-200">
          <Card.Content className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Hoàn thành</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.completed}
            </p>
          </Card.Content>
        </Card>

        <Card className="border border-gray-200">
          <Card.Content className="p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Đã hủy</p>
            <p className="text-3xl font-bold text-red-600">
              {stats.cancelled}
            </p>
          </Card.Content>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <Card.Content className="p-0">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin mx-auto h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mb-4"></div>
              <p className="text-gray-600">Đang tải danh sách booking...</p>
            </div>
          ) : sortedAppointments.length === 0 ? (
            <div className="p-12 text-center">
              <FiCalendar className="mx-auto text-5xl text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Chưa có lịch hẹn
              </h3>
              <p className="text-gray-500">Chưa có lịch hẹn nào được tạo</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Mã
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Tên KH
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Dòng xe
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Giờ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Liên hệ
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Ghi chú
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedAppointments.map((appointment, index) => (
                    <React.Fragment key={appointment.id}>
                    <tr
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        DL{String(appointment.id).padStart(2, "0")}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {appointment.customerName}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {appointment.vehicleModel || appointment.vehicleMake}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {appointment.time}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {appointment.date}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {appointment.customerPhone}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {(appointment.problemDescription || appointment.notes) ? (
                          <button
                            onClick={() => setExpandedNotes(prev => ({
                              ...prev,
                              [appointment.id]: !prev[appointment.id]
                            }))}
                            className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors min-w-[70px]"
                          >
                            {expandedNotes[appointment.id] ? 'Ẩn' : 'Hiển thị'}
                          </button>
                        ) : (
                          <span className="text-gray-400 italic text-xs">Không có</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status === "payment-pending" && "Chờ thanh toán"}
                          {appointment.status === "upcoming" && "Đã thanh toán"}
                          {appointment.status === "update-requested" && "Yêu cầu cập nhật"}
                          {appointment.status === "cancellation-requested" && "Yêu cầu hủy"}
                          {appointment.status === "received" && "Đang xử lý"}
                          {appointment.status === "completed" && "Hoàn thành"}
                          {appointment.status === "cancelled" && "Đã hủy"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2 items-center">
                          {/* Detail button - always show */}
                          <button
                            onClick={() => handleShowDetail(appointment)}
                            className="px-3 py-1 text-xs font-medium bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors whitespace-nowrap"
                          >
                            Chi tiết
                          </button>
                          
                          {/* Show waiting for payment message */}
                          {appointment.status === "payment-pending" && (
                            <span className="px-3 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full whitespace-nowrap">
                              Chờ thanh toán
                            </span>
                          )}

                          {/* Approve/Reject update request */}
                          {appointment.status === "update-requested" && (
                            <>
                              <button
                                onClick={async () => {
                                  if (window.confirm('Xác nhận duyệt cập nhật thông tin?')) {
                                    // TODO: Implement approve update logic
                                    toast.success('Đã duyệt cập nhật');
                                    fetchBookings();
                                  }
                                }}
                                className="px-3 py-1 text-xs font-medium bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors whitespace-nowrap"
                              >
                                ✔ Duyệt
                              </button>
                              <button
                                onClick={async () => {
                                  const reason = prompt('Lý do từ chối:');
                                  if (reason !== null) {
                                    // TODO: Implement reject update logic
                                    toast.success('Đã từ chối cập nhật');
                                    fetchBookings();
                                  }
                                }}
                                className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors whitespace-nowrap"
                              >
                                ✖ Từ chối
                              </button>
                            </>
                          )}

                          {/* Approve/Reject cancellation request */}
                          {appointment.status === "cancellation-requested" && (
                            <>
                              <button
                                onClick={async () => {
                                  if (window.confirm('Xác nhận duyệt hủy lịch hẹn này?')) {
                                    const result = await bookingService.approveCancellation(appointment.id);
                                    if (result.success) {
                                      toast.success('Đã duyệt hủy lịch hẹn');
                                      fetchBookings();
                                    } else {
                                      toast.error(result.error || 'Không thể duyệt hủy');
                                    }
                                  }
                                }}
                                className="px-3 py-1 text-xs font-medium bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors whitespace-nowrap"
                              >
                                ✔ Duyệt hủy
                              </button>
                              <button
                                onClick={async () => {
                                  const reason = prompt('Lý do từ chối:');
                                  if (reason !== null) {
                                    const result = await bookingService.rejectCancellation(appointment.id, reason);
                                    if (result.success) {
                                      toast.success('Đã từ chối hủy lịch');
                                      fetchBookings();
                                    } else {
                                      toast.error(result.error || 'Không thể từ chối');
                                    }
                                  }
                                }}
                                className="px-3 py-1 text-xs font-medium bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors whitespace-nowrap"
                              >
                                ✖ Từ chối
                              </button>
                            </>
                          )}

                          {/* Tiếp nhận xe when customer arrives */}
                          {appointment.status === "upcoming" && (
                            <button
                              onClick={() => handleNavigateToReception(appointment)}
                              className="px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors whitespace-nowrap"
                            >
                              Tiếp nhận
                            </button>
                          )}

                          {/* Show completed state for received bookings */}
                          {appointment.status === "received" && (
                            <span className="px-3 py-1 text-xs font-medium bg-cyan-100 text-cyan-700 rounded-full whitespace-nowrap">
                              ✓ Đã tiếp nhận
                            </span>
                          )}

                          {/* Show completed state */}
                          {appointment.status === "completed" && (
                            <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full whitespace-nowrap">
                              Hoàn thành
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                    {/* Expanded notes row */}
                    {expandedNotes[appointment.id] && (appointment.problemDescription || appointment.notes) && (
                      <tr className="bg-gray-50">
                        <td colSpan="9" className="px-4 py-3">
                          <div className="space-y-2">
                            {appointment.problemDescription && (
                              <div className="p-3 bg-amber-50 rounded border border-amber-200">
                                <p className="text-xs text-amber-700 font-medium mb-1">Vấn đề:</p>
                                <p className="text-sm text-gray-900">{appointment.problemDescription}</p>
                              </div>
                            )}
                            {appointment.notes && (
                              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                                <p className="text-xs text-blue-700 font-medium mb-1">Ghi chú:</p>
                                <p className="text-sm text-gray-900">{appointment.notes}</p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Content>
      </Card>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-2">
        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
          Trang trước
        </button>
        <button className="px-3 py-1 text-sm bg-gray-200 text-gray-900 rounded">
          Trang 1/3
        </button>
        <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">
          Trang sau
        </button>
      </div>
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Create New Appointment
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      customerName: "",
                      customerEmail: "",
                      customerPhone: "",
                      vehicleMake: "",
                      vehicleModel: "",
                      vehiclePlate: "",
                      service: "",
                      date: "",
                      time: "",
                      duration: "60",
                      technician: "",
                      notes: "",
                      price: "",
                    });
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            <form onSubmit={handleAddAppointment} className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">
                Customer Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.customerName}
                    onChange={(e) =>
                      setFormData({ ...formData, customerName: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.customerEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerEmail: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.customerPhone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customerPhone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-4">
                Vehicle Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Make *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Tesla"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.vehicleMake}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleMake: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Model *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Model 3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.vehicleModel}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicleModel: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Plate *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., ABC-123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.vehiclePlate}
                    onChange={(e) =>
                      setFormData({ ...formData, vehiclePlate: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-4">
                Service Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Type *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.service}
                    onChange={(e) =>
                      setFormData({ ...formData, service: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-4">Schedule</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData({ ...formData, time: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                  >
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                    <option value="120">120</option>
                    <option value="180">180</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kỹ thuật viên phụ trách
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={formData.technician}
                    onChange={(e) =>
                      setFormData({ ...formData, technician: e.target.value })
                    }
                  >
                    <option value="">-- Chọn kỹ thuật viên --</option>
                    {technicians
                      .filter(tech => {
                        const workingStatus = tech.workingStatus || 'AVAILABLE';
                        // Only show AVAILABLE technicians
                        return workingStatus === 'AVAILABLE';
                      })
                      .map((tech) => {
                        return (
                          <option 
                            key={tech.employeeId} 
                            value={tech.name}
                          >
                            {tech.name} - {tech.phone} (✓ Sẵn sàng)
                          </option>
                        );
                      })}
                  </select>
                  
                  {/* Show unavailable technicians info */}
                  {technicians.filter(t => t.workingStatus !== 'AVAILABLE').length > 0 && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-800 font-medium mb-1">
                        ⚠️ Kỹ thuật viên không khả dụng:
                      </p>
                      <div className="text-xs text-yellow-700">
                        {technicians
                          .filter(t => t.workingStatus !== 'AVAILABLE')
                          .map(tech => {
                            const statusText = {
                              'ON_WORKING': '🔧 Đang làm việc',
                              'ON_BREAK': '☕ Nghỉ giải lao',
                              'OFF_DUTY': '🏠 Hết ca'
                            }[tech.workingStatus] || '❓ Không rõ';
                            return (
                              <div key={tech.employeeId}>
                                • {tech.name} - {statusText}
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                  
                  {/* Working Status Legend */}
                  <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Lưu ý:</p>
                    <p className="text-xs text-gray-600">
                      Chỉ hiển thị kỹ thuật viên đang sẵn sàng. Kỹ thuật viên đang làm việc, nghỉ giải lao hoặc hết ca sẽ không hiển thị trong danh sách.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Any special instructions or notes..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormData({
                      customerName: "",
                      customerEmail: "",
                      customerPhone: "",
                      vehicleMake: "",
                      vehicleModel: "",
                      vehiclePlate: "",
                      service: "",
                      date: "",
                      time: "",
                      duration: "60",
                      technician: "",
                      notes: "",
                      price: "",
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  <FiCheck className="mr-1" />
                  Create Appointment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  Chi tiết đặt lịch
                </h3>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedBooking(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="text-xl" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Booking Status */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Trạng thái
                  </h4>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      selectedBooking.status
                    )}`}
                  >
                    {selectedBooking.status.toUpperCase().replace("-", " ")}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiUser className="mr-2" />
                  Thông tin khách hàng
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Họ tên</p>
                    <p className="text-base font-medium text-gray-900">
                      {selectedBooking.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="text-base font-medium text-gray-900">
                      {selectedBooking.customerPhone}
                    </p>
                  </div>
                  {selectedBooking.customerEmail && (
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-base font-medium text-gray-900">
                        {selectedBooking.customerEmail}
                      </p>
                    </div>
                  )}
                  {selectedBooking.customerAddress && (
                    <div className={selectedBooking.customerEmail ? "md:col-span-2" : ""}>
                      <p className="text-sm text-gray-600">Địa chỉ</p>
                      <p className="text-base font-medium text-gray-900">
                        <FiMapPin className="inline mr-1" />
                        {selectedBooking.customerAddress}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vehicle Information */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiTruck className="mr-2" />
                  Thông tin xe
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Hãng xe</p>
                    <p className="text-base font-medium text-gray-900">
                      {selectedBooking.vehicleMake}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dòng xe</p>
                    <p className="text-base font-medium text-gray-900">
                      {selectedBooking.vehicleModel}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Biển số</p>
                    <p className="text-base font-medium text-gray-900">
                      {selectedBooking.vehiclePlate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FiCalendar className="mr-2" />
                  Thông tin đặt lịch
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Ngày hẹn</p>
                    <p className="text-base font-medium text-gray-900">
                      <FiCalendar className="inline mr-1" />
                      {selectedBooking.date}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Giờ hẹn</p>
                    <p className="text-base font-medium text-gray-900">
                      <FiClock className="inline mr-1" />
                      {selectedBooking.time}
                    </p>
                  </div>
                </div>
                {(selectedBooking.notes || selectedBooking.problemDescription) && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 font-medium">Ghi chú & Mô tả vấn đề</p>
                    <div className="text-base text-gray-900 mt-2 space-y-2">
                      {selectedBooking.problemDescription && (
                        <div className="p-3 bg-amber-50 rounded border border-amber-200">
                          <p className="text-xs text-amber-700 font-medium mb-1">Vấn đề:</p>
                          <p className="text-sm">{selectedBooking.problemDescription}</p>
                        </div>
                      )}
                      {selectedBooking.notes && (
                        <div className="p-3 bg-blue-50 rounded border border-blue-200">
                          <p className="text-xs text-blue-700 font-medium mb-1">Ghi chú:</p>
                          <p className="text-sm">{selectedBooking.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedBooking(null);
                  }}
                >
                  Đóng
                </Button>
                {selectedBooking.status === "scheduled" && (
                  <>
                    <Button
                      variant="primary"
                      onClick={() => {
                        handleStatusChange(selectedBooking.id, "in-progress");
                        setShowDetailModal(false);
                      }}
                    >
                      <FiClock className="mr-1" />
                      Bắt đầu dịch vụ
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleDeleteAppointment(selectedBooking.id);
                        setShowDetailModal(false);
                      }}
                      className="text-red-600 border-red-600 hover:bg-red-50"
                    >
                      <FiX className="mr-1" />
                      Hủy lịch
                    </Button>
                  </>
                )}
                {selectedBooking.status === "in-progress" && (
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleStatusChange(selectedBooking.id, "completed");
                      setShowDetailModal(false);
                    }}
                  >
                    <FiCheckCircle className="mr-1" />
                    Hoàn thành
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}





    </div>
  );
};

export default StaffAppointments;
