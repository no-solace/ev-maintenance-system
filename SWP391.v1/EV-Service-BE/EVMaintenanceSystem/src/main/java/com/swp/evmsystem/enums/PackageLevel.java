package com.swp.evmsystem.enums;

public enum PackageLevel {
    LEVEL_1(1000),
    LEVEL_2(5000),
    LEVEL_3(10000);

    private final int kmInterval;

    PackageLevel(int kmInterval) {
        this.kmInterval = kmInterval;
    }

    public int getValue() {
        return kmInterval;
    }

    @Override
    public String toString() {
        return kmInterval + " km";
    }
}
