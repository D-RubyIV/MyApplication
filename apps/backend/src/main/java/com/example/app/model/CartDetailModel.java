package com.example.app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "cart_details")
public class CartDetailModel extends BaseModel{
    @ManyToOne
    @JoinColumn(name = "product_id")
    private ProductDetailModel productDetail;
    private int quantity;
    @ManyToOne
    @JoinColumn(name = "cart_id")
    private CartModel cart;
}
