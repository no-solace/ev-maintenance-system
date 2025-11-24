package com.swp.evmsystem.enums;


import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum InspectionCategory {
    BATTERY("Pin & Hệ thống điện"),
    MOTOR("Động cơ & truyền động"),
    BRAKE_SUSPENSION("Phanh & Hệ thống treo"),
    WHEELS_TIRES("Bánh xe & lốp"),
    FRAME_BODY("Khung & thân xe"),
    CONTROLS_SAFETY("Hệ thống điều khiển & an toàn");

    @Getter
    private final String displayName;

    @Override
    public String toString() {
        return displayName;
    }
}
