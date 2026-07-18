package Flipkart.smartexchange_backend;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/exchange")
@CrossOrigin(origins = "*") 
public class ExchangeController {

    // Simple Java Record to pass parameters cleanly
    public record PriceCheckRequest(String productId, String selectedSize) {}
    public record PriceResponse(int finalPrice, boolean premiumApplied, String message) {}

    @GetMapping("/products/{id}")
    public Map<String, Object> getProductSpecs(@PathVariable String id) {
        Map<String, Object> response = new HashMap<>();
        
        // Corrected standard Java Map syntax
        if ("CAMPUS".equalsIgnoreCase(id)) {
            response.put("basePrice", 810);
            response.put("title", "asian Carnival-02 Mens High Top Casual Chunky Sneakers");
        } else if ("URBANICE".equalsIgnoreCase(id)) {
            response.put("basePrice", 283);
            response.put("title", "Kachhot Men Regular Fit Self Design Spread Collar Shirt");
        } else {
            response.put("basePrice", 543);
            response.put("title", "Urbano Fashion Men Slim Fit Pure Cotton Trousers");
        }
        return response;
    }

    @PostMapping("/calculate-price")
    public PriceResponse evaluateExchangePremium(@RequestBody PriceCheckRequest request) {
        int basePrice = 0;
        
        if ("CAMPUS".equalsIgnoreCase(request.productId())) {
            basePrice = 810;
            try {
                int size = Integer.parseInt(request.selectedSize());
                if (size > 8) {
                    return new PriceResponse(basePrice + 50, true, "+ ₹50 Size Premium Applied");
                }
            } catch (NumberFormatException e) {
                // Safe fallback check for non-numeric sizes
            }
        } else if ("URBANICE".equalsIgnoreCase(request.productId())) {
            basePrice = 283;
        } else {
            basePrice = 543;
        }

        return new PriceResponse(basePrice, false, "");
    }
}