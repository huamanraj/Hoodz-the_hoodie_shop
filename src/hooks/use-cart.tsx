import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../data/products';

type CartItem = Product & { 
  quantity: number;
  size?: string;
};

interface CartContextType {
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product & { size?: string }) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string) => void;
  totalItems: number;
  subtotal: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
    
    // Calculate total items and subtotal
    const newTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const newSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setTotalItems(newTotalItems);
    setSubtotal(newSubtotal);
  }, [cart]);
  
  // Create a unique key for each item (combination of id and size)
  const getItemKey = (id: string, size?: string) => {
    return size ? `${id}-${size}` : id;
  };
  
  const addToCart = (product: Product & { size?: string }) => {
    setCart(prevCart => {
      const productId = product._id || product.id; // Support both _id and id
      const itemKey = getItemKey(productId, product.size);
      
      // Look for existing item with same id AND size (if applicable)
      const existingItemIndex = prevCart.findIndex(item => 
        getItemKey(item._id || item.id, item.size) === itemKey
      );
      
      if (existingItemIndex !== -1) {
        // If item exists, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        // If item doesn't exist, add it to cart
        return [...prevCart, { ...product, _id: productId, id: productId, quantity: 1 }];
      }
    });
  };
  
  const removeFromCart = (productId: string, size?: string) => {
    const itemKey = getItemKey(productId, size);
    setCart(prevCart => prevCart.filter(item => 
      getItemKey(item._id || item.id, item.size) !== itemKey
    ));
  };
  
  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    
    const itemKey = getItemKey(productId, size);
    setCart(prevCart => 
      prevCart.map(item => 
        getItemKey(item._id || item.id, item.size) === itemKey
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      cartOpen,
      setCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      totalItems,
      subtotal,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
