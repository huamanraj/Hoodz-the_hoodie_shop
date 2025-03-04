
import React, { useState, useRef, useEffect } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productData } from '../data/products';

interface SearchProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Search: React.FC<SearchProps> = ({ isOpen, setIsOpen }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<typeof productData>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = productData.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [searchTerm]);

  const handleProductClick = (productId: string) => {
    setIsOpen(false);
    setSearchTerm('');
    navigate(`/product/${productId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white bg-opacity-95 z-50 flex flex-col pt-24">
      <div className="container mx-auto px-4">
        <div ref={searchRef} className="relative">
          <div className="flex items-center border-b border-gray-300 pb-4">
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

          {results.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm uppercase tracking-wider mb-4">Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map(product => (
                  <div 
                    key={product.id} 
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleProductClick(product.id)}
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

          {searchTerm.length > 1 && results.length === 0 && (
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
