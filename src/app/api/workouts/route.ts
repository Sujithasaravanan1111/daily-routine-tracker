import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const workouts = await prisma.workout.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(workouts);
    } catch (error) {
        return NextResponse.json({ message: "Failed to fetch workouts" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const { exercise, sets, reps, duration } = await req.json();

        const workout = await prisma.workout.create({
            data: {
                exercise,
                sets: Number(sets),
                reps: Number(reps),
                duration: duration ? Number(duration) : null,
                userId: user.id,
            },
        });

        return NextResponse.json(workout, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Failed to create workout" }, { status: 500 });
    }
}
