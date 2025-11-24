package com.swp.evmsystem.enums;

import lombok.Getter;

@Getter
public enum OfferType {
    MAINTENANCE("Bảo dưỡng định kỳ", "Bảo dưỡng xe định kỳ theo km hoặc thời gian"),
    REPLACEMENT("Thay thế phụ tùng", "Thay thế các phụ tùng hư hỏng hoặc hết tuổi thọ"),
    REPAIR("Sửa chữa kỹ thuật", "Sửa chữa các vấn đề kỹ thuật và hư hỏng");

    private final String name;
    private final String description;

    OfferType(String name, String description) {
        this.name = name;
        this.description = description;
    }

}
