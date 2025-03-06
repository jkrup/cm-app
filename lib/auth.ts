// lib/auth.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/routes";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export async function auth() {
    return await getServerSession(authOptions);
}

export async function requireAuth() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return session;
}