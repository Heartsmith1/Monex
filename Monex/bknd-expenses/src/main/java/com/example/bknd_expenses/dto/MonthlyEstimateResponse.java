package com.example.bknd_expenses.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyEstimateResponse {

    private BigDecimal totalMonthlyEstimate;
    private Integer totalCreditExpenses;
}