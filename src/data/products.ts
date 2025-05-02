export interface Product {
  _id: string;         // Changed from id to _id to match MongoDB
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes?: string[];    // Optional sizes array
  inStock?: boolean;   // Optional in stock status
  tags?: string[];     // Optional tags array
  createdAt?: string;  // Optional timestamp
  updatedAt?: string;  // Optional timestamp
}

export const productData: Product[] = [
  {
    _id: '1',   // Changed from id to _id
    name: 'Classic Black Hoodie',
    description: 'A classic black hoodie made from premium cotton. Features a kangaroo pocket and adjustable drawstrings.',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'men',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true
  },
  {
    _id: '2',   // Changed from id to _id
    name: 'Cream Oversized Hoodie',
    description: 'An oversized hoodie in a soft cream color. Perfect for a relaxed, casual look.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'women',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true
  },
  {
    _id: '3',
    name: 'Minimalist Gray Hoodie',
    description: 'A minimalist gray hoodie with subtle logo detailing. Made from a cotton-polyester blend for comfort and durability.',
    price: 74.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'men'
  },
  {
    _id: '4',
    name: 'Pastel Blue Hoodie',
    description: 'A pastel blue hoodie with a relaxed fit. Features ribbed cuffs and hem for added comfort.',
    price: 84.99,
    image: 'https://images.unsplash.com/photo-1599519470850-6d875bcce48d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'women'
  },
  {
    _id: '5',
    name: 'Vintage Red Hoodie',
    description: 'A vintage-inspired red hoodie with distressed details. Made from soft, pre-washed fabric for that lived-in feel.',
    price: 94.99,
    image: 'https://images.unsplash.com/photo-1584829476759-747279a58b21?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'men'
  },
  {
    _id: '6',
    name: 'Eco-friendly Green Hoodie',
    description: 'An eco-friendly hoodie made from organic cotton and recycled materials. Features a unique green hue.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'new'
  },
  {
    _id: '7',
    name: 'Premium White Hoodie',
    description: 'A premium white hoodie made from the finest materials. Features minimalist design and exceptional comfort.',
    price: 109.99,
    image: 'https://images.unsplash.com/photo-1554142130-78fe35798489?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'new'
  },
  {
    _id: '8',
    name: 'Graphic Print Hoodie',
    description: 'A statement hoodie featuring unique graphic prints. Made from high-quality cotton for everyday wear.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1556726204-06c9787d2152?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
    category: 'women'
  }
];
