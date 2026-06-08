package com.example.bknd_expenses.repository;

import com.example.bknd_expenses.entity.Expense;
import com.example.bknd_expenses.entity.PaymentMethod;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

        List<Expense> findByUserId(Long userId);

        Page<Expense> findByUserId(Long userId, Pageable pageable);

        List<Expense> findByUserIdAndPaymentMethod(Long userId, PaymentMethod paymentMethod);

        Page<Expense> findByUserIdAndPaymentMethod(
                        Long userId,
                        PaymentMethod paymentMethod,
                        Pageable pageable);

        List<Expense> findByUserIdAndCategoryId(Long userId, Long categoryId);

        Page<Expense> findByUserIdAndCategoryId(
                        Long userId,
                        Long categoryId,
                        Pageable pageable);

        List<Expense> findByUserIdAndDateBetween(
                        Long userId,
                        LocalDate startDate,
                        LocalDate endDate);

        Page<Expense> findByUserIdAndDateBetween(
                        Long userId,
                        LocalDate startDate,
                        LocalDate endDate,
                        Pageable pageable);

        List<Expense> findByUserIdAndCategoryIdAndDateBetween(
                        Long userId,
                        Long categoryId,
                        LocalDate startDate,
                        LocalDate endDate);

        Page<Expense> findByUserIdAndCategoryIdAndDateBetween(
                        Long userId,
                        Long categoryId,
                        LocalDate startDate,
                        LocalDate endDate,
                        Pageable pageable);

        List<Expense> findByUserIdAndPaymentMethodAndDateBetween(
                        Long userId,
                        PaymentMethod paymentMethod,
                        LocalDate startDate,
                        LocalDate endDate);

        Page<Expense> findByUserIdAndPaymentMethodAndDateBetween(
                        Long userId,
                        PaymentMethod paymentMethod,
                        LocalDate startDate,
                        LocalDate endDate,
                        Pageable pageable);

        List<Expense> findByUserIdAndPaymentMethodAndCategoryIdAndDateBetween(
                        Long userId,
                        PaymentMethod paymentMethod,
                        Long categoryId,
                        LocalDate startDate,
                        LocalDate endDate);

        Page<Expense> findByUserIdAndPaymentMethodAndCategoryIdAndDateBetween(
                        Long userId,
                        PaymentMethod paymentMethod,
                        Long categoryId,
                        LocalDate startDate,
                        LocalDate endDate,
                        Pageable pageable);
}