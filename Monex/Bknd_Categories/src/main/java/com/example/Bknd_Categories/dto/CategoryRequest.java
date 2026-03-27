package com.example.Bknd_Categories.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryRequest {

    @NotBlank(message = "El nombre de la categoria es obligatorio")
    @Size(max = 120, message = "El nombre no puede superar 120 caracteres")
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
