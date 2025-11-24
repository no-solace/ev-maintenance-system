package com.swp.evmsystem.constants;

public class BookingConstants {

    public static final long DEPOSIT_AMOUNT = 200000L;

    // Time limit for customer to complete payment after creating booking (in minutes)
    public static final int PAYMENT_TIMEOUT_MINUTES = 5;

    // Time window after appointment time that customer can still arrive (in minutes)
    public static final int HOLD_TIME_MINUTES = 15;

    // Minimum hours before appointment time to allow reschedule/cancellation
    public static final int MINIMUM_RESCHEDULE_HOURS = 4;

    public static final int SLOT_DURATION = 60;

    public static final int MINIMUM_ADVANCE_TIME = 45;

    public static final String DEPOSIT_POLICY =
            "Chúng tôi chỉ giữ chỗ cho bạn " + HOLD_TIME_MINUTES + " phút sau giờ hẹn. " +
                    "Nếu đến sau thời gian đó, chúng tôi không có trách nhiệm hoàn tiền đặt cọc.";

}
