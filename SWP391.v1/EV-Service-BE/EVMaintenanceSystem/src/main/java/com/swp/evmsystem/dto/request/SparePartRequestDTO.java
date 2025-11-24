package com.swp.evmsystem.dto.request;

import com.swp.evmsystem.enums.PartCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SparePartRequestDTO {
    @NotBlank(message = "Part name is required")
    String partName;
    
    String partNumber;
    
    @NotNull(message = "Category is required")
    PartCategory category;
    
    @NotNull(message = "Unit price is required")
    @Min(value = 0, message = "Unit price must be positive")
    Double unitPrice;
    
    @NotNull(message = "Stock quantity is required")
    @Min(value = 0, message = "Stock quantity must be non-negative")
    Integer stockQuantity;
    
    @Min(value = 0, message = "Minimum stock level must be non-negative")
    Integer minStockLevel;
    
    String supplier;
    
    String description;
    
    // Center ID - optional for admin (null = available for all centers)
    // Required for staff (will be auto-set to their center)
    Integer centerId;
}
