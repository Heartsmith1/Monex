package com.example.Bknd_Categories.controllers;

import com.example.Bknd_Categories.dto.CategoryRequest;
import com.example.Bknd_Categories.dto.CategoryResponse;
import com.example.Bknd_Categories.service.CategoryService;
import com.example.Bknd_Categories.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/categorias")
@Tag(name = "Categorias", description = "CRUD de categorias")
public class CategoryController {

    private final CategoryService categoryService;
    private final JwtService jwtService;

    public CategoryController(CategoryService categoryService, JwtService jwtService) {
        this.categoryService = categoryService;
        this.jwtService = jwtService;
    }

    @Operation(summary = "Listar categorias")
    @GetMapping
    public ResponseEntity<List<CategoryResponse>> listAll() {
        return ResponseEntity.ok(categoryService.listAll());
    }

    @Operation(summary = "Obtener categoria por ID")
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(categoryService.getById(id));
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Crear categoria", security = {@SecurityRequirement(name = "bearerAuth")})
    @PostMapping
    public ResponseEntity<?> create(
            @Valid @RequestBody CategoryRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            Long userId = jwtService.getUserIdFromAuthorizationHeader(authHeader);
            CategoryResponse created = categoryService.create(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        } catch (IllegalStateException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @Operation(summary = "Actualizar categoria", security = {@SecurityRequirement(name = "bearerAuth")})
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request,
            @RequestHeader("Authorization") String authHeader) {
        try {
            jwtService.getUserIdFromAuthorizationHeader(authHeader);
            CategoryResponse updated = categoryService.update(id, request);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @Operation(summary = "Eliminar categoria", security = {@SecurityRequirement(name = "bearerAuth")})
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authHeader) {
        try {
            jwtService.getUserIdFromAuthorizationHeader(authHeader);
            categoryService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
        } catch (NoSuchElementException ex) {
            return ResponseEntity.notFound().build();
        }
    }
}
