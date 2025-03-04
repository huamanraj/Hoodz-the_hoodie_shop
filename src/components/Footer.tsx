
import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '../hooks/use-mobile';

const Footer = () => {
  const footerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

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
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-black text-white py-10 opacity-0" style={{ animationDelay: '0.2s' }}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-0">HOODZ</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 w-full md:w-auto">
            <div>
              <h3 className="text-sm font-semibold mb-3">MEN</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Hoodies</a></li>
                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Sweatshirts</a></li>
                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Jackets</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">WOMEN</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Hoodies</a></li>
                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Sweatshirts</a></li>
                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Jackets</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">COLLECTIONS</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Summer 2023</a></li>
                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Winter 2023</a></li>
                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Special Edition</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold mb-3">POPULAR</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">New Arrivals</a></li>
                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Best Sellers</a></li>
                <li><a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">Sale</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400 mb-4 md:mb-0">© HOODZ INC. RIGHTS RESERVED.</p>
          <div className="flex space-x-4">
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">PRIVACY POLICY</a>
            <a href="#" className="text-xs text-gray-400 hover:text-white transition-colors">TERMS & CONDITIONS</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
