import React, { useState } from 'react';
import { 
  FiSettings, FiSave, FiGlobe, FiMail, FiPhone, FiMapPin,
  FiClock, FiDollarSign, FiBell, FiShield, FiDatabase,
  FiToggleLeft, FiToggleRight, FiEdit2, FiCheck, FiX
} from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isEditing, setIsEditing] = useState(false);
  
  // cai dat chung
  const [generalSettings, setGeneralSettings] = useState({
    companyName: 'EV Service Center',
    email: 'contact@evservice.com',
    phone: '1900-1234',
    address: '123 Nguyễn Văn Linh, Quận 7, TP.HCM',
    website: 'www.evservice.com',
    taxId: '0123456789'
  });

  // gio hoat dong cua cong ty
  const [businessHours, setBusinessHours] = useState({
    monday: { open: '08:00', close: '18:00', closed: false },
    tuesday: { open: '08:00', close: '18:00', closed: false },
    wednesday: { open: '08:00', close: '18:00', closed: false },
    thursday: { open: '08:00', close: '18:00', closed: false },
    friday: { open: '08:00', close: '18:00', closed: false },
    saturday: { open: '08:00', close: '12:00', closed: false },
    sunday: { open: '08:00', close: '12:00', closed: true }
  });

  // cai dat dich vu
  const [serviceSettings, setServiceSettings] = useState({
    defaultServiceDuration: 60,
    bufferTime: 15,
    maxAdvanceBooking: 30,
    minAdvanceBooking: 2,
    cancellationPeriod: 24,
    depositRequired: true,
    depositPercentage: 30
  });

  // thong bao
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    bookingConfirmation: true,
    bookingReminder: true,
    reminderHoursBefore: 24,
    promotionalEmails: false,
    systemAlerts: true
  });

  // cai dat thanh toan
  const [paymentSettings, setPaymentSettings] = useState({
    acceptCash: true,
    acceptCard: true,
    acceptBankTransfer: true,
    acceptEWallet: true,
    vatRate: 10,
    currency: 'VND',
    autoInvoice: true
  });

  // cai dat he thong
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    backupFrequency: 'daily',
    dataRetention: 365,
    sessionTimeout: 30,
    maxLoginAttempts: 5
  });

  const tabs = [
    { key: 'general', label: 'Thông tin chung', icon: FiGlobe },
    { key: 'business', label: 'Giờ làm việc', icon: FiClock },
    { key: 'service', label: 'Dịch vụ', icon: FiSettings },
    { key: 'notification', label: 'Thông báo', icon: FiBell },
    { key: 'payment', label: 'Thanh toán', icon: FiDollarSign },
    { key: 'system', label: 'Hệ thống', icon: FiDatabase }
  ];

  const daysOfWeek = [
    { key: 'monday', label: 'Thứ 2' },
    { key: 'tuesday', label: 'Thứ 3' },
    { key: 'wednesday', label: 'Thứ 4' },
    { key: 'thursday', label: 'Thứ 5' },
    { key: 'friday', label: 'Thứ 6' },
    { key: 'saturday', label: 'Thứ 7' },
    { key: 'sunday', label: 'Chủ nhật' }
  ];
//luu cai dat moi cho backend
  const handleSaveSettings = () => {
    toast.success('Cài đặt đã được lưu thành công!');
    setIsEditing(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin công ty</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên công ty
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={generalSettings.companyName}
                  onChange={(e) => setGeneralSettings({...generalSettings, companyName: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={generalSettings.email}
                  onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={generalSettings.phone}
                  onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={generalSettings.website}
                  onChange={(e) => setGeneralSettings({...generalSettings, website: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã số thuế
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={generalSettings.taxId}
                  onChange={(e) => setGeneralSettings({...generalSettings, taxId: e.target.value})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Giờ làm việc</h3>
            
            <div className="space-y-4">
              {daysOfWeek.map((day) => (
                <div key={day.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-green-600 rounded"
                      checked={!businessHours[day.key].closed}
                      onChange={(e) => setBusinessHours({
                        ...businessHours,
                        [day.key]: { ...businessHours[day.key], closed: !e.target.checked }
                      })}
                      disabled={!isEditing}
                    />
                    <span className="font-medium text-gray-700 w-24">{day.label}</span>
                  </div>
                  
                  {!businessHours[day.key].closed && (
                    <div className="flex items-center gap-3">
                      <input
                        type="time"
                        className="px-3 py-1 border border-gray-300 rounded"
                        value={businessHours[day.key].open}
                        onChange={(e) => setBusinessHours({
                          ...businessHours,
                          [day.key]: { ...businessHours[day.key], open: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                      <span className="text-gray-500">đến</span>
                      <input
                        type="time"
                        className="px-3 py-1 border border-gray-300 rounded"
                        value={businessHours[day.key].close}
                        onChange={(e) => setBusinessHours({
                          ...businessHours,
                          [day.key]: { ...businessHours[day.key], close: e.target.value }
                        })}
                        disabled={!isEditing}
                      />
                    </div>
                  )}
                  
                  {businessHours[day.key].closed && (
                    <span className="text-red-600">Đóng cửa</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'service':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Cài đặt dịch vụ</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian dịch vụ mặc định (phút)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={serviceSettings.defaultServiceDuration}
                  onChange={(e) => setServiceSettings({...serviceSettings, defaultServiceDuration: parseInt(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian đệm giữa các lịch (phút)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={serviceSettings.bufferTime}
                  onChange={(e) => setServiceSettings({...serviceSettings, bufferTime: parseInt(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đặt lịch tối đa trước (ngày)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={serviceSettings.maxAdvanceBooking}
                  onChange={(e) => setServiceSettings({...serviceSettings, maxAdvanceBooking: parseInt(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đặt lịch tối thiểu trước (giờ)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={serviceSettings.minAdvanceBooking}
                  onChange={(e) => setServiceSettings({...serviceSettings, minAdvanceBooking: parseInt(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian hủy lịch (giờ)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={serviceSettings.cancellationPeriod}
                  onChange={(e) => setServiceSettings({...serviceSettings, cancellationPeriod: parseInt(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yêu cầu đặt cọc
                </label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      checked={serviceSettings.depositRequired}
                      onChange={(e) => setServiceSettings({...serviceSettings, depositRequired: e.target.checked})}
                      disabled={!isEditing}
                    />
                    <span>Bắt buộc</span>
                  </label>
                  {serviceSettings.depositRequired && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        className="w-20 px-2 py-1 border border-gray-300 rounded"
                        value={serviceSettings.depositPercentage}
                        onChange={(e) => setServiceSettings({...serviceSettings, depositPercentage: parseInt(e.target.value)})}
                        disabled={!isEditing}
                      />
                      <span>%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'notification':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Cài đặt thông báo</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Thông báo Email</p>
                  <p className="text-sm text-gray-500">Gửi thông báo qua email</p>
                </div>
                <button
                  onClick={() => setNotificationSettings({...notificationSettings, emailNotifications: !notificationSettings.emailNotifications})}
                  disabled={!isEditing}
                  className={`p-2 ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                >
                  {notificationSettings.emailNotifications ? 
                    <FiToggleRight className="text-3xl text-green-600" /> : 
                    <FiToggleLeft className="text-3xl text-gray-400" />
                  }
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Thông báo SMS</p>
                  <p className="text-sm text-gray-500">Gửi thông báo qua tin nhắn</p>
                </div>
                <button
                  onClick={() => setNotificationSettings({...notificationSettings, smsNotifications: !notificationSettings.smsNotifications})}
                  disabled={!isEditing}
                  className={`p-2 ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                >
                  {notificationSettings.smsNotifications ? 
                    <FiToggleRight className="text-3xl text-green-600" /> : 
                    <FiToggleLeft className="text-3xl text-gray-400" />
                  }
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Xác nhận đặt lịch</p>
                  <p className="text-sm text-gray-500">Gửi xác nhận khi có lịch hẹn mới</p>
                </div>
                <button
                  onClick={() => setNotificationSettings({...notificationSettings, bookingConfirmation: !notificationSettings.bookingConfirmation})}
                  disabled={!isEditing}
                  className={`p-2 ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                >
                  {notificationSettings.bookingConfirmation ? 
                    <FiToggleRight className="text-3xl text-green-600" /> : 
                    <FiToggleLeft className="text-3xl text-gray-400" />
                  }
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Nhắc nhở lịch hẹn</p>
                  <p className="text-sm text-gray-500">Nhắc nhở trước {notificationSettings.reminderHoursBefore} giờ</p>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                    value={notificationSettings.reminderHoursBefore}
                    onChange={(e) => setNotificationSettings({...notificationSettings, reminderHoursBefore: parseInt(e.target.value)})}
                    disabled={!isEditing}
                  />
                  <button
                    onClick={() => setNotificationSettings({...notificationSettings, bookingReminder: !notificationSettings.bookingReminder})}
                    disabled={!isEditing}
                    className={`p-2 ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                  >
                    {notificationSettings.bookingReminder ? 
                      <FiToggleRight className="text-3xl text-green-600" /> : 
                      <FiToggleLeft className="text-3xl text-gray-400" />
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Phương thức thanh toán</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiDollarSign className="text-gray-600" />
                    <span>Tiền mặt (Cash)</span>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 rounded"
                    checked={paymentSettings.acceptCash}
                    onChange={(e) => setPaymentSettings({...paymentSettings, acceptCash: e.target.checked})}
                    disabled={!isEditing}
                  />
                </label>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <label className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiDollarSign className="text-gray-600" />
                    <span>VNPay E-Transfer</span>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 rounded"
                    checked={paymentSettings.acceptVNPay !== false}
                    onChange={(e) => setPaymentSettings({...paymentSettings, acceptVNPay: e.target.checked})}
                    disabled={!isEditing}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thuế VAT (%)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={paymentSettings.vatRate}
                  onChange={(e) => setPaymentSettings({...paymentSettings, vatRate: parseInt(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị tiền tệ
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={paymentSettings.currency}
                  onChange={(e) => setPaymentSettings({...paymentSettings, currency: e.target.value})}
                  disabled={!isEditing}
                >
                  <option value="VND">VND - Việt Nam Đồng</option>
                  <option value="USD">USD - US Dollar</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'system':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Cài đặt hệ thống</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Chế độ bảo trì</p>
                  <p className="text-sm text-gray-500">Tạm dừng hệ thống để bảo trì</p>
                </div>
                <button
                  onClick={() => setSystemSettings({...systemSettings, maintenanceMode: !systemSettings.maintenanceMode})}
                  disabled={!isEditing}
                  className={`p-2 ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                >
                  {systemSettings.maintenanceMode ? 
                    <FiToggleRight className="text-3xl text-red-600" /> : 
                    <FiToggleLeft className="text-3xl text-gray-400" />
                  }
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Tự động sao lưu</p>
                  <p className="text-sm text-gray-500">Sao lưu dữ liệu định kỳ</p>
                </div>
                <button
                  onClick={() => setSystemSettings({...systemSettings, autoBackup: !systemSettings.autoBackup})}
                  disabled={!isEditing}
                  className={`p-2 ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                >
                  {systemSettings.autoBackup ? 
                    <FiToggleRight className="text-3xl text-green-600" /> : 
                    <FiToggleLeft className="text-3xl text-gray-400" />
                  }
                </button>
              </div>

              {systemSettings.autoBackup && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tần suất sao lưu
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    value={systemSettings.backupFrequency}
                    onChange={(e) => setSystemSettings({...systemSettings, backupFrequency: e.target.value})}
                    disabled={!isEditing}
                  >
                    <option value="daily">Hằng ngày</option>
                    <option value="weekly">Hằng tuần</option>
                    <option value="monthly">Hằng tháng</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lưu trữ dữ liệu (ngày)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={systemSettings.dataRetention}
                  onChange={(e) => setSystemSettings({...systemSettings, dataRetention: parseInt(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian hết phiên (phút)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={systemSettings.sessionTimeout}
                  onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: parseInt(e.target.value)})}
                  disabled={!isEditing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới hạn đăng nhập thất bại
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={systemSettings.maxLoginAttempts}
                  onChange={(e) => setSystemSettings({...systemSettings, maxLoginAttempts: parseInt(e.target.value)})}
                  disabled={!isEditing}
                />
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Cấu hình và tùy chỉnh hệ thống</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                icon={<FiX />}
                onClick={() => setIsEditing(false)}
              >
                Hủy
              </Button>
              <Button
                variant="primary"
                icon={<FiSave />}
                onClick={handleSaveSettings}
                className="bg-gradient-to-r from-green-500 to-teal-600"
              >
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              icon={<FiEdit2 />}
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

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
                      ? 'bg-green-50 text-green-700'
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

export default AdminSettings;