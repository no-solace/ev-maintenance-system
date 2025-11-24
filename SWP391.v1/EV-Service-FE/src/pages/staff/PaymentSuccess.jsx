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
      // Get all query parameters from URL
      const queryParams = new URLSearchParams(location.search);
      const params = Object.fromEntries(queryParams.entries());

      console.log('📥 VNPay return params (Staff Payment):', params);

      // Check if we have VNPay response parameters
      if (!params.vnp_ResponseCode) {
        setError('Không nhận được thông tin từ VNPay');
        setLoading(false);
        return;
      }

      // Parse VNPay response directly from URL params
      const responseCode = params.vnp_ResponseCode;
      const transactionNo = params.vnp_TransactionNo;
      const txnRef = params.vnp_TxnRef;
      const amount = params.vnp_Amount;
      const bankCode = params.vnp_BankCode;
      const payDate = params.vnp_PayDate;

      // Check if payment was successful
      const isSuccess = responseCode === '00';

      // Parse invoice number and payment ID from txnRef
      // Format: {invoiceNumber}_{paymentId}_{timestamp}
      let invoiceNumber = null;
      let paymentId = null;
      
      if (txnRef) {
        const parts = txnRef.split('_');
        if (parts.length >= 3) {
          // Last part is timestamp, second last is paymentId, rest is invoiceNumber
          paymentId = parts[parts.length - 2];
          invoiceNumber = parts.slice(0, parts.length - 2).join('_');
        }
      }

      const result = {
        success: isSuccess,
        responseCode: responseCode,
        transactionNo: transactionNo,
        txnRef: txnRef,
        amount: amount ? parseInt(amount) : 0,
        bankCode: bankCode,
        payDate: payDate,
        invoiceNumber: invoiceNumber,
        paymentId: paymentId,
        message: getResponseMessage(responseCode)
      };

      console.log('📊 Parsed payment result:', result);

      setResult(result);

      // If payment successful, trigger confetti and notify backend
      if (isSuccess) {
        triggerConfetti();
        
        // Notify backend about successful payment (optional, for logging)
        try {
          await vnpayService.handleReturn(params);
        } catch (err) {
          console.warn('⚠️ Failed to notify backend, but payment was successful:', err);
        }
      }
    } catch (err) {
      console.error('Error processing VNPay return:', err);
      setError('Có lỗi xảy ra khi xử lý kết quả thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const getResponseMessage = (responseCode) => {
    const messages = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa',
      '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày',
      '75': 'Ngân hàng thanh toán đang bảo trì',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định',
    };
    return messages[responseCode] || 'Lỗi không xác định';
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
