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

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const { active } = await req.json();

        const reminder = await prisma.reminder.updateMany({
            where: {
                id: id,
                userId: user.id,
            },
            data: {
                active: active,
            },
        });

        return NextResponse.json(reminder);
    } catch {
        return NextResponse.json(
            { message: "Failed to update reminder" },
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

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        await prisma.reminder.deleteMany({
            where: {
                id: id,
                userId: user.id,
            },
        });

        return NextResponse.json({ message: "Reminder deleted" });
    } catch {
        return NextResponse.json(
            { message: "Failed to delete reminder" },
            { status: 500 }
        );
    }
}