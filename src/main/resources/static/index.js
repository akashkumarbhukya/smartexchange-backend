// Local item configuration architecture mapping to your local assets setup
const orderHistoryData = [
    {
        id: "CAMPUS", 
        title: "asian Carnival-02 Mens High Top Casual Chunky Sneakers High Tops For Men",
        variant: "Color: FULL WHITE | Size: 8",
        price: 810,
        seller: "ASIAN Brand Store",
        status: "Delivered on Thu, Jul 16",
        img: "shoe_1.jpg", 
        currentSize: "8",
        currentColor: "FULL WHITE",
        availableSizes: ["6", "7", "8", "9", "10"],
        availableColors: [
            { name: "FULL WHITE", img: "shoe_1.jpg" },        
            { name: "BLACK RED", img: "shoe_2.jpg" }, 
            { name: "NAVY WHITE", img: "shoe_3.jpg" }
        ]
    },
    {
        id: "URBANICE", 
        title: "Kachhot Men Regular Fit Self Design Spread Collar Casual Shirt",
        variant: "Selected Color: Black | Size: M",
        price: 283,
        seller: "KACHHOT Retail",
        status: "Delivered on Fri, Jul 17",
        img: "shirt_1.jpg", 
        currentSize: "M",
        currentColor: "Black",
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        availableColors: [
            { name: "Black", img: "shirt_1.jpg" },        
            { name: "White Stripe", img: "shirt_2.jpg" }, 
            { name: "Graphic Black 1", img: "shirt_3.jpg" },
            { name: "Dark Green", img: "shirt_4.jpg" }     
        ]
    },
    {
        id: "FOXTER", 
        title: "Urbano Fashion Men Slim Fit Pure Cotton Trousers",
        variant: "Selected Color: Grey | Size: 32",
        price: 543,
        seller: "URBANO RETAIL",
        status: "Delivered on Sun, Jul 12",
        img: "pant_1.jpg", 
        currentSize: "32",
        currentColor: "Grey",
        availableSizes: ["28", "30", "32", "34", "36", "38", "40"],
        availableColors: [
            { name: "Grey", img: "pant_1.jpg" },         
            { name: "Cream", img: "pant_2.jpg" },         
            { name: "Pista Green", img: "pant_3.jpg" }, 
            { name: "Peacock Green", img: "pant_4.jpg" }                              
        ]
    }
];

let globalActiveProductId = null;
let selectedExchangeSize = null;
let selectedExchangeColor = null;
let currentComputedPrice = 0;
let baseUpchargePremiumCost = 0; 

function showPage(pageId) {
    document.querySelectorAll('.view-panel').forEach(view => view.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

function buildOrdersDashboard() {
    const listContainer = document.getElementById("orders-injection-list");
    if (!listContainer) return;
    listContainer.innerHTML = ""; 

    orderHistoryData.forEach(item => {
        const cardNode = document.createElement("div");
        cardNode.className = "order-row-card";
        cardNode.onclick = () => launchDetailedView(item.id);
        cardNode.innerHTML = `
            <div class="item-meta-flex">
                <img src="${item.img}" alt="Thumbnail" class="product-thumbnail">
                <div class="title-block">
                    <h4>${item.title}</h4>
                    <p class="variant-txt">${item.variant}</p>
                </div>
            </div>
            <div class="card-price">₹${item.price}</div>
            <div class="delivery-status-indicator">
                <span class="status-green">● ${item.status}</span>
                <span class="status-sub">Your item has been delivered safely.</span>
            </div>
        `;
        listContainer.appendChild(cardNode);
    });
}

function launchDetailedView(productId) {
    const matchedRecord = orderHistoryData.find(o => o.id === productId);
    if (!matchedRecord) return;

    globalActiveProductId = productId;
    document.getElementById("detail-title").innerText = matchedRecord.title;
    document.getElementById("detail-meta").innerText = matchedRecord.variant;
    document.getElementById("detail-seller").innerText = `Seller: ${matchedRecord.seller}`;
    document.getElementById("detail-price").innerText = `₹${matchedRecord.price}`;
    document.getElementById("detail-img").src = matchedRecord.img;

    showPage("order-details-page");
}

function openExchangeVariantWorkspace() {
    const item = orderHistoryData.find(o => o.id === globalActiveProductId);
    if (!item) return;

    selectedExchangeSize = item.currentSize;
    selectedExchangeColor = item.currentColor;
    currentComputedPrice = item.price;
    baseUpchargePremiumCost = 0;

    document.getElementById("exchange-pane-title").innerText = item.title;
    document.getElementById("exchange-pane-price").innerText = `₹${item.price}`;
    document.getElementById("exchange-pane-img").src = item.img;
    document.getElementById("current-color-label").innerText = item.currentColor;
    document.getElementById("price-alert-tag").style.display = "none";

    const colorContainer = document.getElementById("color-options-container");
    colorContainer.innerHTML = "";
    item.availableColors.forEach(color => {
        const imgChip = document.createElement("img");
        imgChip.src = color.img;
        imgChip.className = `thumb-chip ${color.name === selectedExchangeColor ? 'selected' : ''}`;
        imgChip.onclick = () => {
            document.querySelectorAll(".thumb-chip").forEach(c => c.classList.remove("selected"));
            imgChip.classList.add("selected");
            selectedExchangeColor = color.name;
            document.getElementById("current-color-label").innerText = color.name;
            document.getElementById("exchange-pane-img").src = color.img;
        };
        colorContainer.appendChild(imgChip);
    });

    const sizeContainer = document.getElementById("size-options-container");
    sizeContainer.innerHTML = "";
    item.availableSizes.forEach(size => {
        const chip = document.createElement("div");
        chip.className = `chip-opt ${size === selectedExchangeSize ? 'selected' : ''}`;
        chip.innerText = size;
        chip.onclick = () => {
            document.querySelectorAll(".chip-opt").forEach(c => c.classList.remove("selected"));
            chip.classList.add("selected");
            selectedExchangeSize = size;
            evaluateDynamicPriceRules(item);
        };
        sizeContainer.appendChild(chip);
    });

    showPage("exchange-variant-page");
}

function evaluateDynamicPriceRules(item) {
    const priceTextNode = document.getElementById("exchange-pane-price");
    const alertBox = document.getElementById("price-alert-tag");

    if (item.id === "CAMPUS" && parseInt(selectedExchangeSize, 10) > 8) {
        baseUpchargePremiumCost = 50;
        currentComputedPrice = item.price + baseUpchargePremiumCost;
        priceTextNode.innerText = `₹${currentComputedPrice}`;
        alertBox.innerText = "+ ₹50 Size Premium Applied";
        alertBox.style.display = "inline-block";
    } else {
        baseUpchargePremiumCost = 0;
        currentComputedPrice = item.price;
        priceTextNode.innerText = `₹${item.price}`;
        alertBox.style.display = "none";
    }
}

// Redirect Routing Logic based on premium upcharge values
function finalizeExchangeTransaction() {
    const item = orderHistoryData.find(o => o.id === globalActiveProductId);
    
    if (selectedExchangeSize === item.currentSize && selectedExchangeColor === item.currentColor) {
        alert("Please select a different variation configuration option to process an exchange request.");
        return;
    }

    // Direct conditional jump: If an extra charge exists, route straight into payments panel layout
    if (baseUpchargePremiumCost > 0) {
        launchPaymentGatewayWorkspace();
    } else {
        routeStraightToTimelineTrackingPage();
    }
}

// Initialize and project total payable mappings inside Payment Gateway layout views
function launchPaymentGatewayWorkspace() {
    // Reset selection interface states
    document.getElementById("cod-radio-input").checked = false;
    document.getElementById("cod-action-drawer").classList.remove("open");

    // Compute final breakdown tallies (Base Premium + 9 Handling + 9 Platform - 20 Coupon)
    const overallPayableAmountValue = baseUpchargePremiumCost + 9 + 9 - 20;

    document.getElementById("pay-base-premium").innerText = `₹${baseUpchargePremiumCost}`;
    document.getElementById("pay-total-payable").innerText = `₹${overallPayableAmountValue}`;

    showPage("payment-gateway-page");
}

// Triggers accordion drop-down window pane uncollapsing
function toggleCashOnDeliveryCheckoutPanel() {
    document.getElementById("cod-radio-input").checked = true;
    const drawer = document.getElementById("cod-action-drawer");
    drawer.classList.add("open");
}

// Completes payment steps and maps horizontal tracker graph details
function executeOrderFinalizationFromPaymentGateway() {
    routeStraightToTimelineTrackingPage();
}

// Internal worker to construct visual horizontal progression tracker view nodes
function routeStraightToTimelineTrackingPage() {
    const item = orderHistoryData.find(o => o.id === globalActiveProductId);

    document.getElementById("track-product-title").innerText = item.title;
    document.getElementById("track-product-desc").innerText = `Color: ${selectedExchangeColor} | Size: ${selectedExchangeSize}`;
    document.getElementById("track-product-price").innerText = `₹${currentComputedPrice}`;
    document.getElementById("track-product-img").src = document.getElementById("exchange-pane-img").src;

    const randomSuffix = Math.floor(100000000 + Math.random() * 900000000);
    document.getElementById("breadcrumb-id").innerText = `003270${randomSuffix}`;

    const premiumBadge = document.getElementById("track-upcharge-badge");
    if (baseUpchargePremiumCost > 0) {
        premiumBadge.innerText = `₹${baseUpchargePremiumCost} Size Upcharge Included`;
        premiumBadge.style.display = "inline-block";
    } else {
        premiumBadge.style.display = "none";
    }

    showPage("exchange-tracking-page");
}

document.addEventListener("DOMContentLoaded", buildOrdersDashboard);