"use client";

import { useState } from "react";
import axios from "axios";
// import SaveData from "../pages/api/saveData";

const EggForm = () => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0], // Default to today’s date
    house: "House A",
    totalEggs: "",
    mortality: "",
    brokenEggs: "",
    chickens: "",
    food: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/saveData", formData);
      alert(response.data.message);
      setFormData({ ...formData, totalEggs: "", mortality: "", brokenEggs: "", chickens: "", food: "" });
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data! ");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Egg Collection Form</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500" required />

          <select name="house" value={formData.house} onChange={handleChange} className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500" required>
            <option>House A</option>
            <option>House B</option>
            <option>House C</option>
            <option>House D</option>
          </select>



          <input type="number" name="totalEggs" value={formData.totalEggs} onChange={handleChange} placeholder="Total Eggs" className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500" required />
          <input type="number" name="mortality" value={formData.mortality} onChange={handleChange} placeholder="Mortality" className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500" required />
          <input type="number" name="brokenEggs" value={formData.brokenEggs} onChange={handleChange} placeholder="Broken Eggs" className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500" required />
          <input type="number" name="chickens" value={formData.chickens} onChange={handleChange} placeholder="Number of Chickens" className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500" required />
          <input type="number" step="0.1" name="food" value={formData.food} onChange={handleChange} placeholder="Food Consumed (kg)" className="w-full p-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500" required />

          <button type="submit" className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default EggForm;
