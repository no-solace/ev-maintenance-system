import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import vnpayService from '../../services/vnpayService';
import confetti from 'canvas-confetti';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleVNPayReturn();
  }, []);

  const handleVNPayReturn = async () => {
    try {
      // Get all query parameters
      const queryParams = new URLSearchParams(location.search);
      const params = Object.fromEntries(queryParams.entries());

      console.log('📥 VNPay return params (Staff Payment):', params);

      // Process the return from VNPay
      const response = await vnpayService.handleReturn(params);

      if (response.success) {
        setResult(response.data);
        
        // If payment successful, trigger confetti
        if (response.data.success || response.data.responseCode === '00') {
          triggerConfetti();
        }
      } else {
        setError(response.error);
      }
    } catch (err) {
      console.error('Error processing VNPay return:', err);
      setError('Có lỗi xảy ra khi xử lý kết quả thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const isSuccess = result?.success || result?.responseCode === '00';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <Card.Content className="p-8 text-center">
            <FiLoader className="animate-spin mx-auto text-6xl text-purple-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Đang xử lý kết quả thanh toán...
            </h2>
            <p className="text-gray-600">
              Vui lòng đợi trong giây lát
            </p>
          </Card.Content>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <Card.Content className="p-8 text-center">
            <FiXCircle className="mx-auto text-6xl text-red-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Lỗi xử lý thanh toán
            </h2>
            <p className="text-gray-600 mb-6">
              {error}
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/staff/payments')}
              className="w-full"
            >
              Quay lại danh sách thanh toán
            </Button>
          </Card.Content>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-lg w-full">
        <Card.Content className="p-8">
          <div className="text-center mb-6">
            {isSuccess ? (
              <>
                <FiCheckCircle className="mx-auto text-7xl text-green-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Thanh toán thành công! 🎉
                </h2>
                <p className="text-gray-600">
                  Giao dịch của bạn đã được xử lý thành công
                </p>
              </>
            ) : (
              <>
                <FiXCircle className="mx-auto text-7xl text-red-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Thanh toán thất bại
                </h2>
                <p className="text-gray-600">
                  {result?.message || 'Giao dịch không thành công'}
                </p>
              </>
            )}
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Thông tin giao dịch</h3>
            
            <div className="space-y-3">
              {result?.invoiceNumber && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã hóa đơn:</span>
                  <span className="font-semibold text-gray-900">{result.invoiceNumber}</span>
                </div>
              )}
              
              {result?.amount && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Số tiền:</span>
                  <span className="font-semibold text-purple-600">
                    {(result.amount / 100).toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              )}
              
              {result?.transactionNo && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-mono text-sm text-gray-900">{result.transactionNo}</span>
                </div>
              )}
              
              {result?.bankCode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngân hàng:</span>
                  <span className="font-semibold text-gray-900">{result.bankCode}</span>
                </div>
              )}
              
              {result?.transactionDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Thời gian:</span>
                  <span className="text-gray-900">
                    {new Date(result.transactionDate).toLocaleString('vi-VN')}
                  </span>
                </div>
              )}

              {result?.responseCode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã phản hồi:</span>
                  <span className={`font-semibold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {result.responseCode}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              variant="primary"
              onClick={() => navigate('/staff/payments')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Quay lại danh sách thanh toán
            </Button>
            
            {isSuccess && result?.invoiceNumber && (
              <Button
                variant="outline"
                onClick={() => navigate(`/staff/invoices/${result.invoiceNumber}`)}
                className="w-full"
              >
                Xem chi tiết hóa đơn
              </Button>
            )}
          </div>

          {/* Support Note */}
          {!isSuccess && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                💡 <strong>Lưu ý:</strong> Nếu bạn đã thanh toán nhưng giao dịch không thành công, 
                vui lòng liên hệ bộ phận hỗ trợ với mã giao dịch trên.
              </p>
            </div>
          )}
        </Card.Content>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
