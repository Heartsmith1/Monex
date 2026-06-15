package com.example.bknd_expenses.repository;

import com.example.bknd_expenses.entity.Expense;
import com.example.bknd_expenses.entity.PaymentMethod;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ExpenseRepositoryTest {

    @Autowired
    private ExpenseRepository expenseRepository;

    private Expense crearExpense(Long userId, Long categoryId, PaymentMethod paymentMethod, LocalDate date) {
        Expense expense = Expense.builder()
                .name("Compra " + System.currentTimeMillis())
                .categoryId(categoryId)
                .categoryName("Categoria")
                .date(date)
                .amount(new BigDecimal("10000"))
                .commission(BigDecimal.ZERO)
                .paymentMethod(paymentMethod)
                .installments(1)
                .userId(userId)
                .build();

        return expenseRepository.save(expense);
    }

    @Test
    @DisplayName("findByUserId: debe retornar gastos del usuario")
    void findByUserId_ok() {
        Long userId = System.currentTimeMillis();

        crearExpense(userId, 1L, PaymentMethod.DEBITO, LocalDate.now());

        List<Expense> result = expenseRepository.findByUserId(userId);

        assertFalse(result.isEmpty());
        assertEquals(userId, result.get(0).getUserId());
    }

    @Test
    @DisplayName("findByUserIdAndPaymentMethod: debe filtrar por método de pago")
    void findByUserIdAndPaymentMethod_ok() {
        Long userId = System.currentTimeMillis();

        crearExpense(userId, 1L, PaymentMethod.CREDITO, LocalDate.now());
        crearExpense(userId, 1L, PaymentMethod.DEBITO, LocalDate.now());

        List<Expense> result = expenseRepository.findByUserIdAndPaymentMethod(userId, PaymentMethod.CREDITO);

        assertEquals(1, result.size());
        assertEquals(PaymentMethod.CREDITO, result.get(0).getPaymentMethod());
    }

    @Test
    @DisplayName("findByUserIdAndCategoryId: debe filtrar por categoría")
    void findByUserIdAndCategoryId_ok() {
        Long userId = System.currentTimeMillis();

        crearExpense(userId, 10L, PaymentMethod.DEBITO, LocalDate.now());
        crearExpense(userId, 20L, PaymentMethod.DEBITO, LocalDate.now());

        List<Expense> result = expenseRepository.findByUserIdAndCategoryId(userId, 10L);

        assertEquals(1, result.size());
        assertEquals(10L, result.get(0).getCategoryId());
    }

    @Test
    @DisplayName("findByUserIdAndDateBetween: debe filtrar por rango de fechas")
    void findByUserIdAndDateBetween_ok() {
        Long userId = System.currentTimeMillis();

        crearExpense(userId, 1L, PaymentMethod.DEBITO, LocalDate.of(2026, 6, 10));

        List<Expense> result = expenseRepository.findByUserIdAndDateBetween(
                userId,
                LocalDate.of(2026, 6, 1),
                LocalDate.of(2026, 6, 30)
        );

        assertEquals(1, result.size());
    }

    @Test
    @DisplayName("filtro completo: usuario, método, categoría y fechas")
    void filtroCompleto_ok() {
        Long userId = System.currentTimeMillis();

        crearExpense(userId, 99L, PaymentMethod.CREDITO, LocalDate.of(2026, 6, 15));

        List<Expense> result = expenseRepository.findByUserIdAndPaymentMethodAndCategoryIdAndDateBetween(
                userId,
                PaymentMethod.CREDITO,
                99L,
                LocalDate.of(2026, 6, 1),
                LocalDate.of(2026, 6, 30)
        );

        assertEquals(1, result.size());
        assertEquals(99L, result.get(0).getCategoryId());
        assertEquals(PaymentMethod.CREDITO, result.get(0).getPaymentMethod());
    }
}