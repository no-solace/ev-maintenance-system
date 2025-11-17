import React, { useState, useEffect } from 'react';
import { FiX, FiChevronLeft } from 'react-icons/fi';
import SelectCenter from './steps/SelectCenter';
import SelectDate from './steps/SelectDate';
import SelectTimeSlot from './steps/SelectTimeSlot';
import ConfirmBooking from './steps/ConfirmBooking';
import BookingSuccess from './steps/BookingSuccess';

const MultiStepBooking = ({ isOpen, onClose, vehicle }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    center: null,
    date: null,
    service: null,
    servicePackage: null,
    parts: [],
    problemDescription: '',
    timeSlot: null,
    vehicle: vehicle || null, // Store full vehicle object
    vehicleData: vehicle || null, // Keep full vehicle data for reference
    customerInfo: { name: '', phone: '', email: '', address: '' },
    notes: '',
    status: 'pending',
    bookingId: null,
  });

  const steps = [
    { id: 1, name: 'Chọn trung tâm', component: SelectCenter },
    { id: 2, name: 'Chọn ngày', component: SelectDate },
    { id: 3, name: 'Chọn giờ', component: SelectTimeSlot },
    { id: 4, name: 'Xác nhận', component: ConfirmBooking },
    { id: 5, name: 'Hoàn tất', component: BookingSuccess },
  ];

  // Update vehicle data when vehicle prop changes
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
    setBookingData({ ...bookingData, ...data });
    if (currentStep < steps.length) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

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
      vehicleData: vehicle || null,
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

  if (!isOpen) return null;

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-40"
        onClick={handleClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl transition-all">
          {/* Header modal */}
          <div
            className="px-8 py-6 rounded-t-3xl border-b border-[#027C9D]"
            style={{ backgroundColor: '#027C9D' }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 min-w-0 pr-4">
                <h2
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: '#f0f9ff' }}
                >
                  Đặt lịch dịch vụ VinFast
                </h2>
                <p
                  className="text-base mt-1 font-medium"
                  style={{ color: '#80D3EF' }}
                >
                  Bước {Math.min(currentStep, 4)} / {steps.length - 1}: {steps[currentStep - 1].name}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-[#80D3EF] focus:outline-none transition flex-shrink-0"
                aria-label="Đóng modal"
              >
                <FiX className="w-6 h-6" style={{ color: '#f0f9ff' }} />
              </button>
            </div>

            {/* Progress Bar */}
            {currentStep < 5 && (
              <div className="flex items-center justify-between gap-1 mt-2 mb-1">
                {steps.slice(0, 4).map((step, index) => {
                  let borderColor = '#a7d1e6';
                  let backgroundColor = '#d1edf9';
                  let color = '#80d3ef';

                  if (currentStep > step.id) {
                    borderColor = '#034058';
                    backgroundColor = '#80d3ef';
                    color = '#ffffff';
                  } else if (currentStep === step.id) {
                    borderColor = '#034058';
                    backgroundColor = '#027c9d';
                    color = '#ffffff';
                  }

                  return (
                    <div key={step.id} className="flex flex-1 flex-col items-center min-w-0 relative">
                      <div
                        className="flex items-center justify-center w-9 h-9 rounded-full border-2 font-semibold text-lg"
                        style={{ borderColor, backgroundColor, color }}
                      >
                        {currentStep > step.id ? '✓' : step.id}
                      </div>
                      <span
                        className="mt-2 max-w-[100px] text-xs text-center font-semibold truncate"
                        style={{ color: currentStep >= step.id ? '#034058' : '#80d3ef' }}
                      >
                        {step.name}
                      </span>
                      {index < steps.length - 2 && (
                        <div
                          className="absolute top-4 left-full h-0.5 w-full mx-2"
                          style={{ backgroundColor: currentStep > step.id ? '#80d3ef' : '#a7d1e6' }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Nội dung step */}
          <div
            className="p-7 rounded-b-3xl"
            style={{ maxHeight: '70vh', overflowY: 'auto', backgroundColor: '#e7faff' }}
          >
            <CurrentStepComponent
              data={bookingData}
              onNext={handleNext}
              onBack={handleBack}
              currentStep={currentStep}
            />
          </div>

          {/* Nút quay lại */}
          {currentStep > 1 && currentStep < 5 && (
            <div className="px-8 py-6 border-t border-[#027C9D] flex justify-start bg-[#80d3ef] rounded-b-3xl">
              <button
                onClick={handleBack}
                className="flex items-center px-5 py-2 font-semibold rounded-lg text-white"
                style={{ backgroundColor: '#034058' }}
              >
                <FiChevronLeft className="mr-2" />
                Quay lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepBooking;
