package com.swp.evmsystem.enums;

public enum KmInterval {
    ONE_THOUSAND(1000),
    FIVE_THOUSAND(5000),
    TEN_THOUSAND(10000);

    private final int value;

    KmInterval(int value) {
        this.value = value;
    }


    public int getValue() {
        return value;
    }

    @Override
    public String toString() {
        return value + " km";
    }
}
