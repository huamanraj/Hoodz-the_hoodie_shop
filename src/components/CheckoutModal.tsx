import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useCreateOrder, updateOrderPaymentStatus } from '@/hooks/use-orders';
import { useUser, useAuth, useClerk } from '@clerk/clerk-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

const CheckoutModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, subtotal, clearCart } = useCart();
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();
  const queryClient = useQueryClient();
  const modalRef = useRef<HTMLDivElement>(null);
  
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
  
  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);
  
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn || !user) {
      toast({
        title: "You must be signed in to checkout",
        variant: "destructive",
      });
      onClose();
      // Use Clerk's openSignIn instead of redirecting to custom login page
      openSignIn({ redirectUrl: window.location.href });
      return;
    }

    // Calculate prices
    const taxPrice = Number((subtotal * 0.18).toFixed(2)); // 18% tax
    const shippingPrice = subtotal > 150 ? 0 : 10;
    const totalPrice = subtotal + taxPrice + shippingPrice;

    // Format order items
    const orderItems = cart.map(item => ({
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      size: item.size
    }));

    try {
      // Create an order
      const result = await createOrder.mutateAsync({
        orderItems,
        shippingAddress,
        paymentMethod: 'Razorpay',
        subtotal,
        taxPrice,
        shippingPrice,
        totalPrice
      });

      // Log Razorpay key for debugging
      console.log('Using Razorpay key:', import.meta.env.VITE_RAZORPAY_KEY_ID);

      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.razorpayOrder.amount,
        currency: result.razorpayOrder.currency,
        name: 'HOODZ',
        description: 'Payment for your order',
        order_id: result.razorpayOrder.id,
        handler: async function (response: any) {
          try {
            // Send the payment details to the server to verify and update the order
            await updateOrderPaymentStatus(
              result.order._id,
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature
              },
              getToken
            );
            
            // Invalidate queries to refresh order data
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['order', result.order._id] });
            
            // Show success message and clear cart
            toast({
              title: "Payment successful",
              description: "Your order has been placed successfully",
            });
            clearCart();
            onClose();
            navigate('/orders');
          } catch (error) {
            toast({
              title: "Payment verification failed",
              description: "Please contact support",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: user.fullName || '',
          email: user.primaryEmailAddress?.emailAddress || '',
        },
        theme: {
          color: '#000000',
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order",
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  // Handle backdrop click to close the modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-xl font-medium">Checkout</h2>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleCheckout} className="p-6">
          <h3 className="font-medium mb-4">Shipping Information</h3>
          
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="address" className="block text-sm mb-1">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={shippingAddress.address}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm mb-1">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label htmlFor="postalCode" className="block text-sm mb-1">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm mb-1">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={shippingAddress.country}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <h3 className="font-medium mb-4">Order Summary</h3>
          
          <div className="space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (18%)</span>
              <span>${(subtotal * 0.18).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{subtotal > 150 ? 'Free' : '$10.00'}</span>
            </div>
            
            <div className="flex justify-between font-medium pt-2 border-t">
              <span>Total</span>
              <span>${(subtotal + (subtotal * 0.18) + (subtotal > 150 ? 0 : 10)).toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition-colors"
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
