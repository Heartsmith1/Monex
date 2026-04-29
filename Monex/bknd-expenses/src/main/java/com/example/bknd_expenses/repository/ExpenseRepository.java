package com.example.bknd_expenses.repository;

import com.example.bknd_expenses.entity.Expense;
import com.example.bknd_expenses.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserId(Long userId);

    List<Expense> findByUserIdAndPaymentMethod(Long userId, PaymentMethod paymentMethod);

    List<Expense> findByUserIdAndCategoryId(Long userId, Long categoryId);

    List<Expense> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    List<Expense> findByUserIdAndCategoryIdAndDateBetween(
            Long userId,
            Long categoryId,
            LocalDate startDate,
            LocalDate endDate
    );

    List<Expense> findByUserIdAndPaymentMethodAndDateBetween(
            Long userId,
            PaymentMethod paymentMethod,
            LocalDate startDate,
            LocalDate endDate
    );

    List<Expense> findByUserIdAndPaymentMethodAndCategoryIdAndDateBetween(
            Long userId,
            PaymentMethod paymentMethod,
            Long categoryId,
            LocalDate startDate,
            LocalDate endDate
    );
}