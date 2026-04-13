import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const routines = await prisma.routine.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(routines);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch routines" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const { title, time, repeating } = await req.json();
        if (!title) return NextResponse.json({ message: "Title is required" }, { status: 400 });

        const routine = await prisma.routine.create({
            data: {
                title,
                time,
                repeating: repeating || false,
                userId: user.id,
            },
        });

        return NextResponse.json(routine, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to create routine" }, { status: 500 });
    }
}
