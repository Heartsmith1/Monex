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
    private String name;
    private Long categoryId;
    private String categoryName;
    private LocalDate date;
    private BigDecimal amount;
    private BigDecimal commission;
    private PaymentMethod paymentMethod;
    private Integer installments;
    private Long userId;
}