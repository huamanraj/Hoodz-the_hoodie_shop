import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, ShoppingBag, Menu, X } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/use-cart';
import Search from './Search';
import Cart from './Cart';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const { setCartOpen, totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header 
        className={`w-full fixed top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-sm py-3' : 'bg-white py-5'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-6">
            {isMobile && (
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
            
            {!isMobile && (
              <nav className="hidden md:flex items-center space-x-8">
                <Link to="/products" className="nav-link">COLLECTIONS</Link>
                <Link to="/products?category=new" className="nav-link">NEW PRODUCT</Link>
                <Link to="/products" className="nav-link">POPULAR</Link>
              </nav>
            )}
          </div>

          {/* Logo */}
          <Link to="/" className="text-2xl font-heading font-bold tracking-tight">HOODZ</Link>

          {/* Right section */}
          <div className="flex items-center space-x-6">
            {!isMobile && (
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#" className="nav-link">SALE</a>
                <a href="#" className="nav-link">STORIES</a>
                <SignedIn>
                  <Link to="/profile" className="nav-link">PROFILE</Link>
                 
                </SignedIn>
                <SignedOut>
                  <SignInButton>
                    <span className="nav-link">LOGIN</span>
                  </SignInButton>
                </SignedOut>
              </nav>
            )}
            <div className="flex items-center space-x-4">
              <button 
                className="p-1"
                onClick={() => setSearchOpen(true)}
              >
                <SearchIcon size={20} />
              </button>
              <button 
                className="p-1 relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobile && mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-t border-gray-100 animate-fade-in" style={{ animationFillMode: 'forwards' }}>
            <div className="container mx-auto py-6 px-4">
              <nav className="flex flex-col space-y-4">
                <Link to="/products" className="text-sm uppercase tracking-wide py-2 border-b border-gray-100">COLLECTIONS</Link>
                <Link to="/products?category=new" className="text-sm uppercase tracking-wide py-2 border-b border-gray-100">NEW PRODUCT</Link>
                <Link to="/products" className="text-sm uppercase tracking-wide py-2 border-b border-gray-100">POPULAR</Link>
                <a href="#" className="text-sm uppercase tracking-wide py-2 border-b border-gray-100">SALE</a>
                <a href="#" className="text-sm uppercase tracking-wide py-2 border-b border-gray-100">STORIES</a>
                <SignedIn>
                  <Link to="/profile" className="text-sm uppercase tracking-wide py-2">PROFILE</Link>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton>
                    <span className="text-sm uppercase tracking-wide py-2">LOGIN</span>
                  </SignInButton>
                </SignedOut>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Search modal */}
      <Search isOpen={searchOpen} setIsOpen={setSearchOpen} />
      
      {/* Cart drawer */}
      <Cart />
    </>
  );
};

export default Navbar;
