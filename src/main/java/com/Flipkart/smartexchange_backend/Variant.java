package com.Flipkart.smartexchange_backend;

public class Variant {
    private String sku;       
    private String size;      
    private String color;     
    private int stockCount;   

    public Variant(String sku, String size, String color, int stockCount) {
        this.sku = sku;
        this.size = size;
        this.color = color;
        this.stockCount = stockCount;
    }

    // Getters
    public String getSku() { return sku; }
    public String getSize() { return size; }
    public String getColor() { return color; }
    public int getStockCount() { return stockCount; }
}