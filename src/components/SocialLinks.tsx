
import React, { useEffect, useRef } from 'react';

const SocialLinks = () => {
  const socialRef = useRef<HTMLDivElement>(null);

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

    if (socialRef.current) {
      observer.observe(socialRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="border-t border-b border-gray-200 py-4 my-8 md:my-12">
      <div className="container mx-auto px-4">
        <div ref={socialRef} className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-16 opacity-0" style={{ animationFillMode: 'forwards' }}>
          <a href="#" className="text-xs sm:text-sm uppercase tracking-wider hover:opacity-70 transition-opacity">
            INSTAGRAM
          </a>
          <a href="#" className="text-xs sm:text-sm uppercase tracking-wider hover:opacity-70 transition-opacity">
            TELEGRAM
          </a>
          <a href="#" className="text-xs sm:text-sm uppercase tracking-wider hover:opacity-70 transition-opacity">
            FACEBOOK
          </a>
          <a href="#" className="text-xs sm:text-sm uppercase tracking-wider hover:opacity-70 transition-opacity">
            TWITTER
          </a>
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;
