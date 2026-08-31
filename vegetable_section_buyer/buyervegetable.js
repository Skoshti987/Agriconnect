// Buyer Product Catalog & Order Request Logic
const buyer = AgriConnect.requireAuth('buyer');

let cartCount = 0;
let cartItems = [];

document.addEventListener('DOMContentLoaded', function() {
    renderBuyerCatalog();
});

function renderBuyerCatalog() {
    const container = document.getElementById('buyer-catalog-container');
    if (!container) return;

    const products = AgriConnect.getProducts();
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p style="font-size:18px; text-align:center; width:100%;">No products available at the moment. Please check back soon!</p>';
        return;
    }

    products.forEach(prod => {
        const box = document.createElement('div');
        box.className = 'vegetable-box';
        box.style.cssText = 'border:1px solid #ccc; border-radius:10px; padding:15px; width:250px; background:#fff; box-shadow:0 2px 5px rgba(0,0,0,0.1); margin:15px; text-align:center;';

        const imgPath = prod.image || 'tomato.jpg';

        box.innerHTML = `
            <img src="${imgPath}" alt="${prod.name}" style="width:100%; height:160px; object-fit:cover; border-radius:8px;">
            <h3 style="margin:10px 0 5px 0;">${prod.name}</h3>
            <p style="color:#2e7d32; font-weight:bold; margin:3px 0;">Price: ₹${prod.price} / ${prod.unit}</p>
            <p style="font-size:13px; color:#666; margin:3px 0;">Seller: ${prod.sellerName}</p>
            <p style="font-size:13px; color:#666; margin:3px 0;">Available Stock: ${prod.quantity} ${prod.unit}</p>
            <p style="margin-top:10px;">Quantity: <input type="number" value="1" min="1" max="${prod.quantity}" id="qty-${prod.id}" style="width:60px; padding:5px; text-align:center;"></p>
            <button onclick="addToCart('${prod.id}', '${prod.name}', ${prod.price}, 'qty-${prod.id}')" style="background:#4CAF50; color:white; border:none; padding:8px 15px; border-radius:5px; cursor:pointer; margin-top:10px; width:100%;">Request Purchase</button>
        `;

        container.appendChild(box);
    });
}

function addToCart(productId, productName, price, qtyInputId) {
    const qtyInput = document.getElementById(qtyInputId);
    const quantity = parseFloat(qtyInput.value);

    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid positive quantity.');
        return;
    }

    const products = AgriConnect.getProducts();
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.quantity) {
        alert(`Requested quantity exceeds available stock (${product.quantity} ${product.unit}).`);
        return;
    }

    const existing = cartItems.find(item => item.productId === productId);
    if (existing) {
        existing.quantity += quantity;
        existing.totalPrice = (existing.price * existing.quantity).toFixed(2);
    } else {
        cartItems.push({
            productId: productId,
            vegetable: productName,
            price: price,
            quantity: quantity,
            totalPrice: (price * quantity).toFixed(2)
        });
    }

    cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = cartCount;

    updateCartDropdown();
    alert(`Added ${quantity} of ${productName} to request cart.`);
}

function updateCartDropdown() {
    const cartItemsList = document.getElementById("cart-items");
    const checkoutBtn = document.getElementById("checkout-btn");

    cartItemsList.innerHTML = "";

    if (cartItems.length === 0) {
        cartItemsList.innerHTML = "<li>No items selected.</li>";
        checkoutBtn.disabled = true;
    } else {
        cartItems.forEach(item => {
            const cartItem = document.createElement("li");
            cartItem.textContent = `${item.quantity} x ${item.vegetable} - ₹${item.totalPrice}`;
            cartItemsList.appendChild(cartItem);
        });
        checkoutBtn.disabled = false;
    }
}

function openCheckoutWindow() {
    const checkoutModal = document.getElementById("checkout-modal");
    const checkoutItemsList = document.getElementById("checkout-items");
    const totalPriceElement = document.getElementById("total-price");

    checkoutItemsList.innerHTML = "";
    let totalAmount = 0;

    cartItems.forEach(item => {
        const checkoutItem = document.createElement("li");
        checkoutItem.style.marginBottom = "8px";
        checkoutItem.innerHTML = `
            ${item.quantity} x ${item.vegetable} - ₹${item.totalPrice}
            <button onclick="adjustQuantity('${item.productId}', 'decrease')" style="padding:2px 8px; margin-left:8px;">-</button>
            <button onclick="adjustQuantity('${item.productId}', 'increase')" style="padding:2px 8px; margin-left:4px;">+</button>
        `;
        checkoutItemsList.appendChild(checkoutItem);
        totalAmount += parseFloat(item.totalPrice);
    });

    totalPriceElement.textContent = totalAmount.toFixed(2);
    checkoutModal.style.display = "flex";
}

function adjustQuantity(productId, action) {
    const item = cartItems.find(i => i.productId === productId);
    if (!item) return;

    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease') {
        item.quantity -= 1;
    }

    if (item.quantity <= 0) {
        cartItems = cartItems.filter(i => i.productId !== productId);
    } else {
        item.totalPrice = (item.price * item.quantity).toFixed(2);
    }

    cartCount = cartItems.reduce((total, i) => total + i.quantity, 0);
    document.getElementById("cart-count").textContent = cartCount;

    updateCartDropdown();
    if (cartItems.length === 0) {
        document.getElementById("checkout-modal").style.display = "none";
    } else {
        openCheckoutWindow();
    }
}

function makeContract() {
    if (cartItems.length === 0) return;

    let createdCount = 0;
    cartItems.forEach(item => {
        const res = AgriConnect.createRequest(item.productId, item.quantity);
        if (res.success) {
            createdCount++;
        } else {
            alert(`Error creating request for ${item.vegetable}: ${res.message}`);
        }
    });

    if (createdCount > 0) {
        alert(`Successfully submitted ${createdCount} purchase request(s)! Redirecting to My Requests status page...`);
        cartCount = 0;
        cartItems = [];
        document.getElementById("cart-count").textContent = 0;
        updateCartDropdown();
        document.getElementById("checkout-modal").style.display = "none";
        window.location.href = "../../show_request_buyer/show_contract.html";
    }
}
