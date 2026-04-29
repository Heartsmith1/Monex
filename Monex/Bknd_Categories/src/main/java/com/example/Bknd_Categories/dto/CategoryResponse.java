package com.example.Bknd_Categories.dto;

public class CategoryResponse {

    private Long id;
    private String name;
    private Long createdByUserId;

    public CategoryResponse() {
    }

    public CategoryResponse(Long id, String name, Long createdByUserId) {
        this.id = id;
        this.name = name;
        this.createdByUserId = createdByUserId;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getCreatedByUserId() {
        return createdByUserId;
    }
}