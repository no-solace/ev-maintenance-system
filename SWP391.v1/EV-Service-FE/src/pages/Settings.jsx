import React, { useState } from 'react';
import { 
  FiBell, FiLock, FiGlobe, FiMoon, FiSun, FiMail, 
  FiSmartphone, FiShield, FiEye, FiEyeOff, FiCheck,
  FiAlertCircle, FiCreditCard, FiTrash2
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('vi');
  
  // thong bao
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    marketing: false,
    updates: true,
    reminders: true,
    promotions: false
  });

  // bao mat
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // phuong thuc thanh toan
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'visa', last4: '4242', isDefault: true },
    { id: 2, type: 'mastercard', last4: '8888', isDefault: false },
    { id: 3, type: 'naspa', last4: '1234', isDefault: false }
  ]);

  const tabs = [
    { key: 'general', label: 'Chung', icon: FiGlobe },
    { key: 'notifications', label: 'Thông báo', icon: FiBell },
    { key: 'security', label: 'Bảo mật', icon: FiLock },
    { key: 'payment', label: 'Thanh toán', icon: FiCreditCard },
    { key: 'privacy', label: 'Riêng tư', icon: FiShield }
  ];

  // option thay doi giao dien
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // ap dung cho toan bo ung dung
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast.success(`Đã chuyển sang chế độ ${newTheme === 'dark' ? 'tối' : 'sáng'}`);
  };

  // doi mat khau
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    // goi API de doi mat khau neu thanh cong
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Đổi mật khẩu thành công!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // xoa paymanet
  const handleDeletePaymentMethod = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa phương thức thanh toán này?')) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
      toast.success('Đã xóa phương thức thanh toán');
    }
  };

  // xem noi dung tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Giao diện</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => handleThemeChange('light')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    theme === 'light' 
                      ? 'border-teal-500 bg-teal-50 text-teal-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <FiSun className="text-xl" />
                  <span>Sáng</span>
                  {theme === 'light' && <FiCheck className="ml-2" />}
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    theme === 'dark' 
                      ? 'border-teal-500 bg-teal-50 text-teal-700' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <FiMoon className="text-xl" />
                  <span>Tối</span>
                  {theme === 'dark' && <FiCheck className="ml-2" />}
                </button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Ngôn ngữ</h3>
              <select 
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  toast.success('Đã thay đổi ngôn ngữ');
                }}
              >
                <option value="vi">Tiếng Việt</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Múi giờ</h3>
              <select className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
                <option value="Asia/Ho_Chi_Minh">GMT+7 (Hồ Chí Minh)</option>
                <option value="Asia/Bangkok">GMT+7 (Bangkok)</option>
                <option value="Asia/Singapore">GMT+8 (Singapore)</option>
              </select>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Định dạng ngày</h3>
              <select className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500">
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Cài đặt thông báo</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiMail className="text-xl text-gray-600" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.email}
                    onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiSmartphone className="text-xl text-gray-600" />
                  <div>
                    <p className="font-medium">SMS</p>
                    <p className="text-sm text-gray-500">Nhận thông báo qua tin nhắn</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.sms}
                    onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiBell className="text-xl text-gray-600" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-gray-500">Thông báo trên ứng dụng</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications.push}
                    onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Loại thông báo</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm">Cập nhật dịch vụ</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    checked={notifications.updates}
                    onChange={(e) => setNotifications({...notifications, updates: e.target.checked})}
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Nhắc nhở lịch hẹn</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    checked={notifications.reminders}
                    onChange={(e) => setNotifications({...notifications, reminders: e.target.checked})}
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Khuyến mãi và ưu đãi</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    checked={notifications.promotions}
                    onChange={(e) => setNotifications({...notifications, promotions: e.target.checked})}
                  />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Tin tức và cập nhật</span>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    checked={notifications.marketing}
                    onChange={(e) => setNotifications({...notifications, marketing: e.target.checked})}
                  />
                </label>
              </div>
            </div>

            <Button 
              variant="primary"
              onClick={() => toast.success('Đã lưu cài đặt thông báo')}
            >
              Lưu cài đặt
            </Button>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Đổi mật khẩu</h3>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-10"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    required
                  />
                </div>

                <Button type="submit" variant="primary">
                  Đổi mật khẩu
                </Button>
              </form>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Xác thực 2 bước</h3>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Bảo mật tài khoản với xác thực 2 bước</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Thêm một lớp bảo mật cho tài khoản của bạn
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={twoFactorEnabled}
                      onChange={(e) => {
                        setTwoFactorEnabled(e.target.checked);
                        toast.success(e.target.checked ? 'Đã bật xác thực 2 bước' : 'Đã tắt xác thực 2 bước');
                      }}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Phiên đăng nhập</h3>
              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Chrome - Windows</p>
                      <p className="text-sm text-gray-500">192.168.1.1 • Hồ Chí Minh</p>
                      <p className="text-xs text-green-600 mt-1">Phiên hiện tại</p>
                    </div>
                    <span className="text-xs text-gray-400">5 phút trước</span>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Safari - iPhone</p>
                      <p className="text-sm text-gray-500">192.168.1.2 • Hồ Chí Minh</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-red-600">
                      Đăng xuất
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Phương thức thanh toán</h3>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FiCreditCard className="text-2xl text-gray-600" />
                      <div>
                        <p className="font-medium">
                          {method.type === 'visa' ? 'Visa' : 'Mastercard'} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <span className="text-xs text-green-600">Mặc định</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!method.isDefault && (
                        <Button size="sm" variant="outline">
                          Đặt mặc định
                        </Button>
                      )}
                      <button
                        onClick={() => handleDeletePaymentMethod(method.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" icon={<FiCreditCard />}>
              Thêm phương thức thanh toán
            </Button>
            <div>
              <h4 className="font-medium mb-3">Lịch sử thanh toán</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Ngày</th>
                      <th className="px-4 py-2 text-left">Mô tả</th>
                      <th className="px-4 py-2 text-right">Số tiền</th>
                      <th className="px-4 py-2 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-2">15/02/2024</td>
                      <td className="px-4 py-2">Bảo dưỡng định kỳ</td>
                      <td className="px-4 py-2 text-right">1,500,000₫</td>
                      <td className="px-4 py-2 text-center">
                        <span className="text-green-600">Thành công</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2">10/02/2024</td>
                      <td className="px-4 py-2">Sạc xe điện</td>
                      <td className="px-4 py-2 text-right">250,000₫</td>
                      <td className="px-4 py-2 text-center">
                        <span className="text-green-600">Thành công</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Cài đặt riêng tư</h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Lưu ý về quyền riêng tư</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Thông tin của bạn được bảo mật và chỉ được sử dụng cho mục đích cung cấp dịch vụ.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Chia sẻ dữ liệu</h4>
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Cho phép chia sẻ thông tin với đối tác</span>
                    <input type="checkbox" className="w-4 h-4 text-teal-600 rounded" />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Sử dụng dữ liệu để cải thiện dịch vụ</span>
                    <input type="checkbox" className="w-4 h-4 text-teal-600 rounded" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between">
                    <span className="text-sm">Nhận đề xuất dịch vụ phù hợp</span>
                    <input type="checkbox" className="w-4 h-4 text-teal-600 rounded" defaultChecked />
                  </label>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Xuất dữ liệu</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    Tải xuống dữ liệu cá nhân
                  </Button>
                  <p className="text-xs text-gray-500">
                    Tải xuống tất cả dữ liệu cá nhân của bạn dưới dạng file JSON
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="font-medium mb-3 text-red-600">Vùng nguy hiểm</h4>
                <div className="space-y-3">
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h5 className="font-medium text-red-800 mb-1">Vô hiệu hóa tài khoản</h5>
                    <p className="text-sm text-red-700 mb-3">
                      Tạm thời vô hiệu hóa tài khoản của bạn. Bạn có thể kích hoạt lại bất cứ lúc nào.
                    </p>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                      Vô hiệu hóa tài khoản
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h5 className="font-medium text-red-800 mb-1">Xóa tài khoản</h5>
                    <p className="text-sm text-red-700 mb-3">
                      Xóa vĩnh viễn tài khoản và tất cả dữ liệu. Hành động này không thể hoàn tác.
                    </p>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                      Xóa tài khoản
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Cài Đặt
      </h1>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card className="p-0">
            <nav className="space-y-1 p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.key
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="text-lg" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </Card>
        </div>
        <div className="lg:col-span-3">
          <Card>
            <Card.Content>
              {renderTabContent()}
            </Card.Content>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;