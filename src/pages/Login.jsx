// pages/Login.jsx
import { useSignIn } from "@clerk/clerk-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, ArrowRight, ShoppingBag } from "lucide-react";

const Login = () => {
  const { signIn, setSession, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      // Create the signIn attempt
      const result = await signIn.create({
        identifier: email,
        password,
      });
      
      if (result.status === "complete") {
        // Sign-in successful, set session
        await setSession(result.createdSessionId);
        navigate("/");
      } else {
        // Handle other possible statuses
        console.log("Sign-in status:", result.status);
        setError("Authentication incomplete. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      // Handle specific error cases
      if (err.errors?.[0]?.code === "form_identifier_not_found") {
        setError("Email not found. Please check your email or create an account.");
      } else if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Incorrect password. Please try again.");
      } else {
        setError(err.errors?.[0]?.message || "Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!isLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
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
            <h2 className="text-xl font-medium mb-2">Welcome Back</h2>
            <p className="text-gray-600 text-sm">Enter your credentials to access your account</p>
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
              {error}
            </div>
          )}
          
          <button 
            onClick={handleGoogleLogin} 
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
          
          <form ref={formRef} onSubmit={handleLogin}>
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
            </div>
            
            {/* Add clerk-captcha div for Clerk to use if needed */}
            <div id="clerk-captcha" className="mb-4"></div>
            
            <button 
              type="submit" 
              className="w-full bg-black text-white py-3 rounded-sm hover:bg-gray-800 transition-colors flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                "Logging in..."
              ) : (
                <>
                  <LogIn size={16} className="mr-2" />
                  SIGN IN
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="p-6 border-t">
          <p className="text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="text-black font-medium hover:underline inline-flex items-center">
              Create one <ArrowRight size={14} className="ml-1" />
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

export default Login;
