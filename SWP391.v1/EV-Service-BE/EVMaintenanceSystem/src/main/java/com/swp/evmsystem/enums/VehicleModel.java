package com.swp.evmsystem.enums;

public enum VehicleModel {
    KLARA_S("Klara S"),
    FELIZ_S("Feliz S"),
    VENTO_S("Vento S"),
    THEON_S("Theon S"),
    EVO_200("Evo 200"),
    EVO_200_LITE("Evo 200 Lite"),
    IMPES("Impes"),
    LUDO("Ludo"),
    KLARA_A2("Klara A2");

    private final String name;

    VehicleModel(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
