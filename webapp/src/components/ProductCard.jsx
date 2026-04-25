import { motion } from 'framer-motion';

export default function ProductCard({ product, onAddToCart, index }) {
  return (
    <motion.div
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
    >
      <div className="product-image">
        <span className="product-emoji">{product.emoji}</span>
        <div className="roast-badge">{product.roast}</div>
      </div>

      <div className="product-details">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-origin">{product.origin}</p>
        <p className="product-description">{product.description}</p>

        <div className="product-notes">
          {product.notes.map(note => (
            <span key={note} className="note-tag">{note}</span>
          ))}
        </div>

        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
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
  );
}
