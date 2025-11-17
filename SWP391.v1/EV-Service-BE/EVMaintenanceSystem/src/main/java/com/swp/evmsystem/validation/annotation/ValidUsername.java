package com.swp.evmsystem.validation.annotation;

import com.swp.evmsystem.validation.validator.UsernameValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UsernameValidator.class)
@Documented
public @interface ValidUsername {
    String message() default "Username phải là email hoặc số điện thoại";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
