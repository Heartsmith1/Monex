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

    @NotNull(message = "La categoría es obligatoria")
    private Long categoryId;

    @NotNull(message = "La fecha es obligatoria")
    private LocalDate date;

    // Opcional: si no viene, se usa date en el service
    private LocalDate startDate;

    @NotNull(message = "El monto es obligatorio")
    @DecimalMin(value = "0.01", message = "El monto debe ser mayor a 0")
    private BigDecimal amount;

    @NotBlank(message = "El medio de pago es obligatorio")
    private String paymentMethod;

    // Opcional → el service decide si es 1 o más
    private Integer installments;
}