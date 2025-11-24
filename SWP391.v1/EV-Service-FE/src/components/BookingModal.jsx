import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiCalendar, FiClock, FiUser, FiPhone, FiMail, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Input from './ui/Input';
import Button from './ui/Button';
//form booking
const BookingModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm();
  //xem dịch vụ đã chọn
  const selectedService = watch('service');

  // danh sách dịch vụ
  const services = [
    { id: 'charging', name: 'Sạc xe điện' },
    { id: 'check', name: 'Kiểm tra xe điện' },
    { id: 'maintenance', name: 'Bảo dưỡng định kỳ' },
    { id: 'repair', name: 'Sửa chữa' },
    { id: 'battery', name: 'Kiểm tra pin' },
    { id: 'emergency', name: 'Cứu hộ khẩn cấp' }
  ];

  // danh sách xe 
  const vehicles = [
    'Theon S',
    'Vento S', 
    'Klara S',
    'Feliz S',
    'Evo 200',
    'Evo 200 Lite',
    'Evo Grand',
    'Evo Grand Lite',
    'Motio',
    'DrgnFly',
    'Khác'
  ];

  // xử lý submit form
  const onSubmit = async (data) => {
    try {
      console.log('Booking data:', data);
      await new Promise(resolve => setTimeout(resolve, 1500));      
      toast.success('Đặt lịch thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.');
      reset();
      onClose();
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  if (!isOpen) return null;
  // giao dien modal
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl transform transition-all">
          <div className="bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-600 text-white rounded-t-2xl px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Đặt lịch dịch vụ</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-white/80 mt-1">
              Điền thông tin bên dưới để đặt lịch hẹn. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin khách hàng</h3>
                
                <Input
                  label="Họ và tên"
                  icon={<FiUser />}
                  placeholder="Nguyễn Văn A"
                  error={errors.name?.message}
                  {...register('name', {
                    required: 'Vui lòng nhập họ tên'
                  })}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính
                    </label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      {...register('gender')}
                    >
                      <option value="">Chọn</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  
                  <Input
                    label="Số điện thoại"
                    type="tel"
                    placeholder="0912 345 678"
                    error={errors.phone?.message}
                    {...register('phone', {
                      required: 'Vui lòng nhập số điện thoại',
                      pattern: {
                        value: /^[0-9]{10,11}$/,
                        message: 'Số điện thoại không hợp lệ'
                      }
                    })}
                  />
                </div>

                <Input
                  label="Email"
                  type="email"
                  icon={<FiMail />}
                  placeholder="email@example.com"
                  error={errors.email?.message}
                  {...register('email', {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ'
                    }
                  })}
                />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 mb-3">Thông tin dịch vụ</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại xe <span className="text-red-500">*</span>
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    {...register('vehicle', {
                      required: 'Vui lòng chọn loại xe'
                    })}
                  >
                    <option value="">Chọn loại xe</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle} value={vehicle}>
                        {vehicle}
                      </option>
                    ))}
                  </select>
                  {errors.vehicle && (
                    <p className="text-xs text-red-500 mt-1">{errors.vehicle.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày hẹn <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        min={new Date().toISOString().split('T')[0]}
                        {...register('date', {
                          required: 'Vui lòng chọn ngày'
                        })}
                      />
                      <FiCalendar className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.date && (
                      <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giờ hẹn <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="time"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        {...register('time', {
                          required: 'Vui lòng chọn giờ'
                        })}
                      />
                      <FiClock className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                    {errors.time && (
                      <p className="text-xs text-red-500 mt-1">{errors.time.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chọn dịch vụ <span className="text-red-500">*</span>
                  </label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    {...register('service', {
                      required: 'Vui lòng chọn dịch vụ'
                    })}
                  >
                    <option value="">Chọn dịch vụ</option>
                    {services.map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                  {errors.service && (
                    <p className="text-xs text-red-500 mt-1">{errors.service.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ghi chú thêm (tùy chọn)
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Mô tả thêm về tình trạng xe hoặc yêu cầu đặc biệt..."
                {...register('notes')}
              />
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-teal-600 hover:bg-teal-700 text-white px-6"
              >
                <FiCalendar className="mr-2" />
                Xác nhận đặt lịch
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;