import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Types
export interface OrderItem {
  product?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
}

export interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentResult {
  id: string;
  status: string;
  update_time: string;
  email_address?: string;
}

export interface Order {
  _id: string;
  userId: string;
  userEmail: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  paymentResult?: PaymentResult;
  subtotal: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  status: 'Processing' | 'Shipped' | 'Delivered';
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CheckoutData {
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
}

// Hook to get all orders for the current user
export const useOrders = () => {
  const { getToken } = useAuth();
  
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('No authentication token available');
        
        const response = await axios.get(`${API_URL}/orders/myorders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
    },
    enabled: !!getToken, // Only run if getToken is available
  });
};

// Hook to get a single order by ID
export const useOrder = (orderId: string) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('No authentication token available');
        
        const response = await axios.get(`${API_URL}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error(`Error fetching order ${orderId}:`, error);
        throw error;
      }
    },
    enabled: !!orderId && !!getToken, // Only run if orderId and getToken are available
  });
};

// Hook to create a new order
export const useCreateOrder = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: CheckoutData) => {
      try {
        console.log('Creating order with data:', orderData);
        const token = await getToken();
        if (!token) throw new Error('No authentication token available');
        
        console.log('Sending request to:', `${API_URL}/orders`);
        console.log('Using auth token (first 15 chars):', token.substring(0, 15) + '...');
        
        const response = await axios.post(`${API_URL}/orders`, orderData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log('Order created successfully:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error creating order:', error);
        // Log more detailed error information
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Hook to mark an order as paid
export const useUpdateOrderToPaid = (orderId: string) => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentDetails: any) => {
      const token = await getToken();
      const response = await axios.put(`${API_URL}/orders/${orderId}/pay`, paymentDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
  });
};

// Function to update order payment status - for direct use in async callbacks
export const updateOrderPaymentStatus = async (orderId: string, paymentDetails: any, getToken: () => Promise<string | null>) => {
  try {
    const token = await getToken();
    if (!token) throw new Error('Authentication token not available');
    
    console.log(`Updating payment status for order ${orderId}:`, paymentDetails);
    const response = await axios.put(`${API_URL}/orders/${orderId}/pay`, paymentDetails, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Payment status updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error updating payment status for order ${orderId}:`, error);
    throw error;
  }
};
