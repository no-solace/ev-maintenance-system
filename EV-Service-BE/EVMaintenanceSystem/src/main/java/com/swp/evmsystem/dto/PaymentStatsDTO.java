package com.swp.evmsystem.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentStatsDTO {
    private Long totalPayments;
    private Long pendingCount;
    private Long paidCount;
    private Long completedCount;
    private Double totalRevenue;
    private Double pendingAmount;
    private Double collectedAmount;
}
