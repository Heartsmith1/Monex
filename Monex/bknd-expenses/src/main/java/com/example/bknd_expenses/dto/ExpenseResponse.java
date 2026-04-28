package com.example.bknd_expenses.dto;

import com.example.bknd_expenses.entity.PaymentMethod;
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
    private Long categoryId;
    private LocalDate date;
    private LocalDate startDate;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private Integer installments;
    private Long userId;
}