import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user)
            return NextResponse.json({ message: "User not found" }, { status: 404 });

        await prisma.workout.delete({
            where: {
                id,
                userId: user.id,
            },
        });

        return NextResponse.json({ message: "Workout deleted" });
    } catch {
        return NextResponse.json(
            { message: "Failed to delete workout" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user)
            return NextResponse.json({ message: "User not found" }, { status: 404 });

        const { exercise, sets, reps, duration } = await req.json();

        const workout = await prisma.workout.update({
            where: {
                id,
                userId: user.id,
            },
            data: {
                ...(exercise !== undefined && { exercise }),
                ...(sets !== undefined && { sets: Number(sets) }),
                ...(reps !== undefined && { reps: Number(reps) }),
                ...(duration !== undefined && { duration: duration ? Number(duration) : null }),
            },
        });

        return NextResponse.json(workout);
    } catch {
        return NextResponse.json(
            { message: "Failed to update workout" },
            { status: 500 }
        );
    }
}