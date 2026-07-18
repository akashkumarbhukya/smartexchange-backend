async function checkExchangeOptions(productPrefix) {
    try {
        // Calls our Spring Boot REST API endpoint
        const response = await fetch(`/api/exchange/options?productPrefix=${productPrefix}`);
        const data = await response.json();
        
        const exchangeSection = document.getElementById("exchange-section");
        const variantList = document.getElementById("variant-list");
        
        // Clear out any old items from previous clicks
        variantList.innerHTML = ""; 
        
        // Unhide the exchange UI container panel
        exchangeSection.classList.remove("hidden");

        // Loop through whatever variants our backend array found in stock
        data.forEach(variant => {
            const card = document.createElement("div");
            card.className = "variant-card";
            card.innerHTML = `
                <h4>Option: ${variant.color}</h4>
                <p>Size: <strong>${variant.size}</strong></p>
                <p style="color: green; font-size: 12px;">✔ Instantly Available</p>
                <button onclick="alert('Success! Ordered confirmation for SKU Swap: ${variant.sku}')" class="swap-btn">Select Swap</button>
            `;
            variantList.appendChild(card);
        });
    } catch (error) {
        console.error("Error communicating with exchange backend data portal:", error);
    }
}