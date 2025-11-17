import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import MainLayout from './layouts/MainLayout';
import PublicLayout from './layouts/PublicLayout';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';

import Contact from "./pages/Contact";
import Services from './pages/Services';
import MyBookings from './pages/MyBookings';
import MaintenanceHistory from './pages/MaintenanceHistory';

import Profile from './pages/Profile';
import MyVehicles from './pages/MyVehicles';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import CustomerInspectionApproval from './pages/CustomerInspectionApproval';
import PublicInspectionView from './pages/PublicInspectionView';

// Admin 
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminEnhancedAnalytics from './pages/admin/AdminEnhancedAnalytics';
import AdminInventory from './pages/admin/AdminInventory';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';

// Staff 
import StaffLayout from './layouts/StaffLayout';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffCustomers from './pages/staff/StaffCustomers';
import StaffAppointments from './pages/staff/StaffAppointments';
import StaffVehicleReception from './pages/staff/StaffVehicleReception';
import StaffReceptionTracking from './pages/staff/StaffReceptionTracking';
import StaffSpareParts from './pages/staff/StaffSpareParts';
import StaffPayments from './pages/staff/StaffPayments';
import StaffPaymentSuccess from './pages/staff/PaymentSuccess';
import StaffBookingSearch from './pages/staff/StaffBookingSearch';
import CustomerVNPayReturn from './pages/VNPayReturn';

// Technician 
import TechnicianLayout from './layouts/TechnicianLayout';
import TechnicianDashboard from './pages/technician/TechnicianDashboard';
import TechnicianWorkOrders from './pages/technician/TechnicianWorkOrders';
import TechnicianVehicleInspection from './pages/technician/TechnicianVehicleInspection';


const ProtectedRoute = ({ children }) => {
  const store = useAuthStore();
  const { isAuthenticated, _hasHydrated, initializeAuth } = store;
  
  React.useEffect(() => {
    // Also try to load from localStorage directly
    if (_hasHydrated) {
      const hasAuth = initializeAuth();
      console.log('🔐 Manual auth check:', hasAuth, 'Store auth:', isAuthenticated);
    }
  }, [_hasHydrated, initializeAuth, isAuthenticated]);
  
  // Wait for Zustand persist to rehydrate
  if (!_hasHydrated) {
    console.log('⏳ Waiting for Zustand rehydration...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }
  
  console.log('✅ Hydration complete. isAuthenticated:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('✅ Authenticated, rendering protected content');
  return children;
};

//hien thi sau khi login thanh cong
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();  
  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }  
  return children;
};

function App() {
  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/vnpay-return" element={<CustomerVNPayReturn />} />
          <Route path="/inspection/reception/:receptionId" element={<PublicInspectionView />} />
        </Route>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } 
        />
        <Route 
          path="/verify-otp" 
          element={
            <PublicRoute>
              <VerifyOTP />
            </PublicRoute>
          } 
        />
        <Route 
          path="/reset-password/:token" 
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          } 
        />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vehicles" element={<MyVehicles />} />
          <Route path="services" element={<Services />} />
          <Route path="my-bookings" element={<MyBookings />} />
          <Route path="vehicle-history" element={<MaintenanceHistory />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="inspection/:bookingId" element={<CustomerInspectionApproval />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="enhanced-analytics" element={<AdminEnhancedAnalytics />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/staff/dashboard" replace />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="customers" element={<StaffCustomers />} />
          <Route path="appointments" element={<StaffAppointments />} />
          <Route path="appointments/new" element={<StaffAppointments />} />
          <Route path="vehicle-reception" element={<StaffVehicleReception />} />
          <Route path="reception-tracking" element={<StaffReceptionTracking />} />
          <Route path="spare-parts" element={<StaffSpareParts />} />
          <Route path="payments" element={<StaffPayments />} />
          <Route path="booking-search" element={<StaffBookingSearch />} />
          <Route path="payment-success" element={<StaffPaymentSuccess />} />
        </Route>

        <Route
          path="/technician"
          element={
            <ProtectedRoute>
              <TechnicianLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/technician/dashboard" replace />} />
          <Route path="dashboard" element={<TechnicianDashboard />} />
          <Route path="work-orders" element={<TechnicianWorkOrders />} />
          <Route path="work-orders/:id" element={<TechnicianWorkOrders />} />
          <Route path="inspection/:bookingId" element={<TechnicianVehicleInspection />} />
          <Route path="inspection/reception/:receptionId" element={<TechnicianVehicleInspection />} />
          <Route path="inventory" element={<div>Inventory Page</div>} />
          <Route path="history" element={<div>Service History Page</div>} />
          <Route path="resources" element={<div>Tools & Manuals Page</div>} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;