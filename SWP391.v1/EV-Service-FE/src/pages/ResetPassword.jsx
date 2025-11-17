import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { authService } from '../services/authService';

function ResetPassword() {
  const { token } = useParams(); // lay token tu url
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  // from
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    trigger 
  } = useForm();

  const watchPassword = watch('password', '');

  // ham kiem tra do manh cua password
  function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    return strength;
  }

  // cap nhat khi password thay doi
  useEffect(() => {
    setPasswordStrength(checkPasswordStrength(watchPassword));
  }, [watchPassword]);
  //ktr token tu user co hop le khong
  useEffect(() => {
    async function verifyToken() {
      if (!token) {
        setTokenValid(false);
        return;
      }

      try {
        // fake check token, goi api sau neu be xong
        await new Promise(resolve => setTimeout(resolve, 500));
        //neu token khong hop le
        setTokenValid(true);
      } catch (error) {
        console.error('Invalid token:', error);
        setTokenValid(false);
        toast.error('Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn');
      }
    }

    verifyToken();
  }, [token]);
  //dat lai mk
  async function handleResetPassword(data) {
    setIsSubmitting(true);

    try {
      // goi api dat lai mk
      const response = await authService.resetPassword(token, data.password);
      
      // neu dat lai mk thanh cong
      if (response.success !== false) {
        toast.success('Mật khẩu đã được đặt lại thành công!');
        
        // chuyen ve trang login sau 2s sau khi dat lai mk thanh cong
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error('Không thể đặt lại mật khẩu. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // hien thi loi neu token khong dung
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <Card className="p-8">
            <div className="text-red-500 mb-4">
              <FiX className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Link không hợp lệ
            </h2>
            <p className="text-gray-600 mb-6">
              Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. 
              Vui lòng yêu cầu link mới.
            </p>
            <Link to="/forgot-password">
              <Button variant="primary" className="w-full">
                Yêu cầu link mới
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // hien thi thong bao do manh cua mk khi dat lai mk hoac dang ky
  function renderStrengthIndicator() {
    const strengthLevels = ['Yếu', 'Trung bình', 'Khá', 'Mạnh'];
    const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return (
      <div className="mt-2">
        <div className="flex gap-1 mb-2">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index < passwordStrength 
                  ? strengthColors[passwordStrength - 1]
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        {watchPassword && (
          <p className={`text-xs ${
            passwordStrength === 1 ? 'text-red-500' :
            passwordStrength === 2 ? 'text-yellow-500' :
            passwordStrength === 3 ? 'text-blue-500' :
            passwordStrength === 4 ? 'text-green-500' :
            'text-gray-500'
          }`}>
            Độ mạnh: {strengthLevels[passwordStrength - 1] || 'Rất yếu'}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-600 rounded-xl mb-4">
            <span className="text-white font-bold text-2xl">EV</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Đặt lại mật khẩu
          </h1>
          <p className="mt-2 text-gray-600">
            Nhập mật khẩu mới cho tài khoản của bạn
          </p>
        </div>

        <Card className="p-8">
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
                      value: 8,
                      message: 'Mật khẩu phải có ít nhất 8 ký tự'
                    },
                    validate: {
                      strength: value => 
                        checkPasswordStrength(value) >= 2 || 
                        'Mật khẩu quá yếu. Hãy thêm chữ hoa, số và ký tự đặc biệt'
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
              {renderStrengthIndicator()}
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
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Yêu cầu mật khẩu:
              </p>
              <ul className="space-y-1">
                <li className="flex items-center text-sm">
                  {watchPassword?.length >= 8 ? (
                    <FiCheck className="text-green-500 mr-2" />
                  ) : (
                    <FiX className="text-gray-400 mr-2" />
                  )}
                  <span className={watchPassword?.length >= 8 ? 'text-green-700' : 'text-gray-500'}>
                    Ít nhất 8 ký tự
                  </span>
                </li>
                <li className="flex items-center text-sm">
                  {watchPassword?.match(/[A-Z]/) && watchPassword?.match(/[a-z]/) ? (
                    <FiCheck className="text-green-500 mr-2" />
                  ) : (
                    <FiX className="text-gray-400 mr-2" />
                  )}
                  <span className={
                    watchPassword?.match(/[A-Z]/) && watchPassword?.match(/[a-z]/) 
                      ? 'text-green-700' 
                      : 'text-gray-500'
                  }>
                    Chữ hoa và chữ thường
                  </span>
                </li>
                <li className="flex items-center text-sm">
                  {watchPassword?.match(/[0-9]/) ? (
                    <FiCheck className="text-green-500 mr-2" />
                  ) : (
                    <FiX className="text-gray-400 mr-2" />
                  )}
                  <span className={watchPassword?.match(/[0-9]/) ? 'text-green-700' : 'text-gray-500'}>
                    Ít nhất một số
                  </span>
                </li>
                <li className="flex items-center text-sm">
                  {watchPassword?.match(/[^a-zA-Z0-9]/) ? (
                    <FiCheck className="text-green-500 mr-2" />
                  ) : (
                    <FiX className="text-gray-400 mr-2" />
                  )}
                  <span className={
                    watchPassword?.match(/[^a-zA-Z0-9]/) 
                      ? 'text-green-700' 
                      : 'text-gray-500'
                  }>
                    Ký tự đặc biệt (!@#$...)
                  </span>
                </li>
              </ul>
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
            <div className="text-center">
              <Link
                to="/login"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default ResetPassword;
