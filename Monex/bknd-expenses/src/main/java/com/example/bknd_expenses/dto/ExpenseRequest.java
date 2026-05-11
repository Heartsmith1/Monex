package com.example.bknd_expenses.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExpenseRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150, message = "El nombre no puede superar los 150 caracteres")
    private String name;

    @NotNull(message = "La categoría es obligatoria")
    private Long categoryId;

    @NotBlank(message = "El nombre de la categoría es obligatorio")
    private String categoryName;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate date;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal amount;

    @DecimalMin(value = "0.00", message = "La comisión no puede ser negativa")
    @Builder.Default
    private BigDecimal commission = BigDecimal.ZERO;

    @NotBlank(message = "El método de pago es obligatorio")
    private String paymentMethod;

    @Min(value = 1, message = "Las cuotas deben ser mínimo 1")
    @Builder.Default
    private Integer installments = 1;
}