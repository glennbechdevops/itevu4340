import React from 'react'
import { motion } from 'framer-motion'

const Header = ({ cartItemCount, onCartClick }) => {
  return (
    <motion.header
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="header-content">
        <div className="brand">
          <motion.h1
            className="brand-name"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            Coffee Chaos
          </motion.h1>
          <p className="tagline">Engineering Antifragile Brews Since 2024</p>
        </div>

        <motion.button
          className="cart-button"
          onClick={onCartClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="cart-icon">🛒</span>
          <span className="cart-label">Cart</span>
          {cartItemCount > 0 && (
            <motion.span
              className="cart-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {cartItemCount}
            </motion.span>
          )}
        </motion.button>
      </div>
    </motion.header>
  )
}

export default Header
