import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import MultiStepBooking from '../components/booking/MultiStepBooking';

const PublicLayout = ({ children }) => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // truyền function mở modal xuống các component 
  React.useEffect(() => {
    // xem co du lieu tu event khong
    const handleOpenBooking = () => setIsBookingOpen(true);
    window.addEventListener('openBookingModal', handleOpenBooking);
    
    return () => {
      window.removeEventListener('openBookingModal', handleOpenBooking);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <Footer />
      <MultiStepBooking 
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};

export default PublicLayout;