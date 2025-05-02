import React, { useEffect, useRef } from 'react';
import { useProducts } from '@/hooks/use-products';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

const FeaturedProducts = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const { data, isLoading } = useProducts('new', 3);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-fade');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    if (productsRef.current) {
      observer.observe(productsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div 
          ref={textRef} 
          className="opacity-0"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          <div className="border-b border-gray-200 pb-1 overflow-hidden">
            <div className="whitespace-nowrap animate-[marquee_15s_linear_infinite]">
              {Array(5).fill(0).map((_, i) => (
                <span key={i} className="text-xs uppercase tracking-wider mr-8">
                  # HOODIE CLOTHING SHOP # THE BEST HOODIES CLOTHING SHOP # THE BEST HOODIES CL
                </span>
              ))}
            </div>
          </div>
        </div>

        <div 
          ref={productsRef} 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 opacity-0"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          {isLoading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="product-card mb-4 sm:mb-0">
                <Skeleton className="w-full aspect-[3/4]" />
                <div className="mt-2">
                  <Skeleton className="h-5 w-1/2 mb-1" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))
          ) : (
            data?.products.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="product-card mb-4 sm:mb-0">
                <div className="relative group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full aspect-[3/4] object-cover"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-95 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-full py-2 border border-black text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
                      VIEW PRODUCT
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">{product.name}</p>
                  <p className="text-sm font-medium">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
