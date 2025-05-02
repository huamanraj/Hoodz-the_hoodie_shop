// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const path = require('path');

// Load env vars - ensure we're looking in the right place
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Use the MongoDB Atlas URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

// Verify URI is available
if (!MONGO_URI) {
  console.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

// Sample products data
const products = [
  {
    name: 'Classic Black Hoodie',
    description: 'A classic black hoodie made from premium cotton. Features a kangaroo pocket and adjustable drawstrings.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'men',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    tags: ['hoodie', 'black', 'classic']
  },
  {
    name: 'Cream Oversized Hoodie',
    description: 'An oversized hoodie in a soft cream color. Perfect for a relaxed, casual look.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'women',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    tags: ['hoodie', 'cream', 'oversized']
  },
  {
    name: 'Minimalist Gray Hoodie',
    description: 'A minimalist gray hoodie with subtle logo detailing. Made from a cotton-polyester blend for comfort and durability.',
    price: 74.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'men',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    tags: ['hoodie', 'gray', 'minimalist']
  },
  {
    name: 'Pastel Blue Hoodie',
    description: 'A pastel blue hoodie with a relaxed fit. Features ribbed cuffs and hem for added comfort.',
    price: 84.99,
    image: 'https://images.unsplash.com/photo-1599519470850-6d875bcce48d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'women',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    tags: ['hoodie', 'blue', 'pastel']
  },
  {
    name: 'Vintage Red Hoodie',
    description: 'A vintage-inspired red hoodie with distressed details. Made from soft, pre-washed fabric for that lived-in feel.',
    price: 94.99,
    image: 'https://images.unsplash.com/photo-1584829476759-747279a58b21?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'men',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    tags: ['hoodie', 'red', 'vintage']
  },
  {
    name: 'Eco-friendly Green Hoodie',
    description: 'An eco-friendly hoodie made from organic cotton and recycled materials. Features a unique green hue.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'new',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    tags: ['hoodie', 'green', 'eco-friendly']
  },
  {
    name: 'Premium White Hoodie',
    description: 'A premium white hoodie made from the finest materials. Features minimalist design and exceptional comfort.',
    price: 109.99,
    image: 'https://images.unsplash.com/photo-1554142130-78fe35798489?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'new',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    tags: ['hoodie', 'white', 'premium']
  },
  {
    name: 'Graphic Print Hoodie',
    description: 'A statement hoodie featuring unique graphic prints. Made from high-quality cotton for everyday wear.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1556726204-06c9787d2152?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'women',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    tags: ['hoodie', 'graphic', 'print']
  }
];

// Set up a timeout to exit if connection takes too long
let connectionTimeout = setTimeout(() => {
  console.error('MongoDB Atlas connection timed out after 30 seconds');
  process.exit(1);
}, 30000); // Extended timeout for Atlas connections

// Connect to MongoDB Atlas with proper options
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increased for Atlas connections
  connectTimeoutMS: 30000, // Increased for Atlas connections
})
.then(async () => {
  // Clear the connection timeout as we've connected successfully
  clearTimeout(connectionTimeout);
  console.log(`MongoDB Atlas Connected: ${mongoose.connection.host}`);
  
  // Import or destroy data based on command arg
  if (process.argv[2] === '-d') {
    await destroyData();
  } else {
    await importData();
  }
})
.catch(err => {
  clearTimeout(connectionTimeout);
  console.error(`Error connecting to MongoDB Atlas: ${err.message}`);
  process.exit(1);
});

// Import data to DB
const importData = async () => {
  try {
    // Get the Product model after connection is established
    const Product = require('../models/productModel');
    
    // Clear existing data
    console.log('Clearing existing product data...');
    await Product.deleteMany({});
    
    // Insert new data
    console.log('Inserting new product data...');
    await Product.insertMany(products);
    
    console.log('Data imported successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Delete all data from DB
const destroyData = async () => {
  try {
    // Get the Product model after connection is established
    const Product = require('../models/productModel');
    
    console.log('Deleting all product data...');
    await Product.deleteMany({});
    
    console.log('Data destroyed successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.disconnect();
  console.log('MongoDB Atlas connection closed');
  process.exit(0);
});
