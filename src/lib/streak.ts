import { prisma } from "./prisma";

/**
 * Updates the user's daily streak.
 */
export async function updateStreak(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { streakCount: true, lastActive: true }
    });

    if (!user) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // ✅ Safe default
    let newStreak = user.streakCount ?? 0;

    const lastActive = user.lastActive ? new Date(user.lastActive) : null;

    if (!lastActive) {
        newStreak = 1;
    } else {
        const lastActiveDate = new Date(
            lastActive.getFullYear(),
            lastActive.getMonth(),
            lastActive.getDate()
        );

        const diffTime = today.getTime() - lastActiveDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            newStreak += 1;
        } else if (diffDays > 1) {
            newStreak = 1;
        } else {
            // Already active today
            return;
        }
    }

    await prisma.user.update({
        where: { id: userId },
        data: {
            streakCount: newStreak,
            lastActive: now
        }
    });
}