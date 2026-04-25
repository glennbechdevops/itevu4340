// Configuration - Update with your Lambda Function URL
const LAMBDA_URL = 'YOUR_LAMBDA_FUNCTION_URL_HERE';

// Mock product data (same as original)
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

// Circuit Breaker for handling repeated failures
class CircuitBreaker {
    constructor(threshold = 3, timeout = 60000) {
        this.failureCount = 0;
        this.threshold = threshold;
        this.timeout = timeout;
        this.state = 'CLOSED';  // CLOSED, OPEN, HALF_OPEN
        this.nextAttempt = Date.now();
    }

    async execute(fn) {
        if (this.state === 'OPEN') {
            if (Date.now() < this.nextAttempt) {
                console.log('Circuit breaker is OPEN - rejecting request');
                throw new Error('Service temporarily unavailable. Please try again later.');
            }
            console.log('Circuit breaker transitioning to HALF_OPEN');
            this.state = 'HALF_OPEN';
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        console.log('Circuit breaker: Request succeeded');
        this.failureCount = 0;
        this.state = 'CLOSED';
    }

    onFailure() {
        this.failureCount++;
        console.log(`Circuit breaker: Failure count = ${this.failureCount}`);

        if (this.failureCount >= this.threshold) {
            this.state = 'OPEN';
            this.nextAttempt = Date.now() + this.timeout;
            console.log(`Circuit breaker: OPEN for ${this.timeout}ms`);
        }
    }

    getState() {
        return this.state;
    }
}

// Global circuit breaker instance
const circuitBreaker = new CircuitBreaker(3, 60000);

// Fetch with timeout
async function fetchWithTimeout(url, options, timeout = 5000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - server took too long to respond');
        }
        throw error;
    }
}

// Retry with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt} of ${maxRetries}`);
            return await fn();
        } catch (error) {
            if (attempt === maxRetries) {
                console.log('All retry attempts exhausted');
                throw error;
            }

            const delay = baseDelay * Math.pow(2, attempt - 1);
            console.log(`Retry failed, waiting ${delay}ms before attempt ${attempt + 1}`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Initialize the app
function init() {
    renderProducts();
    updateCartCount();
    updateCircuitBreakerStatus();

    // Update circuit breaker status every second
    setInterval(updateCircuitBreakerStatus, 1000);
}

// Render product cards (same as original)
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

// Add product to cart (same as original)
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

// Update cart display (same as original)
function updateCart() {
    updateCartCount();
    renderCartItems();
    updateCartTotal();
}

// Update cart count badge (same as original)
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

// Render cart items (same as original)
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

// Update cart total (same as original)
function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

// Increase item quantity (same as original)
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        updateCart();
    }
}

// Decrease item quantity (same as original)
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

// Remove item from cart (same as original)
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Toggle cart panel (same as original)
function toggleCart() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.classList.toggle('open');
}

// Show cart panel (same as original)
function showCartPanel() {
    const cartPanel = document.getElementById('cart-panel');
    cartPanel.classList.add('open');
}

// Hide cart panel (same as original)
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

// Update circuit breaker status display
function updateCircuitBreakerStatus() {
    const statusEl = document.getElementById('circuit-breaker-status');
    if (statusEl) {
        const state = circuitBreaker.getState();
        const stateClass = state.toLowerCase();
        statusEl.textContent = `Circuit Breaker: ${state}`;
        statusEl.className = `circuit-breaker-status ${stateClass}`;
    }
}

// RESILIENT CHECKOUT FUNCTION
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

    // Store original cart for rollback
    const originalCart = [...cart];

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

        // Use circuit breaker + retry + timeout
        await circuitBreaker.execute(async () => {
            return await retryWithBackoff(async () => {
                const response = await fetchWithTimeout(LAMBDA_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order)
                }, 5000);  // 5 second timeout

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                return await response.json();
            }, 3, 1000);  // 3 retries, 1 second base delay
        });

        console.log('Order submitted successfully');
        showStatus('Order placed successfully!', 'success');

        // Clear cart on success
        cart = [];
        updateCart();

        setTimeout(() => {
            hideCartPanel();
        }, 2000);

    } catch (error) {
        console.error('Checkout failed:', error);

        // Rollback cart
        cart = originalCart;
        updateCart();

        // Show user-friendly error message
        let errorMessage = 'Order failed. Please try again.';

        if (error.message.includes('timeout')) {
            errorMessage = 'Request timed out. Please check your connection and try again.';
        } else if (error.message.includes('temporarily unavailable')) {
            errorMessage = error.message;
        } else if (error.message.includes('CORS')) {
            errorMessage = 'CORS error - check Lambda configuration.';
        }

        showStatus(errorMessage, 'error');
    } finally {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('loading');
        checkoutBtn.textContent = 'Checkout';
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
