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

        await prisma.note.delete({
            where: {
                id,
                userId: user.id,
            },
        });

        return NextResponse.json({ message: "Note deleted" });
    } catch {
        return NextResponse.json({ message: "Failed to delete note" }, { status: 500 });
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

        const { title, content, date } = await req.json();

        const note = await prisma.note.update({
            where: {
                id,
                userId: user.id,
            },
            data: {
                ...(title !== undefined && { title }),
                ...(content !== undefined && { content }),
                ...(date !== undefined && { date: date ? new Date(date) : null }),
            },
        });

        return NextResponse.json(note);
    } catch {
        return NextResponse.json({ message: "Failed to update note" }, { status: 500 });
    }
}