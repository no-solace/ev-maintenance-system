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
public class SparePartStatsDTO {
    Long totalParts;
    Long inStockCount;
    Long lowStockCount;
    Long outOfStockCount;
    Double totalInventoryValue;
}
