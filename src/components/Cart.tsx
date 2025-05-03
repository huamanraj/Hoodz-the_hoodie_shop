import React, { useEffect, useRef, useState } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/use-cart';
import { Link } from 'react-router-dom';
import CheckoutModal from './CheckoutModal';

const Cart = () => {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQuantity, subtotal, totalItems } = useCart();
  const cartRef = useRef<HTMLDivElement>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  // Close cart when checkout is opened
  useEffect(() => {
    if (checkoutOpen) {
      setCartOpen(false);
    }
  }, [checkoutOpen, setCartOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartOpen(false);
      }
    };

    if (cartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartOpen, setCartOpen]);

  const handleCheckout = () => {
    setCheckoutOpen(true);
  };

  if (!cartOpen && !checkoutOpen) return null;
  if (checkoutOpen) return <CheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div 
        ref={cartRef}
        className="bg-white w-full max-w-md flex flex-col h-full animate-fade-in"
        style={{ animationFillMode: 'forwards' }}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-medium">Shopping Cart ({totalItems})</h2>
          <button 
            onClick={() => setCartOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <ShoppingBag size={64} className="mb-4 opacity-30" />
            <p className="text-lg mb-6">Your cart is empty</p>
            <Link
              to="/products"
              className="border border-black px-6 py-2 hover:bg-black hover:text-white transition-colors"
              onClick={() => setCartOpen(false)}
            >
              SHOP NOW
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto p-4">
              {cart.map(item => {
                const itemId = item._id || item.id;
                return (
                  <div key={`${itemId}${item.size ? `-${item.size}` : ''}`} className="flex border-b py-4">
                    <div className="w-20 h-24 bg-gray-100 mr-4 flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&q=80";
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(itemId, item.size)}
                          className="text-gray-400 hover:text-black"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">${item.price.toFixed(2)}</p>
                      {item.size && (
                        <p className="text-xs text-gray-500 mb-2">Size: {item.size}</p>
                      )}
                      <div className="flex items-center border w-fit">
                        <button 
                          onClick={() => updateQuantity(itemId, item.quantity - 1, item.size)}
                          className="px-2 py-1 hover:bg-gray-100"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(itemId, item.quantity + 1, item.size)}
                          className="px-2 py-1 hover:bg-gray-100"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t">
              <div className="flex justify-between mb-4">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Shipping and taxes calculated at checkout</p>
              <button 
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 hover:bg-gray-800 transition-colors"
              >
                CHECKOUT
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
