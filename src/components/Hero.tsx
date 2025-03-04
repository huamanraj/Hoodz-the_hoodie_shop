import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add animation classes after component mounts
    const elements = [
      { ref: subtitleRef, class: 'title-slide', delay: '0.2s' },
      { ref: titleRef, class: 'title-slide', delay: '0.1s' },
      { ref: imageRef, class: 'image-fade', delay: '0.1s' },
      { ref: swipeRef, class: 'section-fade', delay: '1s' }
    ];

    elements.forEach(({ ref, class: className, delay }) => {
      if (ref.current) {
        ref.current.classList.add(className);
        ref.current.style.animationDelay = delay;
        ref.current.style.animationFillMode = 'forwards';
      }
    });
  }, []);

  return (
    <div ref={heroRef} className="w-full bg-white overflow-hidden">
      <div className="relative">
        {/* Subtitle - "THE BEST HOODIES ARE ONLY HERE" */}
        <div className="container mx-auto px-4 text-center py-4 sm:py-6 md:py-8 relative z-20">
          <p ref={subtitleRef} className="text-sm sm:text-base md:text-lg font-medium uppercase tracking-wide opacity-0">
            THE BEST HOODIES ARE ONLY HERE
          </p>
        </div>
        
        {/* Main Title - "HOODIE" */}
        <div className="container mx-auto px-4 text-center relative z-0">
          <h1 ref={titleRef} className="text-[60px] sm:text-[80px] md:text-[120px] lg:text-[180px] xl:text-[200px] font-bold uppercase tracking-tight leading-none opacity-0">
            HOODZ
          </h1>
        </div>
        
        {/* Hero Image */}
        <div ref={imageRef} className="w-full opacity-0  -mt-16 sm:-mt-20 md:-mt-28 lg:-mt-32 xl:-mt-40 relative z-10">
          <div className="relative">
            <img
              src="/heroimage2.png"
              alt="Three models wearing cream hoodies"
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px] object-cover"
              loading="eager"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&q=80";
              }}
            />
            
            {/* Swipe Button */}
            <div ref={swipeRef} className="absolute left-4 bottom-4 sm:left-8 sm:bottom-8 md:left-12 md:bottom-12 lg:left-16 lg:bottom-16 opacity-0 z-30">
              <Link 
                to="/products" 
                className="bg-white p-3 sm:p-4 md:p-5 lg:p-6 w-[160px] sm:w-[180px] md:w-[200px] lg:w-[250px] block"
              >
                <div className="flex flex-col">
                  <span className="font-medium uppercase text-black text-base sm:text-lg mb-1 sm:mb-2">SWIPE</span>
                  <div className="flex items-center border-t border-gray-300 pt-1 sm:pt-2">
                    <span className="text-gray-400 uppercase text-xs sm:text-sm">DISCOVER NOW</span>
                    <ArrowRight className="ml-auto" size={16} />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
