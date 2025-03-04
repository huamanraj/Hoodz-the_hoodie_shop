
import React from 'react';
import Layout from '../components/Layout';
import { useParams } from 'react-router-dom';
import { productData } from '../data/products';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/use-cart';
import { toast } from '@/hooks/use-toast';

const Product = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = productData.find(p => p.id === id) || productData[0];

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="overflow-hidden bg-gray-50">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-[500px] object-cover transition-transform hover:scale-105 duration-500"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&q=80";
                }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-6">
            <div className="border-b pb-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-medium">${product.price.toFixed(2)}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm uppercase tracking-wider mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm uppercase tracking-wider mb-2">Size</h3>
                <div className="flex space-x-2">
                  {["S", "M", "L", "XL"].map((size) => (
                    <button 
                      key={size}
                      className="border border-black w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="mt-8 flex items-center justify-center space-x-2 border border-black py-3 px-6 hover:bg-black hover:text-white transition-colors"
            >
              <ShoppingBag size={20} />
              <span className="uppercase text-sm tracking-wider">Add to Cart</span>
            </button>
            
            <div className="border-t border-b py-4 mt-8">
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Free shipping on orders over $150</p>
                <p className="text-sm">Free returns within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
