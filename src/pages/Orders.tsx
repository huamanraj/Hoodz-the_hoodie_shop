import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { ArrowLeft, Search, Package, TruckIcon, CheckCircle } from "lucide-react";
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useOrders } from '@/hooks/use-orders';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

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
  const { data: orders, isLoading, error } = useOrders();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredOrders = orders?.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            
            {isLoading ? (
              // Loading state
              <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-4 sm:p-6 border-b bg-gray-50">
                      <div className="flex justify-between">
                        <div>
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex gap-4 mb-6">
                        <Skeleton className="h-20 w-20" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-40 mb-2" />
                          <Skeleton className="h-4 w-20 mb-2" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <div className="flex justify-between pt-4 border-t">
                        <Skeleton className="h-6 w-20" />
                        <div className="flex gap-2">
                          <Skeleton className="h-10 w-24" />
                          <Skeleton className="h-10 w-24" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Error state
              <div className="text-center py-12 bg-white rounded-lg border">
                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-medium mb-2">Error loading orders</h2>
                <p className="text-gray-600 mb-6">There was an error loading your orders. Please try again later.</p>
              </div>
            ) : filteredOrders && filteredOrders.length > 0 ? (
              // Orders list
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div className="p-4 sm:p-6 border-b bg-gray-50">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Order #{order._id}</p>
                          <p className="text-sm text-gray-500">
                            Placed on {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="font-medium">{order.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 sm:p-6">
                      {order.orderItems.map((item, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-4 py-4 border-b last:border-b-0">
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
                              {item.size && (
                                <p className="text-sm text-gray-600">Size: {item.size}</p>
                              )}
                            </div>
                            <p className="font-medium">${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex justify-between mt-6 pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="font-medium">${order.totalPrice.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">
                            Track Order
                          </button>
                          <Link 
                            to={`/orders/${order._id}`} 
                            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm"
                          >
                            Order Details
                          </Link>
                        </div>
                      </div>
                      
                      {order.paymentResult && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-sm text-gray-600 mb-1">Payment ID: {order.paymentResult.id}</p>
                          <p className="text-sm text-gray-600">
                            Payment Status: <span className="text-green-500 font-medium">{order.isPaid ? 'Paid' : 'Pending'}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // No orders
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
