const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const { category, limit = 20, page = 1 } = req.query;
  const queryFilter = {};
  
  if (category) {
    queryFilter.category = category;
  }
  
  const count = await Product.countDocuments(queryFilter);
  const products = await Product.find(queryFilter)
    .limit(Number(limit))
    .skip(Number(limit) * (Number(page) - 1))
    .sort({ createdAt: -1 });
  
  res.json({ 
    products, 
    page: Number(page), 
    pages: Math.ceil(count / Number(limit)),
    total: count 
  });
});

// @desc    Fetch single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/v1/products
// @access  Private/Admin (for future implementation)
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, image, category } = req.body;
  
  const product = await Product.create({
    name,
    description,
    price,
    image,
    category
  });
  
  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error('Invalid product data');
  }
});

// @desc    Update a product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin (for future implementation)
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, image, category, inStock, sizes } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.inStock = inStock !== undefined ? inStock : product.inStock;
    product.sizes = sizes || product.sizes;
    
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin (for future implementation)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
