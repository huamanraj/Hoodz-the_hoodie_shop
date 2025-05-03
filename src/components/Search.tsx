import React, { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchProducts } from '@/lib/api';
import { Product } from '@/types/product';

interface SearchProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Search: React.FC<SearchProps> = ({ isOpen, setIsOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Prevent body scrolling when search is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position and prevent scrolling
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scroll position when closing
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    
    return () => {
      // Cleanup when component unmounts
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  const { data: results = [], isLoading, isFetching } = useQuery({
    queryKey: ['productSearch', debouncedSearchTerm],
    queryFn: () => searchProducts({ query: debouncedSearchTerm, limit: 8 }),
    enabled: debouncedSearchTerm.length > 1,
    staleTime: 30 * 1000, // 30 seconds
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setIsOpen]);

  const handleProductClick = (productId: string) => {
    setIsOpen(false);
    setSearchTerm('');
    navigate(`/product/${productId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 z-50 overflow-y-auto">
      <div className="container mx-auto px-4 py-24">
        <div ref={searchRef} className="relative">
          <div className="flex items-center border-b border-gray-300 pb-4 sticky top-0 bg-white bg-opacity-95 z-10 pt-4">
            <SearchIcon size={24} className="mr-3" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-xl md:text-2xl outline-none bg-transparent"
              autoFocus
            />
            <button 
              onClick={() => { setIsOpen(false); setSearchTerm(''); }}
              className="ml-3"
            >
              <X size={24} />
            </button>
          </div>

          {searchTerm.length > 1 && (isLoading || isFetching) && (
            <div className="mt-6 flex justify-center py-8">
              <Loader2 size={30} className="animate-spin text-gray-500" />
            </div>
          )}

          {results.length > 0 && !(isLoading || isFetching) && (
            <div className="mt-6">
              <h3 className="text-sm uppercase tracking-wider mb-4">Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((product: Product) => (
                  <div 
                    key={product._id} 
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleProductClick(product._id)}
                  >
                    <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&q=80";
                        }}
                      />
                    </div>
                    <h4 className="mt-2 font-medium">{product.name}</h4>
                    <p className="text-sm">${product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchTerm.length > 1 && debouncedSearchTerm.length > 1 && results.length === 0 && !(isLoading || isFetching) && (
            <div className="mt-6 text-center py-8">
              <p className="text-lg">No products found for "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
