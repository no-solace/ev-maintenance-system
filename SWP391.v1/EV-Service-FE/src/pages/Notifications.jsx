import React, { useState, useEffect } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const sampleNotifications = [
  {
    id: 1,
    title: "Lịch bảo dưỡng xe VinFast Evo 200 sắp tới",
    message: "Bạn có lịch bảo dưỡng vào ngày 15/10/2025. Vui lòng chuẩn bị xe.",
    time: "2 giờ trước",
    status: "new",
  },
  {
    id: 2,
    title: "Sạc xe thành công",
    message: "Xe VinFast Evo 200 Lite đã được sạc đầy vào ngày hôm qua.",
    time: "1 ngày trước",
    status: "read",
  },
  {
    id: 3,
    title: "Khuyến mãi 20% cho dịch vụ bảo dưỡng",
    message: "Áp dụng đến hết tháng 10/2025, giảm giá dịch vụ bảo dưỡng cho khách hàng thân thiết.",
    time: "3 ngày trước",
    status: "important",
  },
];

const statusColors = {
  new: "bg-blue-400",
  read: "bg-gray-300",
  important: "bg-red-500",
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(sampleNotifications);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Thông báo của bạn</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-600">Bạn chưa có thông báo mới.</p>
      ) : (
        <div className="space-y-4">
          {notifications.map(({ id, title, message, time, status }) => (
            <Card key={id} className="p-4 shadow-md rounded-lg border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${statusColors[status]}`}></div>
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <span className="ml-auto text-xs text-gray-500 italic">{time}</span>
              </div>
              <p className="mt-2 text-gray-700">{message}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
