// pages/dashboard.js
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { auth } from "../../pages/api/firebase"; // Ensure correct import path
import { onAuthStateChanged } from "firebase/auth";

import Toastify from 'toastify-js'
// import "toastify-js/toastify.css";
import "toastify-js/src/toastify.css"
const Dashboard = () => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0], 
        house: "House A",
        totalEggs: "",
        mortality: "",
        brokenEggs: "",
        chickens: "",
        food: "",
        user:""
      });

  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/"); // Redirect to login if not authenticated
      } else {
        setUser(currentUser);
        // Update formData with the user's email when authenticated
        setFormData((prevData) => ({
          ...prevData,
          user: currentUser.email || "Unknown User",
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting:", formData); // Debug log to check final data
    try {
        const response = await axios.post("/api/saveData", formData);
           // Show toast notification on success
             Toastify({
               text: response.data.message || "Data saved successfully!",
               duration: 3000, // Duration in milliseconds
               close: true, // Show close button
               gravity: "top", // Position: 'top' or 'bottom'
               position: "right", // Position: 'left', 'center', or 'right'
               backgroundColor: "#4CAF50", // Green color for success
               stopOnFocus: true, // Pause timer on hover
             }).showToast();
             // Reset form fields except date, house, and user
        setFormData({ ...formData, totalEggs: "", mortality: "", brokenEggs: "", chickens: "", food: ""});
    } catch (error) {
        console.error("Error saving data:", error);
        // Show error toast notification
        Toastify({
          text: error.response?.data?.error || "Failed to save data!",
          duration: 3000,
          close: true,
          gravity: "top",
          position: "right",
          backgroundColor: "#f44336", // Red color for error
          stopOnFocus: true,
        }).showToast();
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      router.push("/");
    }).catch((error) => {
      console.error("Error logging out:", error);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-3 sm:space-y-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
            Dashboard
          </h1>
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm sm:text-base font-medium text-gray-800 truncate max-w-[120px] sm:max-w-none">
                Hi, {user.email || "User"}!
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded text-sm sm:text-base hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Welcome Message */}
        {user ? (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
              Welcome back!
            </h2>
            <p className="text-gray-700 text-sm sm:text-base mt-1">
              Manage your egg collection data efficiently.
            </p>
          </div>
        ) : (
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md mb-4">
            <p className="text-yellow-800 text-sm sm:text-base">
              Redirecting to login...
            </p>
          </div>
        )}

        {/* Egg Collection Form */}
        {user && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
              Egg Collection Form
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="w-full sm:w-1/2">
                  <label className="block text-gray-900 text-sm sm:text-base font-medium mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-2 py-2 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="w-full sm:w-1/2">
                  <label className="block text-gray-900 text-sm sm:text-base font-medium mb-1">House</label>
                  <select
                    name="house"
                    value={formData.house}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-2 py-2 text-gray-900 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option>House A</option>
                    <option>House B</option>
                    {/* <option>House C</option>
                    <option>House D</option> */}
                  </select>
                </div>
              </div>

              <input type="number" name="totalEggs" value={formData.totalEggs} onChange={handleChange} placeholder="Total Eggs" className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500" required />
          <input type="number" name="mortality" value={formData.mortality} onChange={handleChange} placeholder="Mortality" className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500" required />
          <input type="number" name="brokenEggs" value={formData.brokenEggs} onChange={handleChange} placeholder="Broken Eggs" className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500" required />
          <input type="number" name="chickens" value={formData.chickens} onChange={handleChange} placeholder="Number of Chickens" className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500" required />
          <input type="number" step="0.1" name="food" value={formData.food} onChange={handleChange} placeholder="Food Consumed (kg)" className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500" required />

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded-lg text-sm sm:text-base font-medium hover:bg-green-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;