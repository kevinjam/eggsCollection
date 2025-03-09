"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../../pages/api/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      router.push("/EggForm");
    } catch (err) {
        console.error(err);
      setError("Failed to log in. Check your credentials.",err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      {/* <Image 
        src="/background.png" 
        alt="Background" 
        layout="fill" 
        objectFit="cover" 
        className="absolute inset-0 w-full h-full" 
      /> */}
      <div className="relative z-10 bg-white p-6 rounded-xl shadow-lg w-80 sm:w-96">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Let's Get Started</h2>
        <p className="text-sm text-gray-600 text-center mb-6">Discover jobs and build your dream career.</p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Email Address" 
            className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500" 
            required 
          />
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Password" 
            className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500" 
            required 
          />
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            disabled={loading}>
            {loading ? "Please wait..." : "Log In"}
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
        To install this app on iOS, open in Safari and tap the Share icon > "Add to Home Screen".
          {/* Don't have an account? <a href="#" className="text-green-500">Create One Now</a> */}
        </p>
      </div>
    </div>
  );
};
export default LoginPage;
