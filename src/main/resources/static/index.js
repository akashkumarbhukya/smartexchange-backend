const orderHistoryData = [
    {
        id: "CAMPUS",
        title: "CAMPUS OG-09 Sneakers For Men",
        variant: "Color: White | Size: 8",
        price: 869,
        seller: "JQR MARCO POLO",
        status: "Delivered on Thu, Jul 16",
        img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
        currentSize: "8",
        currentColor: "White",
        availableSizes: ["6", "7", "8", "9", "10", "11"],
        availableColors: [
            { name: "White", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
            { name: "Red", img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400" },
            { name: "Black", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" }
        ]
    },
    {
        id: "URBANICE",
        title: "URBANICE Men Regular Fit Solid Ribbed Collar Casual Shirt",
        variant: "Selected Color: Brown | Size: M",
        price: 816,
        seller: "URBANICE Brand Store",
        status: "Delivered on Fri, Jul 17",
        img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400",
        currentSize: "M",
        currentColor: "Brown",
        availableSizes: ["S", "M", "L", "XL"],
        availableColors: [
            { name: "Brown", img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400" },
            { name: "Black", img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400" },
            { name: "Blue", img: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400" }
        ]
    },
    {
        id: "FOXTER",
        title: "FOXTER Men Striped Black Track Pants",
        variant: "Selected Color: Black | Size: L",
        price: 333,
        seller: "ZEN1FASHION Store",
        status: "Delivered on Sun, Jul 12",
        img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
        currentSize: "L",
        currentColor: "Black",
        availableSizes: ["S", "M", "L", "XL", "XXL"],
        availableColors: [
            { name: "Black", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400" },
            { name: "Grey", img: "https://images.unsplash.com/photo-1580906853634-f17d2ef4a8a0?w=400" }
        ]
    }
];

let globalActiveProductId = null;
let selectedExchangeSize = null;
let selectedExchangeColor = null;
let currentComputedPrice = 0;

function showPage(pageId) {
    document.querySelectorAll('.view-panel').forEach(view => view.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

function buildOrdersDashboard() {
    const listContainer = document.getElementById("orders-injection-list");
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

    if (item.id === "CAMPUS") {
        const parsedSize = parseInt(selectedExchangeSize, 10);
        if (!isNaN(parsedSize) && parsedSize > 8) {
            currentComputedPrice = item.price + 50;
            priceTextNode.innerText = `₹${currentComputedPrice}`;
            alertBox.innerText = "+ ₹50 Size Premium Applied";
            alertBox.style.display = "inline-block";
            return;
        }
    }
    
    currentComputedPrice = item.price;
    priceTextNode.innerText = `₹${item.price}`;
    alertBox.style.display = "none";
}

function finalizeExchangeTransaction() {
    const item = orderHistoryData.find(o => o.id === globalActiveProductId);
    
    if (selectedExchangeSize === item.currentSize && selectedExchangeColor === item.currentColor) {
        alert("Please select a different size or color option to trigger the exchange request.");
        return;
    }

    // Bind parameters to tracking milestone elements dynamically
    document.getElementById("track-product-title").innerText = item.title;
    document.getElementById("track-product-desc").innerText = `Color: ${selectedExchangeColor} | Size: ${selectedExchangeSize}`;
    document.getElementById("track-product-price").innerText = `₹${currentComputedPrice}`;
    document.getElementById("track-product-img").src = document.getElementById("exchange-pane-img").src;

    // Custom randomly generated mock order id to match layout references
    const randomSuffix = Math.floor(100000000 + Math.random() * 900000000);
    document.getElementById("breadcrumb-id").innerText = `003270${randomSuffix}`;

    const premiumBadge = document.getElementById("track-upcharge-badge");
    if (item.id === "CAMPUS" && parseInt(selectedExchangeSize, 10) > 8) {
        premiumBadge.innerText = "₹50 Size Upcharge Included";
        premiumBadge.style.display = "inline-block";
    } else {
        premiumBadge.style.display = "none";
    }

    // Jump smoothly to our accurate new horizontal tracking layout view
    showPage("exchange-tracking-page");
}

document.addEventListener("DOMContentLoaded", buildOrdersDashboard);