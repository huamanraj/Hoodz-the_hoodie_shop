import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { toast } from '@/hooks/use-toast';
import { useProduct } from '@/hooks/use-products';
import { Skeleton } from '@/components/ui/skeleton';

const Product = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      id: product._id,
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      category: product.category,
      size: selectedSize || undefined
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <Skeleton className="h-[500px] w-full" />
            
            <div className="flex flex-col space-y-6">
              <div className="border-b pb-4">
                <Skeleton className="h-10 w-2/3 mb-2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
              
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
              
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <div className="flex space-x-2">
                  {["S", "M", "L", "XL"].map((size) => (
                    <Skeleton key={size} className="h-10 w-10" />
                  ))}
                </div>
              </div>
              
              <Skeleton className="h-12 w-full mt-8" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 md:py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <p className="mb-8 text-gray-600">We couldn't find the product you're looking for.</p>
          <button
            onClick={() => navigate('/products')}
            className="border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors"
          >
            View All Products
          </button>
        </div>
      </Layout>
    );
  }

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
              
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h3 className="text-sm uppercase tracking-wider mb-2">Size</h3>
                  <div className="flex space-x-2">
                    {product.sizes.map((size) => (
                      <button 
                        key={size}
                        className={`border ${selectedSize === size ? 'bg-black text-white' : 'border-black'} w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
