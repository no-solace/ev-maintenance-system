import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { authService } from '../services/authService';

function ForgotPassword() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // khoi tao form 
  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  async function handleForgotPassword(data) {
    setIsSubmitting(true);
    
    try {
      // Call real API to send OTP
      const response = await authService.forgotPassword(data.email);
      
      if (response.success !== false) {
        toast.success('Mã OTP đã được gửi đến email của bạn!');
        
        // Navigate to OTP verification page with email
        navigate('/verify-otp', { state: { email: data.email } });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Không thể gửi email. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  }
  // gui lai email
  async function resendEmail() {
    const email = getValues('email');
    if (!email) {
      toast.error('Vui lòng nhập email');
      return;
    }

    setIsSubmitting(true);
    try {
      // fake api call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Email đã được gửi lại!');
    } catch (error) {
      toast.error('Không thể gửi lại email');
    } finally {
      setIsSubmitting(false);
    }
  }
//header
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-xl mb-4">
            <span className="text-white font-bold text-2xl">EV</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {emailSent ? 'Kiểm tra email của bạn' : 'Quên mật khẩu?'}
          </h1>
          <p className="mt-2 text-gray-600">
            {emailSent 
              ? 'Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn'
              : 'Không sao, chúng tôi sẽ gửi cho bạn hướng dẫn đặt lại mật khẩu'}
          </p>
        </div>

        <Card className="p-8">
          {!emailSent ? (
            // form nhap email
            <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-6">
              <div>
                <Input
                  label="Email đã đăng ký"
                  type="email"
                  icon={<FiMail />}
                  placeholder="your@email.com"
                  error={errors.email?.message}
                  {...register('email', {
                    required: 'Vui lòng nhập email',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email không hợp lệ'
                    }
                  })}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Nhập email bạn đã dùng để đăng ký tài khoản
                </p>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isSubmitting}
              >
                Gửi email đặt lại mật khẩu
              </Button>
              <div className="text-center">
                <Link
                  to="/login"
                  className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center"
                >
                  <FiArrowLeft className="mr-2" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          ) : (
            // thong bao da gui email thanh cong
            <div className="text-center space-y-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-green-700 font-medium">
                  Email đã được gửi thành công!
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến:
                </p>
                <p className="font-medium text-gray-900">
                  {getValues('email')}
                </p>
                <p className="text-sm text-gray-500">
                  Vui lòng kiểm tra hộp thư (bao gồm cả thư mục spam)
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Không nhận được email?
                </p>
                <Button
                  onClick={resendEmail}
                  variant="outline"
                  size="md"
                  loading={isSubmitting}
                  className="w-full"
                >
                  Gửi lại email
                </Button>
              </div>
              <Link
                to="/login"
                className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center"
              >
                <FiArrowLeft className="mr-2" />
                Quay lại đăng nhập
              </Link>
            </div>
          )}
        </Card>
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Nếu bạn gặp vấn đề, vui lòng liên hệ{' '}
            <a href="mailto:support@evservice.com" className="text-primary-600 hover:text-primary-700">
              support@evservice.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
