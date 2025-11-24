package com.swp.evmsystem.service.implement;

import com.swp.evmsystem.entity.BookingEntity;
import com.swp.evmsystem.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    public void sendOTPEmail(String toEmail, String otpCode) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("🔐 Mã OTP Đặt Lại Mật Khẩu - EV Service");
        
        String htmlContent = buildOTPEmailContent(otpCode);
        helper.setText(htmlContent, true);
        
        mailSender.send(message);
    }
    //mau hien thi gui otp qua mai
    private String buildOTPEmailContent(String otpCode) {
        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%);
                        border-radius: 15px;
                        overflow: hidden;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    }
                    .header {
                        background-color: rgba(255,255,255,0.1);
                        padding: 30px;
                        text-align: center;
                    }
                    .header h1 {
                        color: white;
                        margin: 0;
                        font-size: 28px;
                        font-weight: 600;
                    }
                    .content {
                        background-color: white;
                        padding: 40px 30px;
                    }
                    .otp-box {
                        background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%);
                        border-radius: 10px;
                        padding: 25px;
                        text-align: center;
                        margin: 30px 0;
                    }
                    .otp-code {
                        font-size: 42px;
                        font-weight: bold;
                        letter-spacing: 8px;
                        color: white;
                        margin: 10px 0;
                        font-family: 'Courier New', monospace;
                    }
                    .otp-label {
                        color: rgba(255,255,255,0.9);
                        font-size: 14px;
                        margin-bottom: 10px;
                    }
                    .message {
                        color: #333;
                        line-height: 1.8;
                        margin: 20px 0;
                    }
                    .warning {
                        background-color: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 15px;
                        margin: 20px 0;
                        border-radius: 5px;
                    }
                    .warning p {
                        margin: 5px 0;
                        color: #856404;
                    }
                    .footer {
                        background-color: #f8f9fa;
                        padding: 20px;
                        text-align: center;
                        color: #6c757d;
                        font-size: 12px;
                    }
                    .icon {
                        font-size: 50px;
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="icon">🚗</div>
                        <h1>EV Service System</h1>
                    </div>
                    <div class="content">
                        <h2 style="color: #333; margin-top: 0;">Xin chào! 👋</h2>
                        <p class="message">
                            Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. 
                            Vui lòng sử dụng mã OTP bên dưới để xác nhận:
                        </p>
                        
                        <div class="otp-box">
                            <div class="otp-label">MÃ OTP CỦA BẠN</div>
                            <div class="otp-code">%s</div>
                        </div>
                        
                        <div class="warning">
                            <p><strong>⚠️ Lưu ý quan trọng:</strong></p>
                            <p>• Mã OTP này chỉ có hiệu lực trong <strong>5 phút</strong></p>
                            <p>• Không chia sẻ mã này với bất kỳ ai</p>
                            <p>• Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</p>
                        </div>
                        
                        <p class="message">
                            Nếu bạn gặp bất kỳ vấn đề gì, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.
                        </p>
                    </div>
                    <div class="footer">
                        <p>© 2025 EV Service System. All rights reserved.</p>
                        <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(otpCode);
    }
    
    @Override
    public void sendBookingReceiptEmail(BookingEntity booking) throws MessagingException {
        if (booking.getCustomerEmail() == null || booking.getCustomerEmail().isBlank()) {
            log.warn("⚠️ Cannot send booking receipt: no email for booking ID {}", booking.getBookingId());
            return; // Skip if no email
        }
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(booking.getCustomerEmail());
            helper.setSubject("📧 Biên nhận đặt lịch dịch vụ VinFast - #" + booking.getBookingId());
            
            String htmlContent = buildBookingReceiptEmailContent(booking);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            log.info("✅ Booking receipt email sent to: {} for booking ID: {}", 
                    booking.getCustomerEmail(), booking.getBookingId());
        } catch (Exception e) {
            log.error("❌ Failed to send booking receipt email: {}", e.getMessage(), e);
            throw e;
        }
    }
    
    private String buildBookingReceiptEmailContent(BookingEntity booking) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
        
        String bookingDate = booking.getBookingDate() != null 
                ? booking.getBookingDate().format(dateFormatter) : "N/A";
        String bookingTime = booking.getBookingTime() != null 
                ? booking.getBookingTime().format(timeFormatter) : "N/A";
        
        String centerName = booking.getCenter() != null ? booking.getCenter().getCenterName() : "N/A";
        String centerAddress = booking.getCenter() != null && booking.getCenter().getCenterAddress() != null
                ? booking.getCenter().getCenterAddress().toString() : "N/A";
        String centerPhone = booking.getCenter() != null ? booking.getCenter().getCenterPhone() : "N/A";
        
        String vehicleModel = booking.getVehicle() != null ? booking.getVehicle().getModel().toString() : "N/A";
        String licensePlate = booking.getVehicle() != null ? booking.getVehicle().getLicensePlate() : "N/A";
        
        return """
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                        line-height: 1.6;
                    }
                    .container {
                        max-width: 650px;
                        margin: 40px auto;
                        background: white;
                        border-radius: 15px;
                        overflow: hidden;
                        box-shadow: 0 10px 40px rgba(0,0,0,0.1);
                    }
                    .header {
                        background: linear-gradient(135deg, #027C9D 0%%, #80D3EF 100%%);
                        padding: 40px 30px;
                        text-align: center;
                        color: white;
                    }
                    .header h1 {
                        margin: 10px 0 5px 0;
                        font-size: 28px;
                        font-weight: 600;
                    }
                    .header .subtitle {
                        font-size: 16px;
                        opacity: 0.95;
                    }
                    .content {
                        padding: 40px 30px;
                    }
                    .success-badge {
                        background: linear-gradient(135deg, #10b981 0%%, #059669 100%%);
                        color: white;
                        padding: 15px 25px;
                        border-radius: 10px;
                        text-align: center;
                        margin: 20px 0;
                        font-size: 18px;
                        font-weight: 600;
                    }
                    .booking-id {
                        text-align: center;
                        font-size: 24px;
                        font-weight: bold;
                        color: #027C9D;
                        margin: 20px 0;
                        letter-spacing: 1px;
                    }
                    .section {
                        margin: 30px 0;
                        padding: 20px;
                        background-color: #f8f9fa;
                        border-radius: 10px;
                        border-left: 4px solid #027C9D;
                    }
                    .section h3 {
                        margin-top: 0;
                        color: #027C9D;
                        font-size: 18px;
                        margin-bottom: 15px;
                    }
                    .info-row {
                        display: flex;
                        justify-content: space-between;
                        padding: 10px 0;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                    }
                    .info-label {
                        color: #666;
                        font-weight: 500;
                    }
                    .info-value {
                        color: #333;
                        font-weight: 600;
                        text-align: right;
                    }
                    .important-note {
                        background-color: #fff3cd;
                        border-left: 4px solid #ffc107;
                        padding: 15px;
                        margin: 25px 0;
                        border-radius: 5px;
                    }
                    .important-note h4 {
                        margin-top: 0;
                        color: #856404;
                        font-size: 16px;
                    }
                    .important-note ul {
                        margin: 10px 0;
                        padding-left: 20px;
                    }
                    .important-note li {
                        color: #856404;
                        margin: 5px 0;
                    }
                    .footer {
                        background-color: #f8f9fa;
                        padding: 30px;
                        text-align: center;
                        color: #6c757d;
                        font-size: 13px;
                    }
                    .footer strong {
                        color: #495057;
                    }
                    .icon {
                        font-size: 60px;
                        margin-bottom: 10px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="icon">🚗</div>
                        <h1>VinFast EV Service</h1>
                        <div class="subtitle">Dịch vụ bảo dưỡng xe điện chuyên nghiệp</div>
                    </div>
                    
                    <div class="content">
                        <div class="success-badge">
                            ✅ Đặt lịch thành công!
                        </div>
                        
                        <div class="booking-id">
                            Mã đặt lịch: #%s
                        </div>
                        
                        <p style="text-align: center; color: #666;">
                            Xin chào <strong>%s</strong>,<br>
                            Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!
                        </p>
                        
                        <!-- Thông tin dịch vụ -->
                        <div class="section">
                            <h3>📅 Thông tin lịch hẹn</h3>
                            <div class="info-row">
                                <span class="info-label">Ngày hẹn:</span>
                                <span class="info-value">%s</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Giờ hẹn:</span>
                                <span class="info-value">%s</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Trung tâm:</span>
                                <span class="info-value">%s</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Địa chỉ:</span>
                                <span class="info-value">%s</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Hotline:</span>
                                <span class="info-value">%s</span>
                            </div>
                        </div>
                        
                        <!-- Thông tin xe -->
                        <div class="section">
                            <h3>🚙 Thông tin xe</h3>
                            <div class="info-row">
                                <span class="info-label">Loại xe:</span>
                                <span class="info-value">VinFast %s</span>
                            </div>
                            <div class="info-row">
                                <span class="info-label">Biển số:</span>
                                <span class="info-value">%s</span>
                            </div>
                        </div>
                        
                        <!-- Lưu ý quan trọng -->
                        <div class="important-note">
                            <h4>⚠️ Lưu ý quan trọng</h4>
                            <ul>
                                <li>Vui lòng đến <strong>đúng giờ đã hẹn</strong></li>
                                <li>Mang theo <strong>giấy tờ xe và CMND/CCCD</strong></li>
                                <li>Nếu không thể đến, vui lòng thông báo trước <strong>24 giờ</strong></li>
                                <li>Liên hệ hotline nếu cần hỗ trợ: <strong>%s</strong></li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p><strong>📞 Liên hệ hỗ trợ</strong></p>
                        <p>Email: %s</p>
                        <p>Hotline: %s</p>
                        <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                            © 2025 VinFast EV Service System. All rights reserved.<br>
                            Email này được gửi tự động, vui lòng không trả lời.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(
                booking.getBookingId(),
                booking.getCustomerName(),
                bookingDate,
                bookingTime,
                centerName,
                centerAddress,
                centerPhone,
                vehicleModel,
                licensePlate,
                centerPhone,
                fromEmail,
                centerPhone
            );
    }
}
