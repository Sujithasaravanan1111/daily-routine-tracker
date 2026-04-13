import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { title, time, repeating, completed } = await req.json();

        const { id } = await params;
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
    } catch (error) {
        return NextResponse.json({ message: "Failed to update routine" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { id } = await params;
        await prisma.routine.delete({ where: { id: id } });

        return NextResponse.json({ message: "Routine deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete routine" }, { status: 500 });
    }
}
