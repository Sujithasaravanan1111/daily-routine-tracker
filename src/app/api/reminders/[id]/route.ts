import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        const { active } = await req.json();

        // The user's system leverages 'active: false' as the proxy for 'completed: true' 
        const reminder = await prisma.reminder.updateMany({
            where: {
                id: params.id,
                userId: user.id
            },
            data: {
                active: active
            }
        });

        return NextResponse.json(reminder);
    } catch (error) {
        return NextResponse.json({ message: "Failed to update reminder" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        await prisma.reminder.deleteMany({
            where: {
                id: params.id,
                userId: user.id
            }
        });

        return NextResponse.json({ message: "Reminder deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Failed to delete reminder" }, { status: 500 });
    }
}
