import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiEdit2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      birthday: user?.birthday || '',
      gender: user?.gender || 'male'
    }
  });

  // cap nhat thong tin
  const onSubmit = async (data) => {
    try {
      // goi api va cap nhat thong tin nguoi dung
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      updateUser(data);
      toast.success('Cập nhật thông tin thành công!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
    }
  };

  // huy chinh sua neu user huy
  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Thông Tin Cá Nhân
      </h1>

      <Card>
        <Card.Header className="flex items-center justify-between">
          <Card.Title>Hồ Sơ Của Tôi</Card.Title>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              icon={<FiEdit2 />}
            >
              Chỉnh sửa
            </Button>
          )}
        </Card.Header>
       
        <Card.Content>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex items-center space-x-4">
                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-teal-600 text-3xl" />
                  )}
                </div>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    Thay đổi ảnh
                  </Button>
                )}
              </div>
              <Input
                label="Họ và tên"
                icon={<FiUser />}
                disabled={!isEditing}
                error={errors.name?.message}
                {...register('name', {
                  required: 'Vui lòng nhập họ tên'
                })}
              />

              <Input
                label="Email"
                type="email"
                icon={<FiMail />}
                disabled={!isEditing}
                error={errors.email?.message}
                {...register('email', {
                  required: 'Vui lòng nhập email',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ'
                  }
                })}
              />

              <Input
                label="Số điện thoại"
                type="tel"
                icon={<FiPhone />}
                disabled={!isEditing}
                error={errors.phone?.message}
                {...register('phone', {
                  pattern: {
                    value: /^[0-9]{10,11}$/,
                    message: 'Số điện thoại không hợp lệ'
                  }
                })}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính
                </label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 disabled:bg-gray-50"
                  disabled={!isEditing}
                  {...register('gender')}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <Input
                label="Ngày sinh"
                type="date"
                icon={<FiCalendar />}
                disabled={!isEditing}
                {...register('birthday')}
              />

              <Input
                label="Địa chỉ"
                icon={<FiMapPin />}
                disabled={!isEditing}
                {...register('address')}
              />
            </div>
            {isEditing && (
              <div className="mt-6 flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  icon={<FiX />}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={<FiSave />}
                >
                  Lưu thay đổi
                </Button>
              </div>
            )}
          </form>
        </Card.Content>
      </Card>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <Card>
          <Card.Header>
            <Card.Title>Thống kê tài khoản</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày tham gia</span>
                <span className="font-medium">01/01/2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tổng số xe</span>
                <span className="font-medium">2 xe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Lịch hẹn hoàn thành</span>
                <span className="font-medium">15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Điểm thưởng</span>
                <span className="font-medium text-teal-600">250 điểm</span>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Bảo mật</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                Đổi mật khẩu
              </Button>
              <Button variant="outline" className="w-full">
                Bật xác thực 2 bước
              </Button>
              <Button variant="outline" className="w-full">
                Quản lý thiết bị đăng nhập
              </Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
};

export default Profile;