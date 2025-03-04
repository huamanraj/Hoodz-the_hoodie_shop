
import React, { useEffect, useRef } from 'react';

const categories = [
  { id: 'hoodie', name: 'HOODIE' },
  { id: 'caps', name: 'CAPS & BAGS' },
  { id: 'outerwear', name: 'OUTERWEAR' },
  { id: 'shoes', name: 'SHOES' },
  { id: 'popular', name: 'POPULAR' },
];

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1542838687-6d53be37d976?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    price: '$ 45.00'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1578763396091-9bc2809f6c0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1550639524-a6f58345a2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    price: '$ 50.00'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1509942774463-acf339cf87d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1602810320073-1230c46d89d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    price: '$ 55.00'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1626818590242-5a5f27ee3866?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    fallbackImage: 'https://images.unsplash.com/photo-1598032895397-b9472444bf93?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80',
    price: '$ 60.00'
  },
];

const featuredCollections = [
  {
    id: 1,
    number: "01",
    title: "SWEATSHIRT",
    description:
      "MINIMALIST DESIGNS FEATURING HIGH-QUALITY FABRIC, RELAXED FITS, AND SUBTLE DETAILS. OUR SWEATSHIRTS DELIVER TIMELESS STYLE.",
    image:
      "https://images.pexels.com/photos/9594669/pexels-photo-9594669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    fallbackImage:
      "https://images.unsplash.com/photo-1616150638538-ffb0679a3fc4?ixlib=rb-4.0.3&auto=format&fit=crop&w=830&q=80",
  },
  {
    id: 2,
    number: "02",
    title: "ATHLETIC",
    description:
      "PERFORM AT YOUR PEAK WITH OUR ATHLETIC COLLECTION. ENGINEERED WITH ADVANCED MOISTURE-WICKING FABRICS FOR MAXIMUM COMFORT.",
    image:
      "https://images.pexels.com/photos/3765341/pexels-photo-3765341.jpeg?auto=compress&cs=tinysrgb&w=1000&h=750&dpr=2",
    fallbackImage:
      "https://images.unsplash.com/photo-1511556820780-d912e42b4980?ixlib=rb-4.0.3&auto=format&fit=crop&w1000&q=80",
  },
];

const CollectionShowcase = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const winterCollectionRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

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

    [titleRef, textRef, categoriesRef, productsRef, winterCollectionRef, featuredRef].forEach(ref => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 ref={titleRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 opacity-0" style={{ animationDelay: '0.2s' }}>
          OUR COLLECTION
        </h2>
        
        <p ref={textRef} className="text-xs sm:text-sm max-w-4xl mb-8 md:mb-10 opacity-0" style={{ animationDelay: '0.3s' }}>
          OUR DESIGNS AREN'T MERE PIECES OF CLOTHING; THEY ARE EXPRESSIONS OF INDIVIDUALITY AND PASSION. EACH STITCH TELLS A STORY, EACH COLOR EVOKES AN EMOTION, AND EACH DESIGN IS A STATEMENT. WE DON'T JUST CREATE CLOTHES; WE CRAFT EXPERIENCES.
        </p>
        
        <div ref={categoriesRef} className="flex flex-wrap gap-2 mb-8 md:mb-12 opacity-0" style={{ animationDelay: '0.4s' }}>
          {categories.map((category) => (
            <button key={category.id} className="category-btn">
              {category.name}
            </button>
          ))}
        </div>
        
        <div ref={productsRef} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-12 md:mb-16 opacity-0" style={{ animationDelay: '0.5s' }}>
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img
                src={product.image}
                alt={`Product ${product.id}`}
                className="w-full aspect-square object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = product.fallbackImage;
                }}
              />
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs sm:text-sm font-medium">{product.price}</span>
                <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="M12 5v14"></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mb-16 md:mb-20">
          {featuredCollections.map((collection, index) => (
            <div 
              key={collection.id}
              ref={index === 0 ? featuredRef : null}
              className={`flex flex-col md:flex-row items-center gap-4 md:gap-6 ${
                index !== 0 ? 'mt-12 md:mt-16' : ''
              } ${index === 0 ? 'opacity-0' : ''}`}
              style={{ animationDelay: '0.6s' }}
            >
              <div className="md:w-1/2">
                <div className="flex items-start gap-2 md:gap-4">
                  <span className="text-3xl md:text-5xl font-bold">{collection.number}</span>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">{collection.title}</h3>
                    <p className="text-xs max-w-md leading-relaxed">
                      {collection.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2 mt-4 md:mt-0">
                <img 
                  src={collection.image}
                  alt={collection.title}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = collection.fallbackImage;
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        <div ref={winterCollectionRef} className="opacity-0" style={{ animationDelay: '0.7s' }}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 md:mb-12 text-center">
            FULL WINTERS
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="product-card">
              <img
                src="https://images.unsplash.com/photo-1622519407650-3df9883f76a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80"
                alt="Winter hoodie"
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80";
                }}
              />
            </div>
            <div className="product-card">
              <img
                src="https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-4.0.3&auto=format&fit=crop&w=1065&q=80"
                alt="Winter shoes"
                className="w-full aspect-[4/5] object-cover"
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1065&q=80";
                }}
              />
              <p className="text-xs mt-4 max-w-md">
                A HIGHER FULL WINTER LEVEL. HOODIES, TEES, WINTER CAPS & MORE. FOR MORE INFORMATION AND SIZING, PLEASE INQUIRE.
              </p>
              <button className="mt-4 border border-black px-4 md:px-6 py-2 text-xs sm:text-sm hover:bg-black hover:text-white transition-colors">
                NEW COLLECTION / LIMITED EDITION
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionShowcase;
