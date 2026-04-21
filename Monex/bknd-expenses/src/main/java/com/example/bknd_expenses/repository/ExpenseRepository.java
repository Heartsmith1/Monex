package com.example.bknd_expenses.repository;

import com.example.bknd_expenses.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserId(Long userId);

    List<Expense> findByUserIdAndPaymentMethod(Long userId, String paymentMethod);

    List<Expense> findByUserIdAndCategory(Long userId, String category);
}