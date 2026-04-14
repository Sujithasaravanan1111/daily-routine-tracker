import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { title, time, repeating, completed } = await req.json();

        const routine = await prisma.routine.update({
            where: { id: id },
            data: {
                ...(title !== undefined && { title }),
                ...(time !== undefined && { time }),
                ...(repeating !== undefined && { repeating }),
                ...(completed !== undefined && { completed }),
            },
        });

        return NextResponse.json(routine);
    } catch {
        return NextResponse.json(
            { message: "Failed to update routine" },
            { status: 500 }
        );
    }
}

// DELETE
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await prisma.routine.delete({
            where: { id: id },
        });

        return NextResponse.json({ message: "Routine deleted" });
    } catch {
        return NextResponse.json(
            { message: "Failed to delete routine" },
            { status: 500 }
        );
    }
}