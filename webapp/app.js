// Configuration - Students will update this with their Lambda Function URL
const LAMBDA_URL = 'YOUR_LAMBDA_FUNCTION_URL_HERE';

// Mock product data
const products = [
    {
        id: 'ethiopian-yirgacheffe',
        name: 'Ethiopian Yirgacheffe',
        description: 'Floral and citrus notes with a bright, clean finish. Perfect for pour-over.',
        origin: 'Ethiopia',
        price: 18.99,
        emoji: '☕'
    },
    {
        id: 'colombian-supremo',
        name: 'Colombian Supremo',
        description: 'Rich, full-bodied with chocolate undertones. A classic morning brew.',
        origin: 'Colombia',
        price: 16.99,
        emoji: '🌋'
    },
    {
        id: 'guatemalan-antigua',
        name: 'Guatemalan Antigua',
        description: 'Spicy and smoky with a complex flavor profile. Medium roast excellence.',
        origin: 'Guatemala',
        price: 17.99,
        emoji: '🏔️'
    },
    {
        id: 'kenyan-aa',
        name: 'Kenyan AA',
        description: 'Bold and wine-like with berry notes. Exceptional clarity and body.',
        origin: 'Kenya',
        price: 19.99,
        emoji: '🦁'
    },
    {
        id: 'sumatra-mandheling',
        name: 'Sumatra Mandheling',
        description: 'Earthy and full-bodied with low acidity. Perfect for French press.',
        origin: 'Indonesia',
        price: 17.49,
        emoji: '🌿'
    },
    {
        id: 'costa-rican-tarrazu',
        name: 'Costa Rican Tarrazu',
        description: 'Clean and balanced with bright acidity. A refined Central American gem.',
        origin: 'Costa Rica',
        price: 18.49,
        emoji: '🌴'
    }
];

// Shopping cart state
let cart = [];

// Initialize the app
function init() {
    renderProducts();
    updateCartCount();
}

// Render product cards
function renderProducts() {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-origin">Origin: ${product.origin}</p>
            <div class="product-footer">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="add-to-cart-btn" onclick="addToCart('${product.id}')">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showCartPanel();
}

// Update cart display
function updateCart() {
    updateCartCount();
    renderCartItems();
    updateCartTotal();
}

// Update cart count badge
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Render cart items
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${item.emoji}</div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity('${item.id}')">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity('${item.id}')">+</button>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update cart total
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

// Increase item quantity
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

// Decrease item quantity
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity--;
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Toggle cart panel
function toggleCart() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.classList.toggle('open');
}

// Show cart panel
function showCartPanel() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.classList.add('open');
}

// Hide cart panel
function hideCartPanel() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.classList.remove('open');
}

// Show status message
function showStatus(message, type) {
    const statusEl = document.getElementById('status-message');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;

    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            statusEl.textContent = '';
            statusEl.className = 'status-message';
        }, 5000);
    }
}

// Checkout function - This is where students will observe failures
async function checkout() {
    if (cart.length === 0) {
        showStatus('Your cart is empty', 'error');
        return;
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add('loading');
    checkoutBtn.textContent = 'Processing...';

    showStatus('Submitting order...', 'loading');

    try {
        // Prepare order data
        const order = {
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            })),
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            timestamp: new Date().toISOString()
        };

        console.log('Sending order to Lambda:', order);

        // Make request to Lambda - THIS WILL FAIL due to CORS
        const response = await fetch(LAMBDA_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Order response:', result);

        showStatus('Order placed successfully!', 'success');

        // Clear cart on success
        cart = [];
        updateCart();

        setTimeout(() => {
            hideCartPanel();
        }, 2000);

    } catch (error) {
        console.error('Checkout failed:', error);
        showStatus(`Order failed: ${error.message}`, 'error');
    } finally {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('loading');
        checkoutBtn.textContent = 'Checkout';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
