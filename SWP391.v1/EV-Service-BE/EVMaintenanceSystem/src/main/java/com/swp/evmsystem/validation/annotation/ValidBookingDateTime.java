package com.swp.evmsystem.validation.annotation;

import com.swp.evmsystem.validation.validator.BookingDateTimeValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = BookingDateTimeValidator.class)
public @interface ValidBookingDateTime {
    String message() default "Thời điểm đặt lịch không hợp lệ";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}