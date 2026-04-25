import { motion } from 'framer-motion';

export default function Header({ cartItemCount, onCartClick }) {
  return (
    <header className="header">
      <div className="header-content">
        <motion.div
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Chaos Coffee Co.</h1>
          <p className="tagline">Engineering Antifragile Brews Since 2024</p>
        </motion.div>

        <motion.button
          className="cart-button"
          onClick={onCartClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="cart-icon">🛒</span>
          <span>Cart</span>
          {cartItemCount > 0 && (
            <motion.span
              className="cart-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={cartItemCount}
            >
              {cartItemCount}
            </motion.span>
          )}
        </motion.button>
      </div>
    </header>
  );
}
