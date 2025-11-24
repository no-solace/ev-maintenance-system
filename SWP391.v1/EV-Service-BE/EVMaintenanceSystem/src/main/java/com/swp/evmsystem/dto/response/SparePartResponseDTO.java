package com.swp.evmsystem.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SparePartResponseDTO {
    Integer partId;
    String partName;
    String partNumber;
    String category;
    Double unitPrice;
    Integer stockQuantity;
    Integer minStockLevel;
    String supplier;
    String description;
    Boolean inStock;
    String status; // "in-stock" or "low" (stock status)
    String partStatus; // "ACTIVE", "DISABLED", "DISCONTINUED" (part lifecycle status)
}
