import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all reminders
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user)
            return NextResponse.json({ message: "User not found" }, { status: 404 });

        const reminders = await prisma.reminder.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(reminders);
    } catch {
        return NextResponse.json({ message: "Failed to fetch reminders" }, { status: 500 });
    }
}

// POST new reminder
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user)
            return NextResponse.json({ message: "User not found" }, { status: 404 });

        const { title, time } = await req.json();

        const reminder = await prisma.reminder.create({
            data: {
                title,
                time,
                userId: user.id,
            },
        });

        return NextResponse.json(reminder, { status: 201 });
    } catch {
        return NextResponse.json({ message: "Failed to create reminder" }, { status: 500 });
    }
}