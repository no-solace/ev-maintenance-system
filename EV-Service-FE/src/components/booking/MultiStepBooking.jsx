import React, { useState, useEffect } from 'react';
import { FiX, FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import SelectCenter from './steps/SelectCenter';
import SelectDate from './steps/SelectDate';
import SelectTimeSlot from './steps/SelectTimeSlot';
import ConfirmBooking from './steps/ConfirmBooking';
import BookingSuccessModal from './BookingSuccessModal';

const MultiStepBooking = ({ isOpen, onClose, vehicle }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    center: null,
    date: null,
    service: null,
    servicePackage: null,
    parts: [],
    problemDescription: '',
    timeSlot: null,
    vehicle: vehicle || null, //  giu lai xe neu co truyen vao
    vehicleData: vehicle || null, // Giữ dữ liệu xe đầy đủ để tham chiếu
    customerInfo: { name: '', phone: '', email: '', address: '' },
    notes: '',
    status: 'pending',
    bookingId: null,
  });
  // dinh nghia cac buoc trong quy trinh dat lich
  const steps = [
    { id: 1, name: 'Chọn trung tâm', component: SelectCenter },
    { id: 2, name: 'Chọn ngày', component: SelectDate },
    { id: 3, name: 'Chọn giờ', component: SelectTimeSlot },
    { id: 4, name: 'Xác nhận', component: ConfirmBooking },
  ];

  // Cập nhật dữ liệu xe khi prop vehicle thay đổi
  useEffect(() => {
    if (vehicle) {
      console.log('🚗 Vehicle selected for booking:', vehicle);
      setBookingData(prev => ({
        ...prev,
        vehicle: vehicle,
        vehicleData: vehicle
      }));
    }
  }, [vehicle]);

  const handleNext = (data) => {
    // Chỉ lưu dữ liệu, không chuyển bước
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const goToNextStep = () => {
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };
  // dat lai trang thai ban dau
  const handleReset = () => {
    setCurrentStep(1);
    setBookingData({
      center: null,
      date: null,
      service: null,
      servicePackage: null,
      parts: [],
      problemDescription: '',
      timeSlot: null,
      vehicle: vehicle || null, // Restore vehicle if provided
      vehicleData: vehicle || null, // Giữ dữ liệu xe đầy đủ để tham chiếu
      customerInfo: { name: '', phone: '', email: '', address: '' },
      notes: '',
      status: 'pending',
      bookingId: null,
    });
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleBookingSuccess = (data) => {
    // show modal thành công
    console.log('🎉 handleBookingSuccess called, showing success modal');
    setBookingData(prev => ({ ...prev, ...data }));
    setShowSuccessModal(true);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    handleReset();
    onClose();
  };

  // ref để gọi hàm submit trong bước xác nhận
  const confirmRef = React.useRef();

  if (!isOpen && !showSuccessModal) return null;

  const CurrentStepComponent = steps[currentStep - 1].component;
  //  tra ve giao dien dat lich theo buoc
  return (
    <>
    {isOpen && !showSuccessModal && (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-40"
        onClick={handleClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl transition-all">
          {/* Header modal */}
          <div
            className="px-8 py-6 rounded-t-2xl border-b border-[#027C9D] relative"
            style={{ backgroundColor: '#027C9D' }}
          >
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 p-2 rounded-lg hover:bg-[#80D3EF] focus:outline-none transition"
              aria-label="Đóng modal"
            >
              <FiX className="w-6 h-6" style={{ color: '#f0f9ff' }} />
            </button>

            {/* Progress Bar */}
            <div className="flex items-center justify-center mt-2 mb-1">
              {steps.map((step, index) => {
                  let borderColor = '#ffffff';
                  let backgroundColor = 'rgba(255, 255, 255, 0.3)';
                  let circleColor = 'rgba(255, 255, 255, 0.7)';
                  let textColor = 'rgba(255, 255, 255, 0.7)';

                  if (currentStep > step.id) {
                    // Completed steps
                    borderColor = '#ffffff';
                    backgroundColor = '#ffffff';
                    circleColor = '#027c9d';
                    textColor = '#ffffff';
                  } else if (currentStep === step.id) {
                    // Current step
                    borderColor = '#ffffff';
                    backgroundColor = '#0ea5e9';
                    circleColor = '#ffffff';
                    textColor = '#ffffff';
                  }

                  const isLastStep = index === steps.length - 1;
                  
                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center flex-shrink-0" style={{ width: '100px' }}>
                        <div
                          className="flex items-center justify-center rounded-full border-2 font-semibold text-lg shadow-sm flex-shrink-0"
                          style={{ 
                            width: '36px',
                            height: '36px',
                            borderColor, 
                            backgroundColor, 
                            color: circleColor 
                          }}
                        >
                          {currentStep > step.id ? '✓' : step.id}
                        </div>
                        <div
                          className="mt-2 text-xs text-center font-semibold"
                          style={{ 
                            width: '100px',
                            color: currentStep >= step.id ? '#ffffff' : textColor,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            lineHeight: '1.2'
                          }}
                        >
                          {step.name}
                        </div>
                      </div>
                      {!isLastStep && (
                        <div
                          className="h-0.5 flex-shrink-0 self-start"
                          style={{ 
                            width: '120px',
                            marginTop: '18px',
                            backgroundColor: currentStep > step.id ? '#ffffff' : 'rgba(255, 255, 255, 0.4)' 
                          }}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
            </div>
          </div>

          {/* Nội dung step */}
          <div
            className="p-7"
            style={{ 
              height: '520px',
              overflowY: 'auto', 
              backgroundColor: '#e7faff',
              scrollbarGutter: 'stable'
            }}
          >
            {/* Title at top of content */}
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
              Đặt lịch dịch vụ VinFast
            </h2>
            
            <CurrentStepComponent
              ref={currentStep === 4 ? confirmRef : null}
              data={bookingData}
              onNext={handleNext}
              onBack={handleBack}
              goToNextStep={goToNextStep}
              onBookingSuccess={handleBookingSuccess}
              currentStep={currentStep}
            />
          </div>

          {/* Footer - Navigation buttons */}
          <div className="px-8 py-6 border-t border-[#027C9D] flex justify-between items-center bg-[#80d3ef] rounded-b-2xl">
              <button
                onClick={currentStep === 1 ? handleClose : handleBack}
                className="flex items-center justify-center px-5 py-2.5 font-semibold rounded-lg text-white transition w-[130px]"
                style={{ 
                  backgroundColor: currentStep === 1 ? '#dc2626' : '#6b7280',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = currentStep === 1 ? '#b91c1c' : '#4b5563';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = currentStep === 1 ? '#dc2626' : '#6b7280';
                }}
              >
                {currentStep === 1 ? (
                  <>
                    <FiX className="mr-2" />
                    Thoát
                  </>
                ) : (
                  <>
                    <FiChevronLeft className="mr-2" />
                    Quay lại
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  if (currentStep === 4) {
                    // For step 4 (Confirm), trigger the submit action via ref
                    if (confirmRef.current) {
                      confirmRef.current.submit();
                    }
                  } else {
                    // For other steps, just move to next step
                    goToNextStep();
                  }
                }}
                disabled={
                  (currentStep === 1 && !bookingData.center) ||
                  (currentStep === 2 && !bookingData.date) ||
                  (currentStep === 3 && !bookingData.timeSlot)
                }
                className="flex items-center justify-center px-5 py-2.5 font-semibold rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition w-[130px]"
                style={{ 
                  backgroundColor: '#10b981'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#059669';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.backgroundColor = '#10b981';
                  }
                }}
              >
                {currentStep === 4 ? (
                  <>
                    Đặt lịch
                    <FiCheck className="ml-2" />
                  </>
                ) : (
                  <>
                    Tiếp tục
                    <FiChevronRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
        </div>
      </div>
    </div>
    )}
      
      {/* Success Modal */}
      <BookingSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        data={bookingData}
      />
    </>
  );
};

export default MultiStepBooking;
