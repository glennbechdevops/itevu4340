import React from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const ProductGrid = ({ products, onAddToCart }) => {
  return (
    <motion.div
      className="product-grid"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </motion.div>
  )
}

export default ProductGrid
