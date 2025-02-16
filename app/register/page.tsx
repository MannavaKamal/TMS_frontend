"use client";

import type React from "react";
import { useState } from "react";
import { MdEmail, MdLock, MdPerson, MdImage } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from 'axios';
import config from '../config.js'
import { useRouter } from "next/navigation";
export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [base64Image, setBase64Image] = useState<string | null>(null);
   const router = useRouter();
  const handleRegister = async(e: React.FormEvent) => {
    e.preventDefault();

   const res = await axios.post(`${config.url}/userSignup`,{
      email:email,
      name:fullName,
      password:password,
      image:base64Image,
      Tasks:[]
    })
    if(res.data.code === 1){
      alert("Successfully registered")
      router.push("/login");
    }
    
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setBase64Image(reader.result as string); // Store Base64 string
      };
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-10 py-12">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Task Management System</h1>
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Register</h2>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="relative">
              <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 transition duration-300"
              />
            </div>
            <div className="relative">
              <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <Input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="pl-10 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 transition duration-300"
              />
            </div>
            <div className="relative">
              <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 transition duration-300"
              />
            </div>
           
            
            {/* Image Upload Section */}
            <div className="relative">
              <MdImage className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="pl-10 py-3 rounded-lg border-2 border-gray-300 focus:border-purple-500 transition duration-300"
              />
            </div>
            {base64Image && (
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-700">Preview:</h3>
                <img src={base64Image} alt="Uploaded" className="mt-2 rounded-lg w-48 h-48 object-cover mx-auto" />
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-600 transition duration-300 transform hover:scale-105"
            >
              Register
            </Button>
          </form>
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-purple-600 hover:underline font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
