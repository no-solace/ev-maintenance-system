import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiKey, FiEye, FiEyeOff, FiCheck, FiX, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { authService } from '../services/authService';

function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  
  const [step, setStep] = useState(1); // 1: Verify OTP, 2: Reset Password
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút = 300 giây
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const watchPassword = watch('password', '');
  
  // Redirect về forgot-password nếu không có email
  useEffect(() => {
    if (!email) {
      toast.error('Vui lòng nhập email trước');
      navigate('/forgot-password');
    }
  }, [email, navigate]);
  
  // Countdown timer cho OTP
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft]);
  
  // Format time còn lại
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Xác thực OTP
  async function handleVerifyOTP(data) {
    setIsSubmitting(true);
    
    try {
      const response = await authService.verifyOTP(email, data.otpCode);
      
      if (response.success !== false) {
        toast.success('Mã OTP hợp lệ! Vui lòng đặt mật khẩu mới.');
        setOtpCode(data.otpCode);
        setStep(2); // Chuyển sang bước 2: Đặt mật khẩu mới
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      toast.error(error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Đặt lại mật khẩu
  async function handleResetPassword(data) {
    setIsSubmitting(true);
    
    try {
      const response = await authService.resetPasswordWithOTP(
        email, 
        otpCode, 
        data.password
      );
      
      if (response.success !== false) {
        toast.success('Mật khẩu đã được đặt lại thành công!');
        
        // Chuyển về trang login sau 2 giây
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Gửi lại OTP
  async function handleResendOTP() {
    setIsSubmitting(true);
    
    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success !== false) {
        toast.success('Mã OTP mới đã được gửi!');
        setTimeLeft(300); // Reset timer
      }
    } catch (error) {
      toast.error('Không thể gửi lại OTP. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  // Kiểm tra độ mạnh mật khẩu
  function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  }
  
  const passwordStrength = checkPasswordStrength(watchPassword);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-xl mb-4">
            <span className="text-white font-bold text-2xl">EV</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {step === 1 ? 'Xác thực OTP' : 'Đặt lại mật khẩu'}
          </h1>
          <p className="mt-2 text-gray-600">
            {step === 1 
              ? `Mã OTP đã được gửi đến ${email}`
              : 'Nhập mật khẩu mới cho tài khoản của bạn'
            }
          </p>
        </div>
        
        <Card className="p-8">
          {step === 1 ? (
            // Step 1: Nhập OTP
            <form onSubmit={handleSubmit(handleVerifyOTP)} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-700 mb-1">
                  <strong>Lưu ý:</strong>
                </p>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Mã OTP có 6 chữ số</li>
                  <li>• Có hiệu lực trong 5 phút</li>
                  <li>• Kiểm tra cả thư mục spam</li>
                </ul>
              </div>
              
              <Input
                label="Mã OTP"
                type="text"
                icon={<FiKey />}
                placeholder="Nhập 6 chữ số"
                maxLength={6}
                error={errors.otpCode?.message}
                {...register('otpCode', {
                  required: 'Vui lòng nhập mã OTP',
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: 'Mã OTP phải là 6 chữ số'
                  }
                })}
              />
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Thời gian còn lại: 
                  <span className={`font-semibold ml-2 ${timeLeft < 60 ? 'text-red-600' : 'text-teal-600'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={timeLeft > 240 || isSubmitting}
                  className="text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Gửi lại OTP
                </button>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isSubmitting}
              >
                Xác thực
              </Button>
              
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center"
                >
                  <FiArrowLeft className="mr-2" />
                  Thử với email khác
                </Link>
              </div>
            </form>
          ) : (
            // Step 2: Đặt mật khẩu mới
            <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6">
              <div>
                <div className="relative">
                  <Input
                    label="Mật khẩu mới"
                    type={showPassword ? 'text' : 'password'}
                    icon={<FiLock />}
                    placeholder="••••••••"
                    error={errors.password?.message}
                    {...register('password', {
                      required: 'Vui lòng nhập mật khẩu mới',
                      minLength: {
                        value: 6,
                        message: 'Mật khẩu phải có ít nhất 6 ký tự'
                      }
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                
                {/* Password Strength Indicator */}
                {watchPassword && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 flex-1 rounded-full ${
                            index < passwordStrength
                              ? passwordStrength === 1 ? 'bg-red-500'
                                : passwordStrength === 2 ? 'bg-yellow-500'
                                : passwordStrength === 3 ? 'bg-blue-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Độ mạnh: {
                        passwordStrength === 1 ? 'Yếu' :
                        passwordStrength === 2 ? 'Trung bình' :
                        passwordStrength === 3 ? 'Khá' :
                        passwordStrength === 4 ? 'Mạnh' : 'Rất yếu'
                      }
                    </p>
                  </div>
                )}
              </div>
              
              <div className="relative">
                <Input
                  label="Xác nhận mật khẩu"
                  type={showConfirmPassword ? 'text' : 'password'}
                  icon={<FiLock />}
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  {...register('confirmPassword', {
                    required: 'Vui lòng xác nhận mật khẩu',
                    validate: value =>
                      value === watchPassword || 'Mật khẩu không khớp'
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                loading={isSubmitting}
              >
                Đặt lại mật khẩu
              </Button>
            </form>
          )}
        </Card>
        
        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-sm text-gray-600 hover:text-gray-800 inline-flex items-center"
          >
            <FiArrowLeft className="mr-2" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
