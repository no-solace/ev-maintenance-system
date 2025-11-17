package com.swp.evmsystem.validation.validator;

import com.swp.evmsystem.validation.annotation.ValidUsername;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class UsernameValidator implements ConstraintValidator<ValidUsername, String> {
    private static final Pattern EMAIL_PATTERN =
            Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");

    private static final Pattern PHONE_PATTERN =
            Pattern.compile("^(0|84)\\d{9}$"); // ví dụ: 0xxxxxxxxx hoặc 84xxxxxxxxx (10 số)

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return false;
        }
        return EMAIL_PATTERN.matcher(value).matches() ||
                PHONE_PATTERN.matcher(value).matches();
    }
}
