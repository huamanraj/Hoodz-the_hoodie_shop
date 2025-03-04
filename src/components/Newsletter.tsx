
import React, { useEffect, useRef } from 'react';

const Newsletter = () => {
  const containerRef = useRef<HTMLDivElement>(null);

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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="py-12 md:py-16 bg-gray-50">
      <div
        ref={containerRef}
        className="container mx-auto px-4 opacity-0"
        style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
      >
        <div className="relative">
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1635796220037-eaa23d73e521?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Newsletter background"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "https://images.unsplash.com/photo-1618333293603-8d668eafa045?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
              }}
            />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 bg-black bg-opacity-30">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 max-w-2xl text-white">
              SUBSCRIBE TO OUR NEWSLETTER
            </h2>
            <div className="w-full max-w-md mt-4 md:mt-6">
              <div className="flex flex-col sm:flex-row">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 bg-white border-0 focus:outline-none mb-2 sm:mb-0"
                />
                <button className="bg-black text-white px-6 py-3 whitespace-nowrap hover:bg-gray-900 transition-colors sm:ml-0">
                  SIGN UP
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
