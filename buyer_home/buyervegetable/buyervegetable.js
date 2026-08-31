// Cart functionality
let cartCount = 0;
let cartItems = [];

function addToCart(vegetable, price, quantityId) {
  const quantity = parseInt(document.getElementById(quantityId).value);
  if (quantity <= 0) return;

  const totalPrice = (price * quantity).toFixed(2);
  const item = {
    vegetable,
    price,
    quantity,
    totalPrice
  };

  // Add item to cart array
  cartItems.push(item);
  cartCount += quantity;

  // Update the cart count
  document.getElementById("cart-count").textContent = cartCount;

  // Update cart dropdown
  updateCartDropdown();
}

function updateCartDropdown() {
  const cartDropdown = document.getElementById("cart-dropdown");
  const cartItemsList = document.getElementById("cart-items");
  const checkoutBtn = document.getElementById("checkout-btn");

  // Clear the cart item list before updating
  cartItemsList.innerHTML = "";

  if (cartItems.length === 0) {
    cartItemsList.innerHTML = "<li>No items in the cart.</li>";
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
  // Display the checkout modal
  const checkoutModal = document.getElementById("checkout-modal");
  const checkoutItemsList = document.getElementById("checkout-items");
  const totalPriceElement = document.getElementById("total-price");

  // Clear the previous checkout items
  checkoutItemsList.innerHTML = "";

  let totalAmount = 0;

  // Add the items to the checkout
  cartItems.forEach(item => {
    const checkoutItem = document.createElement("li");
    checkoutItem.innerHTML = `
      ${item.quantity} x ${item.vegetable} - ₹${item.totalPrice}
      <button class="quantity-adjust-btn" onclick="adjustQuantity('${item.vegetable}', 'decrease')">-</button>
      <button class="quantity-adjust-btn" onclick="adjustQuantity('${item.vegetable}', 'increase')">+</button>
    `;
    checkoutItemsList.appendChild(checkoutItem);
    totalAmount += parseFloat(item.totalPrice);
  });

  // Display the total amount
  totalPriceElement.textContent = totalAmount.toFixed(2);

  // Show the checkout modal
  checkoutModal.style.display = "flex";
}

function adjustQuantity(vegetable, action) {
  const item = cartItems.find(item => item.vegetable === vegetable);
  
  if (item) {
    if (action === "increase") {
      item.quantity += 1;
    } else if (action === "decrease" && item.quantity > 1) {
      item.quantity -= 1;
    }

    // Recalculate the total price for that item
    item.totalPrice = (item.price * item.quantity).toFixed(2);

    // Update cart count and total price
    cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    document.getElementById("cart-count").textContent = cartCount;

    // Update cart and checkout display
    updateCartDropdown();
    openCheckoutWindow();
  }
}

function makeContract() {
  // Simulate the contract-making process
  alert("Contract successfully created! Your order is being processed.");
  // After contract is made, close the modal and reset the cart
  const checkoutModal = document.getElementById("checkout-modal");
  checkoutModal.style.display = "none";
  cartCount = 0;
  cartItems = [];
  document.getElementById("cart-count").textContent = cartCount;
  updateCartDropdown();
}
