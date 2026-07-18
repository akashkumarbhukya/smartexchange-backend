package com.Flipkart.smartexchange_backend;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exchange")
@CrossOrigin(origins = "*") 
public class ExchangeController {

    // Mock Database catalog simulating your real product screenshots
    private final List<Variant> inventoryCatalog = List.of(
        // Shoes
        new Variant("CAMPUS-OG09-WHT8", "8", "White", 0), 
        new Variant("CAMPUS-OG09-WHT9", "9", "White", 4), 
        new Variant("CAMPUS-OG09-BLK8", "8", "Black", 2), 
        
        // Shirts
        new Variant("URBANICE-BRN-M", "M", "Brown", 5),
        new Variant("URBANICE-BLK-M", "M", "Black", 0),
        new Variant("URBANICE-BLU-L", "L", "Blue", 3),

        // Pants
        new Variant("FOXTER-BLK-XL", "XL", "Black", 12),
        
        // Lunch Box
        new Variant("FUSION-LBOX-BLU", "Large", "Blue", 7),
        new Variant("FUSION-LBOX-GRN", "Large", "Green", 1)
    );

    @GetMapping("/options")
    public List<Variant> getAvailableSwaps(@RequestParam String productPrefix) {
        // Industry Logic: Find variants matching the product brand prefix AND ensure they are in stock (> 0)
        return inventoryCatalog.stream()
            .filter(item -> item.getSku().startsWith(productPrefix.toUpperCase()))
            .filter(item -> item.getStockCount() > 0)
            .collect(Collectors.toList());
    }
}