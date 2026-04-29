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

    @Column(nullable = false, length = 150)
    private String description;

    // Idealmente viene desde el microservicio de categorías
    @Column(nullable = false)
    private Long categoryId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentMethod paymentMethod;

    // Por defecto 1 cuota. Efectivo y débito deberían usar 1.
    @Column(nullable = false)
    @Builder.Default
    private Integer installments = 1;

    // Fecha desde la cual comienza el cálculo de cuotas
    @Column(nullable = false)
    private LocalDate startDate;

    // ID del usuario autenticado obtenido desde el JWT
    @Column(nullable = false)
    private Long userId;
}