package com.example.bknd_expenses.service;

import com.example.bknd_expenses.dto.ExpenseRequest;
import com.example.bknd_expenses.dto.ExpenseResponse;
import com.example.bknd_expenses.dto.MonthlyEstimateResponse;
import com.example.bknd_expenses.entity.Expense;
import com.example.bknd_expenses.entity.PaymentMethod;
import com.example.bknd_expenses.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseResponse createExpense(ExpenseRequest request, Long userId) {
        validateRequest(request);

        PaymentMethod paymentMethod = normalizePaymentMethod(request.getPaymentMethod());
        Integer installments = normalizeInstallments(paymentMethod, request.getInstallments());

        Expense expense = Expense.builder()
                .description(request.getDescription().trim())
                .categoryId(request.getCategoryId())
                .date(request.getDate())
                .startDate(request.getStartDate() != null ? request.getStartDate() : request.getDate())
                .amount(request.getAmount())
                .paymentMethod(paymentMethod)
                .installments(installments)
                .userId(userId)
                .build();

        return mapToResponse(expenseRepository.save(expense));
    }

    public List<ExpenseResponse> getExpensesByUser(Long userId) {
        return expenseRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ExpenseResponse getExpenseById(Long id, Long userId) {
        Expense expense = getExpenseOwnedByUser(id, userId);
        return mapToResponse(expense);
    }

    public List<ExpenseResponse> getExpensesByPaymentMethod(Long userId, String paymentMethod) {
        PaymentMethod method = normalizePaymentMethod(paymentMethod);

        return expenseRepository.findByUserIdAndPaymentMethod(userId, method)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ExpenseResponse> getExpensesByCategory(Long userId, Long categoryId) {
        return expenseRepository.findByUserIdAndCategoryId(userId, categoryId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ExpenseResponse> getExpensesByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("La fecha de inicio y término son obligatorias");
        }

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha de término");
        }

        return expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<ExpenseResponse> getExpensesByFilters(
            Long userId,
            Long categoryId,
            String paymentMethod,
            LocalDate startDate,
            LocalDate endDate
    ) {
        boolean hasCategory = categoryId != null;
        boolean hasPaymentMethod = paymentMethod != null && !paymentMethod.isBlank();
        boolean hasDates = startDate != null && endDate != null;

        if ((startDate == null) != (endDate == null)) {
            throw new IllegalArgumentException("Debe enviar fecha de inicio y fecha de término");
        }

        if (hasDates && startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha de término");
        }

        PaymentMethod method = hasPaymentMethod ? normalizePaymentMethod(paymentMethod) : null;

        List<Expense> expenses;

        if (hasCategory && hasPaymentMethod && hasDates) {
            expenses = expenseRepository.findByUserIdAndPaymentMethodAndCategoryIdAndDateBetween(
                    userId, method, categoryId, startDate, endDate
            );
        } else if (hasCategory && hasDates) {
            expenses = expenseRepository.findByUserIdAndCategoryIdAndDateBetween(
                    userId, categoryId, startDate, endDate
            );
        } else if (hasPaymentMethod && hasDates) {
            expenses = expenseRepository.findByUserIdAndPaymentMethodAndDateBetween(
                    userId, method, startDate, endDate
            );
        } else if (hasCategory) {
            expenses = expenseRepository.findByUserIdAndCategoryId(userId, categoryId);
        } else if (hasPaymentMethod) {
            expenses = expenseRepository.findByUserIdAndPaymentMethod(userId, method);
        } else if (hasDates) {
            expenses = expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        } else {
            expenses = expenseRepository.findByUserId(userId);
        }

        return expenses.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, Long userId) {
        validateRequest(request);

        Expense expense = getExpenseOwnedByUser(id, userId);

        PaymentMethod paymentMethod = normalizePaymentMethod(request.getPaymentMethod());
        Integer installments = normalizeInstallments(paymentMethod, request.getInstallments());

        expense.setDescription(request.getDescription().trim());
        expense.setCategoryId(request.getCategoryId());
        expense.setDate(request.getDate());
        expense.setStartDate(request.getStartDate() != null ? request.getStartDate() : request.getDate());
        expense.setAmount(request.getAmount());
        expense.setPaymentMethod(paymentMethod);
        expense.setInstallments(installments);

        return mapToResponse(expenseRepository.save(expense));
    }

    public void deleteExpense(Long id, Long userId) {
        Expense expense = getExpenseOwnedByUser(id, userId);
        expenseRepository.delete(expense);
    }

    public MonthlyEstimateResponse calculateMonthlyEstimate(Long userId) {
        YearMonth currentMonth = YearMonth.now();

        List<Expense> creditExpenses = expenseRepository.findByUserIdAndPaymentMethod(
                userId,
                PaymentMethod.CREDITO
        );

        BigDecimal totalEstimate = creditExpenses.stream()
                .filter(expense -> isInstallmentActiveInMonth(expense, currentMonth))
                .map(this::calculateMonthlyInstallmentAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalCreditExpenses = creditExpenses.stream()
                .filter(expense -> isInstallmentActiveInMonth(expense, currentMonth))
                .count();

        return MonthlyEstimateResponse.builder()
                .totalMonthlyEstimate(totalEstimate)
                .totalCreditExpenses(totalCreditExpenses)
                .build();
    }

    private Expense getExpenseOwnedByUser(Long id, Long userId) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Gasto no encontrado"));

        if (!expense.getUserId().equals(userId)) {
            throw new IllegalArgumentException("No tienes permiso para acceder a este gasto");
        }

        return expense;
    }

    private void validateRequest(ExpenseRequest request) {
        if (request.getDescription() == null || request.getDescription().isBlank()) {
            throw new IllegalArgumentException("La descripción es obligatoria");
        }

        if (request.getCategoryId() == null) {
            throw new IllegalArgumentException("La categoría es obligatoria");
        }

        if (request.getDate() == null) {
            throw new IllegalArgumentException("La fecha es obligatoria");
        }

        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a 0");
        }

        if (request.getPaymentMethod() == null || request.getPaymentMethod().isBlank()) {
            throw new IllegalArgumentException("El medio de pago es obligatorio");
        }
    }

    private PaymentMethod normalizePaymentMethod(String paymentMethod) {
        if (paymentMethod == null) {
            throw new IllegalArgumentException("El medio de pago es obligatorio");
        }

        String normalized = paymentMethod.trim().toUpperCase();

        try {
            return PaymentMethod.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Medio de pago inválido. Use: EFECTIVO, DEBITO o CREDITO");
        }
    }

    private Integer normalizeInstallments(PaymentMethod paymentMethod, Integer installments) {
        if (paymentMethod != PaymentMethod.CREDITO) {
            return 1;
        }

        if (installments == null || installments < 1) {
            throw new IllegalArgumentException("Las cuotas deben ser al menos 1 para pagos con crédito");
        }

        return installments;
    }

    private boolean isInstallmentActiveInMonth(Expense expense, YearMonth targetMonth) {
        LocalDate startDate = expense.getStartDate() != null ? expense.getStartDate() : expense.getDate();

        if (startDate == null || expense.getInstallments() == null) {
            return false;
        }

        YearMonth startMonth = YearMonth.from(startDate);
        YearMonth endMonth = startMonth.plusMonths(expense.getInstallments() - 1);

        return !targetMonth.isBefore(startMonth) && !targetMonth.isAfter(endMonth);
    }

    private BigDecimal calculateMonthlyInstallmentAmount(Expense expense) {
        if (expense.getInstallments() == null || expense.getInstallments() <= 1) {
            return expense.getAmount();
        }

        return expense.getAmount().divide(
                BigDecimal.valueOf(expense.getInstallments()),
                2,
                RoundingMode.HALF_UP
        );
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .description(expense.getDescription())
                .categoryId(expense.getCategoryId())
                .date(expense.getDate())
                .startDate(expense.getStartDate())
                .amount(expense.getAmount())
                .paymentMethod(expense.getPaymentMethod())
                .installments(expense.getInstallments())
                .userId(expense.getUserId())
                .build();
    }
}