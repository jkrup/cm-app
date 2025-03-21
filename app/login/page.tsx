// app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { happyMonkey } from "../fonts/fonts";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("Invalid email or password");
                setIsLoading(false);
                return;
            }

            router.push("/");
            router.refresh();
        } catch (error) {
            setError("Something went wrong. Please try again.");
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
                    Welcome to Chonky Mammoth
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
                    Sign in to adopt and care for your own chonky mammoth!
                </p>

                {error && (
                    <div className="bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#6ECBDC] text-[#101830] py-3 rounded-lg font-medium hover:bg-[#8FE5F5] disabled:opacity-50 disabled:hover:bg-[#6ECBDC] transition-colors mt-6 shadow-[0_0_15px_rgba(110,203,220,0.3)]"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-[#D6ECF0]">
                        Don't have an account?{" "}
                        <Link 
                            href="/register" 
                            className="text-[#6ECBDC] hover:text-[#8FE5F5] transition-colors font-medium"
                        >
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}