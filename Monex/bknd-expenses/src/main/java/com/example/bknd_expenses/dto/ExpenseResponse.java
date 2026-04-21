package com.example.bknd_expenses.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseResponse {

    private Long id;
    private String description;
    private String category;
    private LocalDate date;
    private BigDecimal amount;
    private String paymentMethod;
    private Integer installments;
    private Long userId;
}