package com.example.app.dto;

import com.example.app.model.ColorModel;
import com.example.app.model.ProductModel;
import com.example.app.model.SizeModel;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductDetailDto {
    @NotNull
    @NotBlank
    private String name;
    @NotNull
    @NotBlank
    private String code;
    @NotNull
    @Min(1)
    private float price;
    @NotNull
    @Min(1)
    private int quantity;
    @NotNull
    private int product;
    @NotNull
    private int color;
    @NotNull
    private int size;
    private MultipartFile file;
}

