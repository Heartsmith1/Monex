package com.example.Bknd_Categories.service;

import com.example.Bknd_Categories.dto.CategoryRequest;
import com.example.Bknd_Categories.dto.CategoryResponse;
import com.example.Bknd_Categories.entity.Category;
import com.example.Bknd_Categories.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> listAll() {
        return categoryRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse getById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Categoria no encontrada"));
        return toResponse(category);
    }

    @Transactional
    public CategoryResponse create(CategoryRequest request, Long userId) {
        String normalizedName = normalizeName(request.getName());

        if (categoryRepository.existsByNameIgnoreCase(normalizedName)) {
            throw new IllegalStateException("La categoria ya existe");
        }

        Category category = new Category();
        category.setName(normalizedName);
        category.setCreatedByUserId(userId);

        return toResponse(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category existing = categoryRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Categoria no encontrada"));

        String normalizedName = normalizeName(request.getName());
        categoryRepository.findByNameIgnoreCase(normalizedName)
                .filter(category -> !category.getId().equals(id))
                .ifPresent(category -> {
                    throw new IllegalStateException("La categoria ya existe");
                });

        existing.setName(normalizedName);
        return toResponse(categoryRepository.save(existing));
    }

    @Transactional
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new NoSuchElementException("Categoria no encontrada");
        }
        categoryRepository.deleteById(id);
    }

    private String normalizeName(String name) {
        return name == null ? "" : name.trim();
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getCreatedByUserId()
        );
    }
}
