
import React, { useEffect, useRef } from 'react';

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1614249526292-2593e242e10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    name: 'Gray Hoodie',
    price: '$ 45.00'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    name: 'Green Cap',
    price: '$ 30.00'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94c3b9d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    name: 'Black Tote Bag',
    price: '$ 25.00'
  }
];

const FeaturedProducts = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

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
          {products.map((product) => (
            <div key={product.id} className="product-card mb-4 sm:mb-0">
              <div className="relative group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full aspect-[3/4] object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = product.fallbackImage;
                  }}
                />
                <div className="absolute bottom-0 left-0 w-full bg-white bg-opacity-95 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="w-full py-2 border border-black text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors">
                    {product.id === 2 ? 'EXPLORE' : 'UNLOCK'}
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm">{product.name}</p>
                <p className="text-sm font-medium">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
