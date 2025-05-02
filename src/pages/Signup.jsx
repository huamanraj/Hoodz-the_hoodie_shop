// pages/Signup.jsx
import { useSignUp } from "@clerk/clerk-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const { signUp, setSession } = useSignUp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const result = await signUp.create({ emailAddress: email, password });
            if (result.status === "complete") {
                await setSession(result.createdSessionId);
                navigate("/"); // Redirect on signup
            } else {
                console.log(result);
            }
        } catch (err) {
            setError(err.errors[0]?.message || "Signup failed");
        }
    };

    return (
        <form onSubmit={handleSignup} className="p-4 max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Signup</h2>
            <input
                className="w-full border p-2 mb-2"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="w-full border p-2 mb-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                Signup
            </button>
        </form>
    );
};

export default Signup;
