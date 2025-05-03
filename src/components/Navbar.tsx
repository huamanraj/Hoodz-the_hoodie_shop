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
  UserButton,
  useClerk
} from "@clerk/clerk-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isMobile = useIsMobile();
  const { setCartOpen, totalItems } = useCart();
  const { openSignIn } = useClerk();

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

  // Close mobile menu when user navigates away
  useEffect(() => {
    const cleanup = () => {
      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    
    return cleanup;
  }, [mobileMenuOpen]);

  const handleCartClick = () => {
    setCartOpen(true);
  };

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
                  {/* Use Clerk's openSignIn instead of Link */}
                  <button onClick={() => openSignIn()} className="nav-link">LOGIN</button>
                </SignedOut>
              </nav>
            )}
            <div className="flex items-center space-x-4">
              <button 
                className="p-1"
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
              >
                <SearchIcon size={20} />
              </button>
              <button 
                className="p-1 relative"
                onClick={handleCartClick}
                aria-label="Open shopping cart"
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
              <nav className="flex flex-col items-center space-y-4 text-center">
                <Link to="/products" className="w-full text-sm uppercase tracking-wide py-2 border-b border-gray-100 text-center">COLLECTIONS</Link>
                <Link to="/products?category=new" className="w-full text-sm uppercase tracking-wide py-2 border-b border-gray-100 text-center">NEW PRODUCT</Link>
                <Link to="/products" className="w-full text-sm uppercase tracking-wide py-2 border-b border-gray-100 text-center">POPULAR</Link>
                <a href="#" className="w-full text-sm uppercase tracking-wide py-2 border-b border-gray-100 text-center">SALE</a>
                <a href="#" className="w-full text-sm uppercase tracking-wide py-2 border-b border-gray-100 text-center">STORIES</a>
                <SignedIn>
                  <Link to="/profile" className="w-full text-sm uppercase tracking-wide py-2 text-center">PROFILE</Link>
                  <div className="flex justify-center pt-2">
                    <UserButton afterSignOutUrl="/" />
                  </div>
                </SignedIn>
                <SignedOut>
                  {/* Use Clerk's openSignIn instead of Link */}
                  <button onClick={() => openSignIn()} className="w-full text-sm uppercase tracking-wide py-2 text-center block">LOGIN</button>
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
