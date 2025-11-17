import React from "react";
import { Link } from "react-router-dom";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiZap,
} from "react-icons/fi";

const Footer = () => {
  // năm bay gio
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gradient-to-tr from-[#6BBFD4] via-[#4CAFC4] to-[#027C9D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/*Thông tin công ty */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="/images/Logo.png"
                alt="EV Service Logo"
                className="w-10 h-10 rounded-lg object-contain bg-white/20 backdrop-blur-sm p-1"
              />
              <span className="text-xl font-bold">EV SERVICE</span>
            </div>
            <p className="text-sm text-black/80 leading-relaxed">
              Nắm bắt tương lai, làm chủ xe điện.
              <br />
              Nền tảng chăm sóc xe điện hàng đầu Việt Nam.
            </p>
            {/* Cthogn tin liên hệ */}
            <div className="space-y-2">
              <a
                href="tel:0841234567"
                className="flex items-center text-sm text-black/80 hover:text-white"
              >
                <FiPhone className="mr-2 flex-shrink-0" />
                (84) 123-456-789
              </a>
              <a
                href="mailto:support@evservice.com"
                className="flex items-center text-sm text-black/80 hover:text-white"
              >
                <FiMail className="mr-2 flex-shrink-0" />
                support@evservice.com
              </a>
              <div className="flex items-start text-sm text-black/80">
                <FiMapPin className="mr-2 mt-0.5 flex-shrink-0" />
                123 Tòa Nhà Bitexco , Quận 1, TP.HCM
              </div>
            </div>
          </div>

          {/*Công ty */}
          <div>
            <h3 className="font-semibold mb-4">Công ty</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  to="/partners"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Đối tác & liên kết
                </Link>
              </li>
              <li>
                <Link
                  to="/careers"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Tuyển dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/*Dịch vụ */}
          <div>
            <h3 className="font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/services/charging"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Chăm Sóc Xe Điện
                </Link>
              </li>
              <li>
                <Link
                  to="/services/maintenance"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Bảo dưỡng định kỳ
                </Link>
              </li>
              <li>
                <Link
                  to="/services/repair"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Sửa chữa
                </Link>
              </li>
              <li>
                <Link
                  to="/services/battery"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Kiểm tra pin
                </Link>
              </li>
              <li>
                <Link
                  to="/services/emergency"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Cứu hộ khẩn cấp
                </Link>
              </li>
            </ul>
          </div>

          {/*Hỗ trợ khách hàng */}
          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link
                  to="/guide"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Hướng dẫn sử dụng
                </Link>
              </li>
              <li>
                <Link
                  to="/policy"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Chính sách bảo hành
                </Link>
              </li>
              <li>
                <Link
                  to="/booking"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Đặt lịch hẹn
                </Link>
              </li>
              <li>
                <Link
                  to="/app"
                  className="text-sm text-black/80 hover:text-white transition-colors"
                >
                  Tải ứng dụng
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* */}
        <div className="mt-8 pt-8 border-t border-black/20 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Đăng nhập tài khoản */}
          <div>
            <h3 className="font-semibold mb-2 text-black">
              Đăng nhập tài khoản
            </h3>
            <p className="text-sm text-black/80 mb-4">
              Nhận ngay thông tin về các dịch vụ mới và ưu đãi đặc biệt
            </p>
          </div>

          {/* Truyền thông */}
          <div className="flex items-center justify-end space-x-4 w-full md:w-auto">
            <span className="text-sm text-black/80">Kết nối với chúng tôi</span>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-8 h-8 bg-[#027C9D]/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#027C9D]/50 transition-colors"
              >
                <FiFacebook className="text-black text-sm" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-[#027C9D]/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#027C9D]/50 transition-colors"
              >
                <FiInstagram className="text-black text-sm" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-[#027C9D]/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#027C9D]/50 transition-colors"
              >
                <FiTwitter className="text-black text-sm" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-[#027C9D]/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#027C9D]/50 transition-colors"
              >
                <FiYoutube className="text-black text-sm" />
              </a>
            </div>
          </div>
        </div>

        {/*duong dan*/}
        <div className="border-t border-black/20 pt-6 mt-8">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-6 text-center">
            <p className="text-sm text-black/80">
              © {currentYear} EV Service. Mọi quyền được bảo lưu.
            </p>
            <div className="flex space-x-4">
              <Link
                to="/privacy"
                className="text-sm text-black/80 hover:text-white transition-colors"
              >
                Chính sách bảo mật
              </Link>
              <Link
                to="/terms"
                className="text-sm text-black/80 hover:text-white transition-colors"
              >
                Điều khoản sử dụng
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
