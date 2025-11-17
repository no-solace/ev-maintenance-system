import React, { useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiFileText,
  FiStar,
} from "react-icons/fi";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { formatDate, formatCurrency } from "../utils/format";

const StarRating = ({ rating, setRating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <FiStar
        key={i}
        className={`cursor-pointer ${
          i <= rating ? "text-yellow-400" : "text-gray-300"
        }`}
        onClick={() => setRating(i)}
        size={20}
      />
    );
  }
  return <div className="flex gap-1">{stars}</div>;
};

const MaintenanceHistory = () => {
  const [history, setHistory] = useState([
    {
      id: 1,
      vehicle: "VinFast VF8 - 30A-12345",
      date: "2024-01-20",
      time: "10:00",
      service: "Kiểm tra pin",
      technician: "Lê Văn C",
      cost: 500000,
      status: "completed",
      feedback: "",
      billUrl: "/bills/bill-1.pdf",
    },
    {
      id: 2,
      vehicle: "Tesla Model 3 - 51G-67890",
      date: "2023-12-05",
      time: "14:00",
      service: "Thay dầu phanh",
      technician: "Nguyễn Thị D",
      cost: 350000,
      status: "completed",
      feedback: "Dịch vụ tốt, nhân viên thân thiện",
      billUrl: "/bills/bill-2.pdf",
    },
  ]);

  const [activeReviewId, setActiveReviewId] = useState(null);
  const [tempRating, setTempRating] = useState(0);
  const [tempComment, setTempComment] = useState("");

  const getStatusBadge = (status) => {
    const config = {
      completed: {
        label: "Hoàn thành",
        color: "bg-green-100 text-green-800",
        icon: <FiCheckCircle />,
      },
      cancelled: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800",
        icon: <FiXCircle />,
      },
      pending: {
        label: "Chờ xử lý",
        color: "bg-yellow-100 text-yellow-800",
        icon: null,
      },
    }[status] || {
      label: status,
      color: "bg-gray-100 text-gray-600",
      icon: null,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
      >
        {config.icon}
        {config.label}
      </span>
    );
  };

  const handleSubmitReview = (id) => {
    if (tempRating === 0) {
      alert("Vui lòng chọn số sao đánh giá!");
      return;
    }
    setHistory((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, feedback: tempComment, rating: tempRating }
          : item
      )
    );
    setActiveReviewId(null);
    setTempComment("");
    setTempRating(0);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-3">
        Lịch Sử Bảo Dưỡng
      </h1>

      {history.length === 0 ? (
        <Card className="text-center py-20">
          <p className="text-gray-500 text-lg">
            Bạn chưa có lịch sử bảo dưỡng nào
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {history.map((item) => (
            <Card
              key={item.id}
              className="p-6 rounded-xl shadow-md border border-gray-200"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                <div className="flex flex-wrap gap-8 md:gap-12 font-semibold text-gray-700 max-w-xl">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-teal-600" />
                    <time dateTime={item.date}>{formatDate(item.date)}</time>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-teal-600" />
                    <span>{item.time}</span>
                  </div>
                  <div className="flex items-center gap-2 max-w-xs">
                    <FiUser className="text-teal-600" />
                    <span>{item.technician}</span>
                  </div>
                </div>

                <div className="text-right mt-2 md:mt-0 flex flex-col items-end gap-3">
                  <div className="text-xl font-semibold text-gray-900">
                    {item.service}
                  </div>
                  <div className="text-teal-700 font-semibold">
                    {formatCurrency(item.cost)}
                  </div>
                  {getStatusBadge(item.status)}
                  {item.billUrl && (
                    <a
                      href={item.billUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold text-sm"
                    >
                      <FiFileText className="text-lg" /> Xem hóa đơn
                    </a>
                  )}
                </div>
              </div>
              {item.cancelReason && (
                <p className="text-red-600 mt-3 italic">
                  Lý do hủy: {item.cancelReason}
                </p>
              )}


              {/* Phần đánh giá */}
              
              {item.status === "completed" && (
                <div className="mt-6 border-t pt-4">
                  {activeReviewId === item.id ? (
                    // Form sửa/comment đánh giá, hiển thị khi đang edit hoặc thêm mới
                    <div className="space-y-3">
                      <div>
                        <label className="font-semibold block mb-1">
                          Đánh giá sao:
                        </label>
                        <StarRating
                          rating={tempRating}
                          setRating={setTempRating}
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">
                          Bình luận:
                        </label>
                        <textarea
                          rows="3"
                          className="w-full border border-gray-300 rounded px-3 py-2 resize-none"
                          value={tempComment}
                          onChange={(e) => setTempComment(e.target.value)}
                          placeholder="Viết nhận xét của bạn..."
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="primary"
                          onClick={() => handleSubmitReview(item.id)}
                        >
                          Gửi đánh giá
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setActiveReviewId(null);
                            setTempRating(item.rating || 0);
                            setTempComment(item.feedback || "");
                          }}
                        >
                          Hủy
                        </Button>
                      </div>
                    </div>
                  ) : item.feedback ? (
                    // Hiển thị đánh giá đã có và nút sửa
                    <>
                      <p className="text-gray-600">Đánh giá:</p>
                      <p className="italic text-gray-800 mt-1">
                        &quot;{item.feedback}&quot;
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          setActiveReviewId(item.id);
                          setTempRating(item.rating || 0);
                          setTempComment(item.feedback || "");
                        }}
                      >
                        Sửa
                      </Button>
                    </>
                  ) : (
                    // Nút thêm đánh giá nếu chưa có
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setActiveReviewId(item.id);
                        setTempRating(0);
                        setTempComment("");
                      }}
                    >
                      Đánh giá dịch vụ
                    </Button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceHistory;
