import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiSearch,
  FiChevronRight,
  FiZap,
  FiShield,
  FiTruck,
} from "react-icons/fi";
import Button from "../components/ui/Button";
import ImageSlider from "../components/imgLangding/imageSlider";
import ImageSlider_1 from "../components/imgLangding/imageSlider_1";
import useAuthStore from "../store/authStore";
const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  // tim kiem dich vu
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      //nhay sang trang tim kiem neu co du lieu
      navigate(`/services?search=${encodeURIComponent(searchTerm)}`);
    }
  };
  // thông tin cong ty
  const contactInfo = {
    phones: ["(084) 123-456-789", "(084) 987-654-321"],
    address: "123 Tòa Nhà Bitexco , Quận 1, TP.HCM",
    email: "support@evservice.com",
    hours: "T2-T7: 09:00-20:00, CN: 09:00-18:00",
  };
  // logo,menu
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/images/Logo.png"
                  alt="EV Service Logo"
                  className="h-12 w-auto"
                />
                <span className="text-xl font-bold text-gray-900">
                  EV Service
                </span>
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-16">
              <Link
                to="/services"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Giới thiệu
              </Link>
              <Link
                to={isAuthenticated ? "/app/services" : "/login"}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Đặt lịch
              </Link>
              <Link
                to={isAuthenticated ? "/app/services" : "/login"}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Dịch vụ
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Liên hệ
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/app/dashboard')}
                  className="bg-[#027C9D] text-white px-4 py-2 rounded-lg hover:bg-[#02617A] transition-colors font-semibold"
                >
                  Trang chủ
                </button>
              ) : (
                <button
                  onClick={() => {
                    console.log('Navigating to login...');
                    navigate('/login');
                  }}
                  className="bg-[#027C9D] text-white px-4 py-2 rounded-lg hover:bg-[#02617A] transition-colors font-semibold"
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <section className="bg-gradient-to-tr from-[#B8ECFF] via-[#80D3EF] to-[#027C9D]">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center bg-black/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <span className="text-sm font-medium text-white animate-pulse">
                  CHÀO MỪNG BẠN ĐẾN VỚI EV SERVICE
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Nắm Bắt Tương lai,
                <br />
                Làm Chủ Xe Máy Điện
              </h1>
              <p className="text-lg mb-8 text-black leading-relaxed">
                Dịch Vụ Chăm Sóc Xe Điện Toàn Diện - Bảo Dưỡng, Thay Thế Sửa
                Chữa Với Đội Ngũ Kỹ Thuật Viên Chuyên Nghiệp
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-8">
                <span className="inline-flex items-center text-sm bg-[#1F3F5E]/60 backdrop-blur-sm px-3 py-1 rounded-full text-white">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Hệ Thống Hoạt Động 24/7
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate(isAuthenticated ? "/app/services" : "/login")}
                  className="bg-[#027C9D] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#02617A] transition-all transform hover:scale-105 shadow-lg animate-pulse"
                >
                  Đặt Lịch Ngay →
                </button>

                <button
                  onClick={() => navigate("/services")}
                  className="bg-white/20 backdrop-blur-sm text-black px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition-all border border-white/50"
                >
                  Khám Phá Dịch Vụ
                </button>
              </div>
            </div>

            <div className="relative">
              <ImageSlider />
            </div>
          </div>
          <div className="mt-12 max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <div className="bg-white rounded-full shadow-xl p-2 flex items-center animate-pulse">
                <div className="flex-1 flex items-center px-4">
                  <FiSearch className="text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm thông tin dịch vụ"
                    className="flex-1 py-3 text-gray-700 placeholder-gray-400 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#02617A] text-white px-6 py-3 rounded-full hover:bg-[#027C9D] transition-colors font-medium"
                >
                  Tìm kiếm
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* ảnh khung thứ hai */}

      <section className="relative">
        {/* Gọi component slider để hiển thị ảnh nền auto chạy */}
        <ImageSlider_1 />

        {/* Nội dung đặt lên trên */}
        <div className="absolute top-[80px] right-[30px] w-2/3 pr-6 bg-black/40 rounded-xl p-8 shadow-2xl">
          <h1
            className="text-5xl mb-6 leading-snug text-orange-500"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Tại sao bạn nên chọn chúng tôi?
          </h1>

          {/* Đoạn giới thiệu */}
          <p className="text-lg md:text-xl leading-relaxed mb-4 text-gray-100 font-sans">
            <span className="font-bold text-2xl text-white">EV Service</span>{" "}
            khẳng định vị thế tiên phong trong lĩnh vực chăm sóc và nâng cấp xe
            điện tại Việt Nam. Với hệ thống trung tâm quy mô lớn, công nghệ hiện
            đại và đội ngũ kỹ thuật viên chuẩn quốc tế, chúng tôi luôn mang đến
            trải nghiệm tốt nhất.
          </p>

          <p className="text-2xl font-semibold mb-4 text-black">
            Hơn 10.000+ khách hàng & đối tác tin tưởng
          </p>

          {/* Đoạn kết */}
          <p className="text-lg md:text-xl leading-relaxed text-gray-200 font-sans">
            <span className="font-bold text-2xl text-white">EV Service</span>{" "}
            không chỉ định hình tiêu chuẩn mới mà còn kiến tạo giá trị bền vững
            cho cộng đồng đam mê xe điện.
          </p>
        </div>

        {/* Góc phải dưới */}
        <div className="absolute bottom-[15px] right-[10px] flex flex-col items-end text-right">
          <h1 className="text-2xl md:text-3xl font-bold leading-tight font-sans">
            <span className="block text-yellow-500 pr-[50px]">
              Electric Vehicle Service
            </span>

            <span className="block font-extrabold text-blue-200 drop-shadow-lg">
              Nhận Chăm Sóc & Sửa chữa xe
            </span>
          </h1>
        </div>
        <button className="absolute bottom-5 left-5 bg-[#027C9D] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#02617A] transition-all transform hover:scale-105 shadow-lg animate-pulse">
          <span className="text-base ">Hotline </span>
          <span className="text-2xl font-bold">1900 3979</span>
        </button>
      </section>
      {/* Section Dịch vụ nổi bật */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dịch Vụ Nổi Bật
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chúng Tôi Cung Cấp Giải Pháp Toàn Diện Cho Xe Máy Điện Của Bạn
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-100">
              <div className="w-14 h-14 bg-[#D1F3F9] rounded-lg flex items-center justify-center mb-4">
                <FiZap className="text-[#027C9D] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chăm Sóc</h3>
              <p className="text-gray-600 mb-4">
                Hệ Thống Bảo Dưỡng Năng Suất, Chỉ 30 Phút Cho Kiểm Tra Toàn Diện
              </p>
              <Link
                to="/services"
                className="text-[#02617A] font-medium hover:text-[#5DB9D4] inline-flex items-center "
              >
                Tìm hiểu thêm <FiChevronRight className="ml-1" />
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-100">
              <div className="w-14 h-14 bg-[#D1F3F9] rounded-lg flex items-center justify-center mb-4">
                <FiShield className="text-[#027C9D] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bảo Dưỡng Định Kỳ</h3>
              <p className="text-gray-600 mb-4">
                Kiểm Tra Và Bảo Dưỡng Toàn Diện Theo Tiêu Chuẩn Hãng
              </p>
              <Link
                to="/services"
                className="text-[#02617A] font-medium hover:text-[#5DB9D4] inline-flex items-center"
              >
                Tìm hiểu thêm <FiChevronRight className="ml-1" />
              </Link>
            </div>
            <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-100">
              <div className="w-14 h-14 bg-[#D1F3F9] rounded-lg flex items-center justify-center mb-4">
                <FiTruck className="text-[#027C9D] text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cứu hộ 24/7</h3>
              <p className="text-gray-600 mb-4">
                Dịch Vụ Đặt Lịch Trực Tuyến, Đặt Lịch Mọi Lúc Mọi Nơi
              </p>
              <Link
                to="/services"
                className="text-[#02617A] font-medium hover:text-[#5DB9D4] inline-flex items-center"
              >
                Tìm hiểu thêm <FiChevronRight className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Section Gói dịch vụ*/}
      <section
        className="py-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/gioi-thieu.png')" }}
      >
        <div className="bg-black/40 py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg">
                Gói Dịch Vụ EV Service
              </h2>
              <p className="text-lg text-gray-200">
                Chọn gói phù hợp nhất để chăm sóc & bảo dưỡng xe điện của bạn
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Gói Cơ Bản */}
              <div className="bg-white/90 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all p-8 flex flex-col">
                <img
                  src="/images/goi-co-ban.png"
                  alt="Gói cơ bản"
                  className="w-20 h-20 mx-auto mb-6"
                />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                  Gói Cơ Bản
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Dành cho bảo dưỡng nhanh & kiểm tra cơ bản
                </p>
                <ul className="text-gray-700 space-y-2 flex-1">
                  <li>✔ Kiểm tra pin & động cơ</li>
                  <li>✔ Bảo dưỡng định kỳ</li>
                  <li>✔ Tư vấn kỹ thuật</li>
                </ul>
                <button className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
                onClick={() => navigate(isAuthenticated ? "/app/services" : "/login")}>
                  Chọn gói này
                </button>
              </div>

              {/* Gói Tiêu Chuẩn */}
              <div className="bg-white/90 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all p-8 flex flex-col border-2 border-blue-600">
                <img
                  src="/images/goi-tieu-chuan.png"
                  alt="Gói tiêu chuẩn"
                  className="w-20 h-20 mx-auto mb-6"
                />
                <h3 className="text-2xl font-semibold text-blue-600 mb-2 text-center">
                  Gói Tiêu Chuẩn
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Cân bằng giữa chi phí & trải nghiệm dịch vụ
                </p>
                <ul className="text-gray-700 space-y-2 flex-1">
                  <li>✔ Toàn bộ dịch vụ gói cơ bản</li>
                  <li>✔ Vệ sinh & bảo dưỡng chi tiết</li>
                  <li>✔ Hỗ trợ cứu hộ trong thành phố</li>
                </ul>
                <button
                  className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
                  onClick={() => navigate(isAuthenticated ? "/app/services" : "/login")}
                >
                  Chọn gói này
                </button>
              </div>

              {/* Gói Toàn Diện */}
              <div className="bg-white/90 rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all p-8 flex flex-col">
                <img
                  src="/images/goi-toan-dien.png"
                  alt="Gói toàn diện"
                  className="w-20 h-20 mx-auto mb-6"
                />
                <h3 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                  Gói Toàn Diện
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Trọn gói cao cấp, dịch vụ ưu tiên 24/7
                </p>
                <ul className="text-gray-700 space-y-2 flex-1">
                  <li>✔ Toàn bộ dịch vụ gói tiêu chuẩn</li>
                  <li>✔ Cứu hộ toàn quốc 24/7</li>
                  <li>✔ Bảo hành mở rộng</li>
                  <li>✔ Hỗ trợ kỹ thuật VIP</li>
                </ul>
                <button className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
                onClick={() => navigate(isAuthenticated ? "/app/services" : "/login")}>
                  Chọn gói này
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Phần lợi ích */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">
            Bảo dưỡng định kỳ - Giữ xe luôn an toàn & bền bỉ
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-16">
            Một chiếc xe điện được chăm sóc đúng cách không chỉ mang lại cảm
            giác lái mượt mà mà còn giúp bạn tiết kiệm đáng kể chi phí về lâu
            dài.
          </p>

          <div className="grid md:grid-cols-3 gap-12 text-left">
            {/* Lợi ích 1 */}
            <div className="flex items-start space-x-4">
              <div className="text-orange-500 text-4xl">⚡</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  An toàn tuyệt đối
                </h3>
                <p className="text-gray-600">
                  Kiểm tra định kỳ giúp hệ thống phanh, lốp và điện luôn ổn
                  định, bảo vệ bạn trên mọi hành trình.
                </p>
              </div>
            </div>

            {/* Lợi ích 2 */}
            <div className="flex items-start space-x-4">
              <div className="text-orange-500 text-4xl">💰</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Tiết kiệm lâu dài
                </h3>
                <p className="text-gray-600">
                  Phát hiện và xử lý sớm sự cố nhỏ để tránh chi phí sửa chữa lớn
                  sau này.
                </p>
              </div>
            </div>

            {/* Lợi ích 3 */}
            <div className="flex items-start space-x-4">
              <div className="text-orange-500 text-4xl">🚀</div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Hiệu suất bền bỉ</h3>
                <p className="text-gray-600">
                  Giữ động cơ và pin ở trạng thái tối ưu, giúp xe vận hành mạnh
                  mẽ và mượt mà hơn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#A0E0ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#D1F3F9] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPhone className="text-[#027C9D] text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                ĐƯỜNG DÂY NÓNG
              </h3>
              <p className="text-sm text-gray-600">{contactInfo.phones[0]}</p>
              <p className="text-sm text-gray-600">{contactInfo.phones[1]}</p>
            </div>
            <div className="bg-[#027C9D] text-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMapPin className="text-white text-xl" />
              </div>
              <h3 className="font-semibold mb-2">ĐỊA CHỈ</h3>
              <p className="text-sm opacity-90">{contactInfo.address}</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#D1F3F9] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="text-[#027C9D] text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">EMAIL</h3>
              <p className="text-sm text-gray-600">{contactInfo.email}</p>
              <p className="text-sm text-gray-600">info@evservice.com</p>
            </div>
            <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#D1F3F9] rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="text-[#027C9D] text-xl" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">GIỜ LÀM VIỆC</h3>
              <p className="text-sm text-gray-600">T2-T7: 7:00 - 17:00</p>
              <p className="text-sm text-gray-600">Chủ Nhật: 09:00 - 18:00</p>
            </div>
          </div>
        </div>
      </section>

      {/* Đánh giá từ khách hàng */}
      <section class="bg-white py-12 px-6">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-gray-800 mb-6">
            Đánh giá từ khách hàng
          </h2>

          <div class="space-y-8">
            <div class="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex justify-center mb-2 text-yellow-400 text-xl">
                ★★★★☆
              </div>
              <p class="text-gray-700 italic">
                “ Nhân viên tư vấn rõ ràng, dịch vụ ổn định. Tôi sẽ quay lại bảo
                dưỡng vào lần tiếp theo. Cảm ơn các bạn vì đã cho tôi trải
                nghiệm tốt. ”
              </p>
              <p class="mt-4 text-sm text-gray-500">
                --- Nguyễn Văn Minh, TP.HCM ---
              </p>
            </div>

            <div class="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex justify-center mb-2 text-yellow-400 text-xl">
                ★★★★★
              </div>

              <p class="text-gray-700 italic">
                “ Dịch vụ bảo dưỡng rất chuyên nghiệp, nhân viên cực kì nhiệt
                tình. Thật an tâm khi sử dụng trọn gói dịch vụ của trung tâm. ”
              </p>
              <p class="mt-4 text-sm text-gray-500">
                --- Trần Kim Yến, Thủ Đức ---
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
