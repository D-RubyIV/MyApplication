package com.example.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(name = "categoríes")
public class CategoryModel extends BaseModel{
    @NotNull
    @NotBlank
    private String name;
    @NotNull
    @NotBlank
    private String code;
}
