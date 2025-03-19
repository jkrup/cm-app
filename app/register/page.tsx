// app/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { happyMonkey } from "../fonts/fonts";
import { signIn } from "next-auth/react";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            if (res.ok) {
                // Auto login after successful registration
                const signInResult = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });
                
                if (signInResult?.error) {
                    setError("Registration successful but auto-login failed. Please login manually.");
                    router.push("/login");
                } else {
                    // Redirect to home page after successful login
                    router.push("/");
                }
            } else {
                const data = await res.json();
                setError(data.message || data.error || "Something went wrong");
            }
        } catch (error) {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
            {/* Night sky background effect */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-[rgb(2,6,20)] via-[rgb(7,15,36)] to-[rgb(15,30,60)]" />
            </div>

            <div className="w-full max-w-sm relative bg-[#101830] p-6 sm:p-8 rounded-2xl border border-[#2A3A60] shadow-xl backdrop-blur-sm">
                <h1 className={`text-3xl font-bold text-center mb-6 ${happyMonkey.className}`} style={{
                    background: "linear-gradient(to bottom, rgb(110, 203, 220), rgb(56, 152, 184))",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    color: "transparent",
                    textShadow: "0 2px 4px rgba(40, 180, 220, 0.3)"
                }}>
                    Create Your Account
                </h1>

                <div className="mb-6 flex justify-center">
                    <div className="relative w-32 h-32">
                        <Image
                            src="/mammoth/happy.png"
                            alt="Happy Mammoth"
                            fill
                            className="object-contain"
                            priority
                        />
                        <div className="absolute inset-0 blue-aura"></div>
                    </div>
                </div>

                <p className="text-center mb-8 text-[#D6ECF0]">
                    Register to adopt your own chonky mammoth!
                </p>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#6ECBDC] mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-[#1A2845] border border-[#2A3A60] rounded-lg text-[#D6ECF0] placeholder-[#4A5A80] focus:outline-none focus:ring-2 focus:ring-[#6ECBDC] focus:border-transparent transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#6ECBDC] mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-[#1A2845] border border-[#2A3A60] rounded-lg text-[#D6ECF0] placeholder-[#4A5A80] focus:outline-none focus:ring-2 focus:ring-[#6ECBDC] focus:border-transparent transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#6ECBDC] mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-[#1A2845] border border-[#2A3A60] rounded-lg text-[#D6ECF0] placeholder-[#4A5A80] focus:outline-none focus:ring-2 focus:ring-[#6ECBDC] focus:border-transparent transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#6ECBDC] mb-1">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-[#1A2845] border border-[#2A3A60] rounded-lg text-[#D6ECF0] placeholder-[#4A5A80] focus:outline-none focus:ring-2 focus:ring-[#6ECBDC] focus:border-transparent transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#6ECBDC] text-[#101830] py-3 rounded-lg font-medium hover:bg-[#8FE5F5] disabled:opacity-50 disabled:hover:bg-[#6ECBDC] transition-colors mt-6 shadow-[0_0_15px_rgba(110,203,220,0.3)]"
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-[#D6ECF0]">
                        Already have an account?{" "}
                        <Link 
                            href="/login" 
                            className="text-[#6ECBDC] hover:text-[#8FE5F5] transition-colors font-medium"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}