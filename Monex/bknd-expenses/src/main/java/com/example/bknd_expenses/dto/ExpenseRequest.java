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

    @NotBlank(message = "La descripción es obligatoria")
    @Size(max = 150, message = "La descripción no puede superar los 150 caracteres")
    private String description;

    @NotBlank(message = "La categoría es obligatoria")
    @Size(max = 100, message = "La categoría no puede superar los 100 caracteres")
    private String category;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate date;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal amount;

    @NotBlank(message = "El medio de pago es obligatorio")
    private String paymentMethod;

    @NotNull(message = "Las cuotas son obligatorias")
    @Min(value = 1, message = "Las cuotas deben ser al menos 1")
    private Integer installments;
}