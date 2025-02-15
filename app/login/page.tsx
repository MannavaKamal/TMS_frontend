"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Correct import
import { MdEmail, MdLock } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link"; // ✅ Use Link for navigation
import config from '../config.js'
import axios from 'axios'
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await axios.post(`${config.url}/userLogin`,{
      email:email,
      password:password
    })
    if(res.data.code === 1){
      const udata = res.data.cre
      localStorage.setItem("id", udata._id);
      localStorage.setItem("name",udata.name);
      localStorage.setItem("email",udata.email)
      localStorage.setItem("image",udata.image)
      router.push("/tasks");
    }
   else{
    alert("credentials are invalid")
   }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-red-500">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-10 py-12">
          <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Task Management System</h1>
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-6">
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
            <Button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-pink-600 transition duration-300 transform hover:scale-105"
            >
              Login
            </Button>
          </form>
          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-purple-600 hover:underline font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
