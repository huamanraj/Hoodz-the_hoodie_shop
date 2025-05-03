import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import { ArrowLeft, Package, TruckIcon, CheckCircle } from "lucide-react";
import { Link, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { useOrder } from '@/hooks/use-orders';
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

const OrderDetail = () => {
  const { id = '' } = useParams();
  const { data: order, isLoading, error } = useOrder(id);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 md:py-16">
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>

        <SignedIn>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
              <Link to="/orders" className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold">Order Details</h1>
            </div>
            
            {isLoading ? (
              // Loading state
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-4 sm:p-6 border-b bg-gray-50">
                  <div className="flex justify-between">
                    <Skeleton className="h-6 w-40 mb-2" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-56 mb-1" />
                      <Skeleton className="h-4 w-40 mb-1" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <div>
                      <Skeleton className="h-5 w-32 mb-2" />
                      <Skeleton className="h-4 w-56 mb-1" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  
                  <Skeleton className="h-5 w-32 mb-4" />
                  
                  {[1, 2].map((_, i) => (
                    <div key={i} className="flex gap-4 py-4 border-b">
                      <Skeleton className="h-20 w-20" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-48 mb-2" />
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between mt-6">
                    <div>
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </div>
            ) : error ? (
              // Error state
              <div className="text-center py-12 bg-white rounded-lg border">
                <Package size={48} className="mx-auto mb-4 text-gray-300" />
                <h2 className="text-xl font-medium mb-2">Order not found</h2>
                <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
                <Link 
                  to="/orders" 
                  className="inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                  Back to Orders
                </Link>
              </div>
            ) : order ? (
              // Order details
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-4 sm:p-6 border-b bg-gray-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold">Order #{order._id}</h2>
                      <p className="text-sm text-gray-500">
                        Placed on {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border">
                      {getStatusIcon(order.status)}
                      <span className="font-medium">{order.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <p className="text-gray-700">{order.shippingAddress.address}</p>
                      <p className="text-gray-700">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                      <p className="text-gray-700">{order.shippingAddress.country}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Payment Information</h3>
                      <p className="text-gray-700">Method: {order.paymentMethod}</p>
                      {order.isPaid ? (
                        <p className="text-green-600">Paid on {format(new Date(order.paidAt), 'MMMM dd, yyyy')}</p>
                      ) : (
                        <p className="text-red-600">Not paid</p>
                      )}
                      {order.paymentResult && (
                        <p className="text-gray-700">Payment ID: {order.paymentResult.id}</p>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  
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
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          {item.size && (
                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                          )}
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-8 pt-6 border-t">
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span>${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span>${order.taxPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipping</span>
                        <span>${order.shippingPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t mt-2">
                        <span>Total</span>
                        <span>${order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <button className="mt-6 px-4 py-2 bg-black text-white rounded hover:bg-gray-800">
                      Track Order
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </SignedIn>
      </div>
    </Layout>
  );
};

export default OrderDetail;
