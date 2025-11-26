package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.constants.BookingConstants;
import com.swp.evmsystem.dto.request.PaymentRequestDTO;
import com.swp.evmsystem.dto.response.PaymentResponseDTO;
import com.swp.evmsystem.dto.PaymentStatsDTO;
import com.swp.evmsystem.model.BookingEntity;
import com.swp.evmsystem.model.PaymentEntity;
import com.swp.evmsystem.model.VehicleReceptionEntity;
import com.swp.evmsystem.enums.PaymentMethod;
import com.swp.evmsystem.enums.PaymentStatus;
import com.swp.evmsystem.exception.BusinessException;
import com.swp.evmsystem.exception.ResourceNotFoundException;
import com.swp.evmsystem.repository.*;
import com.swp.evmsystem.service.PaymentService;
import com.swp.evmsystem.service.VNPayService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    
    private static final Logger logger = LoggerFactory.getLogger(PaymentServiceImpl.class);

    final private PaymentRepository paymentRepository;
    final private VehicleReceptionRepository receptionRepository;
    final private BookingRepository bookingRepository;
    final private VNPayService vnPayService;
    final private ElectricVehicleRepository electricVehicleRepository;
    
    @Override
    @Transactional
    public PaymentResponseDTO createPayment(PaymentRequestDTO requestDTO) {
        logger.info("Creating payment for customer: {}", requestDTO.getCustomerName());
        String invoiceNumber = generateInvoiceNumber();
        
        // Build payment entity
        PaymentEntity.PaymentEntityBuilder builder = PaymentEntity.builder()
                .invoiceNumber(invoiceNumber)
                .customerName(requestDTO.getCustomerName())
                .customerPhone(requestDTO.getCustomerPhone())
                .customerEmail(requestDTO.getCustomerEmail())
                .vehicleInfo(requestDTO.getVehicleInfo())
                .licensePlate(requestDTO.getLicensePlate())
                .serviceName(requestDTO.getServiceName())
                .serviceDescription(requestDTO.getServiceDescription())
                .serviceDate(requestDTO.getServiceDate() != null ? requestDTO.getServiceDate() : LocalDateTime.now())
                .totalAmount(requestDTO.getTotalAmount())
                .discountAmount(requestDTO.getDiscountAmount() != null ? requestDTO.getDiscountAmount() : 0.0)
                .paymentMethod(requestDTO.getPaymentMethod())
                .paymentStatus(requestDTO.getPaymentStatus() != null ? requestDTO.getPaymentStatus() : PaymentStatus.PENDING)
                .notes(requestDTO.getNotes());
        
        // Calculate final amount
        double discountAmt = requestDTO.getDiscountAmount() != null ? requestDTO.getDiscountAmount() : 0.0;
        double finalAmount = requestDTO.getTotalAmount() - discountAmt;
        logger.info("💰 Payment calculation: Total={}, Discount={}, Final={}", 
            requestDTO.getTotalAmount(), discountAmt, finalAmount);
        builder.finalAmount(finalAmount);
        
        // Link to reception if provided
        if (requestDTO.getReceptionId() != null) {
            VehicleReceptionEntity reception = receptionRepository.findById(requestDTO.getReceptionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Reception not found with ID: " + requestDTO.getReceptionId()));
            builder.reception(reception);
        }
        
        // Link to booking if provided (for deposit payments)
        if (requestDTO.getBookingId() != null) {
            BookingEntity booking = bookingRepository.findById(requestDTO.getBookingId())
                    .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + requestDTO.getBookingId()));
            builder.booking(booking);
        }
        
        PaymentEntity payment = builder.build();
        PaymentEntity savedPayment = paymentRepository.save(payment);
        
        logger.info("Payment created successfully with invoice number: {}", invoiceNumber);
        return convertToDTO(savedPayment);
    }
    
    @Override
    public PaymentResponseDTO getPaymentById(Integer paymentId) {
        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));
        return convertToDTO(payment);
    }
    
    @Override
    public PaymentResponseDTO getPaymentByInvoiceNumber(String invoiceNumber) {
        PaymentEntity payment = paymentRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with invoice number: " + invoiceNumber));
        return convertToDTO(payment);
    }
    
    @Override
    public List<PaymentResponseDTO> getAllPayments() {
        List<PaymentEntity> payments = paymentRepository.findAllByOrderByCreatedAtDesc();
        return payments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PaymentResponseDTO> getPaymentsByStatus(PaymentStatus status) {
        List<PaymentEntity> payments = paymentRepository.findByPaymentStatus(status);
        return payments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    public List<PaymentResponseDTO> searchPayments(String searchTerm) {
        if (searchTerm == null || searchTerm.trim().isEmpty()) {
            return getAllPayments();
        }
        List<PaymentEntity> payments = paymentRepository.searchPayments(searchTerm);
        return payments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public PaymentResponseDTO updatePaymentStatus(Integer paymentId, PaymentStatus newStatus) {
        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));
        
        payment.setPaymentStatus(newStatus);
        
        if (newStatus == PaymentStatus.PAID || newStatus == PaymentStatus.COMPLETED) {
            if (payment.getPaymentDate() == null) {
                payment.setPaymentDate(LocalDateTime.now());
            }
        }
        
        PaymentEntity updatedPayment = paymentRepository.save(payment);
        logger.info("Payment {} status updated to {}", paymentId, newStatus);
        
        return convertToDTO(updatedPayment);
    }
    
    @Override
    @Transactional
    public PaymentResponseDTO markAsPaid(Integer paymentId, String paymentMethod) {
        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));
        
        // Idempotent: If already PAID or COMPLETED, just return the payment
        if (payment.getPaymentStatus() == PaymentStatus.PAID || payment.getPaymentStatus() == PaymentStatus.COMPLETED) {
            logger.info("Payment {} already marked as {} - skipping duplicate processing", paymentId, payment.getPaymentStatus());
            return convertToDTO(payment);
        }
        
        if (payment.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new IllegalStateException("Only PENDING payments can be marked as PAID. Current status: " + payment.getPaymentStatus());
        }
        
        payment.setPaymentStatus(PaymentStatus.PAID);
        payment.setPaymentDate(LocalDateTime.now());
        
        // Set payment method from parameter (CASH or VNPAY)
        if ("VNPAY".equalsIgnoreCase(paymentMethod)) {
            payment.setPaymentMethod(PaymentMethod.VNPAY);
        } else {
            payment.setPaymentMethod(PaymentMethod.CASH);
        }
        
        PaymentEntity updatedPayment = paymentRepository.save(payment);
        logger.info("Payment {} marked as PAID with method {}", paymentId, paymentMethod);
        
        return convertToDTO(updatedPayment);
    }
    
    @Override
    @Transactional
    public PaymentResponseDTO markAsCompleted(Integer paymentId) {
        PaymentEntity payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with ID: " + paymentId));
        
        // Idempotent: If already COMPLETED, just return the payment
        if (payment.getPaymentStatus() == PaymentStatus.COMPLETED) {
            logger.info("Payment {} already marked as COMPLETED - skipping duplicate processing", paymentId);
            return convertToDTO(payment);
        }
        
        // Allow PAID or PENDING status (VNPay goes directly to COMPLETED)
        if (payment.getPaymentStatus() != PaymentStatus.PAID && payment.getPaymentStatus() != PaymentStatus.PENDING) {
            throw new IllegalStateException("Only PENDING or PAID payments can be marked as COMPLETED. Current status: " + payment.getPaymentStatus());
        }
        
        // Change status to COMPLETED and set payment date if not already set
        payment.setPaymentStatus(PaymentStatus.COMPLETED);
        if (payment.getPaymentDate() == null) {
            payment.setPaymentDate(LocalDateTime.now());
        }
        
        PaymentEntity updatedPayment = paymentRepository.save(payment);
        logger.info("Payment {} marked as COMPLETED with method {}", paymentId, payment.getPaymentMethod());
        
        // Update reception status to PAID when payment is completed
        // Only for service payments (not booking deposits)
        if (payment.getReception() != null) {
            VehicleReceptionEntity reception = payment.getReception();
            reception.setStatus(com.swp.evmsystem.enums.ReceptionStatus.PAID);
            receptionRepository.save(reception);
            logger.info("Updated reception #{} status to PAID after payment completion", reception.getReceptionId());
            
            // Update vehicle maintenance status to AVAILABLE
            if (payment.getLicensePlate() != null) {
                String licensePlate = payment.getLicensePlate();
                var vehicleOpt = electricVehicleRepository.findByLicensePlate(licensePlate);
                if (vehicleOpt.isPresent()) {
                    var vehicle = vehicleOpt.get();
                    vehicle.setMaintenanceStatus(com.swp.evmsystem.enums.EvMaintenanceStatus.AVAILABLE);
                    electricVehicleRepository.save(vehicle);
                    logger.info("Updated vehicle {} maintenance status to AVAILABLE after payment completion", licensePlate);
                }
            }
        }
        
        return convertToDTO(updatedPayment);
    }
    
    @Override
    public PaymentStatsDTO getPaymentStatistics() {
        long totalPayments = paymentRepository.count();
        long pendingCount = paymentRepository.countByPaymentStatus(PaymentStatus.PENDING);
        long paidCount = paymentRepository.countByPaymentStatus(PaymentStatus.PAID);
        long completedCount = paymentRepository.countByPaymentStatus(PaymentStatus.COMPLETED);
        
        Double totalRevenue = paymentRepository.calculateTotalRevenue();
        Double pendingAmount = paymentRepository.sumAmountByStatus(PaymentStatus.PENDING);
        Double collectedAmount = paymentRepository.sumAmountByStatus(PaymentStatus.PAID) 
                + paymentRepository.sumAmountByStatus(PaymentStatus.COMPLETED);
        
        return PaymentStatsDTO.builder()
                .totalPayments(totalPayments)
                .pendingCount(pendingCount)
                .paidCount(paidCount)
                .completedCount(completedCount)
                .totalRevenue(totalRevenue != null ? totalRevenue : 0.0)
                .pendingAmount(pendingAmount != null ? pendingAmount : 0.0)
                .collectedAmount(collectedAmount != null ? collectedAmount : 0.0)
                .build();
    }
    
    @Override
    public List<PaymentResponseDTO> getPaymentsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<PaymentEntity> payments = paymentRepository.findByServiceDateBetween(startDate, endDate);
        return payments.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public PaymentResponseDTO createPaymentFromBooking(Integer bookingId) {
        throw new UnsupportedOperationException("Payment creation from bookings is not supported. Use vehicle reception instead.");
    }
    
    @Override
    @Transactional
    public PaymentResponseDTO createPaymentFromReception(Integer receptionId) {
        logger.info("Creating payment from vehicle reception ID: {}", receptionId);
        
        VehicleReceptionEntity reception = receptionRepository.findById(receptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle reception not found with ID: " + receptionId));
        
        // Check if payment already exists for this reception
        if (paymentRepository.findByReception_ReceptionId(receptionId).isPresent()) {
            throw new IllegalStateException("Payment already exists for this reception");
        }
        
        // Check if reception is completed
        if (!"COMPLETED".equalsIgnoreCase(reception.getStatus().name())) {
            throw new IllegalStateException("Can only create payment for completed receptions. Current status: " + reception.getStatus());
        }
        
        // Use reception total cost
        double totalAmount = reception.getTotalCost();
        String serviceDescription = reception.getNotes();
        
        // Check if this reception is linked to a booking with deposit
        double depositAmount = 0.0;
        Integer linkedBookingId = null;
        if (reception.getBooking() != null) {
            linkedBookingId = reception.getBooking().getBookingId();
            logger.info("Reception is linked to booking #{}", linkedBookingId);
            
            // Find deposit payment for this booking
            var depositPaymentOpt = paymentRepository.findByBooking_BookingId(linkedBookingId);
            if (depositPaymentOpt.isPresent()) {
                PaymentEntity depositPayment = depositPaymentOpt.get();
                logger.info("Found deposit payment: Invoice={}, Status={}, Amount={}", 
                    depositPayment.getInvoiceNumber(), 
                    depositPayment.getPaymentStatus(), 
                    depositPayment.getFinalAmount());
                
                // Only deduct if deposit was actually paid
                if (depositPayment.getPaymentStatus() == PaymentStatus.COMPLETED || 
                    depositPayment.getPaymentStatus() == PaymentStatus.PAID) {
                    depositAmount = depositPayment.getFinalAmount();
                    logger.info("✅ Will deduct deposit: {} VND from total: {} VND", depositAmount, totalAmount);
                } else {
                    logger.warn("⚠️ Deposit payment found but not paid yet. Status: {}", depositPayment.getPaymentStatus());
                }
            } else {
                logger.warn("⚠️ No deposit payment found for booking #{}", linkedBookingId);
            }
        } else {
            logger.info("Reception is NOT linked to any booking (walk-in customer)");
        }
        
        // Build payment from reception data
        PaymentRequestDTO requestDTO = PaymentRequestDTO.builder()
                .receptionId(receptionId)
                .bookingId(linkedBookingId) // Link to booking if exists
                .customerName(reception.getCustomerName())
                .customerPhone(reception.getCustomerPhone())
                .customerEmail(reception.getCustomerEmail())
                .vehicleInfo(reception.getVehicleModel())
                .licensePlate(reception.getLicensePlate())// Services as comma-separated string
                .serviceDescription(serviceDescription)
                .serviceName("Thanh toán phiếu tiếp nhận #" + receptionId)
                .serviceDate(reception.getCreatedAt())
                .totalAmount(totalAmount)
                .discountAmount(depositAmount) // Deduct deposit if exists
                .paymentStatus(PaymentStatus.PENDING)
                .build();
        
        if (depositAmount > 0) {
            logger.info("Payment created with deposit deduction. Total: {} VND, Deposit: {} VND, Final: {} VND", 
                totalAmount, depositAmount, totalAmount - depositAmount);
        } else {
            logger.info("Payment created without deposit. Total amount: {} VND", totalAmount);
        }
        
        return createPayment(requestDTO);
    }

    private BookingEntity getBooking(Integer bookingId) {
        return bookingRepository.findById(bookingId).orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));
    }

    @Override
    @Transactional
    public Map<String, Object> createBookingDepositPayment(Integer bookingId) {
        try {
            BookingEntity booking = getBooking(bookingId);
            PaymentRequestDTO paymentRequest = PaymentRequestDTO.builder()
                    .bookingId(bookingId)
                    .customerName(booking.getCustomerName())
                    .customerPhone(booking.getCustomerName())
                    .customerEmail(booking.getCustomerEmail())
                    .vehicleInfo(booking.getVehicle().getLicensePlate())
                    .licensePlate(booking.getVehicle().getLicensePlate())
                    .serviceName("Đặt cọc booking #" + bookingId)
                    .serviceDescription(BookingConstants.DEPOSIT_POLICY)
                    .serviceDate(LocalDateTime.now())
                    .totalAmount((double) BookingConstants.DEPOSIT_AMOUNT)
                    .discountAmount(0.0)
                    .paymentMethod(PaymentMethod.VNPAY)
                    .paymentStatus(PaymentStatus.PENDING)
                    .notes("Booking ID: " + bookingId)
                    .build();
            
            PaymentResponseDTO payment = createPayment(paymentRequest);
            
            // Create invoice number with payment ID and booking ID
            String invoiceNumber = "BOOKING_DEPOSIT_" + bookingId + "_" + payment.getPaymentId();
            
            // Create VNPay payment URL
            String orderInfo = "Đặt cọc booking #" + bookingId;
            String paymentUrl = vnPayService.createPaymentUrl(
                    BookingConstants.DEPOSIT_AMOUNT,
                    orderInfo,
                    payment.getPaymentId().longValue(),
                    invoiceNumber
            );
            
            logger.info("Created deposit payment - Booking ID: {}, Payment ID: {}, Invoice: {}, Amount: {}",
                    bookingId, payment.getPaymentId(), invoiceNumber, BookingConstants.DEPOSIT_AMOUNT);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("paymentUrl", paymentUrl);
            response.put("depositAmount", BookingConstants.DEPOSIT_AMOUNT);
            response.put("depositPolicy", BookingConstants.DEPOSIT_POLICY);
            response.put("invoiceNumber", invoiceNumber);
            response.put("paymentId", payment.getPaymentId());
            
            return response;
        } catch (UnsupportedEncodingException e) {
            logger.error("Error creating VNPay payment URL for booking {}", bookingId, e);
            throw new BusinessException("Failed to create payment URL: " + e.getMessage(), e);
        }
    }
    
    // Helper methods
    
    private String generateInvoiceNumber() {
        // Generate invoice number in format HD0001, HD0002, etc.
        long count = paymentRepository.count();
        return String.format("HD%04d", count + 1);
    }
    
    private PaymentResponseDTO convertToDTO(PaymentEntity payment) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        return PaymentResponseDTO.builder()
                .paymentId(payment.getPaymentId())
                .receptionId(payment.getReception() != null ? payment.getReception().getReceptionId() : null)
                .bookingId(payment.getBooking() != null ? payment.getBooking().getBookingId() : null)
                .invoiceNumber(payment.getInvoiceNumber())
                .customerName(payment.getCustomerName())
                .customerPhone(payment.getCustomerPhone())
                .customerEmail(payment.getCustomerEmail())
                .vehicleInfo(payment.getVehicleInfo())
                .licensePlate(payment.getLicensePlate())
                .serviceName(payment.getServiceName())
                .serviceDescription(payment.getServiceDescription())
                .serviceDate(payment.getServiceDate())
                .totalAmount(payment.getTotalAmount())
                .discountAmount(payment.getDiscountAmount())
                .finalAmount(payment.getFinalAmount())
                .paymentStatus(payment.getPaymentStatus())
                .paymentMethod(payment.getPaymentMethod())
                .paymentDate(payment.getPaymentDate())
                .notes(payment.getNotes())
                .processedByUserId(payment.getProcessedBy() != null ? payment.getProcessedBy().getId() : null)
                .processedByName(payment.getProcessedBy() != null ? payment.getProcessedBy().getFullName() : null)
                .createdAt(payment.getCreatedAt())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }
}
