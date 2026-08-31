// Search filter
function filterVegetables() {
    const input = document.getElementById('searchBar');
    const filter = input.value.toLowerCase();
    const items = document.querySelectorAll('.vegetable-list .item');

    items.forEach(item => {
        const vegetableName = item.querySelector('h1').textContent.toLowerCase();
        if (vegetableName.indexOf(filter) > -1) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Authentication Check
const seller = AgriConnect.requireAuth('seller');

document.addEventListener('DOMContentLoaded', function() {
    renderSellerProducts();

    // Attach form listeners for preset vegetable items
    const items = document.querySelectorAll('.vegetable-list .item');
    items.forEach(item => {
        const form = item.querySelector('form');
        if (!form) return;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const productName = item.querySelector('h1').textContent.trim();
            const priceInput = form.querySelector('input[id="price"]');
            const qtyInput = form.querySelector('input[id="quantity"]');
            
            const price = parseFloat(priceInput.value);
            const quantity = parseFloat(qtyInput.value);
            const imgSrc = item.querySelector('img') ? item.querySelector('img').getAttribute('src') : '';

            if (isNaN(price) || price <= 0 || isNaN(quantity) || quantity <= 0) {
                alert('Please enter valid positive values for price and quantity.');
                return;
            }

            const res = AgriConnect.addProduct({
                name: productName,
                price: price,
                quantity: quantity,
                unit: 'kg',
                image: imgSrc,
                category: 'Vegetables',
                location: seller.location || 'Local Farm'
            });

            if (res.success) {
                alert(`Successfully added ${quantity} kg of ${productName} for sale!`);
                form.reset();
                renderSellerProducts();
            } else {
                alert(res.message);
            }
        });
    });
});

function renderSellerProducts() {
    const productList = document.getElementById('seller-products');
    if (!productList || !seller) return;

    const products = AgriConnect.getSellerProducts(seller.id);
    productList.innerHTML = '';

    if (products.length === 0) {
        productList.innerHTML = '<p style="font-size:18px; color:#666;">No products listed yet. Use the form above to add vegetables for sale!</p>';
        updateTotalEarningsDisplay(0);
        return;
    }

    let totalEarnings = 0;

    products.forEach(prod => {
        const potentialEarnings = prod.price * prod.quantity;
        totalEarnings += potentialEarnings;

        const card = document.createElement('div');
        card.className = 'product';
        card.style.cssText = 'border:1px solid #4CAF50; border-radius:10px; padding:15px; width:260px; background:#f9fbf9; box-shadow:0 2px 5px rgba(0,0,0,0.1); text-align:left; position:relative;';

        card.innerHTML = `
            <h3 style="margin-top:0; color:#2e7d32;">${prod.name}</h3>
            <p><strong>Price:</strong> ₹${prod.price} / ${prod.unit}</p>
            <p><strong>Available Stock:</strong> ${prod.quantity} ${prod.unit}</p>
            <p><strong>Potential Earnings:</strong> ₹${potentialEarnings.toFixed(2)}</p>
            <button onclick="deleteProductItem('${prod.id}')" style="background:#e53935; color:white; border:none; border-radius:4px; padding:6px 12px; cursor:pointer; width:100%; margin-top:10px;">Remove Listing</button>
        `;

        productList.appendChild(card);
    });

    updateTotalEarningsDisplay(totalEarnings);
}

function deleteProductItem(productId) {
    if (confirm('Are you sure you want to remove this product listing?')) {
        AgriConnect.deleteProduct(productId);
        renderSellerProducts();
    }
}

function updateTotalEarningsDisplay(total) {
    let totalDiv = document.getElementById('total-earnings');
    if (!totalDiv) {
        totalDiv = document.createElement('div');
        totalDiv.id = 'total-earnings';
        totalDiv.style.margin = '20px auto';
        totalDiv.style.fontSize = '20px';
        totalDiv.style.color = '#2e7d32';
        const container = document.getElementById('seller-products');
        if (container && container.parentNode) {
            container.parentNode.insertBefore(totalDiv, container.nextSibling);
        }
    }
    totalDiv.innerHTML = `<h3>Total Potential Inventory Value: ₹${total.toFixed(2)}</h3>`;
}
