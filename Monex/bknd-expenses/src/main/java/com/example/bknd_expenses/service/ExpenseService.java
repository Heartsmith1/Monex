package com.example.bknd_expenses.service;

import com.example.bknd_expenses.dto.ExpenseRequest;
import com.example.bknd_expenses.dto.ExpenseResponse;
import com.example.bknd_expenses.dto.MonthlyEstimateResponse;
import com.example.bknd_expenses.entity.Expense;
import com.example.bknd_expenses.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseResponse createExpense(ExpenseRequest request, Long userId) {
        Expense expense = Expense.builder()
                .description(request.getDescription())
                .category(request.getCategory())
                .date(request.getDate())
                .amount(request.getAmount())
                .paymentMethod(normalizePaymentMethod(request.getPaymentMethod()))
                .installments(normalizeInstallments(request.getPaymentMethod(), request.getInstallments()))
                .userId(userId)
                .build();

        Expense savedExpense = expenseRepository.save(expense);
        return mapToResponse(savedExpense);
    }

    public List<ExpenseResponse> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ExpenseResponse getExpenseById(Long id, Long userId) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Gasto no encontrado"));

        if (!expense.getUserId().equals(userId)) {
            throw new IllegalArgumentException("No tienes permiso para acceder a este gasto");
        }

        return mapToResponse(expense);
    }

    public List<ExpenseResponse> getExpensesByPaymentMethod(Long userId, String paymentMethod) {
        return expenseRepository.findByUserIdAndPaymentMethod(userId, normalizePaymentMethod(paymentMethod))
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ExpenseResponse> getExpensesByCategory(Long userId, String category) {
        return expenseRepository.findByUserIdAndCategory(userId, category)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, Long userId) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Gasto no encontrado"));

        if (!expense.getUserId().equals(userId)) {
            throw new IllegalArgumentException("No tienes permiso para modificar este gasto");
        }

        expense.setDescription(request.getDescription());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setAmount(request.getAmount());
        expense.setPaymentMethod(normalizePaymentMethod(request.getPaymentMethod()));
        expense.setInstallments(normalizeInstallments(request.getPaymentMethod(), request.getInstallments()));

        Expense updatedExpense = expenseRepository.save(expense);
        return mapToResponse(updatedExpense);
    }

    public void deleteExpense(Long id, Long userId) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Gasto no encontrado"));

        if (!expense.getUserId().equals(userId)) {
            throw new IllegalArgumentException("No tienes permiso para eliminar este gasto");
        }

        expenseRepository.delete(expense);
    }

    public MonthlyEstimateResponse calculateMonthlyEstimate(Long userId) {
        List<Expense> userExpenses = expenseRepository.findByUserId(userId);

        LocalDate now = LocalDate.now();

        List<Expense> creditExpenses = userExpenses.stream()
                .filter(expense -> "credito".equalsIgnoreCase(expense.getPaymentMethod()))
                .filter(expense -> expense.getDate() != null
                        && expense.getDate().getMonthValue() == now.getMonthValue()
                        && expense.getDate().getYear() == now.getYear())
                .toList();

        BigDecimal totalEstimate = creditExpenses.stream()
                .map(expense -> {
                    if (expense.getInstallments() == null || expense.getInstallments() <= 1) {
                        return expense.getAmount();
                    }
                    return expense.getAmount().divide(
                            BigDecimal.valueOf(expense.getInstallments()),
                            2,
                            java.math.RoundingMode.HALF_UP);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return MonthlyEstimateResponse.builder()
                .totalMonthlyEstimate(totalEstimate)
                .totalCreditExpenses(creditExpenses.size())
                .build();
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .description(expense.getDescription())
                .category(expense.getCategory())
                .date(expense.getDate())
                .amount(expense.getAmount())
                .paymentMethod(expense.getPaymentMethod())
                .installments(expense.getInstallments())
                .userId(expense.getUserId())
                .build();
    }

    private String normalizePaymentMethod(String paymentMethod) {
        if (paymentMethod == null) {
            throw new IllegalArgumentException("El medio de pago es obligatorio");
        }

        String normalized = paymentMethod.trim().toLowerCase();

        if (!normalized.equals("efectivo") &&
                !normalized.equals("debito") &&
                !normalized.equals("credito")) {
            throw new IllegalArgumentException("Medio de pago invalido. Use: efectivo, debito o credito");
        }

        return normalized;
    }

    private Integer normalizeInstallments(String paymentMethod, Integer installments) {
        String normalizedMethod = normalizePaymentMethod(paymentMethod);

        if (!normalizedMethod.equals("credito")) {
            return 1;
        }

        if (installments == null || installments < 1) {
            throw new IllegalArgumentException("Las cuotas deben ser al menos 1 para pagos con credito");
        }

        return installments;
    }
}