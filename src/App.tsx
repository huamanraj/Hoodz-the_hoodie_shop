import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';
import Index from './pages/Index';
import Product from './pages/Product';
import Products from './pages/Products';
import Profile from './pages/Profile';
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import OrderDetail from './pages/OrderDetail';
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from './components/ui/toaster';
function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/products" element={<Products />} />
        <Route path="/profile" element={
          <>
            <SignedIn>
              <Profile />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />
        <Route path="*" element={<NotFound />} />
        <Route path="/orders" element={
          <>
            <SignedIn>
              <Orders />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />
        <Route path="/orders/:id" element={
          <>
            <SignedIn>
              <OrderDetail />
            </SignedIn>
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          </>
        } />
        {/* Add SSO callback route */}
        <Route path="/sso-callback" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto mb-4"></div>
              <p>Completing authentication...</p>
            </div>
          </div>
        } />
      </Routes>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  );
}

export default App;
