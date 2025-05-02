const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    image: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    inStock: {
      type: Boolean,
      default: true
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL']
    },
    tags: [String],
    rating: {
      type: Number,
      default: 0
    },
    numReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
