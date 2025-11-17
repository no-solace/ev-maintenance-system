package com.swp.evmsystem.constants;

public class AuthMessages {
    public static final String OTP_SENT_SUCCESS =
            "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.";

    public static final String OTP_VALID =
            "Mã OTP hợp lệ. Bạn có thể đặt lại mật khẩu.";

    public static final String OTP_INVALID =
            "Mã OTP không hợp lệ hoặc đã hết hạn.";

    public static final String PASSWORD_RESET_SUCCESS =
            "Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.";

    public static final String EMAIL_SEND_ERROR =
            "Không thể gửi email. Vui lòng thử lại sau.";

    public static final String GENERIC_ERROR =
            "Đã xảy ra lỗi. Vui lòng thử lại.";

    private AuthMessages() {
        // Prevent instantiation
    }
}
