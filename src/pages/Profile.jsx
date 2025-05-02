// pages/Profile.jsx
import React from 'react';
import { SignedIn, SignedOut, RedirectToSignIn, UserButton, useClerk } from "@clerk/clerk-react";
import { Package, LogOut } from "lucide-react";
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

const Profile = () => {
    const { signOut } = useClerk();

    const handleLogout = () => {
        signOut();
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-12 md:py-16">
                <SignedOut>
                    <RedirectToSignIn />
                </SignedOut>

                <SignedIn>
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-bold mb-8">Your Profile</h1>
                        
                        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6 mb-6">
                                <div className="flex items-center gap-4">
                                    <UserButton />
                                    <div>
                                        <h2 className="text-xl font-medium">My Account</h2>
                                        <p className="text-gray-600 text-sm">Manage your profile and preferences</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded text-sm"
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Link 
                                    to="/orders" 
                                    className="flex items-center gap-3 p-4 border rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    <div className="bg-black text-white p-3 rounded-full">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Your Orders</h3>
                                        <p className="text-gray-600 text-sm">Track, view and manage orders</p>
                                    </div>
                                </Link>
                                
                                <div className="flex items-center gap-3 p-4 border rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                                    <div className="bg-black text-white p-3 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart">
                                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-medium">Wishlist</h3>
                                        <p className="text-gray-600 text-sm">Saved items for later</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        
                    </div>
                </SignedIn>
            </div>
        </Layout>
    );
};

export default Profile;
