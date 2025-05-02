import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { ArrowLeft, Search, Package, TruckIcon, CheckCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

// Mock data for orders
const orders = [
  {
    id: 'ORD-12345',
    date: 'May 12, 2023',
    status: 'Delivered',
    total: 79.99,
    items: [
      {
        id: '1',
        name: 'Classic Black Hoodie',
        price: 79.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
      }
    ]
  },
  {
    id: 'ORD-12346',
    date: 'June 3, 2023',
    status: 'Processing',
    total: 164.98,
    items: [
      {
        id: '2',
        name: 'Cream Oversized Hoodie',
        price: 89.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
      },
      {
        id: '6',
        name: 'Eco-friendly Green Hoodie',
        price: 74.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
      }
    ]
  },
  {
    id: 'ORD-12347',
    date: 'July 21, 2023',
    status: 'Shipped',
    total: 94.99,
    items: [
      {
        id: '5',
        name: 'Vintage Red Hoodie',
        price: 94.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1584829476759-747279a58b21?ixlib=rb-4.0.3&auto=format&fit=crop&q=80',
      }
    ]
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Delivered':
      return <CheckCircle size={16} className="text-green-500" />;
    case 'Shipped':
      return <TruckIcon size={16} className="text-blue-500" />;
    default:
      return <Package size={16} className="text-orange-500" />;
  }
};

const Orders = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>

        <SignedIn>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-full">
                  <ArrowLeft size={20} />
                </Link>
                <h1 className="text-2xl md:text-3xl font-bold">Your Orders</h1>
              </div>
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="pl-10 pr-4 py-2 border rounded-md w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-black"
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-4 sm:p-6 border-b bg-gray-50">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Order #{order.id}</p>
                          <p className="text-sm text-gray-500">Placed on {order.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="font-medium">{order.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-4 border-b last:border-b-0">
                          <div className="w-20 h-20 bg-gray-100 flex-shrink-0">
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
                          <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h3 className="font-medium">{item.name}</h3>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex justify-between mt-6 pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">
                            Track Order
                          </button>
                          <button className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm">
                            Order Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border">
                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-medium mb-2">No orders yet</h2>
                <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                <Link 
                  to="/products" 
                  className="inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>
        </SignedIn>
      </div>
    </Layout>
  );
};

export default Orders;
