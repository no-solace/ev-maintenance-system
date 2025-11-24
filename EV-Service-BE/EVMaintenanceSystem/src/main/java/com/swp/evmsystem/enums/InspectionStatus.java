package com.swp.evmsystem.enums;

public enum InspectionStatus {
    PENDING("Chưa thực hiện"),
    NORMAL("Bình thường"),
    ADJUST("Điều chỉnh"),
    REPLACE("Thay thế"),
    CLEAN("Vệ sinh"),
    LUBRICATE("Bôi trơn");

    private final String displayName;

    InspectionStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
