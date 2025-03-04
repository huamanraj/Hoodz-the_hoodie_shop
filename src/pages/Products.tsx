
import React, { useState } from 'react';
import Layout from '../components/Layout';
import { productData } from '../data/products';
import { Link } from 'react-router-dom';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = ['all', 'men', 'women', 'new'];
  
  const filteredProducts = selectedCategory === 'all' 
    ? productData 
    : productData.filter(product => product.category === selectedCategory);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6 md:mb-10">Collection</h1>
        
        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${selectedCategory === category ? 'bg-black text-white' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.toUpperCase()}
            </button>
          ))}
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <Link 
              to={`/product/${product.id}`} 
              key={product.id}
              className="product-card"
            >
              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full aspect-[3/4] object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&q=80";
                  }}
                />
              </div>
              <div className="pt-3 pb-5">
                <h3 className="text-lg font-medium">{product.name}</h3>
                <p className="mt-1">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
