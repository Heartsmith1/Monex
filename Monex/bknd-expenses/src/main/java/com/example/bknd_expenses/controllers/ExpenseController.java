package com.example.bknd_expenses.controllers;

import com.example.bknd_expenses.dto.ExpenseRequest;
import com.example.bknd_expenses.dto.ExpenseResponse;
import com.example.bknd_expenses.dto.MonthlyEstimateResponse;
import com.example.bknd_expenses.service.ExpenseService;
import com.example.bknd_expenses.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@Tag(name = "Gastos", description = "CRUD de gastos")
public class ExpenseController {

    private final ExpenseService expenseService;
    private final JwtService jwtService;

    public ExpenseController(ExpenseService expenseService, JwtService jwtService) {
        this.expenseService = expenseService;
        this.jwtService = jwtService;
    }

    @Operation(summary = "Listar gastos", security = {@SecurityRequirement(name = "bearerAuth")})
    @GetMapping
    public ResponseEntity<?> getExpensesByUser(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtService.getUserIdFromAuthorizationHeader(authHeader);
            List<ExpenseResponse> expenses = expenseService.getExpensesByUser(userId);
            return ResponseEntity.ok(expenses);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        }
    }

    @Operation(summary = "Obtener gasto por ID", security = {@SecurityRequirement(name = "bearerAuth")})
    @GetMapping("/{id}")
    public ResponseEntity<?> getExpenseById(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtService.getUserIdFromAuthorizationHeader(authHeader);
            ExpenseResponse expense = expenseService.getExpenseById(id, userId);
            return ResponseEntity.ok(expense);
        } catch (IllegalArgumentException ex) {
            String message = ex.getMessage();
            if ("Token invalido".equals(message) || "El token no contiene userId valido".equals(message)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message);
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        }
    }

    @Operation(summary = "Crear gasto", security = {@SecurityRequirement(name = "bearerAuth")})
    @PostMapping
    public ResponseEntity<?> createExpense(
            @Valid @RequestBody ExpenseRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtService.getUserIdFromAuthorizationHeader(authHeader);
            ExpenseResponse response = expenseService.createExpense(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException ex) {
            String message = ex.getMessage();
            if ("Token invalido".equals(message) || "El token no contiene userId valido".equals(message)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message);
            }
            return ResponseEntity.badRequest().body(message);
        } catch (IllegalStateException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @Operation(summary = "Actualizar gasto", security = {@SecurityRequirement(name = "bearerAuth")})
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtService.getUserIdFromAuthorizationHeader(authHeader);
            ExpenseResponse updatedExpense = expenseService.updateExpense(id, request, userId);
            return ResponseEntity.ok(updatedExpense);
        } catch (IllegalArgumentException ex) {
            String message = ex.getMessage();
            if ("Token invalido".equals(message) || "El token no contiene userId valido".equals(message)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message);
            }
            return ResponseEntity.badRequest().body(message);
        } catch (IllegalStateException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @Operation(summary = "Eliminar gasto", security = {@SecurityRequirement(name = "bearerAuth")})
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtService.getUserIdFromAuthorizationHeader(authHeader);
            expenseService.deleteExpense(id, userId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            String message = ex.getMessage();
            if ("Token invalido".equals(message) || "El token no contiene userId valido".equals(message)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message);
            }
            return ResponseEntity.badRequest().body(message);
        }
    }

    @Operation(summary = "Filtrar gastos por medio de pago", security = {@SecurityRequirement(name = "bearerAuth")})
    @GetMapping("/payment-method/{paymentMethod}")
    public ResponseEntity<?> getExpensesByPaymentMethod(
            @PathVariable String paymentMethod,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtService.getUserIdFromAuthorizationHeader(authHeader);
            List<ExpenseResponse> expenses = expenseService.getExpensesByPaymentMethod(userId, paymentMethod);
            return ResponseEntity.ok(expenses);
        } catch (IllegalArgumentException ex) {
            String message = ex.getMessage();
            if ("Token invalido".equals(message) || "El token no contiene userId valido".equals(message)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message);
            }
            return ResponseEntity.badRequest().body(message);
        }
    }

    @Operation(summary = "Filtrar gastos por categoría", security = {@SecurityRequirement(name = "bearerAuth")})
    @GetMapping("/category/{category}")
    public ResponseEntity<?> getExpensesByCategory(
            @PathVariable String category,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtService.getUserIdFromAuthorizationHeader(authHeader);
            List<ExpenseResponse> expenses = expenseService.getExpensesByCategory(userId, category);
            return ResponseEntity.ok(expenses);
        } catch (IllegalArgumentException ex) {
            String message = ex.getMessage();
            if ("Token invalido".equals(message) || "El token no contiene userId valido".equals(message)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message);
            }
            return ResponseEntity.badRequest().body(message);
        }
    }

    @Operation(summary = "Calcular estimación mensual", security = {@SecurityRequirement(name = "bearerAuth")})
    @GetMapping("/monthly-estimate")
    public ResponseEntity<?> calculateMonthlyEstimate(
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtService.getUserIdFromAuthorizationHeader(authHeader);
            MonthlyEstimateResponse response = expenseService.calculateMonthlyEstimate(userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            String message = ex.getMessage();
            if ("Token invalido".equals(message) || "El token no contiene userId valido".equals(message)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(message);
            }
            return ResponseEntity.badRequest().body(message);
        }
    }
}