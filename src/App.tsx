import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from './hooks/use-cart';
import { Toaster } from './components/ui/toaster';
import Index from './pages/Index';
import Product from './pages/Product';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

// Create a query client
const queryClient = new QueryClient();

// Get your Clerk publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      
        <TooltipProvider>
          <CartProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/products" element={<Products />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </CartProvider>
        </TooltipProvider>
      
    </QueryClientProvider>
  );
}

export default App;
