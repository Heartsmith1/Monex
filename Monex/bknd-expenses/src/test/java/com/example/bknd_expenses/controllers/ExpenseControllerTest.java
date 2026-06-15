package com.example.bknd_expenses.controllers;

import com.example.bknd_expenses.dto.ExpenseRequest;
import com.example.bknd_expenses.dto.ExpenseResponse;
import com.example.bknd_expenses.dto.MonthlyEstimateResponse;
import com.example.bknd_expenses.entity.PaymentMethod;
import com.example.bknd_expenses.service.ExpenseService;
import com.example.bknd_expenses.service.JwtService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ExpenseControllerTest {

        private MockMvc mockMvc;

        @Mock
        private ExpenseService expenseService;

        @Mock
        private JwtService jwtService;

        @InjectMocks
        private ExpenseController expenseController;

        @BeforeEach
        void setUp() {
                MockitoAnnotations.openMocks(this);
                mockMvc = MockMvcBuilders.standaloneSetup(expenseController).build();
        }

        private ExpenseResponse response() {
                return ExpenseResponse.builder()
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

        private String requestJson() {
                return """
                                {
                                "name": "Supermercado",
                                "categoryId": 1,
                                "categoryName": "Comida",
                                "date": "2026-06-14",
                                "amount": 50000,
                                "commission": 0,
                                "paymentMethod": "DEBITO",
                                "installments": 1
                                }
                                """;
        }

        @Test
        @DisplayName("GET /api/expenses retorna gastos")
        void getExpenses_ok() throws Exception {
                when(jwtService.getUserIdFromAuthorizationHeader("Bearer token")).thenReturn(10L);
                when(expenseService.getExpensesByFilters(eq(10L), isNull(), isNull(), isNull(), isNull()))
                                .thenReturn(List.of(response()));

                mockMvc.perform(get("/api/expenses")
                                .header("Authorization", "Bearer token"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].name").value("Supermercado"))
                                .andExpect(jsonPath("$[0].categoryName").value("Comida"));
        }

        @Test
        @DisplayName("GET /api/expenses/{id} retorna gasto")
        void getExpenseById_ok() throws Exception {
                when(jwtService.getUserIdFromAuthorizationHeader("Bearer token")).thenReturn(10L);
                when(expenseService.getExpenseById(1L, 10L)).thenReturn(response());

                mockMvc.perform(get("/api/expenses/1")
                                .header("Authorization", "Bearer token"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.id").value(1L))
                                .andExpect(jsonPath("$.name").value("Supermercado"));
        }

        @Test
        @DisplayName("POST /api/expenses crea gasto")
        void createExpense_ok() throws Exception {
                when(jwtService.getUserIdFromAuthorizationHeader("Bearer token")).thenReturn(10L);
                when(expenseService.createExpense(any(ExpenseRequest.class), eq(10L)))
                                .thenReturn(response());

                mockMvc.perform(post("/api/expenses")
                                .header("Authorization", "Bearer token")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson()))
                                .andExpect(status().isCreated())
                                .andExpect(jsonPath("$.name").value("Supermercado"))
                                .andExpect(jsonPath("$.paymentMethod").value("DEBITO"));
        }

        @Test
        @DisplayName("PUT /api/expenses/{id} actualiza gasto")
        void updateExpense_ok() throws Exception {
                when(jwtService.getUserIdFromAuthorizationHeader("Bearer token")).thenReturn(10L);
                when(expenseService.updateExpense(eq(1L), any(ExpenseRequest.class), eq(10L)))
                                .thenReturn(response());

                mockMvc.perform(put("/api/expenses/1")
                                .header("Authorization", "Bearer token")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(requestJson()))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").value("Supermercado"));
        }

        @Test
        @DisplayName("DELETE /api/expenses/{id} elimina gasto")
        void deleteExpense_ok() throws Exception {
                when(jwtService.getUserIdFromAuthorizationHeader("Bearer token")).thenReturn(10L);
                doNothing().when(expenseService).deleteExpense(1L, 10L);

                mockMvc.perform(delete("/api/expenses/1")
                                .header("Authorization", "Bearer token"))
                                .andExpect(status().isNoContent());
        }

        @Test
        @DisplayName("GET /api/expenses/monthly-estimate retorna estimación mensual")
        void calculateMonthlyEstimate_ok() throws Exception {
                when(jwtService.getUserIdFromAuthorizationHeader("Bearer token")).thenReturn(10L);
                when(expenseService.calculateMonthlyEstimate(10L))
                                .thenReturn(MonthlyEstimateResponse.builder()
                                                .totalMonthlyEstimate(new BigDecimal("40000.00"))
                                                .totalCreditExpenses(1L)
                                                .build());

                mockMvc.perform(get("/api/expenses/monthly-estimate")
                                .header("Authorization", "Bearer token"))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.totalMonthlyEstimate").value(40000.00))
                                .andExpect(jsonPath("$.totalCreditExpenses").value(1L));
        }

        @Test
        @DisplayName("GET /api/expenses retorna 401 si token es inválido")
        void getExpenses_tokenInvalido() throws Exception {
                when(jwtService.getUserIdFromAuthorizationHeader("Bearer token"))
                                .thenThrow(new IllegalArgumentException("Token invalido"));

                mockMvc.perform(get("/api/expenses")
                                .header("Authorization", "Bearer token"))
                                .andExpect(status().isUnauthorized())
                                .andExpect(content().string("Token invalido"));
        }
}