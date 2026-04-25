import { useState } from 'react';
import { motion } from 'framer-motion';
import { LAMBDA_URL } from '../config';

export default function Cart({ cart, onClose, onUpdateQuantity, onRemoveItem, onClearCart, cartTotal }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // INTENTIONALLY FRAGILE CHECKOUT
  // No error handling, no retries, no timeout, no circuit breaker
  const handleCheckout = async () => {
    if (cart.length === 0) {
      setStatusMessage({ type: 'error', text: 'Your cart is empty' });
      return;
    }

    setIsProcessing(true);
    setStatusMessage({ type: 'loading', text: 'Submitting order...' });

    try {
      const order = {
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: cartTotal,
        timestamp: new Date().toISOString()
      };

      console.log('Sending order to Lambda:', order);

      // NO TIMEOUT - request can hang forever
      // NO RETRY - fails immediately on network issues
      // NO ERROR HANDLING - crashes on unexpected responses
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

      setStatusMessage({ type: 'success', text: 'Order placed successfully!' });

      // Clear cart on success
      setTimeout(() => {
        onClearCart();
        onClose();
      }, 2000);

    } catch (error) {
      // Minimal error handling - just log and show generic message
      console.error('Checkout failed:', error);
      setStatusMessage({ type: 'error', text: `Order failed: ${error.message}` });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <motion.div
        className="cart-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      <motion.div
        className="cart-panel"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="cart-header">
          <h2>Your Cart</h2>
          <motion.button
            className="close-button"
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            ×
          </motion.button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty</p>
          ) : (
            cart.map((item) => (
              <motion.div
                key={item.id}
                className="cart-item"
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="cart-item-image">{item.emoji}</div>
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">${item.price.toFixed(2)}</div>
                  <div className="cart-item-controls">
                    <motion.button
                      className="quantity-btn"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      -
                    </motion.button>
                    <span className="quantity">{item.quantity}</span>
                    <motion.button
                      className="quantity-btn"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      +
                    </motion.button>
                    <motion.button
                      className="remove-btn"
                      onClick={() => onRemoveItem(item.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Remove
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <motion.button
            className={`checkout-btn ${isProcessing ? 'loading' : ''}`}
            onClick={handleCheckout}
            disabled={isProcessing || cart.length === 0}
            whileHover={!isProcessing ? { scale: 1.02 } : {}}
            whileTap={!isProcessing ? { scale: 0.98 } : {}}
          >
            {isProcessing ? 'Processing...' : 'Checkout'}
          </motion.button>

          {statusMessage && (
            <motion.div
              className={`status-message ${statusMessage.type}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {statusMessage.text}
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
}
