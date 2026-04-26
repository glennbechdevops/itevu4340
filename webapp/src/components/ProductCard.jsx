import React from 'react'
import { motion } from 'framer-motion'

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

const ProductCard = ({ product, onAddToCart }) => {
  const formattedPrice = product.price.toFixed(2)
  
  return (
    <motion.div
      className="product-card"
      variants={cardVariants}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <div className="product-image">{product.image}</div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-origin">Origin: {product.origin}</p>
        <p className="product-roast">Roast: {product.roast}</p>
        <p className="product-description">{product.description}</p>

        <div className="product-notes">
          {product.notes.map(note => (
            <span key={note} className="note-tag">{note}</span>
          ))}
        </div>

        <div className="product-footer">
          <span className="product-price">${formattedPrice}</span>
          <motion.button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

export default ProductCard
