package com.example.bknd_expenses.service;

import com.example.bknd_expenses.dto.ExpenseRequest;
import com.example.bknd_expenses.dto.ExpenseResponse;
import com.example.bknd_expenses.dto.MonthlyEstimateResponse;
import com.example.bknd_expenses.entity.Expense;
import com.example.bknd_expenses.entity.PaymentMethod;
import com.example.bknd_expenses.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.Normalizer;
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
                .name(request.getName().trim())
                .categoryId(request.getCategoryId())
                .categoryName(request.getCategoryName().trim())
                .date(request.getDate())
                .amount(request.getAmount())
                .commission(normalizeCommission(request.getCommission()))
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
        return mapToResponse(getExpenseOwnedByUser(id, userId));
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
        validateDateRange(startDate, endDate);

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

        if (hasDates) {
            validateDateRange(startDate, endDate);
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

    public Page<ExpenseResponse> getExpensesByFiltersPaged(
            Long userId,
            Long categoryId,
            String paymentMethod,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable
    ) {
        boolean hasCategory = categoryId != null;
        boolean hasPaymentMethod = paymentMethod != null && !paymentMethod.isBlank();
        boolean hasDates = startDate != null && endDate != null;

        if ((startDate == null) != (endDate == null)) {
            throw new IllegalArgumentException("Debe enviar fecha de inicio y fecha de término");
        }

        if (hasDates) {
            validateDateRange(startDate, endDate);
        }

        PaymentMethod method = hasPaymentMethod ? normalizePaymentMethod(paymentMethod) : null;

        Page<Expense> expenses;

        if (hasCategory && hasPaymentMethod && hasDates) {
            expenses = expenseRepository.findByUserIdAndPaymentMethodAndCategoryIdAndDateBetween(
                    userId, method, categoryId, startDate, endDate, pageable
            );
        } else if (hasCategory && hasDates) {
            expenses = expenseRepository.findByUserIdAndCategoryIdAndDateBetween(
                    userId, categoryId, startDate, endDate, pageable
            );
        } else if (hasPaymentMethod && hasDates) {
            expenses = expenseRepository.findByUserIdAndPaymentMethodAndDateBetween(
                    userId, method, startDate, endDate, pageable
            );
        } else if (hasCategory) {
            expenses = expenseRepository.findByUserIdAndCategoryId(userId, categoryId, pageable);
        } else if (hasPaymentMethod) {
            expenses = expenseRepository.findByUserIdAndPaymentMethod(userId, method, pageable);
        } else if (hasDates) {
            expenses = expenseRepository.findByUserIdAndDateBetween(userId, startDate, endDate, pageable);
        } else {
            expenses = expenseRepository.findByUserId(userId, pageable);
        }

        return expenses.map(this::mapToResponse);
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, Long userId) {
        validateRequest(request);

        Expense expense = getExpenseOwnedByUser(id, userId);

        PaymentMethod paymentMethod = normalizePaymentMethod(request.getPaymentMethod());
        Integer installments = normalizeInstallments(paymentMethod, request.getInstallments());

        expense.setName(request.getName().trim());
        expense.setCategoryId(request.getCategoryId());
        expense.setCategoryName(request.getCategoryName().trim());
        expense.setDate(request.getDate());
        expense.setAmount(request.getAmount());
        expense.setCommission(normalizeCommission(request.getCommission()));
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
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }

        if (request.getCategoryId() == null) {
            throw new IllegalArgumentException("La categoría es obligatoria");
        }

        if (request.getCategoryName() == null || request.getCategoryName().isBlank()) {
            throw new IllegalArgumentException("El nombre de la categoría es obligatorio");
        }

        if (request.getDate() == null) {
            throw new IllegalArgumentException("La fecha es obligatoria");
        }

        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("El monto debe ser mayor a 0");
        }

        if (request.getCommission() != null && request.getCommission().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("La comisión no puede ser negativa");
        }

        if (request.getPaymentMethod() == null || request.getPaymentMethod().isBlank()) {
            throw new IllegalArgumentException("El método de pago es obligatorio");
        }
    }

    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (startDate == null || endDate == null) {
            throw new IllegalArgumentException("La fecha de inicio y término son obligatorias");
        }

        if (startDate.isAfter(endDate)) {
            throw new IllegalArgumentException("La fecha de inicio no puede ser posterior a la fecha de término");
        }
    }

    private PaymentMethod normalizePaymentMethod(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.isBlank()) {
            throw new IllegalArgumentException("El método de pago es obligatorio");
        }

        String normalized = Normalizer.normalize(paymentMethod.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toUpperCase();

        try {
            return PaymentMethod.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Método de pago inválido. Use: EFECTIVO, DEBITO o CREDITO");
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

    private BigDecimal normalizeCommission(BigDecimal commission) {
        return commission != null ? commission : BigDecimal.ZERO;
    }

    private boolean isInstallmentActiveInMonth(Expense expense, YearMonth targetMonth) {
        LocalDate startDate = expense.getDate();

        if (startDate == null || expense.getInstallments() == null) {
            return false;
        }

        YearMonth startMonth = YearMonth.from(startDate);
        YearMonth endMonth = startMonth.plusMonths(expense.getInstallments() - 1);

        return !targetMonth.isBefore(startMonth) && !targetMonth.isAfter(endMonth);
    }

    private BigDecimal calculateMonthlyInstallmentAmount(Expense expense) {
        BigDecimal commission = expense.getCommission() != null ? expense.getCommission() : BigDecimal.ZERO;
        BigDecimal commissionAmount = expense.getAmount()
            .multiply(commission)
            .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = expense.getAmount().add(commissionAmount);

        if (expense.getInstallments() == null || expense.getInstallments() <= 1) {
            return totalAmount;
        }

        return totalAmount.divide(
                BigDecimal.valueOf(expense.getInstallments()),
                2,
                RoundingMode.HALF_UP
        );
    }

    private ExpenseResponse mapToResponse(Expense expense) {
        return ExpenseResponse.builder()
                .id(expense.getId())
                .name(expense.getName())
                .categoryId(expense.getCategoryId())
                .categoryName(expense.getCategoryName())
                .date(expense.getDate())
                .amount(expense.getAmount())
                .commission(expense.getCommission())
                .paymentMethod(expense.getPaymentMethod())
                .installments(expense.getInstallments())
                .userId(expense.getUserId())
                .build();
    }
}