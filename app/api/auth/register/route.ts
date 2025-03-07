// app/api/auth/register/route.ts
"use server"

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        const { name, email, password } = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "Email already in use" },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Create mammoth for the new user
        await prisma.mammoth.create({
            data: {
                userId: user.id,
                name: "Unnamed Mammoth",
            },
        });

        // Create initial quests for the new user
        const initialQuests = await prisma.quest.findMany({
            where: {
                questType: "achievement",
            },
        });

        for (const quest of initialQuests) {
            await prisma.userQuest.create({
                data: {
                    userId: user.id,
                    questId: quest.id,
                },
            });
        }

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        );
    }
}
