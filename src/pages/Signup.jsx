// pages/Signup.jsx
import { useSignUp } from "@clerk/clerk-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, UserPlus, ArrowLeft } from "lucide-react";

const Signup = () => {
    const { signUp, setSession, isLoaded } = useSignUp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef(null);
    
    // Remove the incorrect CAPTCHA initialization
    // Clerk handles CAPTCHA automatically when needed

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        try {
            // Create signup with user information
            const result = await signUp.create({
                emailAddress: email,
                password,
                firstName,
                lastName
            });
            
            // Check the status and handle accordingly
            if (result.status === "complete") {
                // Registration successful, set session
                await setSession(result.createdSessionId);
                navigate("/");
            } else if (result.status === "needs_verification") {
                // Verification needed
                setError("Please check your email for a verification link.");
            } else {
                console.log("Signup status:", result.status);
                setError("Please complete additional verification steps.");
            }
        } catch (err) {
            console.error("Signup error:", err);
            // Handle specific error cases
            if (err.errors?.[0]?.code === "form_password_pwned") {
                setError("This password has been compromised in a data breach. Please use a different password.");
            } else if (err.errors?.[0]?.code === "form_identifier_exists") {
                setError("An account with this email already exists.");
            } else {
                setError(err.errors?.[0]?.message || "Signup failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignup = async () => {
        if (!isLoaded) return;
        try {
            await signUp.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/"
            });
        } catch (err) {
            console.error("OAuth error:", err);
            setError("Failed to connect with Google");
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
            <div className="w-full max-w-md bg-white shadow-md animate-fade-in" style={{ animationFillMode: 'forwards' }}>
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-medium text-center">HOODZ</h1>
                </div>
                
                <div className="p-6">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-medium mb-2">Create Account</h2>
                        <p className="text-gray-600 text-sm">Join us for exclusive access to the best hoodies</p>
                    </div>
                    
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
                            {error}
                        </div>
                    )}
                    
                    <button 
                        onClick={handleGoogleSignup} 
                        className="w-full mb-6 flex items-center justify-center border border-gray-300 py-2.5 px-4 rounded-sm hover:bg-gray-50 transition-colors"
                        type="button"
                        disabled={!isLoaded || isLoading}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="w-5 h-5 mr-2" />
                        Continue with Google
                    </button>
                    
                    <div className="relative flex items-center justify-center my-6">
                        <div className="border-t border-gray-200 absolute w-full"></div>
                        <div className="bg-white px-4 relative z-10 text-xs text-gray-500">or continue with email</div>
                    </div>
                    
                    <form ref={formRef} onSubmit={handleSignup}>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    First Name
                                </label>
                                <input
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    type="text"
                                    placeholder="First Name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Last Name
                                </label>
                                <input
                                    className="w-full px-3 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    type="text"
                                    placeholder="Last Name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={16} className="text-gray-400" />
                                </div>
                                <input
                                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-medium mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={16} className="text-gray-400" />
                                </div>
                                <input
                                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <p className="mt-2 text-xs text-gray-500">
                                Password must be at least 8 characters
                            </p>
                        </div>
                        
                        {/* Add clerk-captcha div for Clerk to use if needed */}
                        <div id="clerk-captcha" className="mb-4 mt-4"></div>
                        
                        <button 
                            type="submit" 
                            className="w-full bg-black text-white py-3 rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                "Creating account..."
                            ) : (
                                <>
                                    <UserPlus size={16} className="mr-2" />
                                    CREATE ACCOUNT
                                </>
                            )}
                        </button>
                    </form>
                </div>
                
                <div className="p-6 border-t">
                    <p className="text-sm text-gray-600 text-center">
                        Already have an account?{" "}
                        <Link to="/login" className="text-black font-medium hover:underline inline-flex items-center">
                            <ArrowLeft size={14} className="mr-1" />
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
            
            <div className="mt-6 text-center text-gray-500 text-xs">
                Built by <a href="https://amanraj.me" target="_blank" rel="noopener noreferrer" className="underline hover:text-black">Aman Raj</a>
            </div>
        </div>
    );
};

export default Signup;
