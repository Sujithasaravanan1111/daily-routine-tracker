import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function DELETE(
    req: NextRequest,
    context: { params: { id: string } }
) {
    try {
        const { id } = context.params;

        const session = await getServerSession(authOptions);
        if (!session?.user?.email)
            return Response.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user)
            return Response.json({ message: "User not found" }, { status: 404 });

        await prisma.workout.delete({
            where: {
                id,
                userId: user.id,
            },
        });

        return Response.json({ message: "Workout deleted" });
    } catch {
        return Response.json({ message: "Failed to delete workout" }, { status: 500 });
    }
}