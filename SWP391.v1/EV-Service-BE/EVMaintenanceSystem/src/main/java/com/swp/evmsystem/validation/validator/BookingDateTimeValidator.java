package com.swp.evmsystem.validation.validator;

import com.swp.evmsystem.dto.request.BookingRequest;
import com.swp.evmsystem.validation.annotation.ValidBookingDateTime;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingDateTimeValidator implements ConstraintValidator<ValidBookingDateTime, BookingRequest> {
    @Override
    public boolean isValid(BookingRequest dto, ConstraintValidatorContext context) {
        if (dto.getBookingDate() == null || dto.getBookingTime() == null)
            return true;

        context.disableDefaultConstraintViolation();
        
        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime bookingDateTime = LocalDateTime.of(dto.getBookingDate(), dto.getBookingTime());
        
        // Check if booking date is in the past
        if(dto.getBookingDate().isBefore(today)) {
            context.buildConstraintViolationWithTemplate("Ngày đặt lịch phải nằm trong tương lai")
                    .addPropertyNode("bookingDate")
                    .addConstraintViolation();
            return false;
        }

        // Check if booking datetime is in the past
        if(bookingDateTime.isBefore(now)) {
            context.buildConstraintViolationWithTemplate("Thời gian đặt lịch phải nằm trong tương lai")
                    .addPropertyNode("bookingTime")
                    .addConstraintViolation();
            return false;
        }
        
        // Check if booking is at least 45 minutes from now
        LocalDateTime minimumBookingTime = now.plusMinutes(45);
        if(bookingDateTime.isBefore(minimumBookingTime)) {
            context.buildConstraintViolationWithTemplate("Lịch hẹn phải đặt trước ít nhất 45 phút")
                    .addPropertyNode("bookingTime")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}
