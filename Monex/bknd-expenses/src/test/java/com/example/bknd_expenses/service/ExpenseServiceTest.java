package com.example.bknd_expenses.service;

import com.example.bknd_expenses.dto.ExpenseRequest;
import com.example.bknd_expenses.dto.ExpenseResponse;
import com.example.bknd_expenses.dto.MonthlyEstimateResponse;
import com.example.bknd_expenses.entity.Expense;
import com.example.bknd_expenses.entity.PaymentMethod;
import com.example.bknd_expenses.repository.ExpenseRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @InjectMocks
    private ExpenseService expenseService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private ExpenseRequest crearRequest() {
        return ExpenseRequest.builder()
                .name("Supermercado")
                .categoryId(1L)
                .categoryName("Comida")
                .date(LocalDate.now())
                .amount(new BigDecimal("50000"))
                .commission(BigDecimal.ZERO)
                .paymentMethod("DEBITO")
                .installments(1)
                .build();
    }

    private Expense crearExpense() {
        return Expense.builder()
                .id(1L)
                .name("Supermercado")
                .categoryId(1L)
                .categoryName("Comida")
                .date(LocalDate.now())
                .amount(new BigDecimal("50000"))
                .commission(BigDecimal.ZERO)
                .paymentMethod(PaymentMethod.DEBITO)
                .installments(1)
                .userId(10L)
                .build();
    }

    @Test
    @DisplayName("createExpense: debe crear gasto correctamente")
    void createExpense_ok() {
        ExpenseRequest request = crearRequest();

        when(expenseRepository.save(any(Expense.class)))
                .thenAnswer(inv -> {
                    Expense expense = inv.getArgument(0);
                    expense.setId(1L);
                    return expense;
                });

        ExpenseResponse result = expenseService.createExpense(request, 10L);

        assertEquals(1L, result.getId());
        assertEquals("Supermercado", result.getName());
        assertEquals(1L, result.getCategoryId());
        assertEquals("Comida", result.getCategoryName());
        assertEquals(new BigDecimal("50000"), result.getAmount());
        assertEquals(PaymentMethod.DEBITO, result.getPaymentMethod());
        assertEquals(1, result.getInstallments());
        assertEquals(10L, result.getUserId());

        verify(expenseRepository).save(any(Expense.class));
    }

    @Test
    @DisplayName("createExpense: debe lanzar error si nombre está vacío")
    void createExpense_nombreVacio() {
        ExpenseRequest request = crearRequest();
        request.setName("   ");

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> expenseService.createExpense(request, 10L)
        );

        assertEquals("El nombre es obligatorio", ex.getMessage());
        verify(expenseRepository, never()).save(any(Expense.class));
    }

    @Test
    @DisplayName("createExpense: debe lanzar error si monto es menor o igual a cero")
    void createExpense_montoInvalido() {
        ExpenseRequest request = crearRequest();
        request.setAmount(BigDecimal.ZERO);

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> expenseService.createExpense(request, 10L)
        );

        assertEquals("El monto debe ser mayor a 0", ex.getMessage());
        verify(expenseRepository, never()).save(any(Expense.class));
    }

    @Test
    @DisplayName("getExpensesByUser: debe retornar gastos del usuario")
    void getExpensesByUser_ok() {
        Expense expense = crearExpense();

        when(expenseRepository.findByUserId(10L))
                .thenReturn(List.of(expense));

        List<ExpenseResponse> result = expenseService.getExpensesByUser(10L);

        assertEquals(1, result.size());
        assertEquals("Supermercado", result.get(0).getName());
        assertEquals(10L, result.get(0).getUserId());

        verify(expenseRepository).findByUserId(10L);
    }

    @Test
    @DisplayName("getExpenseById: debe retornar gasto si pertenece al usuario")
    void getExpenseById_ok() {
        Expense expense = crearExpense();

        when(expenseRepository.findById(1L))
                .thenReturn(Optional.of(expense));

        ExpenseResponse result = expenseService.getExpenseById(1L, 10L);

        assertEquals(1L, result.getId());
        assertEquals("Supermercado", result.getName());
        assertEquals(10L, result.getUserId());

        verify(expenseRepository).findById(1L);
    }

    @Test
    @DisplayName("getExpenseById: debe lanzar error si gasto pertenece a otro usuario")
    void getExpenseById_sinPermiso() {
        Expense expense = crearExpense();
        expense.setUserId(99L);

        when(expenseRepository.findById(1L))
                .thenReturn(Optional.of(expense));

        IllegalArgumentException ex = assertThrows(
                IllegalArgumentException.class,
                () -> expenseService.getExpenseById(1L, 10L)
        );

        assertEquals("No tienes permiso para acceder a este gasto", ex.getMessage());
    }

    @Test
    @DisplayName("updateExpense: debe actualizar gasto existente")
    void updateExpense_ok() {
        Expense existing = crearExpense();

        ExpenseRequest request = crearRequest();
        request.setName("Farmacia");
        request.setCategoryName("Salud");
        request.setPaymentMethod("EFECTIVO");

        when(expenseRepository.findById(1L))
                .thenReturn(Optional.of(existing));

        when(expenseRepository.save(any(Expense.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        ExpenseResponse result = expenseService.updateExpense(1L, request, 10L);

        assertEquals("Farmacia", result.getName());
        assertEquals("Salud", result.getCategoryName());
        assertEquals(PaymentMethod.EFECTIVO, result.getPaymentMethod());
        assertEquals(1, result.getInstallments());

        verify(expenseRepository).save(existing);
    }

    @Test
    @DisplayName("deleteExpense: debe eliminar gasto existente")
    void deleteExpense_ok() {
        Expense expense = crearExpense();

        when(expenseRepository.findById(1L))
                .thenReturn(Optional.of(expense));

        expenseService.deleteExpense(1L, 10L);

        verify(expenseRepository).delete(expense);
    }

    @Test
    @DisplayName("calculateMonthlyEstimate: debe calcular cuotas de crédito del mes")
    void calculateMonthlyEstimate_ok() {
        Expense creditExpense = Expense.builder()
                .id(1L)
                .name("Notebook")
                .categoryId(2L)
                .categoryName("Tecnología")
                .date(LocalDate.now())
                .amount(new BigDecimal("120000"))
                .commission(BigDecimal.ZERO)
                .paymentMethod(PaymentMethod.CREDITO)
                .installments(3)
                .userId(10L)
                .build();

        when(expenseRepository.findByUserIdAndPaymentMethod(10L, PaymentMethod.CREDITO))
                .thenReturn(List.of(creditExpense));

        MonthlyEstimateResponse result = expenseService.calculateMonthlyEstimate(10L);

        assertEquals(new BigDecimal("40000.00"), result.getTotalMonthlyEstimate());
        assertEquals(1L, result.getTotalCreditExpenses());

        verify(expenseRepository).findByUserIdAndPaymentMethod(10L, PaymentMethod.CREDITO);
    }
}