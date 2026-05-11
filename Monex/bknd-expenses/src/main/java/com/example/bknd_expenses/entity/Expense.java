package com.example.bknd_expenses.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "expenses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre del gasto
    @Column(nullable = false, length = 150)
    private String name;

    // ID de la categoría seleccionada
    @Column(nullable = false)
    private Long categoryId;

    // Nombre de la categoría seleccionada
    @Column(nullable = false, length = 100)
    private String categoryName;

    // Fecha del gasto
    @Column(nullable = false)
    private LocalDate date;

    // Monto del gasto
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    // Comisión asociada al gasto
    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal commission = BigDecimal.ZERO;

    // Método de pago
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    // Cantidad de cuotas
    @Column(nullable = false)
    @Builder.Default
    private Integer installments = 1;

    // ID del usuario autenticado
    @Column(nullable = false)
    private Long userId;
}